import React, { useState, useEffect, useCallback } from 'react';
import { DocumentArrowDownIcon, CheckCircleIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ExportProgress {
  id: string;
  fileName: string;
  format: 'pdf' | 'html' | 'docx' | 'md';
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number; // 0-100
  startTime: number;
  endTime?: number;
  error?: string;
  estimatedTime?: number; // en secondes
}

interface ExportProgressIndicatorProps {
  isDarkMode: boolean;
  exports: ExportProgress[];
  onExportCancel?: (exportId: string) => void;
  onExportRetry?: (exportId: string) => void;
  maxConcurrentExports?: number;
}

const ExportProgressIndicator: React.FC<ExportProgressIndicatorProps> = ({
  isDarkMode,
  exports,
  onExportCancel,
  onExportRetry,
  maxConcurrentExports = 3
}) => {
  const [expandedExports, setExpandedExports] = useState<Set<string>>(new Set());

  // Calculer les statistiques d'export
  const stats = {
    total: exports.length,
    pending: exports.filter(e => e.status === 'pending').length,
    processing: exports.filter(e => e.status === 'processing').length,
    completed: exports.filter(e => e.status === 'completed').length,
    error: exports.filter(e => e.status === 'error').length
  };

  // Formater le temps
  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    return `${Math.round(ms / 60000)}min`;
  };

  // Obtenir l'icône pour le statut
  const getStatusIcon = (status: string, progress: number) => {
    switch (status) {
      case 'processing':
        return (
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        );
      case 'completed':
        return <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981' }} />;
      case 'error':
        return <XMarkIcon style={{ width: '20px', height: '20px', color: '#ef4444' }} />;
      case 'pending':
        return <ClockIcon style={{ width: '20px', height: '20px', color: '#9ca3af' }} />;
      default:
        return null;
    }
  };

  // Obtenir la couleur de statut
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'processing': return isDarkMode ? '#60a5fa' : '#3b82f6';
      case 'completed': return '#10b981';
      case 'error': return '#ef4444';
      case 'pending': return isDarkMode ? '#9ca3af' : '#6b7280';
      default: return isDarkMode ? '#6b7280' : '#4b5563';
    }
  };

  // Calculer le temps estimé restant
  const calculateEstimatedTime = useCallback((exportItem: ExportProgress): number => {
    if (exportItem.progress === 0) return 0;

    const elapsed = Date.now() - exportItem.startTime;
    const rate = exportItem.progress / elapsed;
    const remaining = (100 - exportItem.progress) / rate;

    return Math.round(remaining / 1000); // en secondes
  }, []);

  // Basculer l'expansion d'un export
  const toggleExportExpansion = (exportId: string) => {
    const newExpanded = new Set(expandedExports);
    if (newExpanded.has(exportId)) {
      newExpanded.delete(exportId);
    } else {
      newExpanded.add(exportId);
    }
    setExpandedExports(newExpanded);
  };

  // Styles
  const containerStyle = {
    position: 'fixed' as const,
    bottom: '20px',
    left: '20px',
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    maxWidth: '400px',
    maxHeight: '60vh',
    overflow: 'auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const statsStyle = {
    display: 'flex',
    gap: '8px',
    fontSize: '12px',
    color: isDarkMode ? '#94a3b8' : '#64748b'
  };

  const exportItemStyle = (status: string, isExpanded: boolean) => ({
    padding: '12px',
    margin: '8px 0',
    borderRadius: '8px',
    backgroundColor: status === 'error'
      ? (isDarkMode ? '#7f1d1d' : '#fef2f2')
      : (isDarkMode ? '#334155' : '#f8fafc'),
    border: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  const progressStyle = {
    width: '100%',
    height: '4px',
    backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
    borderRadius: '2px',
    overflow: 'hidden',
    margin: '8px 0'
  };

  const progressBarStyle = (status: string) => ({
    height: '100%',
    backgroundColor: status === 'error' ? '#ef4444' : '#10b981',
    transition: 'width 0.3s ease',
    borderRadius: '2px'
  });

  if (stats.total === 0) {
    return null;
  }

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={headerStyle}>
        <h3 style={titleStyle}>
          <DocumentArrowDownIcon style={{ width: '20px', height: '20px' }} />
          Exports en cours
        </h3>
        <div style={statsStyle}>
          {stats.processing > 0 && (
            <span style={{ color: '#3b82f6' }}>{stats.processing} en cours</span>
          )}
          {stats.completed > 0 && (
            <span style={{ color: '#10b981' }}>{stats.completed} terminés</span>
          )}
          {stats.error > 0 && (
            <span style={{ color: '#ef4444' }}>{stats.error} erreurs</span>
          )}
        </div>
      </div>

      <div style={{ maxHeight: '400px', overflow: 'auto' }}>
        {exports.map((exportItem) => {
          const isExpanded = expandedExports.has(exportItem.id);
          const estimatedTime = exportItem.status === 'processing'
            ? calculateEstimatedTime(exportItem)
            : exportItem.estimatedTime || 0;

          return (
            <div
              key={exportItem.id}
              style={exportItemStyle(exportItem.status, isExpanded)}
              onClick={() => toggleExportExpansion(exportItem.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {getStatusIcon(exportItem.status, exportItem.progress)}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: isDarkMode ? '#f1f5f9' : '#1e293b'
                    }}>
                      {exportItem.fileName}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: getStatusColor(exportItem.status),
                      fontWeight: '500',
                      textTransform: 'uppercase'
                    }}>
                      {exportItem.status}
                    </span>
                  </div>

                  <div style={{
                    fontSize: '12px',
                    color: isDarkMode ? '#94a3b8' : '#64748b',
                    marginBottom: '8px'
                  }}>
                    Format: {exportItem.format.toUpperCase()} • {formatTime(Date.now() - exportItem.startTime)}
                    {estimatedTime > 0 && ` • Restant: ${estimatedTime}s`}
                  </div>

                  {(exportItem.status === 'processing' || exportItem.progress > 0) && (
                    <div style={progressStyle}>
                      <div style={{
                        ...progressBarStyle(exportItem.status),
                        width: `${exportItem.progress}%`
                      }} />
                    </div>
                  )}

                  {exportItem.status === 'error' && exportItem.error && (
                    <div style={{
                      fontSize: '12px',
                      color: '#ef4444',
                      marginTop: '8px',
                      padding: '8px',
                      backgroundColor: isDarkMode ? '#450a0a' : '#fef2f2',
                      borderRadius: '4px'
                    }}>
                      {exportItem.error}
                    </div>
                  )}

                  {isExpanded && exportItem.status === 'completed' && (
                    <div style={{
                      fontSize: '12px',
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                      marginTop: '8px',
                      paddingTop: '8px',
                      borderTop: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`
                    }}>
                      <div>Durée totale: {formatTime((exportItem.endTime || 0) - exportItem.startTime)}</div>
                      <div>Progression: {exportItem.progress}%</div>
                    </div>
                  )}
                </div>
              </div>

              {exportItem.status === 'processing' && onExportCancel && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExportCancel(exportItem.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isDarkMode ? '#f87171' : '#dc2626',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px'
                  }}
                  title="Annuler l'export"
                >
                  <XMarkIcon style={{ width: '16px', height: '16px' }} />
                </button>
              )}

              {exportItem.status === 'error' && onExportRetry && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExportRetry(exportItem.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#10b981',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px'
                  }}
                  title="Réessayer l'export"
                >
                  ↻
                </button>
              )}
            </div>
          );
        })}
      </div>

      {stats.processing >= maxConcurrentExports && (
        <div style={{
          fontSize: '12px',
          color: '#f59e0b',
          marginTop: '12px',
          padding: '8px',
          backgroundColor: isDarkMode ? '#451a03' : '#fef3c7',
          borderRadius: '6px'
        }}>
          Limite d'exports simultanés atteinte ({maxConcurrentExports}). Les exports en attente seront traités automatiquement.
        </div>
      )}
    </div>
  );
};

export default ExportProgressIndicator;