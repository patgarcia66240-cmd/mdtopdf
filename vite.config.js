import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'build',
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React chunks
          'react-vendor': ['react'],
          'react-dom': ['react-dom', 'react-dom/client'],
          // PDF processing chunks
          'pdf-core': ['jspdf'],
          'pdf-rendering': ['html2canvas', 'dompurify'],

          // Markdown processing chunks
          'markdown-parser': ['marked', 'react-markdown'],
          'markdown-plugins': ['remark-gfm', 'remark-html'],

          // State management chunks
          'state-query': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          'state-zustand': ['zustand'],

          // UI components chunks
          'ui-icons': ['@heroicons/react/24/outline'],
          'ui-interactions': ['react-dnd', 'react-dnd-html5-backend'],

          // Performance and utility chunks
          'perf-windowing': ['react-window', 'react-window-infinite-loader'],
          'perf-utils': ['immer'],

          // File handling chunks
          'file-export': ['file-saver', 'docx'],

          // Accessibility chunks
          'a11y-core': ['axe-core'],
        },
        chunkFileNames: (chunkInfo) => {
          // Preserve unique chunk names for better debugging
          return 'assets/[name].[hash].js';
        },        assetFileNames: (assetInfo) => {
          // Optimisation du nom des assets
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/styles/[name].[hash][extname]';
          }
          if (assetInfo.name.match(/\.(png|jpe?g|gif|svg|webp)$/)) {
            return 'assets/images/[name].[hash][extname]';
          }
          if (assetInfo.name.match(/\.(woff2?|eot|ttf|otf)$/)) {
            return 'assets/fonts/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        },
      },
    },
    chunkSizeWarningLimit: 600, // Réduit pour détecter les gros chunks
    minify: process.env.NODE_ENV === 'production' ? 'terser' : false,
    terserOptions: process.env.NODE_ENV === 'production' ? {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2, // Multiples passes pour meilleure optimisation
      },
      mangle: {
        properties: {
          regex: /^_/, // Mangle les propriétés privées
        },
      },
    } : {},
    // Optimisation du code splitting
    target: 'esnext',
    cssCodeSplit: true,
    // Préchargement des chunks critiques
      mangle: {
        // Only mangle top-level identifiers (default behavior)
      },    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/hooks': '/src/hooks',
      '@/stores': '/src/stores',
      '@/services': '/src/services',
      '@/types': '/src/types',
      '@/utils': '/src/utils',
      'events': 'events',
      'util': 'util'
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'jspdf', 'html2canvas', '@tanstack/react-query', 'zustand'],
    exclude: ['html-to-docx'],
  },
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
})
