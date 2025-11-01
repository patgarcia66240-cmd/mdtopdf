import React, { useRef, useState, useEffect } from 'react';
import { useMarkdownToPDF } from '../hooks/useMarkdownToPDF';
import { DocumentArrowDownIcon, RocketLaunchIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import MarkdownEditor from './MarkdownEditor';
import PDFOptionsPanel from './PDFOptionsPanel';
import PDFHeaderFooterPanel from './PDFHeaderFooterPanel';

const MarkdownToPDF = () => {
  const markdownRef = useRef(null);
  const { convertToPDF, isConverting } = useMarkdownToPDF();
  const [isDarkMode, setIsDarkMode] = useState(true); // Commence en mode sombre

  
  const [markdown, setMarkdown] = useState(`# **Candivoc Report**

## Introduction
Bienvenue dans le convertisseur Markdown → PDF avec mode sombre ✨

## Test de rendu
Voici un **exemple** avec *Markdown* et du code :

\`\`\`javascript
console.log("Test de rendu Markdown en PDF");
const mode = isDarkMode ? "sombre" : "clair";
\`\`\`

## Fonctionnalités
- ✅ Mode sombre pour l'aperçu
- ✅ Export PDF haute qualité
- ✅ Polices nettes et non déformées
- ✅ Support des images et du code

> **Note** : L'aperçu peut être en mode sombre ou clair selon votre préférence !`);

  const [options, setOptions] = useState({
    format: 'a4',
    orientation: 'portrait',
    margin: 10,
    showPageNumbers: true,
    header: '',
    footer: '',
  });

  const [fileName, setFileName] = useState('candivoc-report');

  
  // Styles dynamiques selon le mode
  const containerStyle = isDarkMode ? {
    backgroundColor: '#181820',
    color: '#fff',
    padding: '30px',
    minHeight: '100vh',
  } : {
    backgroundColor: '#f7f7f7',
    color: '#333',
    padding: '30px',
    minHeight: '100vh',
  };

  const headerStyle = isDarkMode ? {
    fontSize: '2rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '1.2',
    background: 'linear-gradient(135deg, #1357e8ff 0%,  #1452b5ff 75%, #0b41b6ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    WebkitTextStroke: '1px #579eefff',
    WebkitTextStrokeColor: '#579eefff',
    textStroke: '2px #104582ff',
    margin: 0,
    alignSelf: 'center',
    position: 'relative',
  } : {
    fontSize: '2rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '1.2',
    background: 'linear-gradient(135deg, #2563eb 0%,  #3b82f6 75%, #2563eb 100%)',

    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    WebkitTextStroke: '2px #4999f5ff',
    WebkitTextStrokeColor: '#4999f5ff',
    textStroke: '2px #4999f5ff',
    margin: 0,
    alignSelf: 'center',
    position: 'relative',
  };

  const inputStyle = isDarkMode ? {
    flex: 1,
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #3b3b52',
    backgroundColor: '#2a2a3d',
    color: 'white',
  } : {
    flex: 1,
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    color: '#333',
  };

  const buttonStyle = isDarkMode ? {
    padding: '12px 24px',
    background: isConverting
      ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
      : 'linear-gradient(135deg, #1e40af 0%, #2e79f1ff 45%, #2563eb 75%,  #1e40af 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: isConverting ? 'not-allowed' : 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    transform: isConverting ? 'none' : 'translateY(0)',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  } : {
    padding: '12px 24px',
    background: isConverting
      ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'
      : 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 20%, #60a5fa 40%, #3b82f6 60%, #2563eb 80%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: isConverting ? 'not-allowed' : 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    transform: isConverting ? 'none' : 'translateY(0)',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)',
  };

  
  
  const toggleButtonStyle = isDarkMode ? {
    padding: '8px 16px',
    backgroundColor: '#374151',
    color: 'white',
    border: '1px solid #4b5563',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } : {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    color: '#333',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <div style={containerStyle} data-theme={isDarkMode ? "dark" : "light"}>
      {/* En-tête avec bouton de toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        height: '60px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <RocketLaunchIcon
            style={{
              width: '40px',
              height: '40px',
              color: isDarkMode ? '#3b82f6' : '#2563eb',
              filter: `
                drop-shadow(0 2px 4px rgba(37, 99, 235, 0.3))
                hue-rotate(${isDarkMode ? '0deg' : '-10deg'})
                saturate(1.2)
                brightness(1.1)
              `
            }}
          />
          <h1 style={headerStyle}>Markdown to PDF Converter</h1>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={toggleButtonStyle}
          title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          {isDarkMode ? (
            <SunIcon style={{ width: '18px', height: '18px', marginRight: '8px' }} />
          ) : (
            <MoonIcon style={{ width: '18px', height: '18px', marginRight: '8px' }} />
          )}
          {isDarkMode ? 'Mode clair' : 'Mode sombre'}
        </button>
      </div>

      {/* Panneau PDF Header/Footer unifié */}
      <PDFHeaderFooterPanel
        options={options}
        onChange={setOptions}
        isDarkMode={isDarkMode}
      />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Nom du fichier"
          style={inputStyle}
        />
        <button
          onClick={() => convertToPDF(markdownRef, fileName, options)}
          disabled={isConverting}
          style={{
            ...buttonStyle,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            if (!isConverting) {
              e.target.style.transform = 'translateY(-2px)';
              
            }
          }}
          onMouseLeave={(e) => {
            if (!isConverting) {
              e.target.style.transform = 'translateY(0)';
              
            }
          }}
        >
          <DocumentArrowDownIcon
            style={{
              width: '18px',
              height: '18px'
            }}
          />
          {isConverting ? 'Conversion en cours...' : 'Exporter en PDF'}
        </button>
        </div>

      {/* Éditeur Markdown unifié avec mode sombre/clair */}
      <MarkdownEditor
        ref={markdownRef}
        value={markdown}
        onChange={setMarkdown}
        markdownRef={markdownRef}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default MarkdownToPDF;
