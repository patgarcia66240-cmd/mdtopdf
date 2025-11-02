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
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          pdf: ['jspdf', 'html2canvas'],
          markdown: ['react-markdown', 'remark-gfm'],
          state: ['@tanstack/react-query', 'zustand'],
          ui: ['@heroicons/react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/hooks': '/src/hooks',
      '@/stores': '/src/stores',
      '@/services': '/src/services',
      '@/types': '/src/types',
      '@/utils': '/src/utils'
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'jspdf', 'html2canvas', '@tanstack/react-query', 'zustand'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  }
})