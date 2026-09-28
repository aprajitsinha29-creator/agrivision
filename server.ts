import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Support base64 image uploads up to 30MB
app.use(express.json({ limit: '30mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AgriVision Plant Pathology Diagnostic Engine',
    timestamp: new Date().toISOString(),
  });
});

// Diagnostic endpoint
app.post('/api/diagnose', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({
        error: 'No image uploaded. Please provide a clear photograph of a plant leaf.',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the server environment. Please attach an API key in Settings > Secrets.',
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
    const validMimeType = mimeType || 'image/jpeg';

    // Verify valid image MIME type
    if (!validMimeType.startsWith('image/')) {
      return res.status(400).json({
        error: 'Unsupported file format. Please upload an image file (JPG, PNG, WEBP, or HEIC).',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const promptText = `You are AgriVision, a specialized agricultural vision diagnostic tool for tomato crop health.
Analyze the provided image with the following strict requirements:
1. Single Crop Focus: This tool evaluates tomato leaves. First, verify whether the image is actually a plant leaf. If the image is clearly not a plant leaf (e.g., an animal, human, car, room, prepared meal, graphic, or random object), you must set isPlantLeaf to false and explain what you observe in notLeafExplanation.
2. If it is a plant leaf, determine whether it is 'Healthy', 'Diseased', or 'Uncertain'.
3. If diseased, identify the most likely disease name (e.g. Early Blight (Alternaria solani), Late Blight (Phytophthora infestans), Septoria Leaf Spot, Tomato Leaf Mold, Bacterial Spot, Tomato Yellow Leaf Curl Virus, Blossom End Rot / Calcium Deficiency, Powdery Mildew, Spider Mite Damage).
4. Confidence Level: You must rate your diagnostic certainty strictly as 'High', 'Medium', 'Low', or 'Uncertain'. DO NOT fabricate or return any percentage numbers.
5. Symptom observation: Base your assessment solely on visual leaf symptoms (e.g., circular chlorotic halos, concentric target spots, marginal leaf necrosis, water-soaked lesions, velvet mold on underside, vein discoloration). If symptoms are ambiguous, poorly lit, or out of focus, report 'Uncertain' rather than guessing.
6. Provide exactly ONE short, practical, actionable recommendation for the farmer to mitigate the issue or maintain leaf vigor.`;

    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastError: any = null;
    let responseText: string | undefined;

    for (const modelName of candidateModels) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                inlineData: {
                  mimeType: validMimeType,
                  data: cleanBase64,
                },
              },
              {
                text: promptText,
              },
            ],
            config: {
              systemInstruction: `You are AgriVision, an expert agronomic visual diagnostic system for tomato plants.
Only diagnose based on visual leaf symptoms.
Never fabricate percentages. Confidence must be one of: 'High', 'Medium', 'Low', or 'Uncertain'.
If the image is not a plant leaf, or is ambiguous, do not guess: explicitly set isPlantLeaf to false or status to 'Uncertain'.`,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  isPlantLeaf: {
                    type: Type.BOOLEAN,
                    description: 'Whether the image clearly shows a plant leaf, particularly tomato foliage.',
                  },
                  cropIdentified: {
                    type: Type.STRING,
                    description: "Identified crop/plant name, e.g. 'Tomato (Solanum lycopersicum)', 'Non-tomato plant', or 'Non-plant'.",
                  },
                  status: {
                    type: Type.STRING,
                    description: "Diagnosis status: strictly 'Healthy', 'Diseased', or 'Uncertain'.",
                  },
                  diseaseName: {
                    type: Type.STRING,
                    description: "Name of the most likely disease if diseased (e.g. 'Early Blight', 'Septoria Leaf Spot'). Empty if healthy or uncertain.",
                  },
                  confidence: {
                    type: Type.STRING,
                    description: "Certainty level: strictly 'High', 'Medium', 'Low', or 'Uncertain'. Never output a percentage.",
                  },
                  observedSymptoms: {
                    type: Type.STRING,
                    description: 'Concise 1-2 sentence description of visible symptoms observed on the leaf tissue.',
                  },
                  recommendation: {
                    type: Type.STRING,
                    description: 'One short, practical agronomic recommendation for the grower.',
                  },
                  notLeafExplanation: {
                    type: Type.STRING,
                    description: 'If isPlantLeaf is false, a helpful message explaining what was detected and requesting a close-up photo of a plant leaf.',
                  },
                },
                required: ['isPlantLeaf', 'status', 'confidence', 'recommendation'],
              },
            },
          });

          if (response.text) {
            responseText = response.text;
            break;
          }
        } catch (err: any) {
          lastError = err;
          const errMsg = err?.message || String(err);
          const isTransient =
            errMsg.includes('503') ||
            errMsg.includes('429') ||
            errMsg.includes('high demand') ||
            errMsg.includes('UNAVAILABLE') ||
            errMsg.includes('resource exhausted');

          if (isTransient && attempt === 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue;
          }
          break;
        }
      }

      if (responseText) {
        break;
      }
    }

    if (!responseText) {
      throw lastError || new Error('Empty response received from the diagnostic engine. Please re-try.');
    }

    const result = JSON.parse(responseText);
    return res.json(result);
  } catch (err: any) {
    console.error('Diagnosis server error:', err);
    let friendlyMessage = 'Diagnostic analysis failed. Please verify image clarity and try again.';
    try {
      if (err?.message) {
        const parsed = JSON.parse(err.message);
        if (parsed?.error?.message) {
          friendlyMessage = parsed.error.message;
        }
      }
    } catch {
      if (typeof err?.message === 'string') {
        friendlyMessage = err.message;
      }
    }

    return res.status(500).json({
      error: friendlyMessage,
    });
  }
});

// Static / Vite Middleware Setup
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`AgriVision service running on http://0.0.0.0:${port}`);
  });
}

startServer();
