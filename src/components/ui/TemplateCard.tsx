import React from 'react';

interface TemplateCardProps {
  title: string;
  description: string;
  previewColors: string[];
  isPro?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onCustomize?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  title,
  description,
  previewColors,
  isPro = false,
  isSelected = false,
  onSelect,
  onCustomize
}) => {
  const cardStyle = {
    backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
    border: isSelected ? '2px solid #6b7280' : '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: isSelected ? '0 4px 20px rgba(107, 114, 128, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
    position: 'relative' as const
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const badgeStyle = {
    backgroundColor: isPro ? '#fbbf24' : '#10b981',
    color: '#ffffff',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  };

  const previewStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px'
  };

  const colorBlockStyle = (color: string, isFirst: boolean) => ({
    height: '120px',
    borderRadius: isFirst ? '8px 0 0 8px' : '0 8px 8px 0',
    backgroundColor: color,
    flex: 1,
    position: 'relative' as const,
    overflow: 'hidden'
  });

  const textStyle = {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '20px'
  };

  const customizeButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#ffffff',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  const handleCustomizeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCustomize) {
      onCustomize();
    }
  };

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = isSelected ? '0 6px 25px rgba(107, 114, 128, 0.2)' : '0 4px 16px rgba(0, 0, 0, 0.1)';
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = isSelected ? '0 4px 20px rgba(107, 114, 128, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.06)';
  };

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    e.currentTarget.style.borderColor = '#6b7280';
    e.currentTarget.style.color = '#ffffff';
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#ffffff';
    e.currentTarget.style.borderColor = '#e2e8f0';
    e.currentTarget.style.color = '#475569';
  };

  return (
    <div
      style={cardStyle}
      onClick={handleCardClick}
      onMouseEnter={handleCardHover}
      onMouseLeave={handleCardLeave}
    >
      <div style={headerStyle}>
        <h3 style={titleStyle}>
          {isPro && <span style={{ color: '#fbbf24' }}>⭐</span>}
          {title}
        </h3>
        <span style={badgeStyle}>
          {isPro ? 'Pro' : 'Free'}
        </span>
      </div>

      <div style={previewStyle}>
        {previewColors.map((color, index) => (
          <div key={index} style={colorBlockStyle(color, index === 0)}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px'
            }} />
          </div>
        ))}
      </div>

      <p style={textStyle}>{description}</p>

      <button
        style={customizeButtonStyle}
        onClick={handleCustomizeClick}
        onMouseEnter={handleButtonHover}
        onMouseLeave={handleButtonLeave}
      >
        ⚙️ Personnaliser
      </button>
    </div>
  );
};

export default TemplateCard;