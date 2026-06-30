"use client";

import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function InputField({ label, error, className = "", ...props }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[12px] font-bold text-slate-300 ml-1">{label}</label>
      <div className="relative">
        <input
          {...props}
          className={`w-full h-12 bg-slate-900/50 border ${
            error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-brand'
          } rounded-xl px-4 text-[14px] text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
            error ? 'focus:ring-red-500/50' : 'focus:ring-brand/50'
          } transition-all ${className}`}
        />
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
        )}
      </div>
      {error && <span className="text-[11px] font-medium text-red-400 ml-1">{error}</span>}
    </div>
  );
}

interface PasswordFieldProps extends InputFieldProps {
  showStrength?: boolean;
}

export function PasswordField({ label, error, showStrength = false, className = "", value, ...props }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const password = (value as string) || "";

  // Simple UI-only strength calculation
  const getStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length > 7) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strength = getStrength();

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[12px] font-bold text-slate-300 ml-1">{label}</label>
      <div className="relative">
        <input
          {...props}
          value={value}
          type={showPassword ? "text" : "password"}
          className={`w-full h-12 bg-slate-900/50 border ${
            error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-brand'
          } rounded-xl pl-4 pr-10 text-[14px] text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
            error ? 'focus:ring-red-500/50' : 'focus:ring-brand/50'
          } transition-all ${className}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <span className="text-[11px] font-medium text-red-400 ml-1">{error}</span>}
      
      {showStrength && password.length > 0 && (
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex gap-1 h-1.5 w-full">
            {[1, 2, 3, 4].map(level => (
              <div 
                key={level} 
                className={`flex-1 rounded-full transition-colors duration-300 ${
                  strength >= level 
                    ? strength < 2 ? 'bg-red-500' : strength === 2 ? 'bg-amber-500' : strength === 3 ? 'bg-emerald-400' : 'bg-brand'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-medium">
            <span className={`flex items-center gap-1 ${password.length > 7 ? 'text-emerald-400' : 'text-slate-500'}`}><CheckCircle2 className="w-3 h-3" /> 8+ characters</span>
            <span className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? 'text-emerald-400' : 'text-slate-500'}`}><CheckCircle2 className="w-3 h-3" /> Uppercase</span>
            <span className={`flex items-center gap-1 ${/[0-9]/.test(password) ? 'text-emerald-400' : 'text-slate-500'}`}><CheckCircle2 className="w-3 h-3" /> Number</span>
            <span className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(password) ? 'text-emerald-400' : 'text-slate-500'}`}><CheckCircle2 className="w-3 h-3" /> Special character</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
  error?: string;
}

export function SelectField({ label, options, error, className = "", ...props }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[12px] font-bold text-slate-300 ml-1">{label}</label>
      <div className="relative">
        <select
          {...props}
          className={`w-full h-12 bg-slate-900/50 border ${
            error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-brand'
          } rounded-xl px-4 text-[14px] text-white appearance-none focus:outline-none focus:ring-1 ${
            error ? 'focus:ring-red-500/50' : 'focus:ring-brand/50'
          } transition-all ${className}`}
        >
          <option value="" disabled className="text-slate-500 bg-slate-900">Select...</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>
          ))}
        </select>
        {/* Custom Caret */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {error && <span className="text-[11px] font-medium text-red-400 ml-1">{error}</span>}
    </div>
  );
}
