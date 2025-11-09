import React, { useState, useEffect, useRef } from 'react';
import {
  BoldIcon,
  ItalicIcon,
  CodeBracketIcon,
  LinkIcon,
  PhotoIcon,
  TableCellsIcon,
  ListBulletIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

interface MarkdownToolbarProps {
  onInsertText: (text: string, replaceSelection?: boolean) => void;
  onTogglePreview: () => void;
  showPreview: boolean;
  isDarkMode: boolean;
  onShowHelp?: () => void;
}

const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({
  onInsertText,
  onTogglePreview,
  showPreview,
  isDarkMode,
  onShowHelp
}) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const insertFormatting = (before: string, after: string = '') => {
    const text = `${before}${after}`;
    onInsertText(text, true); // true pour indiquer qu'on veut gérer la sélection
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      const linkMarkdown = `[${linkText}](${linkUrl})`;
      onInsertText(linkMarkdown, false);
      setShowLinkModal(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  const toolbarStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '8px 8px 0 0',
    padding: '8px',
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap' as const,
    alignItems: 'center'
  };

  const buttonStyle = (isActive = false, isHovered = false) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    background: isActive
      ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
      : (isHovered
          ? (isDarkMode ? '#374151' : '#f8fafc')
          : 'transparent'),
    border: `1px solid ${isActive
      ? '#6b7280'
      : (isHovered
          ? (isDarkMode ? '#6b7280' : '#9ca3af')
          : (isDarkMode ? '#4b5563' : '#d1d5db'))}`,
    borderRadius: '6px',
    color: isActive
      ? '#ffffff'
      : (isDarkMode ? '#f1f5f9' : '#374151'),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
    boxShadow: isHovered && !isActive
      ? '0 2px 6px rgba(0, 0, 0, 0.15)'
      : 'none'
  });

  const separatorStyle = {
    width: '1px',
    height: '24px',
    backgroundColor: isDarkMode ? '#4b5563' : '#d1d5db',
    margin: '0 4px'
  };

  // Gérer le focus quand la modal s'ouvre
  useEffect(() => {
    if (showLinkModal && firstInputRef.current) {
      // Focus sur le premier champ quand la modal s'ouvre
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [showLinkModal]);

  // Gérer la fermeture avec la touche Échap
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showLinkModal) {
        setShowLinkModal(false);
        setLinkUrl('');
        setLinkText('');
      }
    };

    if (showLinkModal) {
      document.addEventListener('keydown', handleEscapeKey);
      // Empêcher le scroll du body quand la modal est ouverte
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [showLinkModal]);

  return (
    <>
      <div style={toolbarStyle} role="toolbar" aria-label="Barre d'outils de formatage Markdown">
        {/* Formatting */}
        <button
          type="button"
          style={buttonStyle(false, hoveredButton === 'bold')}
          onClick={() => insertFormatting('**', '**')}
          onMouseEnter={() => setHoveredButton('bold')}
          onMouseLeave={() => setHoveredButton(null)}
          title="Gras"
          aria-label="Appliquer le style gras au texte sélectionné"
        >
          <BoldIcon style={{ width: '16px', height: '16px' }} />
        </button>
        <button
          style={buttonStyle(false, hoveredButton === 'italic')}
          onClick={() => insertFormatting('*', '*')}
          onMouseEnter={() => setHoveredButton('italic')}
          onMouseLeave={() => setHoveredButton(null)}
          title="Italique"
          aria-label="Appliquer le style italique au texte sélectionné"
        >
          <ItalicIcon style={{ width: '16px', height: '16px' }} />
        </button>

        <button
          style={buttonStyle(false, hoveredButton === 'code')}
          onClick={() => insertFormatting('`', '`')}
          onMouseEnter={() => setHoveredButton('code')}
          onMouseLeave={() => setHoveredButton(null)}
          title="Code en ligne"
          aria-label="Appliquer le style code en ligne au texte sélectionné"
        >
          <CodeBracketIcon style={{ width: '16px', height: '16px' }} />
        </button>

        <div style={separatorStyle} role="separator" aria-orientation="vertical" />

        {/* Headers */}
        <button
          style={buttonStyle(false, hoveredButton === 'h1')}
          onClick={() => onInsertText('# ')}
          onMouseEnter={() => setHoveredButton('h1')}
          onMouseLeave={() => setHoveredButton(null)}
          title="Titre 1"
          aria-label="Insérer un titre de niveau 1"
        >
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>H1</span>
        </button>

        <button
          style={buttonStyle(false, hoveredButton === 'h2')}
          onClick={() => onInsertText('## ')}
          onMouseEnter={() => setHoveredButton('h2')}
          onMouseLeave={() => setHoveredButton(null)}
          title="Titre 2"
          aria-label="Insérer un titre de niveau 2"
        >
          <span style={{ fontWeight: 'bold', fontSize: '12px' }}>H2</span>
        </button>

        <button
          style={buttonStyle(false, hoveredButton === 'h3')}
          onClick={() => onInsertText('### ')}
          onMouseEnter={() => setHoveredButton('h3')}
          onMouseLeave={() => setHoveredButton(null)}
          title="Titre 3"
          aria-label="Insérer un titre de niveau 3"
        >
          <span style={{ fontWeight: 'bold', fontSize: '11px' }}>H3</span>
        </button>

        <div style={separatorStyle} role="separator" aria-orientation="vertical" />

        {/* Lists */}
        <button
          style={buttonStyle(false, hoveredButton === 'bullet-list')}
          onClick={() => onInsertText('- ')}
          onMouseEnter={() => setHoveredButton('bullet-list')}
          onMouseLeave={() => setHoveredButton(null)}
          title="Liste à puces"
          aria-label="Insérer une liste à puces"
        >
          <ListBulletIcon style={{ width: '16px', height: '16px' }} />
        </button>

        <button
          style={buttonStyle(false, hoveredButton === 'numbered-list')}
          onClick={() => onInsertText('1. ')}
          onMouseEnter={() => setHoveredButton('numbered-list')}
          onMouseLeave={() => setHoveredButton(null)}
          title="Liste numérotée"
          aria-label="Insérer une liste numérotée"
        >
          <span style={{ fontWeight: 'bold', fontSize: '12px' }}>1.</span>
        </button>

        <button
          style={buttonStyle(false, hoveredButton === 'sub-item')}
          onClick={() => onInsertText('  - ')}
          onMouseEnter={() => setHoveredButton('sub-item')}
          onMouseLeave={() => setHoveredButton(null)}
          title="Sous-item"
          aria-label="Insérer un sous-item de liste"
        >
          <ChevronRightIcon style={{ width: '16px', height: '16px' }} />
        </button>

        <div style={separatorStyle} role="separator" aria-orientation="vertical" />

        {/* Elements */}
        <button
          style={buttonStyle(false, hoveredButton === 'quote')}
          onClick={() => insertFormatting('> ', '')}
          onMouseEnter={() => setHoveredButton('quote')}
          onMouseLeave={() => setHoveredButton(null)}
          title="Citation"
          aria-label="Insérer une citation"
        >
          <ChatBubbleLeftRightIcon style={{ width: '16px', height: '16px' }} />
        </button>

        <button
          style={buttonStyle(false, hoveredButton === 'code-block')}
          onClick={() => insertFormatting('```\n', '\n```\n')}
          onMouseEnter={() => setHoveredButton('code-block')}
          onMouseLeave={() => setHoveredButton(null)}
          title="Bloc de code"
          aria-label="Insérer un bloc de code"
        >
          <DocumentTextIcon style={{ width: '16px', height: '16px' }} />
        </button>

        <button
          style={buttonStyle(false, hoveredButton === 'link')}
          onClick={() => setShowLinkModal(true)}
          onMouseEnter={() => setHoveredButton('link')}
          onMouseLeave={() => setHoveredButton(null)}
          title="Lien"
          aria-label="Insérer un lien hypertexte"
        >
          <LinkIcon style={{ width: '16px', height: '16px' }} />
        </button>

        <button
          style={buttonStyle(false, hoveredButton === 'image')}
          onClick={() => onInsertText('![Texte alternatif](url-image)')}
          onMouseEnter={() => setHoveredButton('image')}
          onMouseLeave={() => setHoveredButton(null)}
          title="Image"
          aria-label="Insérer une image"
        >
          <PhotoIcon style={{ width: '16px', height: '16px' }} />
        </button>

        <button
          style={buttonStyle(false, hoveredButton === 'table')}
          onClick={() => onInsertText('\n| Colonne 1 | Colonne 2 |\n|----------|----------|\n| Cellule 1 | Cellule 2 |\n')}
          onMouseEnter={() => setHoveredButton('table')}
          onMouseLeave={() => setHoveredButton(null)}
          title="Tableau"
          aria-label="Insérer un tableau"
        >
          <TableCellsIcon style={{ width: '16px', height: '16px' }} />
        </button>

        <button
          style={buttonStyle(false, hoveredButton === 'pagebreak')}
          onClick={() => onInsertText('\n<!-- pagebreak -->\n')}
          onMouseEnter={() => setHoveredButton('pagebreak')}
          onMouseLeave={() => setHoveredButton(null)}
          title="Saut de page"
          aria-label="Insérer un saut de page"
        >
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>PB</span>
        </button>

        <div style={separatorStyle} role="separator" aria-orientation="vertical" />

        {/* Preview toggle */}
        <button
          style={buttonStyle(showPreview, hoveredButton === 'preview')}
          onClick={onTogglePreview}
          onMouseEnter={() => setHoveredButton('preview')}
          onMouseLeave={() => setHoveredButton(null)}
          title={showPreview ? "Masquer l'aperçu" : "Afficher l'aperçu"}
          aria-label={showPreview ? "Masquer l'aperçu du markdown" : "Afficher l'aperçu du markdown"}
          aria-pressed={showPreview}
        >
          <EyeIcon style={{ width: '16px', height: '16px' }} />
        </button>

        <div style={separatorStyle} role="separator" aria-orientation="vertical" />

        {/* Help button */}
        <button
          style={buttonStyle(false, hoveredButton === 'help')}
          onClick={onShowHelp}
          onMouseEnter={() => setHoveredButton('help')}
          onMouseLeave={() => setHoveredButton(null)}
          title="Aide Markdown"
          aria-label="Afficher l'aide sur la syntaxe Markdown"
        >
          <QuestionMarkCircleIcon style={{ width: '16px', height: '16px' }} />
        </button>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowLinkModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="link-modal-title"
        >
          <div
            ref={modalRef}
            style={{
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              padding: '24px',
              borderRadius: '12px',
              border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
              minWidth: '400px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="link-modal-title"
              style={{
                margin: '0 0 16px 0',
                color: isDarkMode ? '#f1f5f9' : '#1e293b',
                fontSize: '18px',
                fontWeight: '600'
              }}
            >
              Insérer un lien
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  color: isDarkMode ? '#f1f5f9' : '#374151',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                htmlFor="link-text-input"
              >
                Texte du lien
              </label>
              <input
                ref={firstInputRef}
                id="link-text-input"
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Entrez le texte du lien"
                aria-required="true"
                aria-describedby="link-text-description"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                  borderRadius: '6px',
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b',
                  fontSize: '14px'
                }}
              />
              <div
                id="link-text-description"
                style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#94a3b8' : '#6b7280',
                  marginTop: '4px'
                }}
              >
                Le texte qui sera affiché et cliquable
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '4px',
                  color: isDarkMode ? '#f1f5f9' : '#374151',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                htmlFor="link-url-input"
              >
                URL
              </label>
              <input
                id="link-url-input"
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://exemple.com"
                aria-required="true"
                aria-describedby="link-url-description"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                  borderRadius: '6px',
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  color: isDarkMode ? '#f1f5f9' : '#1e293b',
                  fontSize: '14px'
                }}
              />
              <div
                id="link-url-description"
                style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#94a3b8' : '#6b7280',
                  marginTop: '4px'
                }}
              >
                L'adresse web vers laquelle le lien pointera
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkUrl('');
                  setLinkText('');
                }}
                aria-label="Annuler l'insertion du lien"
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                  borderRadius: '6px',
                  color: isDarkMode ? '#f1f5f9' : '#374151',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
              Annuler
            </button>
            <button
                type="button"
                onClick={insertLink}
                disabled={!linkUrl || !linkText}
                aria-label="Insérer le lien dans le document"
                aria-describedby={!linkUrl || !linkText ? 'form-validation-error' : undefined}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '14px',
                  cursor: linkUrl && linkText ? 'pointer' : 'not-allowed',
                  opacity: linkUrl && linkText ? 1 : 0.5
                }}
              >
                Insérer
              </button>
              {(!linkUrl || !linkText) && (
                <div
                  id="form-validation-error"
                  style={{
                    fontSize: '12px',
                    color: '#ef4444',
                    marginTop: '8px'
                  }}
                >
                  Veuillez remplir tous les champs obligatoires
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarkdownToolbar;
