/**
 * Export centralisé de tous les types TypeScript
 * Ce fichier permet d'importer tous les types depuis un seul endroit
 */

import type { PDFOptions, AppState, RecentFile } from './app';
import type { PDFGenerationOptions, PDFGenerationResult, PDFError } from './pdf';
import type { MarkdownProcessingOptions, MarkdownParseResult, MarkdownRenderResult, MarkdownElement } from './markdown';
import type { APIError, ValidationError, MarkdownRenderResponse, UserProfile, UserPreferences } from './api';
import type { FileUploadResult, PerformanceMetrics, AppError, CacheOptions, LoggerConfig } from './utils';
import type { Template } from './template';

// Types applicatifs principaux
export * from './app';

// Types de composants
export * from './components';

// Types PDF avancés
export * from './pdf';

// Types Markdown
export * from './markdown';

// Types API et services
export * from './api';

// Types utilitaires
export * from './utils';

// Réexports pour faciliter l'importation
export type {
  // App types
  AppState,
  PDFOptions,
  Margins,
  HeaderFooter,
  Template,
  TemplateStyles,
  TemplateLayout,
  RecentFile,
} from './app';

export type {
  // Components types
  MarkdownEditorProps,
  PDFOptionsPanelProps,
  PDFHeaderFooterPanelProps,
  MarkdownEditorRef,
} from './components';

export type {
  // PDF types - les plus importants
  PDFMetrics,
  PDFGenerationOptions,
  PDFGenerationResult,
  PDFTemplate,
  PDFTemplateStyles,
  PDFTemplateLayout,
  PDFMetadata,
  Watermark,
  PDFBookmark,
  PDFPage,
  PDFError,
  PDFFormField,
  PDFAnnotation,
  PDFSignature,
} from './pdf';

export type {
  // Markdown types
  MarkdownElement,
  MarkdownProcessingOptions,
  MarkdownParseResult,
  MarkdownMetadata,
  TableOfContents,
  TOCEntry,
  MarkdownStats,
  MarkdownTemplate,
  MarkdownRenderResult,
  MarkdownAnalytics,
} from './markdown';

export type {
  // API types
  APIResponse,
  APIError,
  ValidationError,
  PaginationParams,
  PaginatedResponse,
  TemplateAPIResponse,
  PDFGenerationRequest,
  PDFGenerationStatus,
  MarkdownRenderResponse,
  UserProfile,
  UserPreferences,
  UserStatistics,
  WebhookResponse,
  AnalyticsOverview,
} from './api';

export type {
  // Utils types
  FileUploadResult,
  FileValidationResult,
  ValidationResult,
  PerformanceMetrics,
  CacheOptions,
  CacheEntry,
  LogEntry,
  LoggerConfig,
  DebounceOptions,
  ThrottleOptions,
  StringTransformOptions,
  NumberFormatOptions,
  RGBColor,
  HSLColor,
  ParsedURL,
  StorageOptions,
  AppError,
  DeviceInfo,
  BrowserInfo,
  ScreenInfo,
} from './utils';

// Types génériques utiles
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Types de combinaison
export type CombinedPDFOptions = PDFOptions & PDFGenerationOptions;
export type CombinedMarkdownOptions = MarkdownProcessingOptions & MarkdownRenderResponse;

// Types d'union utiles
export type FileUploadOrString = FileUploadResult | string;
export type TemplateOrId = Template | string;
export type PDFOrMarkdownOptions = PDFGenerationOptions | MarkdownProcessingOptions;

// Types de garde (type guards)
export function isPDFOptions(obj: any): obj is PDFOptions {
  return obj && typeof obj === 'object' &&
         typeof obj.format === 'string' &&
         typeof obj.orientation === 'string' &&
         typeof obj.margins === 'object';
}

export function isTemplate(obj: any): obj is Template {
  return obj && typeof obj === 'object' &&
         typeof obj.id === 'string' &&
         typeof obj.name === 'string' &&
         typeof obj.category === 'string';
}

export function isMarkdownElement(obj: any): obj is MarkdownElement {
  return obj && typeof obj === 'object' &&
         typeof obj.type === 'string' &&
         typeof obj.content === 'string';
}

export function isAPIError(obj: any): obj is APIError {
  return obj && typeof obj === 'object' &&
         typeof obj.code === 'string' &&
         typeof obj.message === 'string';
}

export function isValidationError(obj: any): obj is ValidationError {
  return obj && typeof obj === 'object' &&
         typeof obj.field === 'string' &&
         typeof obj.message === 'string';
}

