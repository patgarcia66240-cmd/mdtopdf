# 🛠️ Roadmap Technique - MDtoPDF

## 📋 Architecture Technique Actuelle

### Stack Technologique
```
Frontend: React 18.3.1 + TypeScript (cible)
Build: Vite 7.1.12
Styling: Tailwind CSS 3.4.18
State Management: TanStack Query + Zustand
Tests: Vitest + Testing Library (à ajouter)
PDF: jsPDF 2.5.2 + html2canvas 1.4.1
Markdown: react-markdown 9.1.0 + remark-gfm 4.0.1
```

### Structure des Fichiers
```
src/
├── components/
│   ├── MarkdownToPDF.jsx
│   ├── MarkdownEditor.jsx
│   ├── PDFOptionsPanel.jsx
│   ├── PDFHeaderFooterPanel.jsx
│   └── ControlGroup.jsx
├── hooks/
│   └── useMarkdownToPDF.js
├── fonts/
│   └── DejaVuSans-normal.js
├── styles/
│   └── (CSS globals)
└── index.jsx
```

## 🚀 Évolution Technique Prévue

### Phase 1: Modernisation du Core (Mois 1-2)

#### 1.1 Migration TypeScript
**Package.json additions:**
```json
{
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.0.0",
    "@vitejs/plugin-react-swc": "^3.5.0"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0"
  }
}
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### 1.2 Configuration Outils Qualité
**.eslintrc.json:**
```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

**package.json scripts:**
```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

---

### Phase 2: Architecture Composants (Mois 3-4)

#### 2.1 Refactorisation Architecture
**Nouvelle structure:**
```
src/
├── components/
│   ├── ui/              # Composants réutilisables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── index.ts
│   ├── editor/          # Éditeur Markdown
│   │   ├── MarkdownEditor.tsx
│   │   ├── PreviewPanel.tsx
│   │   └── SplitView.tsx
│   ├── pdf/             # Génération PDF
│   │   ├── PDFGenerator.tsx
│   │   ├── PDFOptions.tsx
│   │   └── TemplateSelector.tsx
│   └── layout/          # Layout application
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── MainLayout.tsx
├── hooks/
│   ├── api/             # Hooks TanStack Query
│   │   ├── usePDFQuery.ts
│   │   ├── useTemplates.ts
│   │   └── useRecentFiles.ts
│   ├── usePDF.ts
│   ├── useMarkdown.ts
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
├── stores/              # Gestion état local (Zustand)
│   ├── appStore.ts
│   └── uiStore.ts
├── services/            # Services API/async
│   ├── pdfService.ts
│   ├── templateService.ts
│   └── fileService.ts
├── providers/           # React Context providers
│   ├── QueryClientProvider.tsx
│   └── ThemeProvider.tsx
├── utils/
│   ├── pdfUtils.ts
│   ├── markdownUtils.ts
│   └── fileUtils.ts
├── types/
│   ├── app.ts
│   ├── pdf.ts
│   ├── markdown.ts
│   └── api.ts
└── __tests__/
    ├── components/
    ├── hooks/
    ├── services/
    └── utils/
```

#### 2.2 Composants Typés
**types/app.ts:**
```typescript
export interface AppState {
  markdown: string;
  pdfOptions: PDFOptions;
  isLoading: boolean;
  error: string | null;
}

export interface PDFOptions {
  format: 'a4' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
  margins: Margins;
  header?: HeaderFooter;
  footer?: HeaderFooter;
  fontSize: number;
  fontFamily: string;
}


