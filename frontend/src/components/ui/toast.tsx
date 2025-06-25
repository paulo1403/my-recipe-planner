import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';
import { Button } from './button';

export interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose, duration]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = () => {
    const iconProps = { className: 'w-5 h-5 flex-shrink-0' };
    
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className="w-5 h-5 flex-shrink-0 text-green-500" />;
      case 'error':
        return <XCircle {...iconProps} className="w-5 h-5 flex-shrink-0 text-red-500" />;
      case 'warning':
        return <AlertCircle {...iconProps} className="w-5 h-5 flex-shrink-0 text-yellow-500" />;
      default:
        return <Info {...iconProps} className="w-5 h-5 flex-shrink-0 text-blue-500" />;
    }
  };

  return (
    <div className={`rounded-lg border p-4 shadow-lg max-w-sm w-full ${getToastStyles()}`}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-medium">
              {title}
            </p>
          )}
          <p className={`text-sm ${title ? 'mt-1' : ''}`}>
            {message}
          </p>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Toast;
