import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('PDFService Simple Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have default templates', async () => {
    const { pdfService } = await import('@/services/pdfService');
    const templates = await pdfService.getTemplates();

    expect(templates).toHaveLength(2);
    expect(templates[0].id).toBe('modern');
    expect(templates[1].id).toBe('academic');
  });

  it('should handle empty recent files', async () => {
    const { pdfService } = await import('@/services/pdfService');

    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    const files = await pdfService.getRecentFiles();
    expect(files).toEqual([]);
  });

  it('should save recent file to localStorage', async () => {
    const { pdfService } = await import('@/services/pdfService');

    const originalSetItem = Storage.prototype.setItem;
    let savedData: string | null = null;

    Storage.prototype.setItem = vi.fn().mockImplementation((key, value) => {
      if (key === 'recent-files') {
        savedData = value;
      }
    });

    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('[]');

    const file = {
      id: '1',
      name: 'test.md',
      content: '# Test',
      lastModified: new Date(),
      size: 100,
    };

    await pdfService.saveRecentFile(file);

    expect(savedData).toBeTruthy();
    expect(savedData && savedData.includes('"id":"1"')).toBe(true);

    // Restore original
    Storage.prototype.setItem = originalSetItem;
  });
});