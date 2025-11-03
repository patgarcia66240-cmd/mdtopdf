import { RefObject } from 'react';

interface PDFOptions {
  pageWidth?: number;
  margin?: number;
  header?: string;
  footer?: string;
  showPageNumbers?: boolean;
}

export const useMarkdownToPDF: () => {
  convertToPDF: (
    elementRef: RefObject<HTMLElement>,
    fileName?: string,
    options?: PDFOptions
  ) => Promise<void>;
  convertToPDFWithTextShadow: (
    elementRef: RefObject<HTMLElement>,
    fileName?: string,
    options?: PDFOptions
  ) => Promise<void>;
  isConverting: boolean;
};