export interface HeaderFooter {
  text: string;
  alignment: 'left' | 'center' | 'right';
  fontSize: number;
  fontStyle: 'normal' | 'bold' | 'italic';
}
```

#### 2.3 Hooks Améliorés
**hooks/usePDF.ts:**
```typescript
export const usePDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = useCallback(async (
    markdown: string,
    options: PDFOptions
  ): Promise<Blob> => {
    setIsGenerating(true);
    setError(null);

    try {
      const pdf = await createPDFFromMarkdown(markdown, options);
      return pdf;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generatePDF, isGenerating, error };
};
```

---

### Phase 3: Performance & Optimisations (Mois 5-6)

#### 3.1 Optimisations Vite
**vite.config.ts avancé:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          pdf: ['jspdf', 'html2canvas'],
          markdown: ['react-markdown', 'remark-gfm'],
          ui: ['@heroicons/react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'jspdf', 'html2canvas'],
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

#### 3.2 Virtualisation pour Gros Fichiers
**components/editor/VirtualizedEditor.tsx:**
```typescript
import { FixedSizeList as List } from 'react-window';

export const VirtualizedEditor: React.FC<{
  content: string;
  onChange: (value: string) => void;
}> = ({ content, onChange }) => {
  const lines = content.split('\n');

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <textarea
        value={lines[index] || ''}
        onChange={(e) => {
          const newLines = [...lines];
          newLines[index] = e.target.value;
          onChange(newLines.join('\n'));
        }}
        className="w-full h-full border-none outline-none font-mono"
      />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={lines.length}
      itemSize={24}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

#### 3.3 Streaming PDF Generation
**utils/pdfStream.ts:**
```typescript
export class PDFStreamGenerator {
  private worker: Worker;

  constructor() {
    this.worker = new Worker('/workers/pdf-generator.js');
  }

  async generatePDFStream(
    markdown: string,
    options: PDFOptions,
    onProgress?: (progress: number) => void
  ): Promise<ReadableStream> {
    return new Promise((resolve, reject) => {
      this.worker.postMessage({ markdown, options });

      this.worker.onmessage = (event) => {
        const { type, data } = event.data;

        switch (type) {
          case 'progress':
            onProgress?.(data.progress);
            break;
          case 'complete':
            resolve(data.stream);
            break;
          case 'error':
            reject(new Error(data.error));
            break;
        }
      };
    });
  }
}
```

---

### Phase 4: Fonctionnalités Avancées (Mois 7-8)

#### 4.1 Système de Templates
**types/template.ts:**
```typescript
export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'academic' | 'creative' | 'custom';
  styles: TemplateStyles;
  layout: TemplateLayout;
  preview: string;
}

export interface TemplateStyles {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
}

export interface TemplateLayout {
  margins: Margins;
  header?: TemplateHeaderFooter;
  footer?: TemplateHeaderFooter;
  pageSize: PageFormat;
  orientation: PageOrientation;
}
```

#### 4.2 Export Multi-Formats
**utils/exporters/officeExporter.ts:**
```typescript
import { Document, Packer, Paragraph, TextRun } from 'docx';

export class OfficeExporter {
  async exportToDOCX(markdown: string, template?: Template): Promise<Blob> {
    const parsed = await this.parseMarkdownToAST(markdown);
    const doc = new Document({
      sections: [{
        children: parsed.map(block => this.convertBlockToParagraph(block, template))
      }]
    });

    return await Packer.toBlob(doc);
  }

  private convertBlockToParagraph(block: MarkdownBlock, template?: Template): Paragraph {
    // Conversion logic here
    return new Paragraph({
      children: [
        new TextRun({ text: block.content })
      ]
    });
  }
}
```

#### 2.3 TanStack Query pour Gestion des Opérations Asynchrones
**hooks/api/usePDFQuery.ts:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pdfService } from '../services/pdfService';

export const usePDFGeneration = () => {
  const queryClient = useQueryClient();

  const generatePDFMutation = useMutation({
    mutationFn: ({ markdown, options }: { markdown: string; options: PDFOptions }) =>
      pdfService.generatePDF(markdown, options),
    onSuccess: (blob) => {
      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      a.click();
      URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('PDF generation failed:', error);
    },
  });

  const previewPDFMutation = useMutation({
    mutationFn: ({ markdown, options }: { markdown: string; options: PDFOptions }) =>
      pdfService.generatePDFPreview(markdown, options),
  });

  return {
    generatePDF: generatePDFMutation.mutate,
    isGenerating: generatePDFMutation.isPending,
    generateError: generatePDFMutation.error,
    generatePreview: previewPDFMutation.mutate,
    isPreviewGenerating: previewPDFMutation.isPending,
    previewError: previewPDFMutation.error,
  };
};

export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: () => pdfService.getTemplates(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useRecentFiles = () => {
  return useQuery({
    queryKey: ['recent-files'],
    queryFn: () => pdfService.getRecentFiles(),
    staleTime: 1000 * 60, // 1 minute
  });
};
```

**services/pdfService.ts:**
```typescript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export class PDFService {
  async generatePDF(markdown: string, options: PDFOptions): Promise<Blob> {
    // Generate HTML from markdown
    const html = await this.convertMarkdownToHTML(markdown, options);

    // Create temporary element
    const element = document.createElement('div');
    element.innerHTML = html;
    element.style.width = '800px';
    document.body.appendChild(element);

    try {
      // Convert to canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      // Generate PDF
      const pdf = new jsPDF({
        orientation: options.orientation,
        unit: 'mm',
        format: options.format,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = options.format === 'a4' ? 210 : 216; // mm
      const pageHeight = options.format === 'a4' ? 297 : 279; // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = options.margins.top;

      pdf.addImage(imgData, 'PNG', options.margins.left, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', options.margins.left, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      return pdf.output('blob');
    } finally {
      document.body.removeChild(element);
    }
  }

  async generatePDFPreview(markdown: string, options: PDFOptions): Promise<string> {
    const blob = await this.generatePDF(markdown, options);
    return URL.createObjectURL(blob);
  }

  async getTemplates(): Promise<Template[]> {
    // Return default templates + user templates from localStorage
    const defaultTemplates: Template[] = [
      {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and professional template',
        category: 'professional',
        styles: { /* styles */ },
        layout: { /* layout */ },
        preview: '/templates/modern-preview.png',
      },
      // ... more templates
    ];

    const userTemplates = JSON.parse(localStorage.getItem('user-templates') || '[]');
    return [...defaultTemplates, ...userTemplates];
  }

  async getRecentFiles(): Promise<RecentFile[]> {
    return JSON.parse(localStorage.getItem('recent-files') || '[]');
  }

  private async convertMarkdownToHTML(markdown: string, options: PDFOptions): Promise<string> {
    // Implementation using react-markdown server-side rendering
    // or markdown-it for non-React conversion
    return '';
  }
}

export const pdfService = new PDFService();
```

**providers/QueryClientProvider.tsx:**
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

interface Props {
  children: ReactNode;
}

export const AppQueryClientProvider: React.FC<Props> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};
```

#### 2.4 État Local avec Zustand (complémentaire à TanStack Query)
**stores/appStore.ts:**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      getWordCount: () => get().markdown.split(/\s+/).filter(word => word.length > 0).length,
      getEstimatedPages: () => {
        const wordCount = get().getWordCount();
        const wordsPerPage = get().pdfOptions.format === 'a4' ? 500 : 450;
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
```

## 🧪 Stratégie de Testing

### Tests Unitaires (Vitest)
```typescript
// __tests__/utils/pdfUtils.test.ts
import { describe, it, expect } from 'vitest';
import { calculatePDFMetrics } from '../../src/utils/pdfUtils';

describe('PDF Utils', () => {
  it('should calculate correct page count', () => {
    const metrics = calculatePDFMetrics('# Test\n\nLong content...', {
      format: 'a4',
      fontSize: 12,
      margins: { top: 20, right: 20, bottom: 20, left: 20 }
    });

    expect(metrics.pageCount).toBeGreaterThan(0);
  });
});
```

### Tests Composants (Testing Library)
```typescript
// __tests__/components/MarkdownEditor.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MarkdownEditor } from '../../src/components/editor/MarkdownEditor';

describe('MarkdownEditor', () => {
  it('should update content on input', async () => {
    const onChange = vi.fn();
    render(<MarkdownEditor value="" onChange={onChange} />);

    const textarea = screen.getByRole('textbox');
    await fireEvent.change(textarea, { target: { value: '# Test' } });

    expect(onChange).toHaveBeenCalledWith('# Test');
  });
});
```

### Tests E2E (Playwright)
```typescript
// e2e/pdf-generation.spec.ts
import { test, expect } from '@playwright/test';

test('should generate PDF from markdown', async ({ page }) => {
  await page.goto('/');

  await page.fill('[data-testid="markdown-editor"]', '# Test Document\n\nThis is a test.');
  await page.click('[data-testid="generate-pdf"]');

  // Vérifier que le téléchargement commence
  const download = await page.waitForEvent('download');
  expect(download.suggestedFilename()).toMatch(/.*\.pdf/);
});
```

## 📊 Monitoring & Analytics

### Performance Monitoring
```typescript
// utils/performance.ts
export class PerformanceMonitor {
  static measureRenderTime(componentName: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const originalMethod = descriptor.value;

      descriptor.value = function (...args: any[]) {
        const start = performance.now();
        const result = originalMethod.apply(this, args);
        const end = performance.now();

        console.log(`${componentName}.${propertyKey}: ${end - start}ms`);

        // Send to analytics if needed
        this.sendMetric('render-time', {
          component: componentName,
          method: propertyKey,
          duration: end - start
        });

        return result;
      };
    };
  }
}
```

---

*Roadmap maintenue activement - Sujet à évolutions selon retours utilisateurs*