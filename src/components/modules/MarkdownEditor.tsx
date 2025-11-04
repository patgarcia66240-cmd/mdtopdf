import React, { useRef } from 'react';
import { PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import { marked } from 'marked';
import MarkdownToolbar from './MarkdownToolbar';

interface MarkdownEditorProps {
  markdown: string;
  onChange: (value: string) => void;
  showPreview: boolean;
  onTogglePreview: () => void;
  isDarkMode: boolean;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  markdown,
  onChange,
  showPreview,
  onTogglePreview,
  isDarkMode
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Style A4 pour simuler une page PDF - Ratio A4 conservé avec aspect-ratio
  const a4ContainerStyle: React.CSSProperties = {
    width: '100%', // Largeur fluide
    aspectRatio: '210/297', // Ratio A4 (210mm x 297mm)
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    border: `2px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    position: 'relative',
    boxSizing: 'border-box',
    minHeight: '400px' // Hauteur minimale pour lisibilité
  };

  const editorStyle = {
    display: 'grid',
    gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr',
    gap: '16px',
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
    padding: '5mm 15mm', // Marges A4 standard (20mm haut/bas, 15mm gauche/droite)
    border: 'none',
    backgroundColor: 'transparent',
    color: isDarkMode ? '#f9fafb' : '#111827',
    fontSize: '12px', // Police plus petite pour A4
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
    padding: '20mm 15mm', // Marges A4 standard
    border: 'none',
    backgroundColor: 'transparent',
    color: isDarkMode ? '#f9fafb' : '#111827',
    overflow: 'auto',
    fontSize: '12px', // Police plus petite pour A4
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

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
    border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
    borderRadius: '8px',
    color: isDarkMode ? '#f9fafb' : '#374151',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const handleTextareaFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#3b82f6';
    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
  };

  const handleTextareaBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.borderColor = isDarkMode ? '#374151' : '#e5e7eb';
    e.target.style.boxShadow = 'none';
  };

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = isDarkMode ? '#4b5563' : '#e5e7eb';
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6';
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

    let newValue: string;
    let newPosition: number;

    if (replaceSelection && start !== end) {
      // Remplacer la sélection
      newValue = markdown.substring(0, start) + text + markdown.substring(end);
      newPosition = start + text.length;
    } else {
      // Insérer à la position du curseur
      newValue = markdown.substring(0, start) + text + markdown.substring(end);
      newPosition = start + text.length;
    }

    onChange(newValue);

    // Repositionner le curseur
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = newPosition;
    }, 0);
  };

  return (
    <div style={editorContainerStyle}>
      <div style={headerStyle}>
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '700',
          color: isDarkMode ? '#f1f5f9' : '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <PencilIcon style={{ width: '18px', height: '18px' }} />
          Éditeur Markdown
        </h3>
      </div>

      {/* Toolbar */}
      <MarkdownToolbar
        onInsertText={insertText}
        onTogglePreview={onTogglePreview}
        showPreview={showPreview}
        isDarkMode={isDarkMode}
      />

      {/* Conteneur A4 */}
      <div style={a4ContainerStyle}>
        <div style={editorStyle}>
          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleTextareaFocus}
            onBlur={handleTextareaBlur}
            placeholder="# Entrez votre contenu Markdown ici..."
            style={textareaStyle}
          />

          {showPreview && (
            <div
              style={previewStyle}
              dangerouslySetInnerHTML={{ __html: marked(markdown) }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
