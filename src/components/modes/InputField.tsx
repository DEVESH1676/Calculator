import type { ThemeColors } from '../../theme/themes';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  theme: ThemeColors;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  theme,
}) => (
  <div className="flex flex-col gap-1 mb-3">
    <label className={`text-xs ${theme.text} opacity-70`}>{label}</label>
    <input
      type="number"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-3 rounded-xl outline-none transition-all ${theme.displayBg} ${theme.text} placeholder:text-gray-400 focus:ring-1 focus:ring-blue-400 border ${theme.border}`}
    />
  </div>
);
