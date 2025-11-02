import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { usePDFGeneration } from '@/hooks/api/usePDFQuery';
import { pdfService } from '@/services/pdfService';

// Mock pdfService
vi.mock('@/services/pdfService', () => ({
  pdfService: {
    generatePDF: vi.fn(),
    generatePDFPreview: vi.fn(),
    getTemplates: vi.fn(),
    getRecentFiles: vi.fn(),
  },
}));

const mockPdfService = vi.mocked(pdfService);

describe('usePDFQuery', () => {
  let queryClient: QueryClient;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Clear localStorage mock
    vi.clearAllMocks();
  });

  describe('usePDFGeneration', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => usePDFGeneration(), { wrapper });

      expect(result.current.isGenerating).toBe(false);
      expect(result.current.generateError).toBeNull();
      expect(result.current.isPreviewGenerating).toBe(false);
      expect(result.current.previewError).toBeNull();
    });

    it('should generate PDF successfully', async () => {
      const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });
      mockPdfService.generatePDF.mockResolvedValue(mockBlob);

      const mockCreateObjectURL = vi.fn().mockReturnValue('mock-url');
      global.URL.createObjectURL = mockCreateObjectURL;

      const mockRevokeObjectURL = vi.fn();
      global.URL.revokeObjectURL = mockRevokeObjectURL;

      const mockCreateElement = vi.fn().mockReturnValue({
        href: '',
        download: '',
        click: vi.fn(),
      });
      global.document.createElement = mockCreateElement;

      const { result } = renderHook(() => usePDFGeneration(), { wrapper });

      act(() => {
        result.current.generatePDF({
          markdown: '# Test',
          options: {
            format: 'a4',
            orientation: 'portrait',
            margins: { top: 20, right: 20, bottom: 20, left: 20 },
            fontSize: 12,
            fontFamily: 'Inter',
          },
        });
      });

      expect(result.current.isGenerating).toBe(true);

      await waitFor(() => {
        expect(result.current.isGenerating).toBe(false);
      });

      expect(mockPdfService.generatePDF).toHaveBeenCalledWith('# Test', {
        format: 'a4',
        orientation: 'portrait',
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        fontSize: 12,
        fontFamily: 'Inter',
      });

      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
    });

    it('should handle PDF generation errors', async () => {
      const error = new Error('PDF generation failed');
      mockPdfService.generatePDF.mockRejectedValue(error);

      const { result } = renderHook(() => usePDFGeneration(), { wrapper });

      act(() => {
        result.current.generatePDF({
          markdown: '# Test',
          options: {
            format: 'a4',
            orientation: 'portrait',
            margins: { top: 20, right: 20, bottom: 20, left: 20 },
            fontSize: 12,
            fontFamily: 'Inter',
          },
        });
      });

      await waitFor(() => {
        expect(result.current.isGenerating).toBe(false);
        expect(result.current.generateError).toBe(error);
      });
    });

    it('should generate PDF preview successfully', async () => {
      const mockPreviewUrl = 'mock-preview-url';
      mockPdfService.generatePDFPreview.mockResolvedValue(mockPreviewUrl);

      const { result } = renderHook(() => usePDFGeneration(), { wrapper });

      act(() => {
        result.current.generatePreview({
          markdown: '# Test',
          options: {
            format: 'a4',
            orientation: 'portrait',
            margins: { top: 20, right: 20, bottom: 20, left: 20 },
            fontSize: 12,
            fontFamily: 'Inter',
          },
        });
      });

      expect(result.current.isPreviewGenerating).toBe(true);

      await waitFor(() => {
        expect(result.current.isPreviewGenerating).toBe(false);
      });

      expect(mockPdfService.generatePDFPreview).toHaveBeenCalledWith('# Test', {
        format: 'a4',
        orientation: 'portrait',
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        fontSize: 12,
        fontFamily: 'Inter',
      });
    });
  });
});