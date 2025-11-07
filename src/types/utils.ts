/**
 * Types utilitaires généraux
 */

// Types pour la manipulation de fichiers
export interface FileUploadResult {
  file: File;
  content: string;
  size: number;
  type: string;
  lastModified: Date;
  encoding?: string;
  metadata?: FileMetadata;
}

export interface FileMetadata {
  name: string;
  extension: string;
  mimeType: string;
  charset?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // Pour les vidéos/audios
  exif?: Record<string, any>; // Pour les images
}

export interface FileValidationResult {
  isValid: boolean;
  errors: FileValidationError[];
  warnings: FileValidationWarning[];
  metadata?: FileMetadata;
}

export interface FileValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
  constraint?: string;
}

export interface FileValidationWarning {
  field: string;
  message: string;
  code: string;
  suggestion?: string;
}

export interface FileProcessingOptions {
  maxSize?: number; // bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
  sanitize?: boolean;
  extractMetadata?: boolean;
  compress?: boolean;
  generateThumbnails?: boolean;
}

// Types pour la validation de formulaires
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  isValidated: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
  path?: string[]; // Pour les objets imbriqués
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  value?: any;
  suggestion?: string;
}

export interface ValidationRule {
  name: string;
  validator: (value: any) => boolean | string;
  required?: boolean;
  message?: string;
  debounce?: number;
}

export interface ValidationSchema {
  [field: string]: ValidationRule | ValidationSchema;
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string[]>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

// Types pour les performances
export interface PerformanceMetrics {
  renderTime: number; // ms
  conversionTime: number; // ms
  fileSize: number; // bytes
  memoryUsage: number; // MB
  cpuUsage: number; // percentage
  networkLatency?: number; // ms
  timestamp: Date;
  operation: string;
  metadata?: Record<string, any>;
}

export interface PerformanceMonitor {
  startTime: number;
  endTime?: number;
  duration?: number;
  memoryBefore?: number;
  memoryAfter?: number;
  operations: PerformanceMetrics[];
}

export interface PerformanceBenchmark {
  name: string;
  iterations: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  standardDeviation: number;
  timestamp: Date;
  environment: {
    browser: string;
    device: string;
    memory: number;
    cores: number;
  };
}

export interface PerformanceThreshold {
  warning: number; // ms
  error: number; // ms
  operation: string;
}

// Types pour le cache
export interface CacheOptions {
  ttl?: number; // Time to live en secondes
  maxSize?: number; // Taille maximale en bytes
  storageType?: 'memory' | 'localStorage' | 'sessionStorage' | 'indexedDB';
  compression?: boolean;
  encryption?: boolean;
  namespace?: string;
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: Date;
  expiresAt?: Date;
  size: number;
  hits: number;
  lastAccessed: Date;
  metadata?: Record<string, any>;
}

export interface CacheStats {
  size: number; // Nombre d'entrées
  memoryUsage: number; // bytes
  hits: number;
  misses: number;
  hitRate: number; // percentage
  evictions: number;
  oldestEntry?: Date;
  newestEntry?: Date;
}

// Types pour le logging et debugging
export interface LogEntry {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  timestamp: Date;
  category?: string;
  data?: any;
  stack?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  tags?: string[];
}

export interface LoggerConfig {
  level: LogLevel;
  destinations: LogDestination[];
  format?: 'json' | 'text' | 'custom';
  customFormatter?: (entry: LogEntry) => string;
  enableColors?: boolean;
  enableTimestamps?: boolean;
  enableStackTrace?: boolean;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogDestination {
  type: 'console' | 'file' | 'remote' | 'localStorage';
  options?: Record<string, any>;
  filter?: (entry: LogEntry) => boolean;
}

// Types pour les déblocages de code (debounce/throttle)
export interface DebounceOptions {
  delay: number;
  immediate?: boolean;
  maxWait?: number;
  leading?: boolean;
  trailing?: boolean;
}

export interface ThrottleOptions {
  delay: number;
  leading?: boolean;
  trailing?: boolean;
}

export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel(): void;
  flush(): ReturnType<T> | undefined;
  pending(): boolean;
}

export interface ThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel(): void;
  flush(): ReturnType<T> | undefined;
}

