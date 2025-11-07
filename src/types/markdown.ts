/**
 * Types pour le traitement Markdown
 */

export interface MarkdownElement {
  type: 'heading' | 'paragraph' | 'list' | 'code' | 'quote' | 'table' | 'image' | 'link' | 'hr' | 'html';
  content: string;
  level?: number; // Pour les headings (h1, h2, etc.)
  attributes?: Record<string, any>;
  children?: MarkdownElement[];
  position?: {
    start: {
      line: number;
      column: number;
      offset: number;
    };
    end: {
      line: number;
      column: number;
      offset: number;
    };
  };
}

export interface MarkdownHeading extends MarkdownElement {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  id: string; // Pour les ancres
}

export interface MarkdownList extends MarkdownElement {
  type: 'list';
  ordered: boolean;
  start?: number;
  items: MarkdownListItem[];
}

export interface MarkdownListItem {
  type: 'list-item';
  content: string;
  checked?: boolean; // Pour les task lists
  marker: string;
  attributes?: Record<string, any>;
  position?: {
    start: {
      line: number;
      column: number;
      offset: number;
    };
    end: {
      line: number;
      column: number;
      offset: number;
    };
  };
}

export interface MarkdownCode extends MarkdownElement {
  type: 'code';
  language?: string;
  inline?: boolean;
  meta?: string; // Pour les méta-informations
  highlighted?: string;
}

export interface MarkdownImage extends MarkdownElement {
  type: 'image';
  src: string;
  alt: string;
  title?: string;
  dimensions?: {
    width?: number;
    height?: number;
  };
}

export interface MarkdownLink extends MarkdownElement {
  type: 'link';
  href: string;
  title?: string;
  text: string;
  external?: boolean;
}

export interface MarkdownTable extends MarkdownElement {
  type: 'table';
  header: MarkdownTableRow;
  rows: MarkdownTableRow[];
  align: ('left' | 'center' | 'right')[];
}

export interface MarkdownTableRow {
  type: 'table-row';
  cells: MarkdownTableCell[];
  attributes?: Record<string, any>;
  position?: {
    start: {
      line: number;
      column: number;
      offset: number;
    };
    end: {
      line: number;
      column: number;
      offset: number;
    };
  };
}

export interface MarkdownTableCell {
  type: 'table-cell';
  text: string;
  colspan?: number;
  rowspan?: number;
  attributes?: Record<string, any>;
  position?: {
    start: {
      line: number;
      column: number;
      offset: number;
    };
    end: {
      line: number;
      column: number;
      offset: number;
    };
  };
}

export interface MarkdownProcessingOptions {
  sanitize?: boolean;
  breaks?: boolean;
  gfm?: boolean;
  smartLists?: boolean;
  smartypants?: boolean;
  tables?: boolean;
  taskLists?: boolean;
  strikethrough?: boolean;
  footnotes?: boolean;
  emoji?: boolean;
  highlight?: boolean;
  sub?: boolean;
  sup?: boolean;
  katex?: boolean; // Pour les mathématiques
  mermaid?: boolean; // Pour les diagrammes
  toc?: boolean; // Table des matières
  tocOptions?: TOCOptions;
  highlightOptions?: HighlightOptions;
}

export interface TOCOptions {
  title?: string;
  maxDepth?: number;
  minDepth?: number;
  className?: string;
  id?: string;
  container?: string;
  slugify?: (text: string) => string;
}

export interface HighlightOptions {
  theme?: string;
  languages?: string[];
  autoDetection?: boolean;
  tabSize?: number;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

export interface MarkdownParseResult {
  html: string;
  metadata: MarkdownMetadata;
  toc: TableOfContents;
  elements: MarkdownElement[];
  stats: MarkdownStats;
  warnings: MarkdownWarning[];
  tocHTML?: string;
}

export interface MarkdownMetadata {
  title?: string;
  author?: string;
  date?: Date;
  tags?: string[];
  description?: string;
  category?: string;
  wordCount: number;
  readingTime: number; // minutes
  languages?: string[]; // Langues détectées
  links?: {
    internal: number;
    external: number;
  };
  images?: {
    count: number;
    totalSize?: number;
  };
  custom?: Record<string, any>;
}

export interface TableOfContents {
  title: string;
  entries: TOCEntry[];
  maxDepth: number;
}

export interface TOCEntry {
  title: string;
  level: number;
  anchor: string;
  children: TOCEntry[];
  line?: number;
}

export interface MarkdownStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  paragraphs: number;
  lines: number;
  sentences: number;
  headings: Record<number, number>; // h1: 2, h2: 5, etc.
  lists: number;
  listItems: number;
  codeBlocks: number;
  tables: number;
  images: number;
  links: number;
  footnotes: number;
  readingTime: number;
}

