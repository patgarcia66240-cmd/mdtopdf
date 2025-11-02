import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

describe('usePDFQuery Simple Tests', () => {
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

    vi.clearAllMocks();
  });

  it('should initialize with correct default state', async () => {
    const { usePDFGeneration } = await import('@/hooks/api/usePDFQuery');
    const { result } = renderHook(() => usePDFGeneration(), { wrapper });

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.generateError).toBeNull();
    expect(result.current.isPreviewGenerating).toBe(false);
    expect(result.current.previewError).toBeNull();
  });

  it('should load templates', async () => {
    const { useTemplates } = await import('@/hooks/api/usePDFQuery');
    const { result } = renderHook(() => useTemplates(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toHaveLength(2);
      expect(result.current.data?.[0].id).toBe('modern');
    });
  });
});