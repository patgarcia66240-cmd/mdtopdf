import React, { useState, useRef, forwardRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'github-markdown-css/github-markdown.css';
import {
  PencilIcon,
  EyeIcon,
  BoltIcon,
  DocumentIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

const MarkdownEditor = forwardRef(({ value, onChange, markdownRef, isDarkMode }, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState('both'); // 'editor', 'preview', 'both'
  const [paperFormat, setPaperFormat] = useState('a4'); // 'a4', 'free'
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  // États pour la réorganisation des contrôles
  const [controlOrder, setControlOrder] = useState(['viewModes', 'formats', 'stats']);
  const [draggedControl, setDraggedControl] = useState(null);
  const [dragOverControl, setDragOverControl] = useState(null);

  const editorRef = useRef(null);
  const textareaRef = useRef(null);
  const previewRef = useRef(null);

  // Charger et sauvegarder l'ordre des contrôles
  useEffect(() => {
    const savedOrder = localStorage.getItem('markdownControlOrder');
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        if (Array.isArray(parsedOrder) && parsedOrder.length === 3) {
          setControlOrder(parsedOrder);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'ordre des contrôles:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('markdownControlOrder', JSON.stringify(controlOrder));
  }, [controlOrder]);

  // Effet pour injecter le CSS du mode sombre directement dans le DOM
  useEffect(() => {
    if (isDarkMode && markdownRef?.current) {
      const styleId = 'dark-mode-override';
      let styleElement = document.getElementById(styleId);

      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = `
          .markdown-body[data-theme="dark"] {
            background-color: #1e1e2f !important;
            color: #e5e7eb !important;
          }
          .markdown-body[data-theme="dark"] * {
            color: #e5e7eb !important;
          }
          .markdown-body[data-theme="dark"] h1,
          .markdown-body[data-theme="dark"] h2,
          .markdown-body[data-theme="dark"] h3,
          .markdown-body[data-theme="dark"] h4,
          .markdown-body[data-theme="dark"] h5,
          .markdown-body[data-theme="dark"] h6 {
            color: #f3f4f6 !important;
            border-bottom-color: #374151 !important;
          }
          .markdown-body[data-theme="dark"] p {
            color: #e5e7eb !important;
          }
          .markdown-body[data-theme="dark"] code {
            background-color: #374151 !important;
            color: #f9fafb !important;
          }
          .markdown-body[data-theme="dark"] pre {
            background-color: #1f2937 !important;
            color: #e5e7eb !important;
            border-color: #374151 !important;
          }
          .markdown-body[data-theme="dark"] blockquote {
            background-color: #1f2937 !important;
            border-left-color: #6b7280 !important;
            color: #d1d5db !important;
          }
          .markdown-body[data-theme="dark"] a {
            color: #60a5fa !important;
          }
          .markdown-body[data-theme="dark"] a:hover {
            color: #3b82f6 !important;
          }
        `;
        document.head.appendChild(styleElement);
      }
    } else {
      // Retirer le style quand on passe en mode clair
      const styleElement = document.getElementById('dark-mode-override');
      if (styleElement) {
        styleElement.remove();
      }
    }

    return () => {
      // Nettoyer le style quand le composant est démonté
      const styleElement = document.getElementById('dark-mode-override');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [isDarkMode, markdownRef]);

  // Effet pour calculer les statistiques du texte
  useEffect(() => {
    const text = value.replace(/[#*`\-_]/g, '').trim(); // Enlever les caractères markdown
    const words = text.split(/\s+/).filter(word => word.length > 0).length;
    const chars = text.length;
    const readingTime = Math.ceil(words / 200); // 200 mots par minute

    setWordCount(words);
    setCharCount(chars);
    setReadingTime(readingTime);
  }, [value]);

  // Fonctions pour le drag & drop des contrôles
  const handleControlDragStart = (controlType) => {
    setDraggedControl(controlType);
  };

  const handleControlDragOver = (e) => {
    e.preventDefault();
  };

  const handleControlDragEnter = (controlType) => {
    if (draggedControl && draggedControl !== controlType) {
      setDragOverControl(controlType);
    }
  };

  const handleControlDragLeave = () => {
    setDragOverControl(null);
  };

  const handleControlDrop = (e, targetControl) => {
    e.preventDefault();
    if (!draggedControl || draggedControl === targetControl) {
      setDraggedControl(null);
      setDragOverControl(null);
      return;
    }

    const newOrder = [...controlOrder];
    const draggedIndex = newOrder.indexOf(draggedControl);
    const targetIndex = newOrder.indexOf(targetControl);

    // Déplacer le contrôle
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedControl);

    setControlOrder(newOrder);
    setDraggedControl(null);
    setDragOverControl(null);
  };

  const handleControlDragEnd = () => {
    setDraggedControl(null);
    setDragOverControl(null);
  };

  /** Gestion du glisser-déposer */
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const imgMarkdown = `\n![${file.name}](${evt.target.result})\n`;
          onChange(value + imgMarkdown);
        };
        reader.readAsDataURL(file);
      } else if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        const text = await file.text();
        onChange(value + '\n' + text);
      }
    }
  };

  /** Copier-coller */
  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (evt) => {
          const imgMarkdown = `\n![Image collée](${evt.target.result})\n`;
          onChange(value + imgMarkdown);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Styles dynamiques selon le mode
  const editorContainerStyle = {
    flex: 1,
    border: isDragging
      ? (isDarkMode ? '2px dashed #60a5fa' : '2px dashed #007bff')
      : (isDarkMode ? '1px solid #374151' : '1px solid #ccc'),
    borderRadius: '8px',
    backgroundColor: isDragging
      ? (isDarkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(0,123,255,0.1)')
      : (isDarkMode ? '#1f2937' : '#fff'),
    position: 'relative',
    transition: 'all 0.3s ease',
  };

  const textareaStyle = {
    width: '100%',
    height: '100%',
    padding: '24px',
    border: 'none',
    outline: 'none',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
    fontSize: '14px',
    resize: 'none',
    background: 'transparent',
    color: isDarkMode ? '#e5e7eb' : '#1f2937',
    // Scroll indépendant
    overflowY: 'auto',
    overflowX: 'hidden',
    lineHeight: '1.6',
    letterSpacing: '0.01em',
    '&::placeholder': {
      color: isDarkMode ? '#6b7280' : '#9ca3af',
      fontStyle: 'italic',
    },
  };

  const previewStyle = {
    flex: 1,
    border: isDarkMode ? '1px solid #374151' : '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: isDarkMode ? '#1e1e2f' : 'white',
    padding: '20px',
    height: '500px',
    overflowY: 'auto',
    // Force les couleurs de texte en mode sombre
    color: isDarkMode ? '#e5e7eb' : 'inherit',
  };

  const dragOverlayStyle = {
    position: 'absolute',
    inset: 0,
    background: isDarkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(0,123,255,0.1)',
    color: isDarkMode ? '#60a5fa' : '#007bff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
  };

  // Style moderne pour la barre d'outils principale
  const toolbarStyle = {
    marginBottom: '20px',
    padding: '16px 20px',
    background: isDarkMode
      ? 'linear-gradient(135deg, #2a2a3d 0%, #1f2937 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '12px',
    border: isDarkMode ? '1px solid #374151' : '1px solid #e2e8f0',
    boxShadow: isDarkMode
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  };

  // Style pour les groupes de contrôles réorganisables
  const getControlGroupStyle = (controlType, isDragged, isDragOver) => {
    const baseStyle = {
      display: 'flex',
      gap: '4px',
      backgroundColor: isDarkMode ? '#1f2937' : '#f1f5f9',
      padding: '6px',
      borderRadius: '8px',
      cursor: 'move',
      transition: 'all 0.2s ease',
      userSelect: 'none',
      flexWrap: 'wrap',
      alignItems: 'center',
    };

    if (isDragged) {
      return {
        ...baseStyle,
        opacity: 0.5,
        transform: 'scale(0.98)',
        zIndex: 1000,
      };
    }

    if (isDragOver) {
      return {
        ...baseStyle,
        transform: 'translateY(2px)',
        border: isDarkMode ? '2px dashed #3b82f6' : '2px dashed #2563eb',
      };
    }

    return baseStyle;
  };

  // Style pour les boutons dans les contrôles
  const buttonGroupStyle = {
    display: 'flex',
    gap: '2px',
    backgroundColor: 'transparent',
    padding: '2px',
    borderRadius: '6px',
  };

  const buttonStyle = (isActive, group = 'default') => ({
    padding: '8px 14px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: isActive
      ? (group === 'format'
          ? (isDarkMode ? '#10b981' : '#059669')
          : (isDarkMode ? '#3b82f6' : '#2563eb'))
      : 'transparent',
    color: isActive
      ? 'white'
      : (isDarkMode ? '#9ca3af' : '#64748b'),
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    position: 'relative',
    '&:hover': {
      backgroundColor: isActive
        ? undefined
        : (isDarkMode ? '#374151' : '#e2e8f0'),
      transform: 'translateY(-1px)',
    }
  });

  // Style pour les statistiques
  const statsStyle = {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: isDarkMode ? '#9ca3af' : '#64748b',
    fontWeight: '500',
  };

  const statItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: isDarkMode ? '#1f2937' : '#f8fafc',
    borderRadius: '4px',
  };

  // Fonction pour rendre un groupe de contrôles draggable
  const renderControlGroup = (controlType) => {
    const isDragged = draggedControl === controlType;
    const isDragOver = dragOverControl === controlType;

    if (controlType === 'viewModes') {
      return (
        <div
          key="viewModes"
          style={getControlGroupStyle('viewModes', isDragged, isDragOver)}
          draggable
          onDragOver={handleControlDragOver}
          onDragEnter={() => handleControlDragEnter('viewModes')}
          onDragLeave={handleControlDragLeave}
          onDrop={(e) => handleControlDrop(e, 'viewModes')}
          onDragEnd={handleControlDragEnd}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '12px' }}>
            <span style={{ fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>⋮⋮</span>
            <span style={{ fontSize: '12px', fontWeight: '500', color: isDarkMode ? '#e5e7eb' : '#374151' }}>
              Vues
            </span>
          </div>
          <div style={buttonGroupStyle}>
            <button
              onClick={() => setViewMode('editor')}
              style={buttonStyle(viewMode === 'editor')}
              title="Mode éditeur"
            >
              <PencilIcon style={{ width: '16px', height: '16px' }} />
              <span>Éditer</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              style={buttonStyle(viewMode === 'preview')}
              title="Mode aperçu"
            >
              <EyeIcon style={{ width: '16px', height: '16px' }} />
              <span>Aperçu</span>
            </button>
            <button
              onClick={() => setViewMode('both')}
              style={buttonStyle(viewMode === 'both')}
              title="Mode divisé"
            >
              <BoltIcon style={{ width: '16px', height: '16px' }} />
              <span>Divisé</span>
            </button>
          </div>
        </div>
      );
    }

    if (controlType === 'formats') {
      return (
        <div
          key="formats"
          style={getControlGroupStyle('formats', isDragged, isDragOver)}
          draggable
          onDragOver={handleControlDragOver}
          onDragEnter={() => handleControlDragEnter('formats')}
          onDragLeave={handleControlDragLeave}
          onDrop={(e) => handleControlDrop(e, 'formats')}
          onDragEnd={handleControlDragEnd}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '12px' }}>
            <span style={{ fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>⋮⋮</span>
            <span style={{ fontSize: '12px', fontWeight: '500', color: isDarkMode ? '#e5e7eb' : '#374151' }}>
              Format
            </span>
          </div>
          <div style={buttonGroupStyle}>
            {viewMode !== 'editor' && (
              <button
                onClick={() => setPaperFormat(paperFormat === 'a4' ? 'free' : 'a4')}
                style={buttonStyle(true, 'format')}
                title={paperFormat === 'a4' ? "Format libre" : "Format A4"}
              >
                {paperFormat === 'a4' ? (
                  <DocumentIcon style={{ width: '16px', height: '16px' }} />
                ) : (
                  <DocumentTextIcon style={{ width: '16px', height: '16px' }} />
                )}
                <span>{paperFormat === 'a4' ? 'A4' : 'Libre'}</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    if (controlType === 'stats') {
      return (
        <div
          key="stats"
          style={getControlGroupStyle('stats', isDragged, isDragOver)}
          draggable
          onDragOver={handleControlDragOver}
          onDragEnter={() => handleControlDragEnter('stats')}
          onDragLeave={handleControlDragLeave}
          onDrop={(e) => handleControlDrop(e, 'stats')}
          onDragEnd={handleControlDragEnd}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '12px' }}>
            <span style={{ fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>⋮⋮</span>
            <span style={{ fontSize: '12px', fontWeight: '500', color: isDarkMode ? '#e5e7eb' : '#374151' }}>
              Stats
            </span>
          </div>
          <div style={statsStyle}>
            <div style={statItemStyle}>
              <PencilSquareIcon style={{ width: '14px', height: '14px' }} />
              <span>{wordCount} mots</span>
            </div>
            <div style={statItemStyle}>
              <ChartBarIcon style={{ width: '14px', height: '14px' }} />
              <span>{charCount} caractères</span>
            </div>
            <div style={statItemStyle}>
              <ClockIcon style={{ width: '14px', height: '14px' }} />
              <span>{readingTime} min</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Style pour le conteneur principal
  const containerStyle = {
    display: viewMode === 'both' ? 'flex' : 'block',
    gap: '24px',
    flexDirection: viewMode === 'both' ? 'row' : 'column',
    minHeight: '600px',
    alignItems: viewMode === 'both' ? 'flex-start' : 'stretch', // Alignement en haut pour le mode divisé
  };

  // Style pour l'éditeur et l'aperçu selon le mode
  const getEditorStyle = () => ({
    ...editorContainerStyle,
    flex: viewMode === 'both' ? 1 : 'none',
    width: viewMode === 'both' ? 'auto' : '100%',
    height: viewMode === 'both' ? '600px' : '650px',
    display: viewMode === 'preview' ? 'none' : 'block',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    alignSelf: 'flex-start', // Force l'alignement en haut
  });

  const getPreviewStyle = () => {
    const baseStyle = {
      ...previewStyle,
      flex: viewMode === 'both' ? 1 : 'none',
      width: viewMode === 'both' ? 'auto' : '100%',
      height: viewMode === 'both' ? '600px' : '650px', // Même hauteur que l'éditeur
      display: viewMode === 'editor' ? 'none' : 'block',
      // Scroll indépendant
      overflowY: 'auto',
      overflowX: paperFormat === 'free' ? 'auto' : 'hidden',
      alignSelf: 'flex-start', // Force l'alignement en haut
      // Styles agressifs pour le mode sombre
      ...(isDarkMode && {
        backgroundColor: '#1e1e2f !important',
        color: '#e5e7eb !important',
      })
    };

    // Styles spécifiques au format A4
    if (paperFormat === 'a4') {
      return {
        ...baseStyle,
        maxWidth: '794px', // Largeur A4 exacte (210mm à 96 DPI)
        width: '794px',
        minHeight: '1123px', // Hauteur A4 (297mm à 96 DPI)
        margin: '0px auto',
        padding: '60px 40px', // Marges A4 réalistes
        backgroundColor: isDarkMode ? '#2a2a3d' : '#ffffff',
        fontFamily: 'Times New Roman, Georgia, serif',
        fontSize: '12pt',
        lineHeight: '1.6',
        boxShadow: isDarkMode
          ? '0 8px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          : '0 8px 16px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        borderRadius: '4px',
        border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
      };
    }

    // Styles pour format libre
    return {
      ...baseStyle,
      width: '100%',
      padding: '20px',
      fontSize: '14px',
    };
  };

  return (
    <div style={{
      fontFamily: isDarkMode
        ? "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        : "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Barre d'outils principale flexible et réorganisable */}
      <div style={{
        ...toolbarStyle,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
        {/* Groupes de contrôles réorganisables */}
        {controlOrder.map(controlType => renderControlGroup(controlType))}
      </div>

      {/* Conteneur principal */}
      <div style={containerStyle}>
        {/* Zone d'édition */}
        <div
          ref={editorRef}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onPaste={handlePaste}
          style={getEditorStyle()}
        >
          <textarea
            ref={(node) => {
              // Synchroniser les deux refs
              textareaRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="# Commencez à écrire en Markdown...

## Instructions disponibles
- Utilisez **gras** ou *italique* pour le formatage
- Créez des [liens](https://example.com) facilement
- Ajoutez des `blocs de code` pour le code inline
- Insérez des listes avec des tirets ou chiffres
- Glissez-déposez des images ou fichiers Markdown directement ici"
            style={{
              ...textareaStyle,
              height: viewMode === 'both' ? '500px' : '600px',
            }}
          />
          {isDragging && (
            <div style={dragOverlayStyle}>
              Dépose ton fichier ici ⬇️
            </div>
          )}
        </div>

        {/* Aperçu Markdown */}
        <div
          ref={(node) => {
            // Synchroniser les deux refs
            previewRef.current = node;
            if (typeof markdownRef === 'function') {
              markdownRef(node);
            } else if (markdownRef) {
              markdownRef.current = node;
            }
          }}
          style={getPreviewStyle()}
          className="markdown-body"
          data-theme={isDarkMode ? "dark" : "light"}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
});

export default MarkdownEditor;
