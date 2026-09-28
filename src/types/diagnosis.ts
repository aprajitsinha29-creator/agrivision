export type ConfidenceLevel = 'High' | 'Medium' | 'Low' | 'Uncertain';
export type DiagnosticStatus = 'Healthy' | 'Diseased' | 'Uncertain';

export interface DiagnosticResult {
  isPlantLeaf: boolean;
  cropIdentified?: string;
  status: DiagnosticStatus;
  diseaseName?: string;
  confidence: ConfidenceLevel;
  observedSymptoms?: string;
  recommendation: string;
  notLeafExplanation?: string;
}

export interface DiagnosticRequest {
  imageBase64: string;
  mimeType: string;
}

export interface DiagnosticError {
  message: string;
  type: 'validation' | 'unsupported_file' | 'api_failure' | 'network' | 'not_leaf';
}
