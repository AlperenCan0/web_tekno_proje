import React, { forwardRef, useState } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  as?: 'input' | 'textarea';
  rows?: number;
  labelColor?: 'light' | 'dark'; // light: beyaz arka plan için (text-gray-700), dark: koyu arka plan için (text-white)
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = '',
      id,
      as = 'input',
      rows,
      type,
      labelColor = 'light',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const isPassword = type === 'password';

    const baseStyles = 'w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200';
    const normalStyles = 'border-gray-300 focus:ring-primary-500';
    const errorStyles = 'border-red-500 focus:ring-red-500';
    const inputStyles = hasError ? errorStyles : normalStyles;

    const paddingLeft = leftIcon ? 'pl-10' : '';
    const paddingRight = rightIcon || hasError || isPassword ? 'pr-10' : '';

    // Password toggle için gerçek input type
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-medium mb-2 ${
              labelColor === 'dark' ? 'text-white' : 'text-gray-700'
            }`}
          >
            {label}
            {props.required && (
              <span className={`ml-1 ${
                labelColor === 'dark' ? 'text-red-300' : 'text-red-500'
              }`}>*</span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          {as === 'textarea' ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              id={inputId}
              rows={rows || 4}
              className={`${baseStyles} ${inputStyles} ${paddingLeft} ${paddingRight} ${className} resize-none`}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              id={inputId}
              type={inputType}
              className={`${baseStyles} ${inputStyles} ${paddingLeft} ${paddingRight} ${className}`}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}

          {/* Password visibility toggle */}
          {isPassword && !hasError && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}

          {hasError && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}

          {rightIcon && !hasError && !isPassword && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className={`mt-1 text-sm flex items-center gap-1 ${
              labelColor === 'dark' ? 'text-red-200' : 'text-red-600'
            }`}
            role="alert"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className={`mt-1 text-sm ${
              labelColor === 'dark' ? 'text-amber-200' : 'text-gray-500'
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
