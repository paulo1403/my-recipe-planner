import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  type = 'button'
}) => {
  // Construir nombre de clase
  const buttonClasses = ['btn'];
  
  // Añadir clase de variante
  if (variant) {
    buttonClasses.push(`btn-${variant}`);
  }
  
  // Añadir clase de tamaño
  if (size === 'sm') {
    buttonClasses.push('text-sm');
  } else if (size === 'lg') {
    buttonClasses.push('text-lg');
  }
  
  // Añadir clase para botón deshabilitado
  if (disabled) {
    buttonClasses.push('opacity-50 cursor-not-allowed');
  }
  
  // Añadir clases personalizadas
  if (className) {
    buttonClasses.push(className);
  }
  
  return (
    <button
      type={type}
      className={buttonClasses.join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
