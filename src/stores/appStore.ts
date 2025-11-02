import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PDFOptions } from '@/types/app';

interface AppStore {
  // State local (non-async)
  markdown: string;
  pdfOptions: PDFOptions;
  selectedTemplate: string | null;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';

  // Actions
  setMarkdown: (markdown: string) => void;
  updatePDFOptions: (options: Partial<PDFOptions>) => void;
  setSelectedTemplate: (templateId: string | null) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Computed values
  getWordCount: () => number;
  getEstimatedPages: () => number;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      markdown: '',
      pdfOptions: {
        format: 'a4',
        orientation: 'portrait',
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        fontSize: 12,
        fontFamily: 'Inter',
      },
      selectedTemplate: null,
      sidebarCollapsed: false,
      theme: 'light',

      // Actions
      setMarkdown: (markdown) => set({ markdown }),
      updatePDFOptions: (options) =>
        set((state) => ({
          pdfOptions: { ...state.pdfOptions, ...options }
        })),
      setSelectedTemplate: (templateId) => set({ selectedTemplate: templateId }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),

      // Computed
      getWordCount: () => {
        const markdown = get().markdown;
        return markdown.split(/\s+/).filter(word => word.length > 0).length;
      },
      getEstimatedPages: () => {
        const wordCount = get().getWordCount();
        const format = get().pdfOptions.format;
        const wordsPerPage = format === 'a4' ? 500 : 450;
        return Math.ceil(wordCount / wordsPerPage);
      },
    }),
    {
      name: 'mdtopdf-app-store',
      partialize: (state) => ({
        pdfOptions: state.pdfOptions,
        selectedTemplate: state.selectedTemplate,
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);