import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({
  className = '',
  type = 'text',
  error = false,
  label = '',
  helperText = '',
  errorMessage = '',
  icon = null,
  iconPosition = 'left',
  ...props
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';
  
  const inputClasses = cn(
    baseClasses,
    error
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
    icon && iconPosition === 'left' ? 'pl-10' : '',
    icon && iconPosition === 'right' ? 'pr-10' : '',
    className
  );

  const iconClasses = cn(
    'w-5 h-5 absolute top-1/2 transform -translate-y-1/2',
    iconPosition === 'left' ? 'left-3' : 'right-3',
    error ? 'text-red-400' : 'text-gray-400'
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className={iconClasses}>
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className={iconClasses}>
            {icon}
          </div>
        )}
      </div>
      
      {error && errorMessage && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}
      
      {!error && helperText && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
