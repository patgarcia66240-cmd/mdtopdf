// Types locaux pour ce fichier
interface FileUploadResult {
  file: File;
  content: string;
  size: number;
  type: string;
  lastModified: Date;
  encoding?: string;
  metadata?: FileMetadata;
}

interface FileValidationResult {
  isValid: boolean;
  errors: FileValidationError[];
  warnings: FileValidationError[];
  metadata?: FileMetadata;
}

interface FileValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
  constraint?: string;
}

interface FileMetadata {
  name: string;
  extension: string;
  mimeType: string;
  charset?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number;
  [key: string]: any;
}

/**
 * Utilitaires pour la manipulation et la validation de fichiers
 */

// Types MIME supportés
export const SUPPORTED_MIME_TYPES = {
  text: [
    'text/plain',
    'text/markdown',
    'text/md',
    'application/json',
    'text/html',
    'application/xml',
    'text/csv',
    'text/tab-separated-values',
  ],
  image: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
  ],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
  font: [
    'font/ttf',
    'font/otf',
    'font/woff',
    'font/woff2',
    'application/font-sfnt',
    'application/x-font-ttf',
  ],
};

// Extensions de fichier supportées
export const SUPPORTED_EXTENSIONS = {
  markdown: ['.md', '.markdown', '.txt'],
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff'],
  document: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
  font: ['.ttf', '.otf', '.woff', '.woff2'],
  code: ['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.xml', '.json', '.csv', '.tsv'],
};

// Tailles maximales (en bytes)
export const MAX_FILE_SIZES = {
  small: 1024 * 1024,      // 1MB
  medium: 5 * 1024 * 1024, // 5MB
  large: 20 * 1024 * 1024, // 20MB
  xlarge: 100 * 1024 * 1024, // 100MB
};

/**
 * Valide un fichier uploadé
 */
export async function validateFile(
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
    requireImageDimensions?: boolean;
    validateContent?: boolean;
  } = {}
): Promise<FileValidationResult> {
  const {
    maxSize = MAX_FILE_SIZES.medium,
    allowedTypes = Object.values(SUPPORTED_MIME_TYPES).flat(),
    allowedExtensions = Object.values(SUPPORTED_EXTENSIONS).flat(),
    requireImageDimensions = false,
    validateContent = false,
  } = options;

  const errors: FileValidationError[] = [];
  const warnings: FileValidationError[] = [];
  let metadata: FileMetadata | undefined;

  // Validation de la taille
  if (file.size > maxSize) {
    errors.push({
      field: 'size',
      message: `La taille du fichier (${formatFileSize(file.size)}) dépasse la limite maximale (${formatFileSize(maxSize)})`,
      code: 'FILE_TOO_LARGE',
      value: file.size,
      constraint: maxSize.toString(),
    });
  }

  // Validation du type MIME
  if (!allowedTypes.includes(file.type)) {
    errors.push({
      field: 'type',
      message: `Type de fichier non supporté: ${file.type}`,
      code: 'UNSUPPORTED_FILE_TYPE',
      value: file.type,
      constraint: allowedTypes.join(', '),
    });
  }

  // Validation de l'extension
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!allowedExtensions.includes(fileExtension || '')) {
    errors.push({
      field: 'extension',
      message: `Extension de fichier non supportée: ${fileExtension}`,
      code: 'UNSUPPORTED_FILE_EXTENSION',
      value: fileExtension,
      constraint: allowedExtensions.join(', '),
    });
  }

  // Validation du nom du fichier
  if (!isValidFileName(file.name)) {
    errors.push({
      field: 'name',
      message: 'Nom de fichier non valide',
      code: 'INVALID_FILE_NAME',
      value: file.name,
      constraint: 'Caractères alphanumériques, tirets, underscores, points uniquement',
    });
  }

  // Métadonnées de base
  metadata = {
    name: file.name,
    extension: fileExtension || '',
    mimeType: file.type,
    charset: await detectCharset(file),
  };

  // Métadonnées spécifiques pour les images
  if (file.type.startsWith('image/')) {
    const imageMetadata = await extractImageMetadata(file);
    if (imageMetadata) {
      metadata = { ...metadata, ...imageMetadata };
    }

    if (requireImageDimensions && (!imageMetadata.dimensions || !imageMetadata.dimensions.width || !imageMetadata.dimensions.height)) {
      errors.push({
        field: 'dimensions',
        message: 'Impossible de déterminer les dimensions de l\'image',
        code: 'INVALID_IMAGE_DIMENSIONS',
      });
    }
  }

  // Métadonnées pour les vidéos
  if (file.type.startsWith('video/')) {
    const videoMetadata = await extractVideoMetadata(file);
    if (videoMetadata) {
      metadata = { ...metadata, ...videoMetadata };
    }
  }

  // Validation du contenu (optionnel)
  if (validateContent) {
    const contentValidation = await validateFileContent(file);
    warnings.push(...contentValidation.warnings);
    if (!contentValidation.isValid) {
      errors.push(...contentValidation.errors);
    }
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    metadata,
  };
}

