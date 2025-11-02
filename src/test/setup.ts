import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Étendre les matchers de Vitest avec ceux de Testing Library
expect.extend(matchers);

// Nettoyer le DOM après chaque test
afterEach(() => {
  cleanup();
});

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

// Mock de URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url');
global.URL.revokeObjectURL = vi.fn();

// Mock de window.open
global.open = vi.fn();

// Mock de jsPDF
vi.mock('jspdf', () => ({
  default: class {
    output = vi.fn().mockReturnValue(new Blob(['mocked pdf'], { type: 'application/pdf' }));
    addImage = vi.fn();
    addPage = vi.fn();
  },
}));

// Mock de html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mocked'),
    height: 1000,
    width: 800,
  }),
}));