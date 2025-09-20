import React, { useEffect } from 'react';
import { cn } from '../../utils/cn';

const Modal = ({
  isOpen = false,
  onClose,
  children,
  className = '',
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  ...props
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      {...props}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in" />
      
      {/* Modal Content */}
      <div
        className={cn(
          'relative bg-white rounded-2xl shadow-2xl w-full animate-scale-in',
          sizes[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        
        {children}
      </div>
    </div>
  );
};

const ModalHeader = ({ children, className = '', ...props }) => (
  <div
    className={cn('px-6 py-4 border-b border-gray-200', className)}
    {...props}
  >
    {children}
  </div>
);

const ModalContent = ({ children, className = '', ...props }) => (
  <div
    className={cn('px-6 py-4', className)}
    {...props}
  >
    {children}
  </div>
);

const ModalFooter = ({ children, className = '', ...props }) => (
  <div
    className={cn('px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl', className)}
    {...props}
  >
    {children}
  </div>
);

export { Modal, ModalHeader, ModalContent, ModalFooter };
