import React, { useRef, useState } from 'react';
import { PencilIcon, QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import MarkdownToolbar from './MarkdownToolbar';
import MarkdownEditorSkeleton from './MarkdownEditorSkeleton';

interface MarkdownEditorProps {
  markdown: string;
  onChange: (value: string) => void;
  showPreview: boolean;
  onTogglePreview: () => void;
  isDarkMode: boolean;
  isLoading?: boolean;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  markdown,
  onChange,
  showPreview,
  onTogglePreview,
  isDarkMode,
  isLoading = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // État pour détecter mobile
  const [isMobile, setIsMobile] = React.useState(false);
  // État pour la modale d'aide
  const [showHelpModal, setShowHelpModal] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Style A4 pour simuler une page PDF - Ratio A4 conservé avec aspect-ratio
  const a4ContainerStyle: React.CSSProperties = {
    width: '100%', // Largeur fluide
    aspectRatio: isMobile ? '1/1.4' : '210/297', // Ratio adapté pour mobile
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    border: `2px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    position: 'relative',
    boxSizing: 'border-box',
    minHeight: isMobile ? '300px' : 'auto' // Hauteur minimale sur mobile
  };

  const editorStyle = {
    display: 'grid',
    gridTemplateColumns: showPreview && !isMobile ? '1fr 1fr' : '1fr', // Aperçu désactivé par défaut sur mobile
    gap: isMobile ? '8px' : '16px',
    height: '100%'
  };

  const editorContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    padding: '0px' // Alignement avec le header (24px de padding horizontal)
  };

  const textareaStyle = {
    width: '100%',
    height: '100%',
    padding: isMobile ? '10px 15px' : '5mm 15mm', // Marges réduites sur mobile
    border: 'none',
    backgroundColor: 'transparent',
    color: isDarkMode ? '#f9fafb' : '#111827',
    fontSize: isMobile ? '14px' : '12px', // Police plus grande sur mobile
    fontFamily: 'monospace',
    resize: 'none' as const,
    outline: 'none',
    transition: 'all 0.2s ease',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word' as const,
    lineHeight: '1.5',
    boxSizing: 'border-box' as const
  };

  const previewStyle = {
    width: '100%',
    height: '100%',
    padding: isMobile ? '15px' : '20mm 15mm', // Marges réduites sur mobile
    border: 'none',
    backgroundColor: 'transparent',
    color: isDarkMode ? '#f9fafb' : '#111827',
    overflow: 'auto',
    fontSize: isMobile ? '14px' : '12px', // Police plus grande sur mobile
    lineHeight: '1.5',
    boxSizing: 'border-box' as const
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '16px',
    padding: '0' // Plus de padding pour aligner sur le bord gauche
  };

  

  const handleTextareaFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#3b82f6';
    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
  };

  const handleTextareaBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.borderColor = isDarkMode ? '#374151' : '#e5e7eb';
    e.target.style.boxShadow = 'none';
  };

 

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      // Empêcher le comportement par défaut et insérer <br> + retour à la ligne
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insérer <br> suivi d'un vrai retour à la ligne pour l'éditeur
      const newValue = markdown.substring(0, start) + '<br>\n' + markdown.substring(end);
      onChange(newValue);

      // Repositionner le curseur après <br>\n
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 5; // longueur de "<br>\n"
      }, 0);
    }
  };

  const insertText = (text: string, replaceSelection = false) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    let newText = text;
    let newPosition;

    if (replaceSelection && selectedText) {
      // Si du texte est sélectionné et qu'on veut formater, déterminer le format
      if (text === '****') {
        // Cas spécial pour le gras : entourer le texte sélectionné
        newText = `**${selectedText}**`;
      } else if (text === '**') {
        // Cas spécial pour l'italique : entourer le texte sélectionné
        newText = `*${selectedText}*`;
      } else if (text === '``') {
        // Cas spécial pour le code en ligne : entourer le texte sélectionné
        newText = `\`${selectedText}\``;
      } else {
        // Autres cas : remplacer la sélection
        newText = text;
      }
      newPosition = start + newText.length;
    } else {
      // Comportement par défaut : insérer le texte sans modification
      newText = text;
      newPosition = start + text.length;
    }

    const newValue = markdown.substring(0, start) + newText + markdown.substring(end);
    onChange(newValue);

    // Repositionner le curseur
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = newPosition;
    }, 0);
  };
  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return <MarkdownEditorSkeleton showPreview={showPreview} isDarkMode={isDarkMode} />;
  }

  return (
    <section style={editorContainerStyle} aria-labelledby="editor-title">
      <div style={headerStyle}>
        <h2 id="editor-title" style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '700',
          color: isDarkMode ? '#f1f5f9' : '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <PencilIcon style={{ width: '18px', height: '18px' }} aria-hidden="true" />
          {isMobile ? 'Éditeur' : 'Éditeur Markdown'}
        </h2>
      </div>

      {/* Toolbar */}
      <MarkdownToolbar
        onInsertText={insertText}
        onTogglePreview={onTogglePreview}
        showPreview={showPreview}
        isDarkMode={isDarkMode}
        onShowHelp={() => setShowHelpModal(true)}
      />

      {/* Conteneur A4 */}
      <div style={a4ContainerStyle} role="region" aria-label="Zone d'édition Markdown">
        <div style={editorStyle}>
          <div style={{ position: 'relative' }}>
            <label htmlFor="markdown-textarea" style={{
              position: 'absolute',
              left: '-9999px',
              width: '1px',
              height: '1px',
              overflow: 'hidden'
            }}>
              Éditeur de texte Markdown
            </label>
            <textarea
              id="markdown-textarea"
              ref={textareaRef}
              value={markdown}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleTextareaFocus}
              onBlur={handleTextareaBlur}
              placeholder="# Entrez votre contenu Markdown ici..."
              aria-label="Contenu Markdown - Utilisez les raccourcis clavier Ctrl+B pour gras, Ctrl+I pour italique"
              aria-describedby="markdown-help"
              style={textareaStyle}
            />
            <div id="markdown-help" style={{
              position: 'absolute',
              left: '-9999px',
              width: '1px',
              height: '1px',
              overflow: 'hidden'
            }}>
              Raccourcis clavier disponibles : Ctrl+B pour gras, Ctrl+I pour italique, Ctrl+K pour lien, Ctrl+Shift+C pour code
            </div>
          </div>

          {showPreview && (
            <div
              role="region"
              aria-label="Aperçu du Markdown"
              aria-live="polite"
              style={previewStyle}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(markdown) as string) }}
            />
          )}
        </div>
      </div>

      {/* Modale d'aide Markdown */}
      {showHelpModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={() => setShowHelpModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-modal-title"
        >
          <div
            style={{
              position: 'relative',
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              zIndex: 2001,
              width: '90%',
              maxWidth: '700px',
              maxHeight: '80vh',
              overflow: 'auto',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              transform: 'scale(1)',
              animation: 'slideIn 0.3s ease-out',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px 24px 16px',
              borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
            }}>
              <h2 id="help-modal-title" style={{
                fontSize: '20px',
                fontWeight: '600',
                color: isDarkMode ? '#f1f5f9' : '#1e293b',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <QuestionMarkCircleIcon style={{ width: '24px', height: '24px' }} />
                Guide Markdown
              </h2>
              <button
                onClick={() => setShowHelpModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isDarkMode ? '#94a3b8' : '#64748b'
                }}
                aria-label="Fermer l'aide"
              >
                <XMarkIcon style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b',
                  margin: '0 0 16px 0'
                }}>
                  Formatage du texte
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{
                    padding: '16px',
                    backgroundColor: isDarkMode ? '#334155' : '#f8fafc',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isDarkMode ? '#f1f5f9' : '#1e293b',
                      marginBottom: '8px'
                    }}>
                      **Gras**
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                      fontFamily: 'monospace',
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`
                    }}>
                      **texte en gras**
                    </div>
                  </div>

                  <div style={{
                    padding: '16px',
                    backgroundColor: isDarkMode ? '#334155' : '#f8fafc',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isDarkMode ? '#f1f5f9' : '#1e293b',
                      marginBottom: '8px'
                    }}>
                      *Italique*
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                      fontFamily: 'monospace',
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`
                    }}>
                      *texte en italique*
                    </div>
                  </div>

                  <div style={{
                    padding: '16px',
                    backgroundColor: isDarkMode ? '#334155' : '#f8fafc',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isDarkMode ? '#f1f5f9' : '#1e293b',
                      marginBottom: '8px'
                    }}>
                      `Code`
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                      fontFamily: 'monospace',
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`
                    }}>
                      `code en ligne`
                    </div>
                  </div>

                  <div style={{
                    padding: '16px',
                    backgroundColor: isDarkMode ? '#334155' : '#f8fafc',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isDarkMode ? '#f1f5f9' : '#1e293b',
                      marginBottom: '8px'
                    }}>
                      ~~Barré~~
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                      fontFamily: 'monospace',
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`
                    }}>
                      ~~texte barré~~
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b',
                  margin: '0 0 16px 0'
                }}>
                  Titres et structure
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{
                    padding: '16px',
                    backgroundColor: isDarkMode ? '#334155' : '#f8fafc',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isDarkMode ? '#f1f5f9' : '#1e293b',
                      marginBottom: '8px'
                    }}>
                      # Titre 1
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                      fontFamily: 'monospace',
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`
                    }}>
                      # Titre principal
                    </div>
                  </div>

                  <div style={{
                    padding: '16px',
                    backgroundColor: isDarkMode ? '#334155' : '#f8fafc',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isDarkMode ? '#f1f5f9' : '#1e293b',
                      marginBottom: '8px'
                    }}>
                      ## Titre 2
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                      fontFamily: 'monospace',
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`
                    }}>
                      ## Sous-titre
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b',
                  margin: '0 0 16px 0'
                }}>
                  Listes et liens
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{
                    padding: '16px',
                    backgroundColor: isDarkMode ? '#334155' : '#f8fafc',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isDarkMode ? '#f1f5f9' : '#1e293b',
                      marginBottom: '8px'
                    }}>
                      Liste à puces
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                      fontFamily: 'monospace',
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      padding: '8px',
                      borderRadius: '4px',
                      border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`,
                      whiteSpace: 'pre-line'
                    }}>
                      {'- Élément 1\n- Élément 2\n  - Sous-élément'}
                    </div>
                  </div>

                  <div style={{
                    padding: '16px',
                    backgroundColor: isDarkMode ? '#334155' : '#f8fafc',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isDarkMode ? '#f1f5f9' : '#1e293b',
                      marginBottom: '8px'
                    }}>
                      Lien
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                      fontFamily: 'monospace',
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`
                    }}>
                      [texte](url)
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b',
                  margin: '0 0 16px 0'
                }}>
                  Raccourcis clavier
                </h3>
                <div style={{
                  padding: '16px',
                  backgroundColor: isDarkMode ? '#334155' : '#f8fafc',
                  borderRadius: '8px',
                  border: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: isDarkMode ? '#f1f5f9' : '#1e293b',
                        marginBottom: '4px'
                      }}>
                        Ctrl+B
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: isDarkMode ? '#94a3b8' : '#64748b'
                      }}>
                        Mettre en gras
                      </div>
                    </div>
                    <div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: isDarkMode ? '#f1f5f9' : '#1e293b',
                        marginBottom: '4px'
                      }}>
                        Ctrl+I
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: isDarkMode ? '#94a3b8' : '#64748b'
                      }}>
                        Mettre en italique
                      </div>
                    </div>
                    <div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: isDarkMode ? '#f1f5f9' : '#1e293b',
                        marginBottom: '4px'
                      }}>
                        Ctrl+K
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: isDarkMode ? '#94a3b8' : '#64748b'
                      }}>
                        Insérer un lien
                      </div>
                    </div>
                    <div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: isDarkMode ? '#f1f5f9' : '#1e293b',
                        marginBottom: '4px'
                      }}>
                        Ctrl+Shift+C
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: isDarkMode ? '#94a3b8' : '#64748b'
                      }}>
                        Code en ligne
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: isDarkMode ? '#064e3b' : '#ecfdf5',
                borderRadius: '8px',
                border: `1px solid ${isDarkMode ? '#065f46' : '#a7f3d0'}`
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: isDarkMode ? '#6ee7b7' : '#065f46',
                  marginBottom: '8px'
                }}>
                  💡 Conseil
                </div>
                <div style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#a7f3d0' : '#047857'
                }}>
                  Utilisez la barre d'outils ci-dessus pour insérer rapidement les éléments Markdown courants.
                  L'aperçu en temps réel vous permet de voir le rendu final de votre document.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MarkdownEditor;
