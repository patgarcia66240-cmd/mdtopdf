import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { PDFOptions, Template, RecentFile } from '@/types/app';

interface HistoryEntry {
  id: string;
  markdown: string;
  pdfOptions: PDFOptions;
  selectedTemplate: string | null;
  timestamp: Date;
  description: string;
}

interface AdvancedAppState {
  // État principal
  markdown: string;
  pdfOptions: PDFOptions;
  selectedTemplate: string | null;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'auto';

  // Historique (Undo/Redo)
  history: HistoryEntry[];
  historyIndex: number;
  maxHistorySize: number;

  // État UI avancé
  activePanel: 'editor' | 'templates' | 'export' | 'settings';
  previewMode: 'split' | 'preview-only' | 'editor-only';
  showLineNumbers: boolean;
  wordWrap: boolean;
  autoSave: boolean;

  // Performances et préférences
  performance: {
    enableVirtualization: boolean;
    maxFileSize: number;
    autoBackup: boolean;
    cacheSize: number;
  };

  // Récents
  recentFiles: RecentFile[];
  maxRecentFiles: number;

  // Favoris
  favoriteTemplates: string[];
  favoriteFiles: string[];

  // Actions principales
  setMarkdown: (markdown: string) => void;
  updatePDFOptions: (options: Partial<PDFOptions>) => void;
  setSelectedTemplate: (templateId: string | null) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;

  // Actions historique
  addToHistory: (description: string) => void;
  undo: () => boolean;
  redo: () => boolean;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;

  // Actions UI
  setActivePanel: (panel: 'editor' | 'templates' | 'export' | 'settings') => void;
  setPreviewMode: (mode: 'split' | 'preview-only' | 'editor-only') => void;
  toggleLineNumbers: () => void;
  toggleWordWrap: () => void;
  toggleAutoSave: () => void;

  // Actions performance
  updatePerformanceSettings: (settings: Partial<AdvancedAppState['performance']>) => void;

  // Actions fichiers récents
  addToRecentFiles: (file: RecentFile) => void;
  removeFromRecentFiles: (fileId: string) => void;
  clearRecentFiles: () => void;

  // Actions favoris
  toggleFavoriteTemplate: (templateId: string) => void;
  toggleFavoriteFile: (fileId: string) => void;

  // Utilitaires
  getWordCount: () => number;
  getEstimatedPages: () => number;
  getReadingTime: () => number;