// Types pour les utilitaires de chaînes
export interface StringTransformOptions {
  case?: 'upper' | 'lower' | 'title' | 'camel' | 'snake' | 'kebab' | 'pascal';
  trim?: boolean;
  normalize?: boolean;
  removeAccents?: boolean;
  replaceSpaces?: string;
  maxLength?: number;
  ellipsis?: string;
}

export interface StringValidationOptions {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  allowEmpty?: boolean;
  whitelist?: string[];
  blacklist?: string[];
  custom?: (value: string) => boolean | string;
}

// Types pour les utilitaires de tableaux et objets
export interface ArrayUtils {
  unique: <T>(array: T[]) => T[];
  chunk: <T>(array: T[], size: number) => T[][];
  shuffle: <T>(array: T[]) => T[];
  sortBy: <T>(array: T[], key: keyof T | ((item: T) => any)) => T[];
  groupBy: <T>(array: T[], key: keyof T | ((item: T) => string)) => Record<string, T[]>;
  flatten: <T>(array: (T | T[])[]) => T[];
  compact: <T>(array: (T | null | undefined)[]) => T[];
}

export interface ObjectUtils {
  pick: <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]) => Pick<T, K>;
  omit: <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]) => Omit<T, K>;
  deepClone: <T>(obj: T) => T;
  deepMerge: <T1 extends Record<string, any>, T2 extends Record<string, any>>(target: T1, source: T2) => T1 & T2;
  isEqual: <T1, T2>(obj1: T1, obj2: T2) => boolean;
  isEmpty: (value: any) => boolean;
  transformKeys: (obj: Record<string, any>, transform: (key: string) => string) => Record<string, any>;
}

// Types pour les utilitaires de date et heure
export interface DateUtils {
  format: (date: Date, format?: string) => string;
  parse: (dateString: string, format?: string) => Date;
  add: (date: Date, amount: number, unit: TimeUnit) => Date;
  subtract: (date: Date, amount: number, unit: TimeUnit) => Date;
  diff: (date1: Date, date2: Date, unit?: TimeUnit) => number;
  isBefore: (date1: Date, date2: Date) => boolean;
  isAfter: (date1: Date, date2: Date) => boolean;
  isBetween: (date: Date, start: Date, end: Date) => boolean;
  startOf: (date: Date, unit: TimeUnit) => Date;
  endOf: (date: Date, unit: TimeUnit) => Date;
}

export type TimeUnit = 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';

// Types pour les utilitaires de nombres
export interface NumberUtils {
  format: (num: number, options?: NumberFormatOptions) => string;
  parse: (str: string) => number | null;
  round: (num: number, precision?: number) => number;
  floor: (num: number, precision?: number) => number;
  ceil: (num: number, precision?: number) => number;
  clamp: (num: number, min: number, max: number) => number;
  random: (min?: number, max?: number, integer?: boolean) => number;
  isPrime: (num: number) => boolean;
  gcd: (a: number, b: number) => number;
  lcm: (a: number, b: number) => number;
}

export interface NumberFormatOptions {
  decimals?: number;
  thousandsSeparator?: string;
  decimalSeparator?: string;
  prefix?: string;
  suffix?: string;
  currency?: string;
  locale?: string;
}

// Types pour les utilitaires de couleur
export interface ColorUtils {
  hexToRgb: (hex: string) => RGBColor | null;
  rgbToHex: (r: number, g: number, b: number) => string;
  hslToRgb: (h: number, s: number, l: number) => RGBColor;
  rgbToHsl: (r: number, g: number, b: number) => HSLColor;
  lighten: (color: string, amount: number) => string;
  darken: (color: string, amount: number) => string;
  saturate: (color: string, amount: number) => string;
  desaturate: (color: string, amount: number) => string;
  mix: (color1: string, color2: string, weight?: number) => string;
  contrast: (color1: string, color2: string) => number;
  readable: (color: string, backgroundColor: string) => boolean;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

// Types pour les utilitaires de DOM
export interface DOMUtils {
  createElement: <K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    attributes?: Record<string, any>,
    children?: (string | Node)[]
  ) => HTMLElementTagNameMap[K];
  addEventListeners: (element: Element, events: Record<string, EventListener>) => void;
  removeEventListeners: (element: Element, events: Record<string, EventListener>) => void;
  getOffset: (element: Element) => ElementOffset;
  isInViewport: (element: Element) => boolean;
  scrollTo: (element: Element, options?: ScrollToOptions) => void;
  waitForElement: (selector: string, timeout?: number) => Promise<Element>;
  debounceEvent: (event: Event, delay: number) => Promise<Event>;
}