export interface MarkdownWarning {
  type: 'syntax' | 'link' | 'image' | 'structure' | 'performance';
  message: string;
  line?: number;
  column?: number;
  severity: 'info' | 'warning' | 'error';
}

export interface MarkdownValidationError {
  field: string;
  message: string;
  value: any;
  constraint: string;
  line?: number;
  column?: number;
}

export interface MarkdownTemplate {
  id: string;
  name: string;
  description: string;
  category: 'blog' | 'documentation' | 'academic' | 'technical' | 'creative' | 'custom';
  variables: TemplateVariable[];
  template: string;
  preview?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  description: string;
  required: boolean;
  default?: any;
  validation?: VariableValidation;
}

export interface VariableValidation {
  pattern?: string; // Regex
  min?: number;
  max?: number;
  options?: string[];
  custom?: (value: any) => boolean | string;
}

export interface MarkdownPlugin {
  name: string;
  version: string;
  description: string;
  options?: Record<string, any>;
  enabled: boolean;
}

export interface MarkdownRenderResult {
  html: string;
  css?: string;
  js?: string;
  toc?: string;
  metadata: MarkdownMetadata;
  errors: MarkdownWarning[];
  performance: RenderPerformance;
}

export interface RenderPerformance {
  parseTime: number; // ms
  renderTime: number; // ms
  totalTime: number; // ms
  memoryUsage: number; // MB
}

// Types pour les fonctionnalités avancées
export interface MarkdownCollaboration {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  cursor?: {
    line: number;
    column: number;
  };
  selections?: CursorSelection[];
  color: string;
  lastActivity: Date;
}

export interface CursorSelection {
  start: {
    line: number;
    column: number;
  };
  end: {
    line: number;
    column: number;
  };
}

export interface MarkdownVersion {
  id: string;
  documentId: string;
  version: number;
  content: string;
  metadata: MarkdownMetadata;
  author: {
    id: string;
    name: string;
    email?: string;
  };
  message?: string;
  createdAt: Date;
  changes?: {
    added: number;
    removed: number;
    modified: number;
  };
}

export interface MarkdownSearchResult {
  document: {
    id: string;
    title?: string;
    path: string;
  };
  matches: SearchMatch[];
  score: number;
}

export interface SearchMatch {
  text: string;
  line: number;
  column: number;
  context: string;
  type: 'title' | 'content' | 'code' | 'link' | 'image';
}

export interface MarkdownExportOptions {
  format: 'html' | 'pdf' | 'docx' | 'txt' | 'md' | 'epub';
  template?: string;
  options?: Record<string, any>;
  includeMetadata?: boolean;
  includeTOC?: boolean;
  customCSS?: string;
}

export interface MarkdownImportOptions {
  format: 'md' | 'html' | 'txt' | 'docx';
  sanitize?: boolean;
  convertLinks?: boolean;
  extractMetadata?: boolean;
  preserveWhitespace?: boolean;
}

// Types pour l'analyse de contenu
export interface MarkdownAnalytics {
  readability: ReadabilityScore;
  seo: SEOAnalysis;
  structure: StructureAnalysis;
  sentiment?: SentimentAnalysis;
}

export interface ReadabilityScore {
  score: number; // 0-100
  grade: 'very-easy' | 'easy' | 'fairly-easy' | 'standard' | 'fairly-difficult' | 'difficult' | 'very-difficult';
  avgWordsPerSentence: number;
  avgCharsPerWord: number;
  avgSentencesPerParagraph: number;
}

export interface SEOAnalysis {
  title?: {
    present: boolean;
    length: number;
    keywords?: string[];
  };
  description?: {
    present: boolean;
    length: number;
    keywords?: string[];
  };
  headings: {
    h1Count: number;
    h2Count: number;
    h3PlusCount: number;
    structureIssues: string[];
  };
  images: {
    totalImages: number;
    imagesWithAlt: number;
    imagesWithTitles: number;
  };
  links: {
    internalLinks: number;
    externalLinks: number;
    brokenLinks?: string[];
  };
}

export interface StructureAnalysis {
  hasIntroduction: boolean;
  hasConclusion: boolean;
  headingStructure: HeadingStructure[];
  logicalFlow: number; // 0-100
  completeness: number; // 0-100
}

export interface HeadingStructure {
  level: number;
  count: number;
  titles: string[];
  issues: string[];
}

export interface SentimentAnalysis {
  score: number; // -1 to 1
  magnitude: number; // 0 to infinity
  label: 'positive' | 'negative' | 'neutral';
  emotions?: Record<string, number>;
}