import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/stores/appStore';
import { renderHook, act } from '@testing-library/react';

describe('App Store', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.setMarkdown('');
      result.current.setSelectedTemplate(null);
      result.current.setTheme('light');
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAppStore());

    expect(result.current.markdown).toBe('');
    expect(result.current.pdfOptions.format).toBe('a4');
    expect(result.current.pdfOptions.orientation).toBe('portrait');
    expect(result.current.selectedTemplate).toBeNull();
    expect(result.current.theme).toBe('light');
  });

  it('should update markdown correctly', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setMarkdown('# Test Markdown');
    });

    expect(result.current.markdown).toBe('# Test Markdown');
  });

  it('should update PDF options correctly', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.updatePDFOptions({
        format: 'letter',
        fontSize: 14,
      });
    });

    expect(result.current.pdfOptions.format).toBe('letter');
    expect(result.current.pdfOptions.fontSize).toBe(14);
    expect(result.current.pdfOptions.orientation).toBe('portrait'); // Should remain unchanged
  });

  it('should calculate word count correctly', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setMarkdown('Hello world this is a test');
    });

    expect(result.current.getWordCount()).toBe(6);
  });

  it('should calculate estimated pages correctly', () => {
    const { result } = renderHook(() => useAppStore());

    // Set ~1000 words
    const longText = 'word '.repeat(1000).trim();

    act(() => {
      result.current.setMarkdown(longText);
      result.current.updatePDFOptions({ format: 'a4' });
    });

    expect(result.current.getEstimatedPages()).toBe(2); // 1000 words / 500 words per page
  });

  it('should toggle sidebar correctly', () => {
    const { result } = renderHook(() => useAppStore());

    expect(result.current.sidebarCollapsed).toBe(false);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarCollapsed).toBe(true);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarCollapsed).toBe(false);
  });

  it('should change theme correctly', () => {
    const { result } = renderHook(() => useAppStore());

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
  });
});