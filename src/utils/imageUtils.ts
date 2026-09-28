/**
 * Utilities for image loading, validation, and Base64 conversion
 */

export interface ImagePayload {
  base64: string;
  mimeType: string;
  previewUrl: string;
  fileName: string;
  fileSizeBytes: number;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const isAcceptedType = ACCEPTED_TYPES.includes(file.type.toLowerCase()) || file.type.startsWith('image/');
  if (!isAcceptedType) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload a JPEG, PNG, or WEBP photo.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is 15MB.`,
    };
  }

  return { valid: true };
}

export function fileToImagePayload(file: File): Promise<ImagePayload> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      const cleanBase64 = result.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      const mimeType = file.type || 'image/jpeg';
      const previewUrl = URL.createObjectURL(file);

      resolve({
        base64: cleanBase64,
        mimeType,
        previewUrl,
        fileName: file.name,
        fileSizeBytes: file.size,
      });
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image file. Please try another photo.'));
    };

    reader.readAsDataURL(file);
  });
}

export async function urlToImagePayload(url: string, fileName: string): Promise<ImagePayload> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch sample image.');
  }

  const blob = await response.blob();
  const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
  return fileToImagePayload(file);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
