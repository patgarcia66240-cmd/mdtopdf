import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { VariableSizeList as List } from 'react-window';
import { PDFOptions } from '@/types/app';

interface VirtualizedMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  options: PDFOptions;
  isDarkMode: boolean;
  style?: React.CSSProperties;
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
}

const VirtualizedMarkdownEditor: React.FC<VirtualizedMarkdownEditorProps> = ({
  value,
  onChange,
  options,
  isDarkMode,
  style = {}
}) => {
  const [lines, setLines] = useState<string[]>(['']);
  const [lineNumbers, setLineNumbers] = useState<number[]>([1]);

  // Diviser le contenu en lignes
  useEffect(() => {
    const newLines = value.split('\n');
    setLines(newLines.length > 0 ? newLines : ['']);
    setLineNumbers(Array.from({ length: newLines.length }, (_, i) => i + 1));
  }, [value]);

  const handleLineChange = useCallback((lineIndex: number, newValue: string) => {
    const newLines = [...lines];
    newLines[lineIndex] = newValue;
    const newContent = newLines.join('\n');
    onChange(newContent);
  }, [lines, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, lineIndex: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const newLines = [...lines];
      newLines.splice(lineIndex + 1, 0, '');
      setLines(newLines);
      const newContent = newLines.join('\n');
      onChange(newContent);

      // Focus sur la nouvelle ligne
      setTimeout(() => {
        const nextInput = document.querySelector(`textarea[data-line="${lineIndex + 1}"]`) as HTMLTextAreaElement;
        nextInput?.focus();
      }, 0);
    } else if (e.key === 'Backspace' && e.currentTarget.value === '' && lineIndex > 0) {
      e.preventDefault();
      const newLines = [...lines];
      newLines.splice(lineIndex, 1);
      setLines(newLines);
      const newContent = newLines.join('\n');
      onChange(newContent);

      // Focus sur la ligne précédente
      setTimeout(() => {
        const prevInput = document.querySelector(`textarea[data-line="${lineIndex - 1}"]`) as HTMLTextAreaElement;
        prevInput?.focus();
        prevInput?.setSelectionRange(prevInput.value.length, prevInput.value.length);
      }, 0);
    }
  }, [lines, onChange]);

  const Row: React.FC<RowProps> = React.useCallback(({ index, style }) => {
    const lineNumber = lineNumbers[index];
    const lineValue = lines[index] || '';

    return (
      <div
        style={{
          ...style,
          display: 'flex',
          borderBottom: '1px solid ' + (isDarkMode ? '#374151' : '#e5e7eb'),
        }}
      >
        {/* Line numbers */}
        <div
          style={{
            width: '50px',
            padding: '8px 12px',
            textAlign: 'right',
            color: isDarkMode ? '#6b7280' : '#9ca3af',
            fontSize: '14px',
            fontFamily: 'monospace',
            borderRight: '1px solid ' + (isDarkMode ? '#374151' : '#e5e7eb'),
            backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
            userSelect: 'none',
          }}
        >
          {lineNumber}
        </div>

        {/* Text area for this line */}
        <textarea
          data-line={lineNumber}
          value={lineValue}
          onChange={(e) => handleLineChange(index, (e.target as HTMLTextAreaElement).value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          placeholder=""
          style={{
            flex: 1,
            padding: '8px 12px',
            border: 'none',
            outline: 'none',
            fontSize: `${options.fontSize}px`,
            fontFamily: options.fontFamily,
            lineHeight: '1.6',
            backgroundColor: 'transparent',
            color: isDarkMode ? '#e5e7eb' : '#1f2937',
            resize: 'none',
            overflow: 'hidden',
          }}
          spellCheck={false}
        />
      </div>
    );
  }, [lineNumbers, lines, handleLineChange, handleKeyDown, options, isDarkMode]);

  const itemHeight = useMemo(() => {
    return Math.max(32, options.fontSize * 1.8); // Hauteur basée sur la taille de police
  }, [options.fontSize]);

  return (
    <div
      style={{
        border: '1px solid ' + (isDarkMode ? '#374151' : '#d1d5db'),
        borderRadius: '8px',
        backgroundColor: isDarkMode ? '#111827' : '#ffffff',
        overflow: 'hidden',
        height: '600px',
        ...style
      }}
    >
      <List
        height={600}
        itemCount={lines.length}
        itemSize={() => itemHeight}
        width="100%"
        overscanCount={5} // Optimisation: render 5 extra items
      >
        {Row}
      </List>
    </div>
  );
};

export default VirtualizedMarkdownEditor;