// Constantes de types
export const PDF_FORMATS = ['a4', 'letter', 'legal'] as const;
export const PDF_ORIENTATIONS = ['portrait', 'landscape'] as const;
export const TEMPLATE_CATEGORIES = ['professional', 'academic', 'creative', 'custom'] as const;
export const LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'] as const;
export const ERROR_CATEGORIES = ['validation', 'network', 'permission', 'business', 'system', 'ui', 'external'] as const;
export const ERROR_SEVERITIES = ['low', 'medium', 'high', 'critical'] as const;

// Types de configuration par défaut
export interface DefaultConfig {
  pdf: PDFOptions;
  markdown: MarkdownProcessingOptions;
  cache: CacheOptions;
  logging: LoggerConfig;
  performance: {
    enableMetrics: boolean;
    thresholds: Record<string, number>;
  };
}

// Types d'événements
export interface AppEvent {
  type: string;
  payload?: any;
  timestamp: Date;
  source: string;
}

export interface PDFEvent extends AppEvent {
  type: 'pdf:generated' | 'pdf:error' | 'pdf:progress';
  payload: {
    jobId?: string;
    result?: PDFGenerationResult;
    error?: PDFError;
    progress?: number;
  };
}

export interface MarkdownEvent extends AppEvent {
  type: 'markdown:parsed' | 'markdown:rendered' | 'markdown:error';
  payload: {
    result?: MarkdownParseResult | MarkdownRenderResult;
    error?: Error;
    content: string;
  };
}

export interface TemplateEvent extends AppEvent {
  type: 'template:selected' | 'template:created' | 'template:updated' | 'template:deleted';
  payload: {
    template?: Template;
    templateId?: string;
    error?: Error;
  };
}

export interface FileEvent extends AppEvent {
  type: 'file:uploaded' | 'file:deleted' | 'file:error';
  payload: {
    file?: FileUploadResult;
    fileId?: string;
    error?: Error;
  };
}

// Types d'état global
export interface GlobalState {
  app: AppState;
  user?: UserProfile;
  preferences: UserPreferences;
  templates: Template[];
  recentFiles: RecentFile[];
  performance: PerformanceMetrics[];
  errors: AppError[];
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  timestamp: Date;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  primary?: boolean;
}

// Types de thèmes
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    shadow: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Types de plugins et extensions
export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  enabled: boolean;
  config?: PluginConfig;
  hooks?: PluginHooks;
}

export interface PluginConfig {
  [key: string]: any;
}

export interface PluginHooks {
  beforePDFGeneration?: (options: PDFGenerationOptions) => PDFGenerationOptions;
  afterPDFGeneration?: (result: PDFGenerationResult) => PDFGenerationResult;
  beforeMarkdownParsing?: (content: string) => string;
  afterMarkdownParsing?: (result: MarkdownParseResult) => MarkdownParseResult;
  onTemplateLoad?: (template: Template) => Template;
  onFileUpload?: (file: FileUploadResult) => FileUploadResult;
}

// Types pour l'internationalisation
export interface I18nConfig {
  defaultLocale: string;
  supportedLocales: string[];
  fallbackLocale: string;
  messages: Record<string, Record<string, string>>;
  pluralRules?: Record<string, Intl.PluralRules>;
  dateTimeFormats?: Record<string, Intl.DateTimeFormatOptions>;
  numberFormats?: Record<string, Intl.NumberFormatOptions>;
}

export interface TranslationNamespace {
  [key: string]: string | TranslationNamespace;
}

// Types pour l'accessibilité
export interface AccessibilityConfig {
  enableScreenReader: boolean;
  enableKeyboardNavigation: boolean;
  enableHighContrast: boolean;
  enableReducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  language: string;
  announcements: {
    success: string;
    error: string;
    loading: string;
    progress: string;
  };
}

// Types pour les fonctionnalités avancées
export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions?: FeatureFlagCondition[];
  rolloutPercentage?: number;
}

export interface FeatureFlagCondition {
  type: 'user' | 'environment' | 'custom';
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'in' | 'not_in';
  value: any;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: ExperimentVariant[];
  trafficAllocation: number;
  startDate?: Date;
  endDate?: Date;
}

export interface ExperimentVariant {
  id: string;
  name: string;
  weight: number;
  config?: Record<string, any>;
}

// Version de l'API
export const API_VERSION = '1.0.0' as const;
export const TYPES_VERSION = '1.0.0' as const;
