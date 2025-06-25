import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Construir clases del div contenedor
  const containerClasses = className ? className : '';
  
  // Construir clases del input
  let inputClasses = 'input';
  if (error) {
    inputClasses += ' border-red';
  }
  
  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={inputClasses}
        {...props}
      />
      {error && <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  );
};

export default Input;
