export interface TemplateStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  lineHeight?: number;
  color?: string;
  backgroundColor?: string;
  textDecoration?: string;
  textAlign?: string;
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  borders?: {
    width: number;
    color: string;
    style: 'solid' | 'dashed' | 'dotted' | 'none';
  };
  borderRadius?: number;
}

export interface TemplateHeader {
  enabled: boolean;
  content?: string;
  height?: number;
  style?: TemplateStyle;
  alignment?: 'left' | 'center' | 'right';
  pageNumber?: boolean;
  date?: boolean;
  author?: boolean;
}

export interface TemplateFooter {
  enabled: boolean;
  content?: string;
  height?: number;
  style?: TemplateStyle;
  alignment?: 'left' | 'center' | 'right';
  pageNumber?: boolean;
}

export interface TemplatePage {
  size: 'a4' | 'a3' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
  backgroundColor?: string;
  backgroundImage?: string;
  watermark?: {
    text?: string;
    opacity?: number;
    rotation?: number;
    fontSize?: number;
    color?: string;
  };
}

export interface TemplateTypography {
  h1?: TemplateStyle;
  h2?: TemplateStyle;
  h3?: TemplateStyle;
  h4?: TemplateStyle;
  h5?: TemplateStyle;
  h6?: TemplateStyle;
  p?: TemplateStyle;
  blockquote?: TemplateStyle;
  code?: TemplateStyle;
  pre?: TemplateStyle;
  ul?: TemplateStyle;
  ol?: TemplateStyle;
  li?: TemplateStyle;
  table?: {
    header?: TemplateStyle;
    cell?: TemplateStyle;
    border?: TemplateStyle['borders'];
  };
  link?: TemplateStyle;
}

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  muted: string;
  success: string;
  warning: string;
  error: string;
}

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'academic' | 'creative' | 'business' | 'technical' | 'custom';
  author?: string;
  version: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  isDefault?: boolean;
  isPremium?: boolean;
  preview?: string; // miniature du template
}

export interface Template {
  metadata: TemplateMetadata;
  page: TemplatePage;
  header: TemplateHeader;
  footer: TemplateFooter;
  typography: TemplateTypography;
  colors: TemplateColors;
  customCSS?: string;
  variables?: Record<string, any>; // variables personnalisables
}

export interface TemplateVariable {
  id: string;
  name: string;
  type: 'text' | 'color' | 'number' | 'boolean' | 'select';
  defaultValue: any;
  options?: string[]; // pour le type 'select'
  description?: string;
  category?: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  templates: string[]; // IDs des templates
}

export interface TemplateLibrary {
  categories: TemplateCategory[];
  templates: Template[];
  variables: TemplateVariable[];
}
