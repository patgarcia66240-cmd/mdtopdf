import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pdfService } from '@/services/pdfService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Mock des dépendances
vi.mock('jspdf');
vi.mock('html2canvas');

const mockJSPDF = vi.mocked(jsPDF);
const mockHtml2Canvas = vi.mocked(html2canvas);

describe('PDFService', () => {
  const mockCanvas = {
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mocked'),
    height: 1000,
    width: 800,
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock document methods
    const mockElement = {
      innerHTML: '',
      style: {},
      appendChild: vi.fn(),
      removeChild: vi.fn(),
    };

    Object.defineProperty(document, 'createElement', {
      value: vi.fn().mockReturnValue(mockElement),
    });

    Object.defineProperty(document, 'body', {
      value: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
      configurable: true,
    });

    mockHtml2Canvas.mockResolvedValue(mockCanvas);

    // Mock jsPDF instance
    const mockPdfInstance = {
      output: vi.fn().mockReturnValue(new Blob(['mock pdf'], { type: 'application/pdf' })),
      addImage: vi.fn(),
      addPage: vi.fn(),
    };

    mockJSPDF.mockImplementation(() => mockPdfInstance as any);
  });

  describe('generatePDF', () => {
    it('should generate PDF with correct options', async () => {
      const markdown = '# Test Document\n\nThis is a test content.';
      const options = {
        format: 'a4' as const,
        orientation: 'portrait' as const,
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        fontSize: 12,
        fontFamily: 'Inter',
      };

      const result = await pdfService.generatePDF(markdown, options);

      expect(mockHtml2Canvas).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
        })
      );

      expect(mockJSPDF).toHaveBeenCalledWith({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      expect(result).toBeInstanceOf(Blob);
    });

    it('should handle letter format correctly', async () => {
      const options = {
        format: 'letter' as const,
        orientation: 'portrait' as const,
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        fontSize: 12,
        fontFamily: 'Inter',
      };

      await pdfService.generatePDF('# Test', options);

      expect(mockJSPDF).toHaveBeenCalledWith({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter',
      });
    });

    it('should handle landscape orientation correctly', async () => {
      const options = {
        format: 'a4' as const,
        orientation: 'landscape' as const,
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        fontSize: 12,
        fontFamily: 'Inter',
      };

      await pdfService.generatePDF('# Test', options);

      expect(mockJSPDF).toHaveBeenCalledWith({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
    });

    it('should clean up DOM elements after generation', async () => {
      const mockBody = {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      };

      Object.defineProperty(document, 'body', {
        value: mockBody,
        configurable: true,
      });

      await pdfService.generatePDF('# Test', {
        format: 'a4',
        orientation: 'portrait',
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        fontSize: 12,
        fontFamily: 'Inter',
      });

      expect(mockBody.appendChild).toHaveBeenCalled();
      expect(mockBody.removeChild).toHaveBeenCalled();
    });
  });

  describe('generatePDFPreview', () => {
    it('should return object URL for preview', async () => {
      const mockBlob = new Blob(['mock pdf'], { type: 'application/pdf' });

      // Mock generatePDF method
      vi.spyOn(pdfService, 'generatePDF').mockResolvedValue(mockBlob);

      const mockCreateObjectURL = vi.fn().mockReturnValue('mock-preview-url');
      global.URL.createObjectURL = mockCreateObjectURL;

      const result = await pdfService.generatePDFPreview('# Test', {
        format: 'a4',
        orientation: 'portrait',
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        fontSize: 12,
        fontFamily: 'Inter',
      });

      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(result).toBe('mock-preview-url');
    });
  });

  describe('getTemplates', () => {
    it('should return default templates', async () => {
      const templates = await pdfService.getTemplates();

      expect(templates).toHaveLength(2);
      expect(templates[0].id).toBe('modern');
      expect(templates[1].id).toBe('academic');
      expect(templates[0].category).toBe('professional');
      expect(templates[1].category).toBe('academic');
    });

    it('should include user templates from localStorage', async () => {
      const userTemplates = [
        {
          id: 'custom',
          name: 'Custom Template',
          description: 'User created template',
          category: 'custom' as const,
          styles: {},
          layout: {},
          preview: '/custom-preview.png',
        },
      ];

      vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
        if (key === 'user-templates') {
          return JSON.stringify(userTemplates);
        }
        return null;
      });

      const templates = await pdfService.getTemplates();

      expect(templates).toHaveLength(3);
      expect(templates[2].id).toBe('custom');
    });
  });

  describe('getRecentFiles', () => {
    it('should return recent files from localStorage', async () => {
      const recentFiles = [
        {
          id: '1',
          name: 'test.md',
          content: '# Test',
          lastModified: new Date(),
          size: 100,
        },
      ];

      vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
        if (key === 'recent-files') {
          return JSON.stringify(recentFiles);
        }
        return null;
      });

      const files = await pdfService.getRecentFiles();

      expect(files).toEqual(recentFiles);
    });

    it('should return empty array when no files in localStorage', async () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

      const files = await pdfService.getRecentFiles();

      expect(files).toEqual([]);
    });
  });

  describe('saveRecentFile', () => {
    it('should save file to localStorage', async () => {
      const mockSetItem = vi.fn();
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(mockSetItem);
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('[]');

      const file = {
        id: '1',
        name: 'test.md',
        content: '# Test',
        lastModified: new Date(),
        size: 100,
      };

      await pdfService.saveRecentFile(file);

      expect(mockSetItem).toHaveBeenCalledWith(
        'recent-files',
        expect.stringContaining('"id":"1"')
      );
    });

    it('should limit to 10 most recent files', async () => {
      const mockSetItem = vi.fn();
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(mockSetItem);

      // Start with 10 existing files
      const existingFiles = Array.from({ length: 10 }, (_, i) => ({
        id: `existing-${i}`,
        name: `file-${i}.md`,
        content: '',
        lastModified: new Date(),
        size: 100,
      }));

      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(
        JSON.stringify(existingFiles)
      );

      const newFile = {
        id: 'new-file',
        name: 'new.md',
        content: '# New',
        lastModified: new Date(),
        size: 50,
      };

      await pdfService.saveRecentFile(newFile);

      const savedData = JSON.parse(mockSetItem.mock.calls[0][1]);
      expect(savedData).toHaveLength(10);
      expect(savedData[0].id).toBe('new-file');
    });
  });
});