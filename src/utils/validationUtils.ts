import { PDFOptions } from '../types/app';

// Alias pour compatibilité
type AppPDFOptions = PDFOptions;

// Types locaux pour ce fichier
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  isValidated: boolean;
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
  constraint?: string;
  path?: string[];
}

interface ValidationRule {
  name: string;
  validator: (value: any) => boolean | string;
  required?: boolean;
  message?: string;
  debounce?: number;
  options?: Record<string, any>;
}

interface ValidationSchema {
  [field: string]: ValidationRule | ValidationSchema;
}

/**
 * Utilitaires de validation pour formulaires et données
 */

// Patterns de validation courants
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/(?:[-\w.])+(?:[-\w.])*[-\w.]+(?::\d+)?(?:\/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:#(?:[\w.])*)?)?$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  slug: /^[a-z0-9-]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  password: {
    strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    medium: /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
    basic: /.{6,}/,
  },
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  rgbColor: /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/,
  rgbaColor: /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\)$/,
};

/**
 * Crée une règle de validation
 */
export function createRule(options: ValidationRule): ValidationRule {
  return {
    required: false,
    message: 'Ce champ est invalide',
    ...options,
  };
}

/**
 * Ensemble de règles de validation prédéfinies
 */
export const VALIDATION_RULES = {
  required: createRule({
    name: 'required',
    validator: (value: any) => {
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      return value !== null && value !== undefined;
    },
    message: 'Ce champ est obligatoire',
  }),

  email: createRule({
    name: 'email',
    validator: (value: string) => !value || VALIDATION_PATTERNS.email.test(value),
    message: 'Veuillez entrer une adresse email valide',
  }),

  url: createRule({
    name: 'url',
    validator: (value: string) => !value || VALIDATION_PATTERNS.url.test(value),
    message: 'Veuillez entrer une URL valide',
  }),

  minLength: (min: number) => createRule({
    name: 'minLength',
    validator: (value: string) => !value || value.length >= min,
    message: `Ce champ doit contenir au moins ${min} caractères`,
  }),

  maxLength: (max: number) => createRule({
    name: 'maxLength',
    validator: (value: string) => !value || value.length <= max,
    message: `Ce champ ne peut pas dépasser ${max} caractères`,
  }),

  min: (min: number) => createRule({
    name: 'min',
    validator: (value: number) => value === null || value === undefined || value >= min,
    message: `La valeur doit être supérieure ou égale à ${min}`,
  }),

  max: (max: number) => createRule({
    name: 'max',
    validator: (value: number) => value === null || value === undefined || value <= max,
    message: `La valeur doit être inférieure ou égale à ${max}`,
  }),

  pattern: (regex: RegExp, message?: string) => createRule({
    name: 'pattern',
    validator: (value: string) => !value || regex.test(value),
    message: message || 'Le format de ce champ est invalide',
  }),

  oneOf: (options: string[]) => createRule({
    name: 'oneOf',
    validator: (value: string) => !value || options.includes(value),
    message: `Ce champ doit être l'une des valeurs suivantes: ${options.join(', ')}`,
  }),

  pdfOptions: createRule({
    name: 'pdfOptions',
    validator: (options: any) => {
      if (!options) return true;

      // Valider le format
      if (options.format && !['a4', 'letter', 'legal'].includes(options.format)) {
        return false;
      }

      // Valider l'orientation
      if (options.orientation && !['portrait', 'landscape'].includes(options.orientation)) {
        return false;
      }

      // Valider la taille de la police
      if (options.fontSize && (options.fontSize < 6 || options.fontSize > 72)) {
        return false;
      }

      // Valider les marges
      if (options.margins) {
        const { top, right, bottom, left } = options.margins;
        if (top < 0 || right < 0 || bottom < 0 || left < 0) {
          return false;
        }
      }

      return true;
    },
    message: 'Les options PDF sont invalides',
  }),

  passwordStrength: (level: 'basic' | 'medium' | 'strong' = 'medium') => createRule({
    name: 'passwordStrength',
    validator: (value: string) => !value || VALIDATION_PATTERNS.password[level].test(value),
    message: `Le mot de passe ne respecte pas les exigences de sécurité (${level})`,
  }),

  hexColor: createRule({
    name: 'hexColor',
    validator: (value: string) => !value || VALIDATION_PATTERNS.hexColor.test(value),
    message: 'Veuillez entrer une couleur hexadécimale valide (#RRGGBB ou #RGB)',
  }),

  date: createRule({
    name: 'date',
    validator: (value: string | Date) => {
      if (!value) return true;
      const date = typeof value === 'string' ? new Date(value) : value;
      return !isNaN(date.getTime());
    },
    message: 'Veuillez entrer une date valide',
  }),

  futureDate: createRule({
    name: 'futureDate',
    validator: (value: string | Date) => {
      if (!value) return true;
      const date = typeof value === 'string' ? new Date(value) : value;
      return date > new Date();
    },
    message: 'La date doit être dans le futur',
  }),

  pastDate: createRule({
    name: 'pastDate',
    validator: (value: string | Date) => {
      if (!value) return true;
      const date = typeof value === 'string' ? new Date(value) : value;
      return date < new Date();
    },
    message: 'La date doit être dans le passé',
  }),

  number: createRule({
    name: 'number',
    validator: (value: any) => value === null || value === undefined || !isNaN(Number(value)),
    message: 'Veuillez entrer un nombre valide',
  }),

  integer: createRule({
    name: 'integer',
    validator: (value: any) => value === null || value === undefined || (Number.isInteger(Number(value)) && !isNaN(Number(value))),
    message: 'Veuillez entrer un nombre entier',
  }),

  positive: createRule({
    name: 'positive',
    validator: (value: number) => value === null || value === undefined || value > 0,
    message: 'La valeur doit être positive',
  }),

  nonNegative: createRule({
    name: 'nonNegative',
    validator: (value: number) => value === null || value === undefined || value >= 0,
    message: 'La valeur ne peut pas être négative',
  }),
};

