import React from 'react';

interface LoadingSkeletonProps {
  isDarkMode: boolean;
  height?: string;
  width?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  isDarkMode,
  height = '1rem',
  width = '100%'
}) => {
  return (
    <div
      style={{
        height,
        width,
        backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderRadius: '4px',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
    />
  );
};

// Skeleton pour le TemplateSelectorEnhanced
export const TemplateSelectorSkeleton: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div style={{
      padding: '16px',
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderRadius: '12px',
      border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
    }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <LoadingSkeleton isDarkMode={isDarkMode} height="24px" width="200px" />
      </div>

      {/* Carousel de templates */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          overflow: 'hidden'
        }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              flex: '0 0 200px',
              height: '120px',
              backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
              borderRadius: '8px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }} />
          ))}
        </div>
      </div>

      {/* Filtres et contrôles */}
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <LoadingSkeleton isDarkMode={isDarkMode} height="36px" width="200px" />
        <LoadingSkeleton isDarkMode={isDarkMode} height="36px" width="100px" />
      </div>
    </div>
  );
};

// Skeleton pour AdvancedExportPanel
export const AdvancedExportSkeleton: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
      }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <LoadingSkeleton isDarkMode={isDarkMode} height="28px" width="250px" />
          <LoadingSkeleton isDarkMode={isDarkMode} height="16px" width="400px" style={{ marginTop: '8px' }} />
        </div>

        {/* Options d'export */}
        <div style={{ marginBottom: '20px' }}>
          <LoadingSkeleton isDarkMode={isDarkMode} height="20px" width="150px" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginTop: '12px'
          }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                padding: '16px',
                backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                borderRadius: '8px',
                border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
              }}>
                <LoadingSkeleton isDarkMode={isDarkMode} height="16px" width="120px" />
                <LoadingSkeleton isDarkMode={isDarkMode} height="14px" width="80px" style={{ marginTop: '8px' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Boutons d'action */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <LoadingSkeleton isDarkMode={isDarkMode} height="40px" width="100px" />
          <LoadingSkeleton isDarkMode={isDarkMode} height="40px" width="120px" />
        </div>
      </div>
    </div>
  );
};

// Skeleton pour PDFPreview
export const PDFPreviewSkeleton: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div style={{
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      borderRadius: '12px',
      border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
      overflow: 'hidden',
      height: '100%',
      minHeight: '600px'
    }}>
      {/* Header de l'aperçu */}
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <LoadingSkeleton isDarkMode={isDarkMode} height="20px" width="150px" />
          <div style={{ display: 'flex', gap: '8px' }}>
            <LoadingSkeleton isDarkMode={isDarkMode} height="32px" width="80px" />
            <LoadingSkeleton isDarkMode={isDarkMode} height="32px" width="80px" />
          </div>
        </div>
      </div>

      {/* Contenu du document */}
      <div style={{
        padding: '40px',
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
        minHeight: '500px'
      }}>
        {/* Simulation de contenu de document */}
        <div style={{ marginBottom: '20px' }}>
          <LoadingSkeleton isDarkMode={isDarkMode} height="28px" width="300px" />
          <LoadingSkeleton isDarkMode={isDarkMode} height="16px" width="500px" style={{ marginTop: '8px' }} />
          <LoadingSkeleton isDarkMode={isDarkMode} height="16px" width="450px" style={{ marginTop: '4px' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <LoadingSkeleton isDarkMode={isDarkMode} height="20px" width="200px" />
          <LoadingSkeleton isDarkMode={isDarkMode} height="14px" width="100%" style={{ marginTop: '8px' }} />
          <LoadingSkeleton isDarkMode={isDarkMode} height="14px" width="100%" style={{ marginTop: '4px' }} />
          <LoadingSkeleton isDarkMode={isDarkMode} height="14px" width="80%" style={{ marginTop: '4px' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <LoadingSkeleton isDarkMode={isDarkMode} height="16px" width="100%" />
          <LoadingSkeleton isDarkMode={isDarkMode} height="16px" width="100%" style={{ marginTop: '4px' }} />
          <LoadingSkeleton isDarkMode={isDarkMode} height="16px" width="90%" style={{ marginTop: '4px' }} />
        </div>

        {/* Footer du document */}
        <div style={{
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
        }}>
          <LoadingSkeleton isDarkMode={isDarkMode} height="12px" width="150px" />
        </div>
      </div>

      {/* Contrôles de pagination */}
      <div style={{
        padding: '12px 16px',
        borderTop: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <LoadingSkeleton isDarkMode={isDarkMode} height="28px" width="120px" />
        <LoadingSkeleton isDarkMode={isDarkMode} height="28px" width="80px" />
      </div>
    </div>
  );
};

// Skeleton générique pour les contenus chargés
export const ContentLoadingSkeleton: React.FC<{
  isDarkMode: boolean;
  lines?: number;
  height?: string;
}> = ({ isDarkMode, lines = 3, height = '1rem' }) => {
  return (
    <div style={{ width: '100%' }}>
      {Array.from({ length: lines }).map((_, index) => (
        <LoadingSkeleton
          key={index}
          isDarkMode={isDarkMode}
          height={height}
          width={index === lines - 1 ? '70%' : '100%'}
          style={{ marginBottom: index < lines - 1 ? '8px' : '0' }}
        />
      ))}
    </div>
  );
};

// Ajout des styles d'animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `;
  document.head.appendChild(style);
}

export default LoadingSkeleton;