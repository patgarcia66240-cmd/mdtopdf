import React from 'react';
import { PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import { marked } from 'marked';

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
  const editorStyle = {
    display: 'grid',
    gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr',
    gap: '16px',
    height: '500px'
  };

  const textareaStyle = {
    width: '100%',
    height: '100%',
    padding: '16px',
    border: `2px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    borderRadius: '8px',
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#f9fafb' : '#111827',
    fontSize: '14px',
    fontFamily: 'monospace',
    resize: 'none' as const,
    outline: 'none',
    transition: 'all 0.2s ease',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: '1.6'
  };

  const previewStyle = {
    width: '100%',
    height: '100%',
    padding: '16px',
    border: `2px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    borderRadius: '8px',
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#f9fafb' : '#111827',
    overflow: 'auto',
    fontSize: '14px',
    lineHeight: '1.6'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
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

  return (
    <div>
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
        <button
          onClick={onTogglePreview}
          style={buttonStyle}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          <EyeIcon style={{ width: '16px', height: '16px' }} />
          {showPreview ? 'Masquer' : 'Afficher'} l'aperçu
        </button>
      </div>

      <div style={editorStyle}>
        <textarea
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
  );
};

export default MarkdownEditor;