import React, { useState, useEffect } from 'react';

interface PerformanceMetrics {
  avgRenderTime: string;
  maxRenderTime: string;
  minRenderTime: string;
  totalMeasurements: number;
  memoryUsage?: {
    used: number;
    total: number;
    limit: number;
  } | null;
}

interface LatencyMetrics {
  action: string;
  latency: number;
  timestamp: number;
}

interface PerformanceMonitorProps {
  performanceStats: PerformanceMetrics | null;
  latencies: LatencyMetrics[];
  isPerformanceIssue: boolean;
  isDarkMode: boolean;
  onClearMetrics?: () => void;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  performanceStats,
  latencies,
  isPerformanceIssue,
  isDarkMode,
  onClearMetrics
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'render' | 'latency'>('render');

  // Formatage des bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Calculer les statistiques de latence
  const getLatencyStats = () => {
    if (latencies.length === 0) return null;

    const latencyValues = latencies.map(l => l.latency);
    const avgLatency = latencyValues.reduce((a, b) => a + b, 0) / latencyValues.length;
    const maxLatency = Math.max(...latencyValues);
    const minLatency = Math.min(...latencyValues);

    // Grouper par action
    const byAction = latencies.reduce((acc, curr) => {
      if (!acc[curr.action]) {
        acc[curr.action] = [];
      }
      acc[curr.action].push(curr.latency);
      return acc;
    }, {} as Record<string, number[]>);

    const avgByAction = Object.entries(byAction).map(([action, values]) => ({
      action,
      avgLatency: values.reduce((a, b) => a + b, 0) / values.length,
      count: values.length
    }));

    return {
      avgLatency: avgLatency.toFixed(2),
      maxLatency: maxLatency.toFixed(2),
      minLatency: minLatency.toFixed(2),
      totalMeasurements: latencies.length,
      avgByAction
    };
  };

  const latencyStats = getLatencyStats();

  const containerStyle = {
    position: 'fixed' as const,
    top: isVisible ? '20px' : '-400px',
    right: '20px',
    width: '350px',
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    transition: 'top 0.3s ease',
    fontSize: '12px',
    fontFamily: 'monospace'
  };

  const headerStyle = {
    padding: '12px',
    backgroundColor: isPerformanceIssue
      ? '#ef4444'
      : (isDarkMode ? '#374151' : '#f3f4f6'),
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer'
  };

  const contentStyle = {
    padding: '12px',
    maxHeight: '300px',
    overflowY: 'auto' as const
  };

  const tabButtonStyle = (isActive: boolean) => ({
    padding: '4px 8px',
    border: 'none',
    backgroundColor: isActive
      ? (isDarkMode ? '#3b82f6' : '#2563eb')
      : (isDarkMode ? '#374151' : '#f3f4f6'),
    color: isActive ? '#ffffff' : (isDarkMode ? '#f1f5f9' : '#1e293b'),
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    marginRight: '4px'
  });

  const metricStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0',
    borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
  };

  const toggleButtonStyle = {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: isPerformanceIssue ? '#ef4444' : (isDarkMode ? '#374151' : '#f3f4f6'),
    border: 'none',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    zIndex: 999,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      <button
        style={toggleButtonStyle}
        onClick={() => setIsVisible(!isVisible)}
        title={isVisible ? 'Masquer le moniteur' : 'Afficher le moniteur de performance'}
      >
        {isPerformanceIssue ? '⚠️' : '📊'}
      </button>

      <div style={containerStyle}>
        <div style={headerStyle} onClick={() => setIsVisible(!isVisible)}>
          <span style={{ fontWeight: 'bold' }}>
            {isPerformanceIssue ? '⚠️ Performance Alert' : '📊 Performance Monitor'}
          </span>
          <span style={{ fontSize: '10px' }}>
            {isVisible ? '▼' : '▶'}
          </span>
        </div>

        {isVisible && (
          <div style={contentStyle}>
            <div style={{ marginBottom: '12px' }}>
              <button style={tabButtonStyle(activeTab === 'render')} onClick={() => setActiveTab('render')}>
                Render
              </button>
              <button style={tabButtonStyle(activeTab === 'latency')} onClick={() => setActiveTab('latency')}>
                Latency
              </button>
              {onClearMetrics && (
                <button
                  style={{
                    ...tabButtonStyle(false),
                    backgroundColor: isDarkMode ? '#dc2626' : '#ef4444',
                    float: 'right'
                  }}
                  onClick={onClearMetrics}
                >
                  Clear
                </button>
              )}
            </div>

            {activeTab === 'render' && performanceStats && (
              <div>
                <div style={metricStyle}>
                  <span>Avg Render:</span>
                  <span style={{ color: parseFloat(performanceStats.avgRenderTime) > 50 ? '#ef4444' : 'inherit' }}>
                    {performanceStats.avgRenderTime}ms
                  </span>
                </div>
                <div style={metricStyle}>
                  <span>Max Render:</span>
                  <span>{performanceStats.maxRenderTime}ms</span>
                </div>
                <div style={metricStyle}>
                  <span>Min Render:</span>
                  <span>{performanceStats.minRenderTime}ms</span>
                </div>
                <div style={metricStyle}>
                  <span>Measurements:</span>
                  <span>{performanceStats.totalMeasurements}</span>
                </div>

                {performanceStats.memoryUsage && (
                  <>
                    <div style={metricStyle}>
                      <span>Memory Used:</span>
                      <span>{formatBytes(performanceStats.memoryUsage.used)}</span>
                    </div>
                    <div style={metricStyle}>
                      <span>Memory Total:</span>
                      <span>{formatBytes(performanceStats.memoryUsage.total)}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'latency' && latencyStats && (
              <div>
                <div style={metricStyle}>
                  <span>Avg Latency:</span>
                  <span style={{ color: parseFloat(latencyStats.avgLatency) > 100 ? '#ef4444' : 'inherit' }}>
                    {latencyStats.avgLatency}ms
                  </span>
                </div>
                <div style={metricStyle}>
                  <span>Max Latency:</span>
                  <span>{latencyStats.maxLatency}ms</span>
                </div>
                <div style={metricStyle}>
                  <span>Min Latency:</span>
                  <span>{latencyStats.minLatency}ms</span>
                </div>
                <div style={metricStyle}>
                  <span>Interactions:</span>
                  <span>{latencyStats.totalMeasurements}</span>
                </div>

                <div style={{ marginTop: '12px', borderTop: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, paddingTop: '8px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>By Action:</div>
                  {latencyStats.avgByAction.map(({ action, avgLatency, count }) => (
                    <div key={action} style={metricStyle}>
                      <span>{action}:</span>
                      <span>{avgLatency.toFixed(2)}ms ({count})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!performanceStats && activeTab === 'render' && (
              <div style={{ textAlign: 'center', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                No performance data available
              </div>
            )}

            {!latencyStats && activeTab === 'latency' && (
              <div style={{ textAlign: 'center', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                No latency data available
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PerformanceMonitor;