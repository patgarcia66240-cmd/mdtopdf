import React, { useState, useEffect } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  lineCount: number;
  fps: number;
}

interface PerformanceMonitorProps {
  lineCount: number;
  isDarkMode: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  lineCount,
  isDarkMode
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    lineCount: 0,
    fps: 60
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const calculateFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

        setMetrics(prev => ({
          ...prev,
          fps,
          lineCount,
          memoryUsage: (performance as any).memory?.usedJSHeapSize
        }));

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(calculateFPS);
    };

    const startTime = performance.now();
    const animationFrame = requestAnimationFrame(calculateFPS);

    const renderTime = performance.now() - startTime;
    setMetrics(prev => ({ ...prev, renderTime }));

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [lineCount]);

  const formatMemory = (bytes?: number) => {
    if (!bytes) return 'N/A';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  const getStatusColor = (fps: number) => {
    if (fps >= 50) return '#10b981'; // green
    if (fps >= 30) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        padding: '12px',
        backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6',
        border: '1px solid ' + (isDarkMode ? '#374151' : '#d1d5db'),
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 1000,
        minWidth: '200px'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: isDarkMode ? '#e5e7eb' : '#1f2937' }}>
        Performance Monitor
      </div>

      <div style={{ marginBottom: '4px', color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
        Lines: <span style={{ color: isDarkMode ? '#e5e7eb' : '#1f2937' }}>{metrics.lineCount}</span>
      </div>

      <div style={{ marginBottom: '4px', color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
        FPS: <span style={{ color: getStatusColor(metrics.fps) }}>{metrics.fps}</span>
      </div>

      <div style={{ marginBottom: '4px', color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
        Memory: <span style={{ color: isDarkMode ? '#e5e7eb' : '#1f2937' }}>{formatMemory(metrics.memoryUsage)}</span>
      </div>

      <div style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
        Render: <span style={{ color: isDarkMode ? '#e5e7eb' : '#1f2937' }}>{metrics.renderTime.toFixed(2)}ms</span>
      </div>
    </div>
  );
};

export default PerformanceMonitor;