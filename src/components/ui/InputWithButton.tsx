import React from 'react';

interface InputWithButtonProps {
  value: string;
  onChange: (value: string) => void;
  onButtonClick: () => void;
  placeholder?: string;
  buttonText?: string;
  disabled?: boolean;
}

const InputWithButton: React.FC<InputWithButtonProps> = ({
  value,
  onChange,
  onButtonClick,
  placeholder = "Entrez votre titre",
  buttonText = "Continuer",
  disabled = false
}) => {
  const containerStyle = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto'
  };

  const inputStyle = {
    flex: 1,
    padding: '14px 20px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    backgroundColor: '#ffffff',
    color: '#1a202c',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
  };

  const buttonStyle = {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    opacity: disabled ? 0.6 : 1,
    minWidth: '120px'
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#667eea';
    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#e2e8f0';
    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.06)';
  };

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
    }
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
    }
  };

  return (
    <div style={containerStyle}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        style={inputStyle}
        disabled={disabled}
      />
      <button
        onClick={onButtonClick}
        onMouseEnter={handleButtonHover}
        onMouseLeave={handleButtonLeave}
        style={buttonStyle}
        disabled={disabled}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default InputWithButton;