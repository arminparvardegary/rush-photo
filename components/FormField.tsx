"use client";

import { ReactNode, useState, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Eye, EyeOff } from "lucide-react";

interface BaseFieldProps {
  label: string;
  error?: string;
  success?: boolean;
  hint?: string;
  required?: boolean;
  icon?: ReactNode;
}

interface InputFieldProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'url';
}

interface TextareaFieldProps extends BaseFieldProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
}

export function InputField({
  label,
  error,
  success,
  hint,
  required,
  icon,
  type = 'text',
  className = '',
  ...props
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      <label className="flex items-center justify-between text-sm font-medium text-white/80">
        <span className="flex items-center gap-1">
          {label}
          {required && <span className="text-honey">*</span>}
        </span>
        {hint && <span className="text-white/40 font-normal text-xs">{hint}</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
            focused ? 'text-honey' : error ? 'text-red-400' : 'text-white/40'
          }`}>
            {icon}
          </div>
        )}
        
        <input
          type={inputType}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            w-full px-4 py-3.5 rounded-xl text-white placeholder-white/40 outline-none
            transition-all duration-200 bg-white/5 border-2
            ${icon ? 'pl-12' : ''}
            ${type === 'password' ? 'pr-12' : success ? 'pr-12' : ''}
            ${error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border-white/10 focus:border-honey focus:ring-2 focus:ring-honey/20'
            }
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        
        {/* Password toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        
        {/* Success indicator */}
        {success && type !== 'password' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <Check className="w-5 h-5 text-teal" />
          </motion.div>
        )}
      </div>
      
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            id={`${props.id}-error`}
            className="text-sm text-red-400 flex items-center gap-1.5"
            role="alert"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TextareaField({
  label,
  error,
  success,
  hint,
  required,
  rows = 4,
  className = '',
  ...props
}: TextareaFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-2">
      <label className="flex items-center justify-between text-sm font-medium text-white/80">
        <span className="flex items-center gap-1">
          {label}
          {required && <span className="text-honey">*</span>}
        </span>
        {hint && <span className="text-white/40 font-normal text-xs">{hint}</span>}
      </label>
      
      <div className="relative">
        <textarea
          rows={rows}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            w-full px-4 py-3.5 rounded-xl text-white placeholder-white/40 outline-none
            transition-all duration-200 bg-white/5 border-2 resize-none
            ${error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border-white/10 focus:border-honey focus:ring-2 focus:ring-honey/20'
            }
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        
        {/* Character count */}
        {props.maxLength && (
          <span className={`absolute bottom-3 right-4 text-xs ${
            (props.value?.toString().length || 0) > props.maxLength * 0.9 
              ? 'text-red-400' 
              : 'text-white/40'
          }`}>
            {props.value?.toString().length || 0}/{props.maxLength}
          </span>
        )}
      </div>
      
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            id={`${props.id}-error`}
            className="text-sm text-red-400 flex items-center gap-1.5"
            role="alert"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SelectField({
  label,
  error,
  hint,
  required,
  children,
  className = '',
  ...props
}: BaseFieldProps & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="space-y-2">
      <label className="flex items-center justify-between text-sm font-medium text-white/80">
        <span className="flex items-center gap-1">
          {label}
          {required && <span className="text-honey">*</span>}
        </span>
        {hint && <span className="text-white/40 font-normal text-xs">{hint}</span>}
      </label>
      
      <select
        className={`
          w-full px-4 py-3.5 rounded-xl text-white outline-none
          transition-all duration-200 bg-white/5 border-2 cursor-pointer
          appearance-none bg-no-repeat bg-right
          ${error 
            ? 'border-red-500/50 focus:border-red-500' 
            : 'border-white/10 focus:border-honey'
          }
          ${className}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff80' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 12px center',
          backgroundSize: '20px',
        }}
        {...props}
      >
        {children}
      </select>
      
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm text-red-400 flex items-center gap-1.5"
            role="alert"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

