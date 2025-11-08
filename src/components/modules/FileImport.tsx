import React, { useState, useRef } from 'react';
import {
  DocumentArrowDownIcon,
  FolderOpenIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import FileImportSkeleton from './FileImportSkeleton';

interface FileImportProps {
  onFileImport: (content: string, fileName: string) => void;
  isDarkMode: boolean;
  isLoading?: boolean;
}

interface ImportedFile {
  name: string;
  size: number;
  content: string;
  importedAt: Date;
}

const FileImport: React.FC<FileImportProps> = ({
  onFileImport,
  isDarkMode,
  isLoading = false
}) => {
  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return <FileImportSkeleton isDarkMode={isDarkMode} />;
  }
  const [isDragging, setIsDragging] = useState(false);
  const [importedFiles, setImportedFiles] = useState<ImportedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const containerStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    borderRadius: '12px',
    padding: '16px', // Réduit de 24px à 16px
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px' // Réduit de 24px à 16px
  };

  const titleStyle = {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const dropZoneStyle = {
    border: `2px dashed ${isDragging ? '#3b82f6' : (isDarkMode ? '#4b5563' : '#d1d5db')}`,
    borderRadius: '12px',
    padding: '24px 16px', // Réduit de 40px 20px à 24px 16px
    textAlign: 'center' as const,
    backgroundColor: isDragging
      ? (isDarkMode ? '#1e3a5f' : '#eff6ff')
      : (isDarkMode ? '#0f172a' : '#f8fafc'),
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    marginBottom: '16px' // Réduit de 24px à 16px
  };

  const iconStyle = {
    width: '36px', // Réduit de 48px à 36px
    height: '36px', // Réduit de 48px à 36px
    margin: '0 auto 12px', // Réduit de 16px à 12px
    color: isDragging ? '#3b82f6' : (isDarkMode ? '#6b7280' : '#9ca3af')
  };

  const textStyle = {
    fontSize: '15px', // Réduit de 16px à 15px
    fontWeight: '600',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    marginBottom: '6px' // Réduit de 8px à 6px
  };

  const subTextStyle = {
    fontSize: '13px', // Réduit de 14px à 13px
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    marginBottom: '12px' // Réduit de 16px à 12px
  };

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px', // Réduit de 8px à 6px
    padding: '8px 16px', // Réduit de 10px 20px à 8px 16px
    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px', // Réduit de 14px à 13px
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const fileListStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px' // Réduit de 12px à 8px
  };

  const fileItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px', // Réduit de 12px 16px à 8px 12px
    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  };

  const fileIconStyle = {
    width: '20px',
    height: '20px',
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    marginRight: '12px'
  };

  const fileItemLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    flex: 1
  };

  const fileItemRightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setError(null);
      processFiles(Array.from(files));
      e.target.value = '';
    }
  };

  const processFiles = async (files: File[]) => {
  const results = await Promise.allSettled(
    files.map(async (file) => {
      // Validation
      const isMarkdown = file.name.toLowerCase().endsWith('.md') ||
                         file.name.toLowerCase().endsWith('.markdown');
      if (!isMarkdown) {
        throw new Error(`Le fichier "${file.name}" n'est pas un fichier Markdown (.md, .markdown)`);
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(`Le fichier "${file.name}" est trop volumineux (max 5MB)`);
      }

      const content = await readFile(file);
      return {
        name: file.name,
        size: file.size,
        content,
        importedAt: new Date()
      };
    })
  );

  // Process results
  const successfulImports: ImportedFile[] = [];
  results.forEach((result, _) => {
    if (result.status === 'fulfilled') {
      successfulImports.push(result.value);
      onFileImport(result.value.content, result.value.name);
    } else {
      setError(result.reason.message);
    }
  });

  if (successfulImports.length > 0) {
    setImportedFiles(prev => [...successfulImports, ...prev].slice(0, 10));
  }
};

  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('File reading error'));
      reader.readAsText(file, 'UTF-8');
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    }).format(date);
  };

  const clearImportHistory = () => {
    setImportedFiles([]);
  };

  const removeFile = (index: number) => {
    setImportedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          <DocumentArrowDownIcon style={{ width: '24px', height: '24px' }} />
          Import de fichiers Markdown
        </h2>
        {importedFiles.length > 0 && (
          <button
            onClick={clearImportHistory}
            style={{
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '6px',
              color: isDarkMode ? '#f1f5f9' : '#374151',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Effacer l'historique
          </button>
        )}
      </div>

      {/* Drop Zone */}
      <div
        style={dropZoneStyle}
        role="button"
        tabIndex={0}
        aria-label="Zone de dépôt de fichiers Markdown"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <FolderOpenIcon style={iconStyle} />
        <div style={textStyle}>
          {isDragging ? 'Déposez les fichiers ici' : 'Glissez-déposez vos fichiers Markdown'}
        </div>
        <div style={subTextStyle}>
          ou cliquez pour parcourir vos fichiers
        </div>
        <div style={buttonStyle}>
          <DocumentArrowDownIcon style={{ width: '16px', height: '16px' }} />
          Choisir un fichier
        </div>        <div style={{
          fontSize: '11px', // Réduit de 12px à 11px
          color: isDarkMode ? '#6b7280' : '#9ca3af',
          marginTop: '8px' // Réduit de 12px à 8px
        }}>
          Formats supportés : .md, .markdown (max 5MB)
        </div>
      </div>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Error Message */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: isDarkMode ? '#7f1d1d' : '#fef2f2',
          border: `1px solid ${isDarkMode ? '#991b1b' : '#fecaca'}`,
          borderRadius: '8px',
          color: isDarkMode ? '#fca5a5' : '#dc2626',
          marginBottom: '20px'
        }}>
          <ExclamationTriangleIcon style={{ width: '16px', height: '16px' }} />
          <span style={{ fontSize: '14px' }}>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              marginLeft: 'auto',
              color: '#dc2626'
            }}
          >
            <XMarkIcon style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      )}
      {/* Imported Files List */}
      {importedFiles.length > 0 && (
        <div>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: isDarkMode ? '#f1f5f9' : '#1e293b'
          }}>
            Fichiers récemment importés
          </h3>
          <div style={fileListStyle}>
            {importedFiles.map((file, index) => (
              <div key={index} style={fileItemStyle}>
                <div style={fileItemLeftStyle}>
                  <DocumentArrowDownIcon style={fileIconStyle} />
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: isDarkMode ? '#f1f5f9' : '#1e293b',
                      marginBottom: '2px'
                    }}>
                      {file.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: isDarkMode ? '#9ca3af' : '#6b7280'
                    }}>
                      {formatFileSize(file.size)} • {formatDate(file.importedAt)}
                    </div>
                  </div>
                </div>
                <div style={fileItemRightStyle}>
                  <CheckCircleIcon style={{
                    width: '16px',
                    height: '16px',
                    color: '#10b981'
                  }} />
                  <button
                    onClick={() => removeFile(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: isDarkMode ? '#6b7280' : '#9ca3af',
                      borderRadius: '4px'
                    }}
                    title="Supprimer de l'historique"
                  >
                    <XMarkIcon style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div style={{
        marginTop: '16px', // Réduit de 24px à 16px
        padding: '12px', // Réduit de 16px à 12px
        backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
        borderRadius: '8px',
        border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
      }}>
        <h4 style={{
          margin: '0 0 8px 0', // Réduit de 12px à 8px
          fontSize: '13px', // Réduit de 14px à 13px
          fontWeight: '600',
          color: isDarkMode ? '#f1f5f9' : '#1e293b'
        }}>
          💡 Conseils d'utilisation
        </h4>
        <ul style={{
          margin: 0,
          paddingLeft: '16px', // Réduit de 20px à 16px
          fontSize: '12px', // Réduit de 13px à 12px
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          lineHeight: '1.4' // Réduit de 1.5 à 1.4
        }}>
          <li>Supporte les fichiers .md et .markdown avec encodage UTF-8</li>
          <li>Les sauts de page peuvent être ajoutés avec <code style={{ backgroundColor: isDarkMode ? '#374151' : '#e5e7eb', padding: '2px 4px', borderRadius: '3px' }}>&lt;!-- pagebreak --&gt;</code></li>
          <li>L'historique conserve les 10 derniers fichiers importés</li>
          <li>Les fichiers volumineux (&gt;5MB) seront rejetés pour des raisons de performance</li>
        </ul>
      </div>
    </div>
  );
};

export default FileImport;