/**
 * Traite un fichier uploadé et retourne son contenu
 */
export async function processFileUpload(file: File): Promise<FileUploadResult> {
  const validation = await validateFile(file);

  if (!validation.isValid) {
    throw new Error(`Validation échouée: ${validation.errors.map(e => e.message).join(', ')}`);
  }

  let content = '';

  try {
    content = await readFileAsText(file);
  } catch (error) {
    throw new Error(`Impossible de lire le fichier: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }

  return {
    file,
    content,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified),
    encoding: validation.metadata?.charset,
    metadata: validation.metadata,
  };
}

/**
 * Lit un fichier comme texte
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Le résultat n\'est pas une chaîne de caractères'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };

    reader.readAsText(file);
  });
}

/**
 * Lit un fichier comme DataURL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Le résultat n\'est pas une chaîne de caractères'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Lit un fichier comme ArrayBuffer
 */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('Le résultat n\'est pas un ArrayBuffer'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Détecte l'encodage d'un fichier
 */
export async function detectCharset(file: File): Promise<string> {
  try {
    const buffer = await readFileAsArrayBuffer(file);
    const uint8Array = new Uint8Array(buffer);

    // Détection basique des encodages courants
    if (uint8Array.length >= 3 && uint8Array[0] === 0xEF && uint8Array[1] === 0xBB && uint8Array[2] === 0xBF) {
      return 'utf-8';
    }

    if (uint8Array.length >= 2 && uint8Array[0] === 0xFF && uint8Array[1] === 0xFE) {
      return 'utf-16le';
    }

    if (uint8Array.length >= 2 && uint8Array[0] === 0xFE && uint8Array[1] === 0xFF) {
      return 'utf-16be';
    }

    // Détection simple pour ISO-8859-1 (contient des octets > 127)
    for (let i = 0; i < Math.min(1000, uint8Array.length); i++) {
      if (uint8Array[i] > 127) {
        return 'iso-8859-1';
      }
    }

    return 'utf-8';
  } catch {
    return 'utf-8';
  }
}

/**
 * Extrait les métadonnées d'une image
 */
export async function extractImageMetadata(file: File): Promise<FileMetadata | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectURL = URL.createObjectURL(file);

    img.onload = () => {
      const metadata: FileMetadata = {
        name: file.name,
        extension: '.' + file.name.split('.').pop()?.toLowerCase(),
        mimeType: file.type,
        dimensions: {
          width: img.width,
          height: img.height,
        },
      };

      URL.revokeObjectURL(objectURL);
      resolve(metadata);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectURL);
      resolve(null);
    };

    img.src = objectURL;
  });
}

/**
 * Extrait les métadonnées d'une vidéo
 */
export async function extractVideoMetadata(file: File): Promise<FileMetadata | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const objectURL = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      const metadata: FileMetadata = {
        name: file.name,
        extension: '.' + file.name.split('.').pop()?.toLowerCase(),
        mimeType: file.type,
        duration: video.duration,
      };

      URL.revokeObjectURL(objectURL);
      resolve(metadata);
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectURL);
      resolve(null);
    };

    video.src = objectURL;
  });
}

/**
 * Valide le contenu d'un fichier
 */
async function validateFileContent(file: File): Promise<{
  isValid: boolean;
  errors: FileValidationError[];
  warnings: FileValidationError[];
}> {
  const errors: FileValidationError[] = [];
  const warnings: FileValidationError[] = [];

  try {
    const content = await readFileAsText(file);

    // Validation pour les fichiers Markdown
    if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
      if (content.length === 0) {
        warnings.push({
          field: 'content',
          message: 'Le fichier Markdown est vide',
          code: 'EMPTY_FILE',
        });
      }

      // Vérifier la structure Markdown basique
      if (content.length > 1000000) { // 1MB de texte
        warnings.push({
          field: 'content',
          message: 'Le fichier est très volumineux, ce pourrait affecter les performances',
          code: 'LARGE_FILE',
        });
      }
    }

    // Validation pour les fichiers JSON
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      try {
        JSON.parse(content);
      } catch {
        errors.push({
          field: 'content',
          message: 'Le fichier JSON contient des erreurs de syntaxe',
          code: 'INVALID_JSON',
        });
      }
    }

  } catch (error) {
    errors.push({
      field: 'content',
      message: 'Impossible de valider le contenu du fichier',
      code: 'CONTENT_VALIDATION_ERROR',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Vérifie si un nom de fichier est valide
 */
export function isValidFileName(fileName: string): boolean {
  // Nom de fichier non vide
  if (!fileName || fileName.trim().length === 0) {
    return false;
  }

  // Caractères invalides (Windows, Linux, macOS)
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (invalidChars.test(fileName)) {
    return false;
  }

  // Noms réservés (Windows)
  const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
  const nameWithoutExt = fileName.split('.')[0].toUpperCase();
  if (reservedNames.includes(nameWithoutExt)) {
    return false;
  }

  // Longueur maximale (255 caractères pour Windows)
  if (fileName.length > 255) {
    return false;
  }

  return true;
}

/**
 * Génère un nom de fichier sécurisé
 */
export function generateSafeFileName(originalName: string, extension?: string): string {
  // Extraire le nom sans l'extension
  const nameWithoutExt = originalName.split('.')[0];

  // Nettoyer le nom
  let safeName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9àâäéèêëïîôöùûüÿç]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100); // Limiter la longueur

  // Si le nom est vide après nettoyage
  if (!safeName) {
    safeName = 'document';
  }

  // Ajouter un timestamp pour éviter les conflits
  const timestamp = Date.now();
  const ext = extension || ('.' + originalName.split('.').pop()) || '';

  return `${safeName}-${timestamp}${ext}`;
}

/**
 * Formate la taille d'un fichier pour l'affichage
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Détermine la catégorie d'un fichier
 */
export function getFileCategory(file: File): 'text' | 'image' | 'document' | 'font' | 'other' {
  const mimeType = file.type.toLowerCase();
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();

  // Vérifier par type MIME
  for (const [category, types] of Object.entries(SUPPORTED_MIME_TYPES)) {
    if (types.some(type => mimeType.includes(type))) {
      return category as any;
    }
  }

  // Vérifier par extension
  for (const [category, exts] of Object.entries(SUPPORTED_EXTENSIONS)) {
    if (exts.includes(extension)) {
      return category as any;
    }
  }

  return 'other';
}

/**
 * Crée un objet File à partir de contenu texte
 */
export function createFileFromText(
  content: string,
  fileName: string,
  mimeType: string = 'text/plain'
): File {
  const blob = new Blob([content], { type: mimeType });
  return new File([blob], fileName, { type: mimeType });
}

/**
 * Télécharge un fichier
 */
export function downloadFile(content: Blob | string, fileName: string, mimeType?: string): void {
  const blob = typeof content === 'string' ? new Blob([content], { type: mimeType || 'text/plain' }) : content;
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Compresse une image
 */
export function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculer les nouvelles dimensions
      let { width, height } = img;

      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (maxHeight / height) * width;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: `image/${format}`,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Impossible de compresser l\'image'));
            }
          },
          `image/${format}`,
          quality
        );
      } else {
        reject(new Error('Impossible d\'obtenir le contexte 2D'));
      }
    };

    img.onerror = () => {
      reject(new Error('Impossible de charger l\'image'));
    };

    img.src = URL.createObjectURL(file);
  });
}

export default {
  validateFile,
  processFileUpload,
  readFileAsText,
  readFileAsDataURL,
  readFileAsArrayBuffer,
  detectCharset,
  extractImageMetadata,
  extractVideoMetadata,
  isValidFileName,
  generateSafeFileName,
  formatFileSize,
  getFileCategory,
  createFileFromText,
  downloadFile,
  compressImage,
  SUPPORTED_MIME_TYPES,
  SUPPORTED_EXTENSIONS,
  MAX_FILE_SIZES,
};