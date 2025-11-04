import React from 'react';
import { DocumentArrowDownIcon, DocumentTextIcon, ArrowUpTrayIcon, GlobeAltIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface ExportPanelProps {
  onExportPDF: () => void;
  onExportHTML: () => void;
  onExportMD: () => void;
  onExportDOCX: () => void;
  wordCount: number;
  charCount: number;
  lineCount: number;
  isDarkMode: boolean;
  isExporting: boolean;
}

const ExportPanel: React.FC<ExportPanelProps> = ({
  onExportPDF,
  onExportHTML,
  onExportMD,
  onExportDOCX,
  wordCount,
  charCount,
  lineCount,
  isDarkMode,
  isExporting
}) => {
  const panelStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
  };

  const titleStyle = {
    margin: '0 0 20px 0',
    fontSize: '18px',
    fontWeight: '700',
    color: isDarkMode ? '#f1f5f9' : '#1e293b'
  };

  const exportGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '24px'
  };

  const buttonStyle = (gradient: string, disabled: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px 20px',
    background: disabled ? '#6b7280' : gradient,
    border: 'none',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: disabled ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.1)',
    opacity: disabled ? 0.6 : 1
  });

  const statsContainerStyle = {
    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
    padding: '20px',
    borderRadius: '10px',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
  };

  const statsTitleStyle = {
    margin: '0 0 16px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px'
  };

  const statItemStyle = {
    textAlign: 'center' as const
  };

  const statNumberStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: '4px'
  };

  const statLabelStyle = {
    fontSize: '12px',
    color: isDarkMode ? '#94a3b8' : '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  };

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  };

  const exportOptions = [
    {
      icon: <DocumentArrowDownIcon style={{ width: '20px', height: '20px' }} />,
      label: 'Exporter en PDF (HD)',
      gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      onClick: onExportPDF
    },
    {
      icon: <GlobeAltIcon style={{ width: '20px', height: '20px' }} />,
      label: 'Exporter en HTML',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      onClick: onExportHTML
    },
    {
      icon: <DocumentTextIcon style={{ width: '20px', height: '20px' }} />,
      label: 'Exporter en Markdown (.md)',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      onClick: onExportMD
    },
    {
      icon: <ArrowUpTrayIcon style={{ width: '20px', height: '20px' }} />,
      label: 'Exporter en Word (DOCX)',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      onClick: onExportDOCX
    }
  ];

  return (
    <div style={panelStyle}>
      <h3 style={titleStyle}>Export Multi-Formats</h3>

      <div style={exportGridStyle}>
        {exportOptions.map((option, index) => (
          <button
            key={index}
            onClick={option.onClick}
            disabled={isExporting}
            style={buttonStyle(option.gradient, isExporting)}
            onMouseEnter={isExporting ? undefined : handleButtonHover}
            onMouseLeave={isExporting ? undefined : handleButtonLeave}
          >
            {option.icon}
            {isExporting ? 'Exportation en cours...' : option.label}
          </button>
        ))}
      </div>

      <div style={statsContainerStyle}>
        <h4 style={statsTitleStyle}>
          <ChartBarIcon style={{ width: '18px', height: '18px' }} />
          Statistiques du document
        </h4>

        <div style={statsGridStyle}>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>{wordCount}</div>
            <div style={statLabelStyle}>Mots</div>
          </div>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>{charCount}</div>
            <div style={statLabelStyle}>Caractères</div>
          </div>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>{lineCount}</div>
            <div style={statLabelStyle}>Lignes</div>
          </div>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>{Math.ceil(wordCount / 200)}</div>
            <div style={statLabelStyle}>Pages ~</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
