import { PDFGenerationOptions, PDFGenerationResult } from './pdf';
import { MarkdownProcessingOptions, MarkdownParseResult } from './markdown';

/**
 * Types pour les API et services
 */

// Types de réponses API généraux
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp?: Date;
  requestId?: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
  stack?: string; // En développement uniquement
  timestamp?: Date;
  requestId?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  constraint?: string;
  code?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
  filters?: Record<string, any>;
  sorting?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

// Types pour les endpoints de templates
export interface TemplatesAPI {
  // GET /api/templates
  getTemplates(params?: TemplateSearchParams): Promise<PaginatedResponse<TemplateAPIResponse>>;

  // GET /api/templates/:id
  getTemplate(id: string): Promise<APIResponse<TemplateAPIResponse>>;

  // POST /api/templates
  createTemplate(template: CreateTemplateRequest): Promise<APIResponse<TemplateAPIResponse>>;

  // PUT /api/templates/:id
  updateTemplate(id: string, template: UpdateTemplateRequest): Promise<APIResponse<TemplateAPIResponse>>;

  // DELETE /api/templates/:id
  deleteTemplate(id: string): Promise<APIResponse<void>>;

  // POST /api/templates/:id/preview
  previewTemplate(id: string, content: string): Promise<APIResponse<TemplatePreviewResponse>>;
}

export interface TemplateSearchParams extends PaginationParams {
  category?: string;
  style?: string;
  featured?: boolean;
}

export interface TemplateAPIResponse {
  id: string;
  name: string;
  description: string;
  category: string;
  styles: Record<string, any>;
  layout: Record<string, any>;
  preview: string;
  featured: boolean;
  downloadCount: number;
  rating: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
}

export interface CreateTemplateRequest {
  name: string;
  description: string;
  category: string;
  styles: Record<string, any>;
  layout: Record<string, any>;
  tags: string[];
}

export interface UpdateTemplateRequest extends Partial<CreateTemplateRequest> {
  id: string;
}

export interface TemplatePreviewResponse {
  html: string;
  css: string;
  previewUrl: string;
}

// Types pour les endpoints de génération PDF
export interface PDFGenerationAPI {
  // POST /api/pdf/generate
  generatePDF(request: PDFGenerationRequest): Promise<APIResponse<PDFGenerationResult>>;

  // GET /api/pdf/status/:jobId
  getGenerationStatus(jobId: string): Promise<APIResponse<PDFGenerationStatus>>;

  // POST /api/pdf/batch
  generateBatchPDF(request: BatchPDFGenerationRequest): Promise<APIResponse<BatchPDFResponse>>;
}

export interface PDFGenerationRequest {
  content: string;
  options: PDFGenerationOptions;
  filename?: string;
  templateId?: string;
  webhookUrl?: string;
  priority?: 'low' | 'normal' | 'high';
}

export interface PDFGenerationStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  currentStage: string;
  estimatedTimeRemaining?: number; // seconds
  result?: PDFGenerationResult;
  error?: APIError;
  createdAt: Date;
  updatedAt: Date;
}

export interface BatchPDFGenerationRequest {
  documents: {
    id: string;
    content: string;
    options?: PDFGenerationOptions;
    filename?: string;
  }[];
  batchOptions: {
    zipOutput?: boolean;
    emailNotification?: string;
    webhookUrl?: string;
  };
}

export interface BatchPDFResponse {
  batchId: string;
  documents: {
    id: string;
    status: string;
    result?: PDFGenerationResult;
    error?: APIError;
  }[];
  downloadUrl?: string;
  createdAt: Date;
}

// Types pour les endpoints de traitement Markdown
export interface MarkdownProcessingAPI {
  // POST /api/markdown/parse
  parseMarkdown(request: MarkdownParseRequest): Promise<APIResponse<MarkdownParseResult>>;

  // POST /api/markdown/render
  renderMarkdown(request: MarkdownRenderRequest): Promise<APIResponse<MarkdownRenderResponse>>;

  // POST /api/markdown/export
  exportMarkdown(request: MarkdownExportRequest): Promise<APIResponse<MarkdownExportResponse>>;

  // GET /api/markdown/preview
  getPreview(options: MarkdownPreviewOptions): Promise<APIResponse<string>>;
}

export interface MarkdownParseRequest {
  content: string;
  options?: MarkdownProcessingOptions;
  filename?: string;
  extractMetadata?: boolean;
  generateTOC?: boolean;
}

export interface MarkdownRenderRequest {
  content: string;
  template?: string;
  options?: MarkdownProcessingOptions;
  variables?: Record<string, any>;
}