export interface ElementOffset {
  top: number;
  left: number;
  width: number;
  height: number;
}

// Types pour les utilitaires de URL et routing
export interface URLUtils {
  parse: (url: string) => ParsedURL;
  build: (parts: Partial<ParsedURL>) => string;
  join: (...parts: string[]) => string;
  normalize: (url: string) => string;
  isAbsolute: (url: string) => boolean;
  isRelative: (url: string) => boolean;
  getDomain: (url: string) => string;
  getPath: (url: string) => string;
  getQueryParams: (url: string) => Record<string, string>;
  setQueryParam: (url: string, key: string, value: string) => string;
  removeQueryParam: (url: string, key: string) => string;
}

export interface ParsedURL {
  protocol?: string;
  auth?: string;
  hostname?: string;
  port?: string;
  pathname?: string;
  search?: string;
  hash?: string;
  query?: Record<string, string>;
}

// Types pour les utilitaires de stockage
export interface StorageUtils {
  set: <T>(key: string, value: T, options?: StorageOptions) => Promise<boolean>;
  get: <T>(key: string, defaultValue?: T) => Promise<T | null>;
  remove: (key: string) => Promise<boolean>;
  clear: (namespace?: string) => Promise<boolean>;
  keys: (namespace?: string) => Promise<string[]>;
  size: (namespace?: string) => Promise<number>;
  exists: (key: string) => Promise<boolean>;
  backup: (keys?: string[]) => Promise<StorageBackup>;
  restore: (backup: StorageBackup) => Promise<boolean>;
}

export interface StorageOptions {
  ttl?: number; // Time to live en secondes
  namespace?: string;
  encrypt?: boolean;
  compress?: boolean;
  sync?: boolean; // Pour localStorage sync entre tabs
  version?: string;
}

export interface StorageBackup {
  timestamp: Date;
  version: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

// Types pour les erreurs et exceptions personnalisées
export interface AppError extends Error {
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  context?: Record<string, any>;
  recoverable: boolean;
  retryable: boolean;
}

export type ErrorCategory = 'validation' | 'network' | 'permission' | 'business' | 'system' | 'ui' | 'external';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorReporter {
  report: (error: AppError) => Promise<void>;
  setContext: (context: Record<string, any>) => void;
  setUser: (user: { id: string; email?: string; name?: string }) => void;
  clearContext: () => void;
  enable: () => void;
  disable: () => void;
}

// Types pour les utilitaires de test
export interface TestUtils {
  createMock: <T>(template?: Partial<T>) => T;
  createSpy: <T extends (...args: any[]) => any>(fn?: T) => T & { calls: any[] };
  createStub: <T>(obj: T, method: keyof T) => T[keyof T] & { calls: any[] };
  waitFor: (condition: () => boolean, timeout?: number) => Promise<void>;
  flushPromises: () => Promise<void>;
  mockLocalStorage: () => Storage;
  mockSessionStorage: () => Storage;
  mockDate: (date: Date | string) => void;
  restoreDate: () => void;
}
export interface TestConfig {
  timeout: number;
  retries: number;
  parallel: boolean;
  coverage: boolean;
  bail: boolean;
  verbose: boolean;
}

// Types pour les utilitaires de développement
export interface DevUtils {
  isDevelopment: () => boolean;
  isProduction: () => boolean;
  isTest: () => boolean;
  isBrowser: () => boolean;
  isNode: () => boolean;
  isMobile: () => boolean;
  isTablet: () => boolean;
  isDesktop: () => boolean;
  getDeviceInfo: () => DeviceInfo;
  getBrowserInfo: () => BrowserInfo;
  getScreenInfo: () => ScreenInfo;
  debug: (message: string, data?: any) => void;
  warn: (message: string, data?: any) => void;
  error: (message: string, error?: Error) => void;
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: string;
  osVersion: string;
  brand: string;
  model: string;
  memory?: number;
  cores?: number;
}

export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  engineVersion: string;
  language: string;
  languages: string[];
  cookieEnabled: boolean;
  doNotTrack: boolean;
  online: boolean;
}

export interface ScreenInfo {
  width: number;
  height: number;
  availWidth: number;
  availHeight: number;
  colorDepth: number;
  pixelDepth: number;
  devicePixelRatio: number;
  orientation: 'portrait' | 'landscape';
}