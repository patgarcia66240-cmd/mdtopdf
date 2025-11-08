import React, { useState,  useRef, useMemo, useCallback } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface VirtualizedMarkdownEditorProps {
  markdown: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
}

interface LineItem {
  index: number;
  content: string;
  lineNumber: number;
}

const VirtualizedMarkdownEditor: React.FC<VirtualizedMarkdownEditorProps> = ({
  markdown,
  onChange,
  isDarkMode
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // Diviser le markdown en lignes
  const lines = useMemo(() => {
    return markdown.split('\n');
  }, [markdown]);

  // Créer des chunks pour la virtualisation
  const lineChunks = useMemo(() => {
    const chunks: LineItem[] = lines.map((line, index) => ({
      index,
      content: line,
      lineNumber: index + 1
    }));
    return chunks;
  }, [lines]);

  // Gestionnaire de changement du textarea
  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newPosition = e.target.selectionStart;
    setCursorPosition(newPosition);
    onChange(newValue);
  }, [onChange]);

  // Calculer la ligne visible actuelle
  const currentLine = useMemo(() => {
    const textBeforeCursor = markdown.substring(0, cursorPosition);
    return textBeforeCursor.split('\n').length - 1;
  }, [markdown, cursorPosition]);

  // Rendu d'une ligne virtualisée (pour utilisation future avec react-window)
  const renderLine = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const line = lineChunks[index];
    if (!line) return null;

    return (
      <div
        style={{
          ...style,
          display: 'flex',
          borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
          backgroundColor: index === currentLine
            ? (isDarkMode ? '#1e3a8a' : '#dbeafe')
            : 'transparent',
          fontFamily: 'monospace',
          fontSize: '13px',
          lineHeight: '1.5',
          minHeight: '22px'
        }}
      >
        {/* Numéro de ligne */}
        <div
          style={{
            width: '50px',
            padding: '2px 8px',
            color: isDarkMode ? '#64748b' : '#94a3b8',
            textAlign: 'right',
            userSelect: 'none',
            borderRight: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
            backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc'
          }}
        >
          {line.lineNumber}
        </div>

        {/* Contenu de la ligne */}
        <div
          style={{
            flex: 1,
            padding: '2px 12px',
            color: isDarkMode ? '#f1f5f9' : '#1e293b',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
        >
          {line.content || ' '}
        </div>
      </div>
    );
  }, [lineChunks, currentLine, isDarkMode]);

  // Styles
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    height: '600px',
    border: `2px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff'
  };

  const textareaContainerStyle = {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%'
  };

  const textareaStyle = {
    flex: 1,
    width: '100%',
    padding: '4px 60px',
    border: 'none',
    backgroundColor: 'transparent',
    color: isDarkMode ? '#f9fafb' : '#111827',
    fontSize: '13px',
    fontFamily: 'monospace',
    resize: 'none' as const,
    outline: 'none',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word' as const,
    boxSizing: 'border-box' as const
  };

  const previewStyle = {
    height: '100%',
    padding: '8px 16px',
    overflow: 'auto',
    border: 'none',
    backgroundColor: 'transparent',
    color: isDarkMode ? '#f9fafb' : '#111827',
    fontSize: '13px',
    lineHeight: '1.5',
    boxSizing: 'border-box' as const
  };

  const performanceInfoStyle = {
    position: 'absolute' as const,
    top: '8px',
    right: '8px',
    backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
    color: isDarkMode ? '#94a3b8' : '#64748b',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontFamily: 'monospace',
    zIndex: 10,
    opacity: 0.8
  };

  return (
    <div style={containerStyle}>
      {/* Éditeur virtualisé */}
      <div style={textareaContainerStyle}>
        <div style={performanceInfoStyle}>
          {lines.length} lignes • {Math.round(markdown.length / 1024)}KB
        </div>

        <label htmlFor="virtualized-markdown-textarea" style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}>
          Éditeur Markdown virtualisé
        </label>

        <textarea
          id="virtualized-markdown-textarea"
          ref={textareaRef}
          value={markdown}
          onChange={handleTextareaChange}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          placeholder="# Entrez votre contenu Markdown ici..."
          aria-label="Contenu Markdown virtualisé - Supporte les gros documents"
          style={textareaStyle}
        />

        {/* Indicateur de ligne actuelle */}
        {isEditing && (
          <div style={{
            position: 'absolute',
            left: '50px',
            top: `${currentLine * 22}px`,
            right: '8px',
            height: '22px',
            backgroundColor: isDarkMode ? '#1e3a8a' : '#dbeafe',
            borderLeft: `3px solid ${isDarkMode ? '#3b82f6' : '#2563eb'}`,
            pointerEvents: 'none',
            opacity: 0.3,
            transition: 'top 0.1s ease'
          }} />
        )}
      </div>

      {/* Aperçu */}
      <div
        role="region"
        aria-label="Aperçu du Markdown virtualisé"
        aria-live="polite"
        style={previewStyle}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(marked(markdown) as string)
          }}
        />
      </div>
    </div>
  );
};

export default VirtualizedMarkdownEditor;
