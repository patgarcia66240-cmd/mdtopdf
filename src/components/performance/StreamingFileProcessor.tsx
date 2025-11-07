import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CloudArrowUpIcon, DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface StreamingFileProcessorProps {
  isDarkMode: boolean;
  onFileProcessed: (content: string, fileName: string) => void;
  maxFileSize?: number; // en octets
  chunkSize?: number; // en octets
}

interface ProcessingChunk {
  index: number;
  start: number;
  end: number;
  content: string;
  processed: boolean;
}

const StreamingFileProcessor: React.FC<StreamingFileProcessorProps> = ({
  isDarkMode,
  onFileProcessed,
  maxFileSize = 50 * 1024 * 1024, // 50MB par défaut
  chunkSize = 64 * 1024 // 64KB par défaut
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [processingSpeed, setProcessingSpeed] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const startTimeRef = useRef<number>(0);

  // Initialiser le Web Worker pour le traitement en arrière-plan
  useEffect(() => {
    if (typeof Worker !== 'undefined') {
      // Créer le worker inline
      const workerCode = `
        self.addEventListener('message', function(e) {
          const { type, data } = e.data;

          if (type === 'processChunk') {
            try {
              // Simulation de traitement de chunk
              const { chunk, index } = data;

              // Traitement simple - dans une vraie app, vous pourriez faire
              // de la validation, transformation, etc.
              const processedChunk = chunk;

              self.postMessage({
                type: 'chunkProcessed',
                data: {
                  index,
                  content: processedChunk,
                  processed: true
                }
              });
            } catch (error) {
              self.postMessage({
                type: 'chunkError',
                data: {
                  index,
                  error: error.message
                }
              });
            }
          }
        });
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      workerRef.current = new Worker(workerUrl);

      return () => {
        workerRef.current?.terminate();
        URL.revokeObjectURL(workerUrl);
      };
    }
  }, []);

  // Formater la taille du fichier
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Calculer la vitesse de traitement
  useEffect(() => {
    if (isProcessing && progress > 0 && startTimeRef.current > 0) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000; // secondes
      const speed = (progress / 100) * fileSize / elapsed; // octets/secondes
      setProcessingSpeed(speed);
    }
  }, [progress, isProcessing, fileSize]);

  // Traitement par streaming du fichier
  const processFileStreaming = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > maxFileSize) {
        reject(new Error(`Fichier trop volumineux. Maximum: ${formatFileSize(maxFileSize)}`));
        return;
      }

      setIsProcessing(true);
      setProgress(0);
      setError(null);
      setFileName(file.name);
      setFileSize(file.size);
      startTimeRef.current = Date.now();

      const chunks: ProcessingChunk[] = [];
      const totalChunks = Math.ceil(file.size / chunkSize);
      let processedChunks = 0;
      let finalContent = '';

      // Créer un FileReader pour lire le fichier par chunks
      const reader = new FileReader();

      reader.onload = (e) => {
        const chunk = e.target?.result as string;
        const chunkIndex = chunks.length;

        if (workerRef.current) {
          // Traiter le chunk dans le worker
          workerRef.current.postMessage({
            type: 'processChunk',
            data: { chunk, index: chunkIndex }
          });
        } else {
          // Fallback sans worker
          const processedChunk = chunk;
          chunks.push({
            index: chunkIndex,
            start: chunkIndex * chunkSize,
            end: Math.min((chunkIndex + 1) * chunkSize, file.size),
            content: processedChunk,
            processed: true
          });

          processedChunks++;
          setProgress((processedChunks / totalChunks) * 100);

          if (processedChunks === totalChunks) {
            // Trier les chunks par index et combiner
            chunks.sort((a, b) => a.index - b.index);
            finalContent = chunks.map(c => c.content).join('');
            setIsProcessing(false);
            resolve(finalContent);
          } else {
            // Lire le chunk suivant
            const nextStart = (chunkIndex + 1) * chunkSize;
            if (nextStart < file.size) {
              const nextBlob = file.slice(nextStart, Math.min(nextStart + chunkSize, file.size));
              reader.readAsText(nextBlob);
            }
          }
        }
      };

      reader.onerror = () => {
        reject(new Error('Erreur de lecture du fichier'));
        setIsProcessing(false);
      };

      // Gérer les messages du worker
      if (workerRef.current) {
        workerRef.current.onmessage = (e) => {
          const { type, data } = e.data;

          if (type === 'chunkProcessed') {
            chunks.push({
              ...data,
              start: data.index * chunkSize,
              end: Math.min((data.index + 1) * chunkSize, file.size)
            });

            processedChunks++;
            setProgress((processedChunks / totalChunks) * 100);

            if (processedChunks === totalChunks) {
              // Trier les chunks par index et combiner
              chunks.sort((a, b) => a.index - b.index);
              finalContent = chunks.map(c => c.content).join('');
              setIsProcessing(false);
              resolve(finalContent);
            } else {
              // Lire le chunk suivant
              const nextStart = processedChunks * chunkSize;
              if (nextStart < file.size) {
                const nextBlob = file.slice(nextStart, Math.min(nextStart + chunkSize, file.size));
                reader.readAsText(nextBlob);
              }
            }
          } else if (type === 'chunkError') {
            reject(new Error(`Erreur dans le chunk ${data.index}: ${data.error}`));
            setIsProcessing(false);
          }
        };

        workerRef.current.onerror = () => {
          reject(new Error('Erreur dans le Web Worker'));
          setIsProcessing(false);
        };
      }

      // Démarrer la lecture du premier chunk
      const firstChunk = file.slice(0, Math.min(chunkSize, file.size));
      reader.readAsText(firstChunk);
    });
  }, [maxFileSize, chunkSize]);

  // Gestionnaire de sélection de fichier
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await processFileStreaming(file);
      onFileProcessed(content, file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du traitement');
    }
  }, [processFileStreaming, onFileProcessed]);

  // Glisser-déposer
  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    try {
      const content = await processFileStreaming(file);
      onFileProcessed(content, file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du traitement');
    }
  }, [processFileStreaming, onFileProcessed]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  // Styles
  const containerStyle = {
    border: `2px dashed ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center' as const,
    backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative' as const
  };

  const containerHoverStyle = {
    ...containerStyle,
    borderColor: isDarkMode ? '#60a5fa' : '#3b82f6',
    backgroundColor: isDarkMode ? '#1e3a8a' : '#dbeafe'
  };

  const buttonStyle = {
    backgroundColor: isDarkMode ? '#3b82f6' : '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '0 auto 16px'
  };

  const progressStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    margin: '16px 0'
  };

  const progressBarStyle = {
    height: '100%',
    backgroundColor: '#10b981',
    transition: 'width 0.3s ease',
    borderRadius: '4px'
  };

  const infoStyle = {
    fontSize: '12px',
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    marginTop: '12px'
  };

  const errorStyle = {
    backgroundColor: isDarkMode ? '#7f1d1d' : '#fef2f2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '8px',
    marginTop: '12px',
    fontSize: '14px'
  };

  return (
    <div style={containerStyle}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        aria-label="Importer un fichier Markdown volumineux"
      />

      {!isProcessing && !error && (
        <>
          <CloudArrowUpIcon style={{ width: '48px', height: '48px', color: isDarkMode ? '#9ca3af' : '#6b7280', margin: '0 auto 16px' }} />

          <h3 style={{ margin: '0 0 16px', color: isDarkMode ? '#f3f4f6' : '#111827' }}>
            Importer un fichier volumineux
          </h3>

          <button
            style={buttonStyle}
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            <DocumentTextIcon style={{ width: '20px', height: '20px' }} />
            Choisir un fichier
          </button>

          <div style={infoStyle}>
            Supporte les fichiers jusqu'à {formatFileSize(maxFileSize)}<br />
            Format: .md, .markdown, .txt<br />
            Traitement par streaming pour optimiser la performance
          </div>
        </>
      )}

      {isProcessing && (
        <>
          <div style={{ fontSize: '16px', fontWeight: '500', color: isDarkMode ? '#f3f4f6' : '#111827', marginBottom: '16px' }}>
            Traitement de {fileName}...
          </div>

          <div style={progressStyle}>
            <div style={{ ...progressBarStyle, width: `${progress}%` }} />
          </div>

          <div style={infoStyle}>
            Progression: {Math.round(progress)}%<br />
            Taille: {formatFileSize(fileSize)}<br />
            Vitesse: {formatFileSize(processingSpeed)}/s
          </div>
        </>
      )}

      {error && (
        <div style={errorStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <XMarkIcon style={{ width: '20px', height: '20px' }} />
            <strong>Erreur de traitement</strong>
          </div>
          {error}
          <button
            onClick={() => {
              setError(null);
              setFileName('');
              setFileSize(0);
              setProgress(0);
            }}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Zone de glisser-déposer */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          opacity: 0,
          transition: 'opacity 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <CloudArrowUpIcon style={{ width: '48px', height: '48px', color: isDarkMode ? '#60a5fa' : '#3b82f6', margin: '0 auto 16px' }} />
          <div style={{ fontSize: '18px', fontWeight: '500', color: isDarkMode ? '#f3f4f6' : '#111827' }}>
            Glissez le fichier ici
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingFileProcessor;