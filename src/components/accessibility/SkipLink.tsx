import React from 'react';

interface SkipLinkProps {
  targetId: string;
  children: React.ReactNode;
  className?: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({
  targetId,
  children,
  className = ''
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={`skip-link ${className}`}
      style={{
        position: 'absolute',
        top: '-40px',
        left: '6px',
        background: '#000',
        color: '#fff',
        padding: '8px',
        textDecoration: 'none',
        borderRadius: '4px',
        zIndex: '10000',
        fontSize: '14px',
        transition: 'top 0.3s ease'
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '6px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-40px';
      }}
    >
      {children}
    </a>
  );
};

export default SkipLink;