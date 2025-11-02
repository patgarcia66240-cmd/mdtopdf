import { ReactNode, Ref } from 'react';
import { PDFOptions } from './app';

export type MarkdownEditorRef = HTMLDivElement;

export interface MarkdownEditorProps {
  ref: Ref<MarkdownEditorRef>;
  value: string;
  onChange: (value: string) => void;
  markdownRef: Ref<MarkdownEditorRef>;
  isDarkMode: boolean;
}

export interface PDFOptionsPanelProps {
  options: PDFOptions;
  onChange: (options: Partial<PDFOptions>) => void;
  isDarkMode: boolean;
}

export interface PDFHeaderFooterPanelProps {
  options: PDFOptions;
  onChange: (options: Partial<PDFOptions>) => void;
  isDarkMode: boolean;
}