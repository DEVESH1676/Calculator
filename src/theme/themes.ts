export type Theme = 'light' | 'dark' | 'neon' | 'minimal';

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
        bg: 'bg-gradient-to-br from-gray-100 to-gray-300',
        text: 'text-gray-800',
        primary: 'text-blue-600',
        accent: 'bg-blue-500',
        glass: 'bg-white/60 backdrop-blur-xl',
        border: 'border-white/40',
        buttonBg: 'bg-white/80',
        buttonText: 'text-gray-800',
        buttonHover: 'hover:bg-white',
        displayBg: 'bg-white/50',
    },
    dark: {
        bg: 'bg-gradient-to-br from-[#0f2027] to-[#2c5364]',
        text: 'text-white',
        primary: 'text-[#00f5ff]',
        accent: 'bg-[#00f5ff]',
        glass: 'bg-white/10 backdrop-blur-xl',
        border: 'border-white/10',
        buttonBg: 'bg-white/10',
        buttonText: 'text-white',
        buttonHover: 'hover:bg-white/20',
        displayBg: 'bg-black/20',
    },
    neon: {
        bg: 'bg-black',
        text: 'text-[#ff00ff]',
        primary: 'text-[#00f5ff]',
        accent: 'bg-[#00f5ff]',
        glass: 'bg-black/80 backdrop-blur-md border border-[#00f5ff]/30',
        border: 'border-[#ff00ff]/30',
        buttonBg: 'bg-[#1a1a1a]',
        buttonText: 'text-[#00f5ff]',
        buttonHover: 'hover:bg-[#333] hover:shadow-[0_0_10px_#00f5ff]',
        displayBg: 'bg-[#000]',
    },
    minimal: {
        bg: 'bg-[#f5f5f5]',
        text: 'text-[#333]',
        primary: 'text-[#000]',
        accent: 'bg-[#333]',
        glass: 'bg-white border border-gray-200 shadow-sm',
        border: 'border-gray-200',
        buttonBg: 'bg-gray-100',
        buttonText: 'text-[#333]',
        buttonHover: 'hover:bg-gray-200',
        displayBg: 'bg-transparent',
    },
};