export interface MarkdownRenderResponse {
  html: string;
  css?: string;
  toc?: string;
  metadata: Record<string, any>;
  performance: {
    parseTime: number;
    renderTime: number;
    totalTime: number;
  };
}

export interface MarkdownExportRequest {
  content: string;
  format: 'html' | 'pdf' | 'docx' | 'txt';
  template?: string;
  options?: Record<string, any>;
}

export interface MarkdownExportResponse {
  url: string;
  filename: string;
  size: number;
  format: string;
  expiresAt: Date;
}

export interface MarkdownPreviewOptions {
  content: string;
  template?: string;
  theme?: 'light' | 'dark';
  width?: number;
}

// Types pour les endpoints de fichiers
export interface FileAPI {
  // POST /api/files/upload
  uploadFile(file: FileUploadRequest): Promise<APIResponse<FileUploadResponse>>;

  // GET /api/files/:id
  getFile(id: string): Promise<APIResponse<FileResponse>>;

  // DELETE /api/files/:id
  deleteFile(id: string): Promise<APIResponse<void>>;

  // GET /api/files/recent
  getRecentFiles(params?: FileSearchParams): Promise<APIResponse<FileResponse[]>>;
}

export interface FileUploadRequest {
  file: File;
  category?: 'document' | 'image' | 'template' | 'font';
  metadata?: Record<string, any>;
}

export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  category: string;
  metadata: Record<string, any>;
  uploadedAt: Date;
}

export interface FileResponse {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  category: string;
  metadata: Record<string, any>;
  uploadedAt: Date;
  lastAccessed?: Date;
  downloadCount: number;
}

export interface FileSearchParams extends PaginationParams {
  category?: string;
  mimeType?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// Types pour les endpoints utilisateur
export interface UserAPI {
  // GET /api/user/profile
  getProfile(): Promise<APIResponse<UserProfile>>;

  // PUT /api/user/profile
  updateProfile(profile: UpdateProfileRequest): Promise<APIResponse<UserProfile>>;

  // GET /api/user/preferences
  getPreferences(): Promise<APIResponse<UserPreferences>>;

  // PUT /api/user/preferences
  updatePreferences(preferences: UserPreferences): Promise<APIResponse<UserPreferences>>;

  // GET /api/user/statistics
  getStatistics(): Promise<APIResponse<UserStatistics>>;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  joinedAt: Date;
  lastLogin?: Date;
  subscription: {
    plan: string;
    status: 'active' | 'inactive' | 'cancelled';
    expiresAt?: Date;
  };
}

export interface UpdateProfileRequest extends Partial<UserProfile> {
  currentPassword?: string; // Pour les changements sensibles
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  defaultPDFOptions?: Record<string, any>;
  defaultMarkdownOptions?: Record<string, any>;
  notifications: {
    email: boolean;
    push: boolean;
    updates: boolean;
    marketing: boolean;
  };
  editor: {
    fontSize: number;
    fontFamily: string;
    tabSize: number;
    wordWrap: boolean;
    lineNumbers: boolean;
    minimap: boolean;
  };
  privacy: {
    profilePublic: boolean;
    statisticsPublic: boolean;
  };
}

export interface UserStatistics {
  documentsCreated: number;
  pdfsGenerated: number;
  templatesCreated: number;
  filesUploaded: number;
  totalStorageUsed: number;
  pdfsGeneratedThisMonth: number;
  templatesCreatedThisMonth: number;
  lastActivity: Date;
  favoriteTemplate?: string;
  mostUsedFormat?: string;
}

// Types pour les webhooks
export interface WebhookAPI {
  // POST /api/webhooks
  createWebhook(webhook: CreateWebhookRequest): Promise<APIResponse<WebhookResponse>>;

  // GET /api/webhooks
  getWebhooks(): Promise<APIResponse<WebhookResponse[]>>;

  // PUT /api/webhooks/:id
  updateWebhook(id: string, webhook: UpdateWebhookRequest): Promise<APIResponse<WebhookResponse>>;

  // DELETE /api/webhooks/:id
  deleteWebhook(id: string): Promise<APIResponse<void>>;
}

export interface CreateWebhookRequest {
  name: string;
  url: string;
  events: string[];
  secret?: string;
  active: boolean;
}

export interface UpdateWebhookRequest extends Partial<CreateWebhookRequest> {
  id: string;
}

export interface WebhookResponse {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  secret?: string;
  lastTriggered?: Date;
  triggerCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookPayload {
  id: string;
  event: string;
  timestamp: Date;
  data: any;
  signature?: string;
}

// Types pour les analytics et monitoring
export interface AnalyticsAPI {
  // GET /api/analytics/overview
  getOverview(params?: AnalyticsParams): Promise<APIResponse<AnalyticsOverview>>;

