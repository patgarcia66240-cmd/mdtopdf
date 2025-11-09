import { useEffect, useCallback, useRef } from 'react';

interface KeyboardOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

type KeyboardHandler = (event: KeyboardEvent) => void;

/**
 * Hook pour optimiser les interactions au clavier
 */
export const useKeyboardOptimization = () => {
  const handlersRef = useRef<Map<string, KeyboardHandler>>(new Map());
  const isActiveRef = useRef(true);

  /**
   * Gestionnaire principal des événements clavier
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActiveRef.current) return;

    const { key, ctrlKey, metaKey, altKey, shiftKey } = event;
    const combo = [
      ctrlKey || metaKey ? 'ctrl' : '',
      altKey ? 'alt' : '',
      shiftKey ? 'shift' : '',
      key.toLowerCase()
    ].filter(Boolean).join('+');

    const handler = handlersRef.current.get(combo) || handlersRef.current.get(key.toLowerCase());

    if (handler) {
      event.preventDefault();
      event.stopPropagation();
      handler(event);
    }
  }, []);

  /**
   * Enregistrer un raccourci clavier
   */
  const registerShortcut = useCallback((
    keys: string | string[],
    handler: KeyboardHandler,
    options: KeyboardOptions = {}
  ) => {
    const { enabled = true } = options;

    if (!enabled) return () => {};

    const keysArray = Array.isArray(keys) ? keys : [keys];

    keysArray.forEach(key => {
      const normalizedKey = key.toLowerCase().replace(/\s+/g, '+');
      handlersRef.current.set(normalizedKey, handler);
    });

    // Retourner une fonction de nettoyage
    return () => {
      keysArray.forEach(key => {
        const normalizedKey = key.toLowerCase().replace(/\s+/g, '+');
        handlersRef.current.delete(normalizedKey);
      });
    };
  }, []);

  /**
   * Activer/désactiver temporairement les raccourcis
   */
  const setActive = useCallback((active: boolean) => {
    isActiveRef.current = active;
  }, []);

  /**
   * Nettoyer tous les raccourcis
   */
  const clearAll = useCallback(() => {
    handlersRef.current.clear();
  }, []);

  // Configuration des raccourcis globaux
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [handleKeyDown]);

  return {
    registerShortcut,
    setActive,
    clearAll
  };
};

/**
 * Hook pour la navigation au focus optimisée
 */
export const useFocusManagement = (containerRef?: React.RefObject<HTMLElement>) => {
  const focusableElementsRef = useRef<HTMLElement[]>([]);
  const currentIndexRef = useRef(-1);

  /**
   * Récupérer tous les éléments focusables dans un conteneur
   */
  const getFocusableElements = useCallback((container: HTMLElement) => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, []);

  /**
   * Mettre à jour les éléments focusables
   */
  const updateFocusableElements = useCallback(() => {
    if (containerRef?.current) {
      focusableElementsRef.current = getFocusableElements(containerRef.current);
    }
  }, [containerRef, getFocusableElements]);

  /**
   * Navigation au clavier (Tab, Shift+Tab, flèches)
   */
  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    if (!containerRef?.current || focusableElementsRef.current.length === 0) return;

    const { key, shiftKey } = event;
    let nextIndex = currentIndexRef.current;

    switch (key) {
      case 'Tab':
        event.preventDefault();
        nextIndex = shiftKey
          ? (currentIndexRef.current - 1 + focusableElementsRef.current.length) % focusableElementsRef.current.length
          : (currentIndexRef.current + 1) % focusableElementsRef.current.length;
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = (currentIndexRef.current + 1) % focusableElementsRef.current.length;
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = (currentIndexRef.current - 1 + focusableElementsRef.current.length) % focusableElementsRef.current.length;
        break;

      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        nextIndex = focusableElementsRef.current.length - 1;
        break;

      default:
        return;
    }

    const nextElement = focusableElementsRef.current[nextIndex];
    if (nextElement) {
      nextElement.focus();
      currentIndexRef.current = nextIndex;
    }
  }, [containerRef]);

  /**
   * Focus le premier élément focusable
   */
  const focusFirst = useCallback(() => {
    if (focusableElementsRef.current.length > 0) {
      focusableElementsRef.current[0].focus();
      currentIndexRef.current = 0;
    }
  }, []);

  /**
   * Focus le dernier élément focusable
   */
  const focusLast = useCallback(() => {
    const elements = focusableElementsRef.current;
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
      currentIndexRef.current = elements.length - 1;
    }
  }, []);

  /**
   * Mettre le focus sur un élément spécifique
   */
  const focusElement = useCallback((selector: string | HTMLElement) => {
    const element = typeof selector === 'string'
      ? containerRef?.current?.querySelector(selector) as HTMLElement
      : selector;

    if (element && focusableElementsRef.current.includes(element)) {
      element.focus();
      currentIndexRef.current = focusableElementsRef.current.indexOf(element);
    }
  }, [containerRef]);

  // Mettre à jour les éléments focusables quand le conteneur change
  useEffect(() => {
    updateFocusableElements();
  }, [updateFocusableElements]);

  // Observer les changements DOM pour mettre à jour les éléments focusables
  useEffect(() => {
    if (!containerRef?.current) return;

    const observer = new MutationObserver(() => {
      updateFocusableElements();
    });

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'tabindex', 'aria-hidden']
    });

    return () => observer.disconnect();
  }, [containerRef, updateFocusableElements]);

  return {
    focusFirst,
    focusLast,
    focusElement,
    handleKeyboardNavigation,
    updateFocusableElements
  };
};

/**
 * Hook pour les raccourcis clavier spécifiques à l'éditeur
 */
export const useEditorKeyboardShortcuts = (options: {
  onSave?: () => void;
  onExport?: () => void;
  onTogglePreview?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onBold?: () => void;
  onItalic?: () => void;
}) => {
  const { registerShortcut } = useKeyboardOptimization();

  useEffect(() => {
    const cleanupFunctions: (() => void)[] = [];

    // Raccourcis d'édition
    if (options.onBold) {
      cleanupFunctions.push(registerShortcut('Ctrl+B', options.onBold));
    }

    if (options.onItalic) {
      cleanupFunctions.push(registerShortcut('Ctrl+I', options.onItalic));
    }

    if (options.onUndo) {
      cleanupFunctions.push(registerShortcut('Ctrl+Z', options.onUndo));
    }

    if (options.onRedo) {
      cleanupFunctions.push(registerShortcut('Ctrl+Y', options.onRedo));
    }

    // Raccourcis d'action
    if (options.onSave) {
      cleanupFunctions.push(registerShortcut('Ctrl+S', options.onSave));
    }

    if (options.onExport) {
      cleanupFunctions.push(registerShortcut('Ctrl+E', options.onExport));
    }

    if (options.onTogglePreview) {
      cleanupFunctions.push(registerShortcut('Ctrl+P', options.onTogglePreview));
    }

    // Nettoyer les raccourcis au démontage
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [registerShortcut, options]);
};

export default useKeyboardOptimization;