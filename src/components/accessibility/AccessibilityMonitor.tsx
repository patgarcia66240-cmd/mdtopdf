import React, { useState, useEffect, useCallback } from 'react';
import AccessibilityAuditor from '../../utils/accessibility/AccessibilityAuditor';
import { AccessibilityAuditResult, AccessibilityViolation } from '../../utils/accessibility/AccessibilityAuditor';
import { ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface AccessibilityMonitorProps {
  isDarkMode: boolean;
  onAuditComplete?: (results: AccessibilityAuditResult) => void;
  className?: string;
}

const AccessibilityMonitor: React.FC<AccessibilityMonitorProps> = ({
  isDarkMode,
  onAuditComplete,
  className = ''
}) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [lastResults, setLastResults] = useState<AccessibilityAuditResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<AccessibilityViolation | null>(null);
  const [auditor] = useState(() => AccessibilityAuditor.getInstance());

  const containerStyle = {
    position: 'fixed' as const,
    bottom: '20px',
    right: '20px',
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    maxWidth: '400px',
    maxHeight: '80vh',
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

  const scoreContainerStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px'
  };

  const scoreItemStyle = (severity: string) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: getScoreBackgroundColor(severity, isDarkMode),
    minWidth: '60px'
  });

  const scoreNumberStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: getScoreColor(severity)
  };

  const scoreLabelStyle = {
    fontSize: '10px',
    color: isDarkMode ? '#94a3b8' : '#64748b',
    textTransform: 'uppercase' as const,
    marginTop: '2px'
  };

  const auditButtonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: isDarkMode ? '#3b82f6' : '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: isAuditing ? 'not-allowed' : 'pointer',
    opacity: isAuditing ? 0.6 : 1,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const violationListStyle = {
    maxHeight: '200px',
    overflow: 'auto',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '8px',
    padding: '8px'
  };

  const violationItemStyle = (impact: string) => ({
    padding: '8px',
    margin: '4px 0',
    borderRadius: '6px',
    backgroundColor: getViolationBackgroundColor(impact, isDarkMode),
    borderLeft: `4px solid ${getViolationBorderColor(impact)}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  const runAudit = useCallback(async () => {
    if (isAuditing) return;

    setIsAuditing(true);
    try {
      const results = await auditor.auditAccessibility();
      setLastResults(results);
      setShowDetails(true);
      onAuditComplete?.(results);
    } catch (error) {
      console.error('Audit failed:', error);
    } finally {
      setIsAuditing(false);
    }
  }, [isAuditing, auditor, onAuditComplete]);

  // Auto-audit au montage
  useEffect(() => {
    const timer = setTimeout(() => {
      runAudit();
    }, 2000); // Attendre 2s que le composant soit monté

    return () => clearTimeout(timer);
  }, [runAudit]);

  const getScoreColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'serious': return '#ea580c';
      case 'moderate': return '#f59e0b';
      case 'minor': return '#65a30d';
      default: return '#10b981';
    }
  };

  const getScoreBackgroundColor = (severity: string, isDark: boolean): string => {
    switch (severity) {
      case 'critical': return isDark ? '#7f1d1d' : '#fef2f2';
      case 'serious': return isDark ? '#431407' : '#fff7ed';
      case 'moderate': return isDark ? '#451a03' : '#fffbeb';
      case 'minor': return isDark ? '#1a2e05' : '#f7fee7';
      default: return isDark ? '#064e3b' : '#ecfdf5';
    }
  };

  const getViolationBorderColor = (impact: string): string => {
    switch (impact) {
      case 'critical': return '#dc2626';
      case 'serious': return '#ea580c';
      case 'moderate': return '#f59e0b';
      case 'minor': return '#65a30d';
      default: return '#10b981';
    }
  };

  const getViolationBackgroundColor = (impact: string, isDark: boolean): string => {
    switch (impact) {
      case 'critical': return isDark ? '#991b1b' : '#fee2e2';
      case 'serious': return isDark ? '#7c2d12' : '#fed7aa';
      case 'moderate': return isDark ? '#78350f' : '#fef3c7';
      case 'minor': return isDark ? '#365314' : '#ecfccb';
      default: return isDark ? '#065f46' : '#d1fae5';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'critical':
      case 'serious':
        return <ExclamationTriangleIcon style={{ width: '16px', height: '16px', color: getScoreColor(impact) }} />;
      case 'moderate':
        return <InformationCircleIcon style={{ width: '16px', height: '16px', color: getScoreColor(impact) }} />;
      case 'minor':
        return <CheckCircleIcon style={{ width: '16px', height: '16px', color: getScoreColor(impact) }} />;
      default:
        return null;
    }
  };

  if (!lastResults && !isAuditing) {
    return (
      <div style={containerStyle} className={className}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>
            <ExclamationTriangleIcon style={{ width: '20px', height: '20px' }} />
            Audit Accessibilité
          </h3>
        </div>
        <button
          style={auditButtonStyle}
          onClick={runAudit}
        >
          Lancer l'audit WCAG 2.1 AA
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle} className={className}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>
          {lastResults?.score.totalViolations === 0 ? (
            <CheckCircleIcon style={{ width: '20px', height: '20px', color: '#10b981' }} />
          ) : (
            <ExclamationTriangleIcon style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
          )}
          Audit WCAG 2.1 AA
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isDarkMode ? '#94a3b8' : '#64748b'
          }}
        >
          {showDetails ? '−' : '+'}
        </button>
      </div>

      {lastResults && (
        <>
          <div style={scoreContainerStyle}>
            <div style={scoreItemStyle('critical')}>
              <span style={scoreNumberStyle}>{lastResults.score.criticalViolations}</span>
              <span style={scoreLabelStyle}>Critiques</span>
            </div>
            <div style={scoreItemStyle('serious')}>
              <span style={scoreNumberStyle}>{lastResults.score.seriousViolations}</span>
              <span style={scoreLabelStyle}>Sérieux</span>
            </div>
            <div style={scoreItemStyle('moderate')}>
              <span style={scoreNumberStyle}>{lastResults.score.moderateViolations}</span>
              <span style={scoreLabelStyle}>Modérés</span>
            </div>
            <div style={scoreItemStyle('minor')}>
              <span style={scoreNumberStyle}>{lastResults.score.minorViolations}</span>
              <span style={scoreLabelStyle}>Mineurs</span>
            </div>
          </div>

          {showDetails && lastResults.violations.length > 0 && (
            <div style={violationListStyle}>
              {lastResults.violations.map((violation, index) => (
                <div
                  key={index}
                  style={violationItemStyle(violation.impact)}
                  onClick={() => setSelectedViolation(violation)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getImpactIcon(violation.impact)}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: isDarkMode ? '#f1f5f9' : '#1e293b'
                      }}>
                        {violation.description}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: isDarkMode ? '#94a3b8' : '#64748b',
                        marginTop: '2px'
                      }}>
                        {violation.nodes.length} élément(s) affecté(s)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            style={auditButtonStyle}
            onClick={runAudit}
            disabled={isAuditing}
          >
            {isAuditing ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Audit en cours...
              </>
            ) : (
              'Relancer l\'audit'
            )}
          </button>
        </>
      )}

      {selectedViolation && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          zIndex: 2000,
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: isDarkMode ? '#f1f5f9' : '#1e293b'
            }}>
              Détails de la violation
            </h4>
            <button
              onClick={() => setSelectedViolation(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isDarkMode ? '#94a3b8' : '#64748b'
              }}
            >
              <XMarkIcon style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <strong>Impact:</strong> {selectedViolation.impact}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <strong>Description:</strong> {selectedViolation.description}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <strong>Aide:</strong> {selectedViolation.help}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <strong>Éléments affectés:</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              {selectedViolation.nodes.map((node, index) => (
                <li key={index} style={{
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  marginBottom: '4px'
                }}>
                  {node.html.substring(0, 100)}...
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <a
              href={selectedViolation.helpUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#3b82f6',
                textDecoration: 'underline'
              }}
            >
              En savoir plus →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityMonitor;