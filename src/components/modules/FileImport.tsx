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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

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

  // Fonction pour annoncer les statuts aux lecteurs d'écran
  const announceStatus = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (statusRef.current) {
      statusRef.current.textContent = message;
      statusRef.current.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
    announceStatus('Zone de dépôt activée - Relâchez pour importer les fichiers', 'info');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
      announceStatus('', 'info');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    setSuccessMessage(null);

    const files = Array.from(e.dataTransfer.files);
    announceStatus(`Traitement de ${files.length} fichier(s) en cours...`, 'info');
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setError(null);
      setSuccessMessage(null);
      const fileList = Array.from(files);
      announceStatus(`Traitement de ${fileList.length} fichier(s) sélectionné(s) en cours...`, 'info');
      processFiles(fileList);
      e.target.value = '';
    }
  };

  const processFiles = async (files: File[]) => {
  setIsProcessing(true);

  const results = await Promise.allSettled(
    files.map(async (file, index) => {
      try {
        // Annonce du début de traitement de chaque fichier
        announceStatus(`Traitement du fichier ${index + 1}/${files.length} : ${file.name}`, 'info');

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
      } catch (error) {
        throw error;
      }
    })
  );

  // Process results
  const successfulImports: ImportedFile[] = [];
  const errors: string[] = [];

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      successfulImports.push(result.value);
      onFileImport(result.value.content, result.value.name);
    } else {
      errors.push(result.reason.message);
    }
  });

  setIsProcessing(false);

  // Annoncer les résultats
  if (successfulImports.length > 0) {
    const successMsg = successfulImports.length === 1
      ? `Le fichier "${successfulImports[0].name}" a été importé avec succès`
      : `${successfulImports.length} fichiers ont été importés avec succès`;

    setSuccessMessage(successMsg);
    announceStatus(successMsg, 'success');
    setImportedFiles(prev => [...successfulImports, ...prev].slice(0, 10));
  }

  if (errors.length > 0) {
    const errorMsg = errors.length === 1 ? errors[0] : `Erreurs : ${errors.join('; ')}`;
    setError(errorMsg);
    announceStatus(errorMsg, 'error');
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
    announceStatus('Historique d\'importation effacé', 'info');
  };

  const removeFile = (index: number, fileName: string) => {
    setImportedFiles(prev => prev.filter((_, i) => i !== index));
    announceStatus(`Le fichier "${fileName}" a été retiré de l'historique`, 'info');
  };

  return (
    <section
      style={containerStyle}
      role="region"
      aria-label="Importation de fichiers Markdown"
    >
      {/* Screen reader status announcements */}
      <div
        ref={statusRef}
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
        aria-live="polite"
        aria-atomic="true"
      />

      <header style={headerStyle}>
        <h2 style={titleStyle}>
          <DocumentArrowDownIcon style={{ width: '24px', height: '24px' }} aria-hidden="true" />
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
            aria-label={`Effacer l'historique de ${importedFiles.length} fichier(s) importé(s)`}
            title="Supprimer tous les fichiers de l'historique d'importation"
          >
            Effacer l'historique
          </button>
        )}
      </header>

      {/* Drop Zone */}
      <div
        style={dropZoneStyle}
        role="button"
        tabIndex={0}
        aria-label={
          isDragging
            ? 'Zone de dépôt activée - Relâchez pour importer les fichiers Markdown'
            : 'Zone de dépôt de fichiers Markdown - Glissez-déposez ou cliquez pour sélectionner'
        }
        aria-describedby="file-formats-help"
        aria-busy={isProcessing}
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
        <FolderOpenIcon style={iconStyle} aria-hidden="true" />
        <div style={textStyle}>
          {isDragging ? 'Déposez les fichiers ici' : 'Glissez-déposez vos fichiers Markdown'}
        </div>
        <div style={subTextStyle}>
          ou cliquez pour parcourir vos fichiers
        </div>
        <div style={buttonStyle}>
          <DocumentArrowDownIcon style={{ width: '16px', height: '16px' }} aria-hidden="true" />
          Choisir un fichier
        </div>
        <div
          id="file-formats-help"
          style={{
            fontSize: '11px',
            color: isDarkMode ? '#6b7280' : '#9ca3af',
            marginTop: '8px'
          }}
        >
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
        aria-label="Sélectionner des fichiers Markdown à importer"
        title="Sélectionner un ou plusieurs fichiers Markdown"
      />

      {/* Success Message */}
      {successMessage && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            backgroundColor: isDarkMode ? '#14532d' : '#f0fdf4',
            border: `1px solid ${isDarkMode ? '#166534' : '#bbf7d0'}`,
            borderRadius: '8px',
            color: isDarkMode ? '#86efac' : '#16a34a',
            marginBottom: '16px'
          }}
        >
          <CheckCircleIcon style={{ width: '16px', height: '16px' }} aria-hidden="true" />
          <span style={{ fontSize: '14px' }}>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              marginLeft: 'auto',
              color: isDarkMode ? '#86efac' : '#16a34a'
            }}
            aria-label="Fermer le message de succès"
            title="Masquer ce message"
          >
            <XMarkIcon style={{ width: '14px', height: '14px' }} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            backgroundColor: isDarkMode ? '#7f1d1d' : '#fef2f2',
            border: `1px solid ${isDarkMode ? '#991b1b' : '#fecaca'}`,
            borderRadius: '8px',
            color: isDarkMode ? '#fca5a5' : '#dc2626',
            marginBottom: '16px'
          }}
        >
          <ExclamationTriangleIcon style={{ width: '16px', height: '16px' }} aria-hidden="true" />
          <span style={{ fontSize: '14px' }}>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              marginLeft: 'auto',
              color: isDarkMode ? '#fca5a5' : '#dc2626'
            }}
            aria-label="Fermer le message d'erreur"
            title="Masquer ce message"
          >
            <XMarkIcon style={{ width: '14px', height: '14px' }} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div
          role="status"
          aria-live="polite"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            backgroundColor: isDarkMode ? '#1e3a8a' : '#eff6ff',
            border: `1px solid ${isDarkMode ? '#1e40af' : '#bfdbfe'}`,
            borderRadius: '8px',
            color: isDarkMode ? '#93c5fd' : '#1d4ed8',
            marginBottom: '16px'
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid currentColor',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
            aria-hidden="true"
          />
          <span style={{ fontSize: '14px' }}>
            Traitement des fichiers en cours...
          </span>
        </div>
      )}
      {/* Imported Files List */}
      {importedFiles.length > 0 && (
        <section
          aria-label={`Liste des ${importedFiles.length} fichiers importés`}
        >
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: isDarkMode ? '#f1f5f9' : '#1e293b'
          }}>
            Fichiers récemment importés ({importedFiles.length})
          </h3>
          <ul
            style={{
              ...fileListStyle,
              listStyle: 'none',
              margin: 0,
              padding: 0,
              role: 'list',
              'aria-label': 'Historique des fichiers importés'
            }}
          >
            {importedFiles.map((file, index) => (
              <li
                key={index}
                style={fileItemStyle}
                role="listitem"
                aria-label={`Fichier : ${file.name}, ${formatFileSize(file.size)}, importé le ${formatDate(file.importedAt)}`}
              >
                <div style={fileItemLeftStyle}>
                  <DocumentArrowDownIcon style={fileIconStyle} aria-hidden="true" />
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
                  <CheckCircleIcon
                    style={{
                      width: '16px',
                      height: '16px',
                      color: '#10b981'
                    }}
                    aria-hidden="true"
                    title="Fichier importé avec succès"
                  />
                  <button
                    onClick={() => removeFile(index, file.name)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: isDarkMode ? '#6b7280' : '#9ca3af',
                      borderRadius: '4px'
                    }}
                    aria-label={`Supprimer "${file.name}" de l'historique`}
                    title={`Retirer "${file.name}" de l'historique d'importation`}
                  >
                    <XMarkIcon style={{ width: '14px', height: '14px' }} aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Instructions */}
      <section
        style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
          borderRadius: '8px',
          border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
        }}
        aria-label="Instructions et conseils d'utilisation"
      >
        <h4 style={{
          margin: '0 0 8px 0',
          fontSize: '13px',
          fontWeight: '600',
          color: isDarkMode ? '#f1f5f9' : '#1e293b'
        }}>
          💡 Conseils d'utilisation
        </h4>
        <ul style={{
          margin: 0,
          paddingLeft: '16px',
          fontSize: '12px',
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          lineHeight: '1.4'
        }}>
          <li>
            Supporte les fichiers .md et .markdown avec encodage UTF-8
          </li>
          <li>
            Les sauts de page peuvent être ajoutés avec{' '}
            <code
              style={{
                backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                padding: '2px 4px',
                borderRadius: '3px',
                fontSize: '11px'
              }}
              aria-label="Code pour insérer un saut de page"
            >
              &lt;!-- pagebreak --&gt;
            </code>
          </li>
          <li>
            L'historique conserve les 10 derniers fichiers importés
          </li>
          <li>
            Les fichiers volumineux (&gt;5MB) seront rejetés pour des raisons de performance
          </li>
        </ul>
      </section>
    </section>
  );
};

export default FileImport;