  // GET /api/analytics/usage
  getUsage(params?: AnalyticsParams): Promise<APIResponse<UsageAnalytics>>;

  // GET /api/analytics/performance
  getPerformance(params?: AnalyticsParams): Promise<APIResponse<PerformanceAnalytics>>;
}

export interface AnalyticsParams {
  startDate?: Date;
  endDate?: Date;
  period?: 'hour' | 'day' | 'week' | 'month' | 'year';
  metrics?: string[];
  filters?: Record<string, any>;
}

export interface AnalyticsOverview {
  totalUsers: number;
  activeUsers: number;
  documentsCreated: number;
  pdfsGenerated: number;
  storageUsed: number;
  revenue?: number;
  growth: {
    users: number;
    documents: number;
    pdfs: number;
    storage: number;
  };
}

export interface UsageAnalytics {
  metrics: {
    timestamp: Date;
    users: number;
    documents: number;
    pdfs: number;
    storage: number;
    errors: number;
  }[];
  summary: {
    totalUsers: number;
    totalDocuments: number;
    totalPDFs: number;
    totalStorage: number;
    averageResponseTime: number;
    errorRate: number;
  };
}

export interface PerformanceAnalytics {
  responseTimes: {
    endpoint: string;
    method: string;
    averageTime: number;
    minTime: number;
    maxTime: number;
    requestCount: number;
    errorRate: number;
  }[];
  system: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkIO: number;
  };
  database: {
    connectionCount: number;
    queryTime: number;
    slowQueries: number;
  };
}

// Types pour les endpoints d'administration
export interface AdminAPI {
  // GET /api/admin/users
  getUsers(params?: AdminUserParams): Promise<PaginatedResponse<AdminUserResponse>>;

  // PUT /api/admin/users/:id
  updateUser(id: string, user: AdminUpdateUserRequest): Promise<APIResponse<AdminUserResponse>>;

  // DELETE /api/admin/users/:id
  deleteUser(id: string): Promise<APIResponse<void>>;

  // GET /api/admin/statistics
  getSystemStatistics(): Promise<APIResponse<SystemStatistics>>;

  // POST /api/admin/maintenance
  triggerMaintenance(action: MaintenanceAction): Promise<APIResponse<MaintenanceResponse>>;
}

export interface AdminUserParams extends PaginationParams {
  status?: 'active' | 'inactive' | 'suspended';
  plan?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface AdminUserResponse {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  subscription: {
    plan: string;
    status: 'active' | 'inactive' | 'cancelled';
    expiresAt?: Date;
  };
  statistics: {
    documentsCreated: number;
    pdfsGenerated: number;
    storageUsed: number;
  };
  joinedAt: Date;
  lastLogin?: Date;
}

export interface AdminUpdateUserRequest {
  status?: 'active' | 'inactive' | 'suspended';
  subscription?: {
    plan: string;
    status: 'active' | 'inactive' | 'cancelled';
    expiresAt?: Date;
  };
}

export interface SystemStatistics {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
  };
  documents: {
    total: number;
    createdThisMonth: number;
    averageSize: number;
  };
  pdfs: {
    total: number;
    generatedThisMonth: number;
    successRate: number;
    averageGenerationTime: number;
  };
  storage: {
    totalUsed: number;
    totalAvailable: number;
    percentageUsed: number;
  };
  performance: {
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    projected: number;
  };
}

export interface MaintenanceAction {
  type: 'cache-clear' | 'database-optimize' | 'backup' | 'update';
  options?: Record<string, any>;
}

export interface MaintenanceResponse {
  action: string;
  status: 'started' | 'completed' | 'failed';
  message: string;
  result?: any;
  startedAt: Date;
  completedAt?: Date;
}

// Types pour les erreurs et exceptions
export interface APIErrorResponse {
  success: false;
  error: APIError;
  timestamp: Date;
  requestId: string;
  path: string;
  method: string;
}

export interface RateLimitError extends APIError {
  retryAfter: number;
  limit: number;
  remaining: number;
  resetTime: Date;
}

export interface AuthenticationError extends APIError {
  provider?: string;
  redirectUrl?: string;
}

export interface AuthorizationError extends APIError {
  permissions?: string[];
  resource?: string;
}

// Types pour la configuration de l'API client
export interface APIConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  headers?: Record<string, string>;
  authentication?: {
    type: 'bearer' | 'api-key' | 'basic';
    token: string;
  };
  interceptors?: {
    request?: Array<(config: any) => any>;
    response?: Array<(response: any) => any>;
    error?: Array<(error: any) => any>;
  };
}