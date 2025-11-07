import React, { useEffect, useRef } from 'react';

interface FocusManagerProps {
  children: React.ReactNode;
  isDarkMode: boolean;
}

const FocusManager: React.FC<FocusManagerProps> = ({ children, isDarkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Styles pour le focus visible
    const style = document.createElement('style');
    style.textContent = `
      /* Focus visible styles pour accessibilité */
      *:focus-visible {
        outline: 2px solid ${isDarkMode ? '#60a5fa' : '#2563eb'} !important;
        outline-offset: 2px !important;
        border-radius: 4px !important;
      }

      /* Focus styles pour les navigateurs qui ne supportent pas :focus-visible */
      *:focus {
        outline: 2px solid ${isDarkMode ? '#60a5fa' : '#2563eb'} !important;
        outline-offset: 2px !important;
        border-radius: 4px !important;
      }

      /* Styles spécifiques pour les boutons */
      button:focus-visible {
        box-shadow: 0 0 0 3px ${isDarkMode ? 'rgba(96, 165, 250, 0.3)' : 'rgba(37, 99, 235, 0.3)'} !important;
      }

      /* Styles spécifiques pour les inputs et textareas */
      input:focus-visible,
      textarea:focus-visible {
        box-shadow: 0 0 0 3px ${isDarkMode ? 'rgba(96, 165, 250, 0.3)' : 'rgba(37, 99, 235, 0.3)'} !important;
        border-color: ${isDarkMode ? '#60a5fa' : '#2563eb'} !important;
      }

      /* Gestion du contraste minimum WCAG AA */
      .text-contrast-ensured {
        color: ${isDarkMode ? '#f8fafc' : '#1e293b'};
      }

      /* Animations réduites pour les utilisateurs qui préfèrent moins de mouvement */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* Styles pour les lecteurs d'écran */
      .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }

      /* Styles pour les skip links au survol */
      .skip-link:hover {
        background: #2563eb !important;
        text-decoration: underline !important;
      }

      /* Amélioration du contraste pour les liens */
      a {
        color: ${isDarkMode ? '#60a5fa' : '#1d4ed8'} !important;
        text-decoration: underline !important;
      }

      a:hover,
      a:focus {
        color: ${isDarkMode ? '#93c5fd' : '#1e40af'} !important;
        text-decoration: none !important;
      }

      /* Amélioration du contraste pour le texte */
      body {
        color: ${isDarkMode ? '#f8fafc' : '#1e293b'} !important;
      }

      /* Styles pour les erreurs et validations */
      .error-message {
        color: #dc2626 !important;
        font-weight: 600 !important;
        background-color: ${isDarkMode ? '#7f1d1d' : '#fef2f2'} !important;
        padding: 8px 12px !important;
        border-radius: 4px !important;
        border-left: 4px solid #dc2626 !important;
      }

      .success-message {
        color: #059669 !important;
        font-weight: 600 !important;
        background-color: ${isDarkMode ? '#064e3b' : '#ecfdf5'} !important;
        padding: 8px 12px !important;
        border-radius: 4px !important;
        border-left: 4px solid #059669 !important;
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [isDarkMode]);

  // Gestion du focus pour la navigation au clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab navigation
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }

      // Escape key pour fermer les modaux
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach(modal => {
          const closeButton = modal.querySelector('button[aria-label*="fermer"], button[aria-label*="close"]');
          if (closeButton && closeButton instanceof HTMLButtonElement) {
            closeButton.click();
          }
        });
      }

      // Raccourcis clavier pour l'accessibilité
      if (e.altKey) {
        switch (e.key) {
          case 'm': // Alt+M pour aller à l'éditeur principal
            e.preventDefault();
            const mainTextarea = document.getElementById('markdown-textarea');
            if (mainTextarea) {
              mainTextarea.focus();
            }
            break;
          case 'p': // Alt+P pour aller à l'aperçu
            e.preventDefault();
            const previewPanel = document.getElementById('preview-panel');
            if (previewPanel) {
              previewPanel.focus();
              previewPanel.scrollIntoView({ behavior: 'smooth' });
            }
            break;
          case 'h': // Alt+H pour l'aide
            e.preventDefault();
            console.log('🔧 Raccourcis clavier disponibles:');
            console.log('Alt+M: Aller à l\'éditeur');
            console.log('Alt+P: Aller à l\'aperçu');
            console.log('Alt+H: Afficher l\'aide');
            console.log('Échap: Fermer les modaux');
            console.log('Tab: Navigation au clavier');
            break;
        }
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};

export default FocusManager;