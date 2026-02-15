export type Theme = 'light' | 'dark';

export interface ThemeColors {
  bg: string;
  text: string;
  primary: string;
  accent: string;
  glass: string;
  border: string;
  buttonBg: string;
  buttonText: string;
  buttonHover: string;
  displayBg: string;
}

export const themes: Record<Theme, ThemeColors> = {
  light: {
    bg: 'bg-[#e0e5ec]', // Neumorphic base / Ceramic feel
    text: 'text-slate-800',
    primary: 'text-indigo-600',
    accent: 'bg-indigo-600',
    glass: 'bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]',
    border: 'border-white/50',
    buttonBg: 'bg-white/60 shadow-sm',
    buttonText: 'text-slate-700',
    buttonHover: 'hover:bg-white hover:scale-105 hover:shadow-md',
    displayBg: 'bg-white/30 inner-shadow-sm',
  },
  dark: {
    // Deep Space / Midnight Neon
    bg: 'bg-[#050b14]',
    text: 'text-cyan-50',
    primary: 'text-cyan-400',
    accent: 'bg-cyan-500',
    glass: 'bg-[#0a192f]/60 backdrop-blur-xl border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]',
    border: 'border-white/5',
    buttonBg: 'bg-white/5',
    buttonText: 'text-cyan-100',
    buttonHover: 'hover:bg-cyan-500/20 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]',
    displayBg: 'bg-[#020617]/50',
  },
};