  // Auto-save
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

export const useAdvancedAppStore = create<AdvancedAppState>()(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        // État initial
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

        // Historique
        history: [],
        historyIndex: -1,
        maxHistorySize: 50,

        // État UI
        activePanel: 'editor',
        previewMode: 'split',
        showLineNumbers: true,
        wordWrap: true,
        autoSave: true,

        // Performance
        performance: {
          enableVirtualization: true,
          maxFileSize: 10 * 1024 * 1024, // 10MB
          autoBackup: true,
          cacheSize: 100,
        },

        // Récents
        recentFiles: [],
        maxRecentFiles: 10,

        // Favoris
        favoriteTemplates: [],
        favoriteFiles: [],

        // Actions principales
        setMarkdown: (markdown) =>
          set((state) => {
            state.markdown = markdown;
            if (state.autoSave) {
              state.saveToLocalStorage();
            }
          }),

        updatePDFOptions: (options) =>
          set((state) => {
            Object.assign(state.pdfOptions, options);
            if (state.autoSave) {
              state.saveToLocalStorage();
            }
          }),

        setSelectedTemplate: (templateId) =>
          set((state) => {
            state.selectedTemplate = templateId;
            if (state.autoSave) {
              state.saveToLocalStorage();
            }
          }),

        toggleSidebar: () =>
          set((state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
          }),

        setTheme: (theme) =>
          set((state) => {
            state.theme = theme;
            // Appliquer le thème au document
            if (theme === 'auto') {
              const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            } else {
              document.documentElement.setAttribute('data-theme', theme);
            }
          }),

        // Actions historique
        addToHistory: (description) =>
          set((state) => {
            const entry: HistoryEntry = {
              id: Date.now().toString(),
              markdown: state.markdown,
              pdfOptions: { ...state.pdfOptions },
              selectedTemplate: state.selectedTemplate,
              timestamp: new Date(),
              description,
            };

            // Supprimer les entrées futures si on n'est pas à la fin
            state.history = state.history.slice(0, state.historyIndex + 1);

            // Ajouter la nouvelle entrée
            state.history.push(entry);
            state.historyIndex = state.history.length - 1;

            // Limiter la taille de l'historique
            if (state.history.length > state.maxHistorySize) {
              state.history.shift();
              state.historyIndex--;
            }
          }),

        undo: () =>
          set((state) => {
            if (state.historyIndex > 0) {
              state.historyIndex--;
              const entry = state.history[state.historyIndex];
              state.markdown = entry.markdown;
              state.pdfOptions = { ...entry.pdfOptions };
              state.selectedTemplate = entry.selectedTemplate;
              return true;
            }
            return false;
          }),

        redo: () =>
          set((state) => {
            if (state.historyIndex < state.history.length - 1) {
              state.historyIndex++;
              const entry = state.history[state.historyIndex];
              state.markdown = entry.markdown;
              state.pdfOptions = { ...entry.pdfOptions };
              state.selectedTemplate = entry.selectedTemplate;
              return true;
            }
            return false;
          }),

        canUndo: () => get().historyIndex > 0,

        canRedo: () => get().historyIndex < get().history.length - 1,

        clearHistory: () =>
          set((state) => {
            state.history = [];
            state.historyIndex = -1;
          }),

        // Actions UI
        setActivePanel: (panel) =>
          set((state) => {
            state.activePanel = panel;
          }),

        setPreviewMode: (mode) =>
          set((state) => {
            state.previewMode = mode;
          }),

        toggleLineNumbers: () =>
          set((state) => {
            state.showLineNumbers = !state.showLineNumbers;
          }),

        toggleWordWrap: () =>
          set((state) => {
            state.wordWrap = !state.wordWrap;
          }),

        toggleAutoSave: () =>
          set((state) => {
            state.autoSave = !state.autoSave;
          }),

        // Actions performance
        updatePerformanceSettings: (settings) =>
          set((state) => {
            Object.assign(state.performance, settings);
          }),

        // Actions fichiers récents
        addToRecentFiles: (file) =>
          set((state) => {
            state.recentFiles = state.recentFiles.filter(f => f.id !== file.id);
            state.recentFiles.unshift(file);
            state.recentFiles = state.recentFiles.slice(0, state.maxRecentFiles);
          }),

        removeFromRecentFiles: (fileId) =>
          set((state) => {
            state.recentFiles = state.recentFiles.filter(f => f.id !== fileId);
          }),

        clearRecentFiles: () =>
          set((state) => {
            state.recentFiles = [];
          }),

        // Actions favoris
        toggleFavoriteTemplate: (templateId) =>
          set((state) => {
            const index = state.favoriteTemplates.indexOf(templateId);
            if (index === -1) {
              state.favoriteTemplates.push(templateId);
            } else {
              state.favoriteTemplates.splice(index, 1);
            }
          }),

        toggleFavoriteFile: (fileId) =>
          set((state) => {
            const index = state.favoriteFiles.indexOf(fileId);
            if (index === -1) {
              state.favoriteFiles.push(fileId);
            } else {
              state.favoriteFiles.splice(index, 1);
            }
          }),

        // Utilitaires
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

        getReadingTime: () => {
          const wordCount = get().getWordCount();
          const wordsPerMinute = 200; // Moyenne de lecture
          return Math.ceil(wordCount / wordsPerMinute);
        },

        // Auto-save
        saveToLocalStorage: () => {
          const state = get();
          const saveData = {
            markdown: state.markdown,
            pdfOptions: state.pdfOptions,
            selectedTemplate: state.selectedTemplate,
            timestamp: new Date().toISOString(),
          };
          localStorage.setItem('mdtopdf-autosave', JSON.stringify(saveData));
        },

        loadFromLocalStorage: () =>
          set((state) => {
            try {
              const savedData = localStorage.getItem('mdtopdf-autosave');
              if (savedData) {
                const data = JSON.parse(savedData);
                const savedTime = new Date(data.timestamp);
                const now = new Date();
                const diffHours = (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60);

                // Restaurer seulement si moins de 24h
                if (diffHours < 24) {
                  state.markdown = data.markdown || '';
                  if (data.pdfOptions) {
                    Object.assign(state.pdfOptions, data.pdfOptions);
                  }
                  state.selectedTemplate = data.selectedTemplate || null;
                }
              }
            } catch (error) {
              console.warn('Failed to load autosave data:', error);
            }
          }),
      })),
      {
        name: 'mdtopdf-advanced-store',
        version: 1,
        partialize: (state) => ({
          pdfOptions: state.pdfOptions,
          selectedTemplate: state.selectedTemplate,
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
          activePanel: state.activePanel,
          previewMode: state.previewMode,
          showLineNumbers: state.showLineNumbers,
          wordWrap: state.wordWrap,
          autoSave: state.autoSave,
          performance: state.performance,
          recentFiles: state.recentFiles,
          favoriteTemplates: state.favoriteTemplates,
          favoriteFiles: state.favoriteFiles,
        }),
        onRehydrateStorage: () => (state) => {
          // Charger l'auto-save après réhydratation
          state?.loadFromLocalStorage();

          // Configurer le thème
          if (state?.theme === 'auto') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
          } else if (state) {
            document.documentElement.setAttribute('data-theme', state.theme);
          }

          // Écouter les changements de préférence système
          if (state?.theme === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => {
              document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            };
            mediaQuery.addEventListener('change', handleChange);
          }
        },
      }
    )
  )
);

// Selecteurs optimisés avec memoization
export const useWordCount = () => useAdvancedAppStore((state) => state.getWordCount());
export const useEstimatedPages = () => useAdvancedAppStore((state) => state.getEstimatedPages());
export const useReadingTime = () => useAdvancedAppStore((state) => state.getReadingTime());
export const useCanUndo = () => useAdvancedAppStore((state) => state.canUndo());
export const useCanRedo = () => useAdvancedAppStore((state) => state.canRedo());