/**
 * Valide un objet en utilisant un schéma
 */
export function validateSchema(
  data: Record<string, any>,
  schema: ValidationSchema
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Valider chaque champ
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // Validation requise
    if (rules.required && (value === null || value === undefined || value === '')) {
      errors.push({
        field,
        message: rules.message || 'Ce champ est obligatoire',
        code: 'REQUIRED_FIELD',
        value,
        constraint: 'required',
      });
      continue;
    }

    // Si le champ est vide et non requis, passer à la suite
    if (!value && !rules.required) {
      continue;
    }

    // Appliquer la règle de validation
    if (rules.validator && !rules.validator(value)) {
      errors.push({
        field,
        message: rules.message || 'Ce champ est invalide',
        code: rules.name || 'VALIDATION_ERROR',
        value,
        constraint: '',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    isValidated: true,
  };
}

/**
 * Valide un seul champ
 */
export function validateField(
  value: any,
  rules: ValidationRule | ValidationRule[]
): ValidationResult {
  const ruleArray = Array.isArray(rules) ? rules : [rules];
  const errors: ValidationError[] = [];

  for (const rule of ruleArray) {
    // Validation requise
    if (rule.required && (value === null || value === undefined || value === '')) {
      errors.push({
        field: '',
        message: rule.message || 'Ce champ est obligatoire',
        code: 'REQUIRED_FIELD',
        value,
        constraint: 'required',
      });
      break;
    }

    // Si le champ est vide et non requis, passer à la suite
    if (!value && !rule.required) {
      continue;
    }

    // Appliquer la règle de validation
    if (rule.validator && !rule.validator(value)) {
      errors.push({
        field: '',
        message: rule.message || 'Ce champ est invalide',
        code: rule.name || 'VALIDATION_ERROR',
        value,
        constraint: '',
      });
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: [],
    isValidated: true,
  };
}

/**
 * Valide des options PDF
 */
export function validatePDFOptions(options: Partial<AppPDFOptions>): ValidationResult {
  const schema: ValidationSchema = {
    format: {
      ...VALIDATION_RULES.pdfOptions,
      required: false,
    },
    orientation: {
      ...VALIDATION_RULES.pdfOptions,
      required: false,
    },
    fontSize: {
      ...VALIDATION_RULES.pdfOptions,
      required: false,
    },
    margins: {
      name: 'margins',
      required: false,
      validator: (margins: any) => {
        if (!margins) return true;
        const { top, right, bottom, left } = margins;
        return typeof top === 'number' && typeof right === 'number' &&
               typeof bottom === 'number' && typeof left === 'number' &&
               top >= 0 && right >= 0 && bottom >= 0 && left >= 0;
      },
      message: 'Les marges doivent être des nombres positifs',
    },
  };

  return validateSchema(options, schema);
}

/**
 * Valide un formulaire complet
 */
export function validateForm(
  formData: Record<string, any>,
  validationSchema: ValidationSchema,
  options: {
    stopOnFirstError?: boolean;
    includeWarnings?: boolean;
  } = {}
): ValidationResult {
  const { stopOnFirstError = false, includeWarnings = true } = options;

  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  for (const [field, rules] of Object.entries(validationSchema)) {
    const value = formData[field];
    const fieldErrors: ValidationError[] = [];

    // Validation requise
    if (rules.required && (value === null || value === undefined || value === '')) {
      fieldErrors.push({
        field,
        message: rules.message || 'Ce champ est obligatoire',
        code: 'REQUIRED_FIELD',
        value,
        constraint: 'required',
      });
    } else if (value) {
      // Appliquer la règle de validation
      if (rules.validator && !rules.validator(value)) {
        fieldErrors.push({
          field,
          message: rules.message || 'Ce champ est invalide',
          code: rules.name || 'VALIDATION_ERROR',
          value,
          constraint: '',
        });
      }
    }

    if (fieldErrors.length > 0) {
      if (stopOnFirstError) {
        return {
          isValid: false,
          errors: fieldErrors,
          warnings: [],
          isValidated: true,
        };
      }
      errors.push(...fieldErrors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: includeWarnings ? warnings : [],
    isValidated: true,
  };
}

/**
 * Sanitize une chaîne de caractères
 */
export function sanitizeString(input: string, options: {
  maxLength?: number;
  allowHTML?: boolean;
  allowScripts?: boolean;
  removeExtraWhitespace?: boolean;
} = {}): string {
  const {
    maxLength,
    allowHTML = false,
    allowScripts = false,
    removeExtraWhitespace = true,
  } = options;

  let sanitized = input;

  // Supprimer les scripts si non autorisés
  if (!allowScripts) {
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  // Supprimer le HTML si non autorisé
  if (!allowHTML) {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }

  // Limiter la longueur
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Supprimer les espaces supplémentaires
  if (removeExtraWhitespace) {
    sanitized = sanitized.replace(/\s+/g, ' ').trim();
  }

  return sanitized;
}

/**
 * Valide et sanitize un email
 */
export function validateAndSanitizeEmail(email: string): {
  isValid: boolean;
  sanitized: string;
  errors: string[];
} {
  const errors: string[] = [];
  let sanitized = sanitizeString(email, { allowHTML: false, allowScripts: false });

  // Conversion en minuscules
  sanitized = sanitized.toLowerCase().trim();

  // Validation basique
  if (!VALIDATION_PATTERNS.email.test(sanitized)) {
    errors.push('Format d\'email invalide');
  }

  // Validation de la longueur
  if (sanitized.length > 254) {
    errors.push('L\'email est trop long');
  }

  // Validation du domaine
  const domain = sanitized.split('@')[1];
  if (domain && domain.length > 63) {
    errors.push('Le domaine de l\'email est trop long');
  }

  return {
    isValid: errors.length === 0,
    sanitized,
    errors,
  };
}

/**
 * Crée un validateur réutilisable avec debounce
 */
export function createDebouncedValidator(
  validator: (value: any) => ValidationResult,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastValue: any = null;

  return (value: any, callback?: (result: ValidationResult) => void): void => {
    lastValue = value;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      const result = validator(lastValue);
      if (callback) {
        callback(result);
      }
    }, delay);
  };
}

/**
 * Validation de la force d'un mot de passe
 */
export function validatePasswordStrength(password: string): {
  score: number;
  level: 'weak' | 'fair' | 'good' | 'strong';
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let score = 0;

  // Longueur
  if (password.length >= 8) score += 1;
  else suggestions.push('Utilisez au moins 8 caractères');

  // Majuscule
  if (/[A-Z]/.test(password)) score += 1;
  else suggestions.push('Ajoutez une majuscule');

  // Minuscule
  if (/[a-z]/.test(password)) score += 1;
  else suggestions.push('Ajoutez une minuscule');

  // Chiffre
  if (/\d/.test(password)) score += 1;
  else suggestions.push('Ajoutez un chiffre');

  // Caractère spécial
  if (/[@$!%*?&]/.test(password)) score += 1;
  else suggestions.push('Ajoutez un caractère spécial');

  let level: 'weak' | 'fair' | 'good' | 'strong';
  if (score <= 2) level = 'weak';
  else if (score <= 3) level = 'fair';
  else if (score <= 4) level = 'good';
  else level = 'strong';

  return {
    score,
    level,
    suggestions,
  };
}

export default {
  createRule,
  VALIDATION_RULES,
  VALIDATION_PATTERNS,
  validateSchema,
  validateField,
  validateForm,
  validatePDFOptions,
  sanitizeString,
  validateAndSanitizeEmail,
  createDebouncedValidator,
  validatePasswordStrength,
};