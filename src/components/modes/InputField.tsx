import React from 'react';
import { useThemeStore } from '../../store/useThemeStore';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  type?: 'number' | 'text';
  placeholder?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = 'number',
  placeholder,
}) => {
  const { theme } = useThemeStore();

  return (
    <div className="flex flex-col gap-1 mb-3">
      <label className={`text-xs ${theme.text} opacity-70`}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-3 rounded-xl outline-none transition-all ${theme.displayBg} ${theme.text} placeholder:text-gray-400 focus:ring-1 focus:ring-blue-400 border ${theme.border}`}
      />
    </div>
  );
};
