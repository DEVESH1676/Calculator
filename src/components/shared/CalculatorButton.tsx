import React from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for safe tailwind class merging
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type ButtonVariant = 'number' | 'operator' | 'function' | 'equal' | 'scientific';

interface CalculatorButtonProps extends Omit<HTMLMotionProps<'button'>, 'className'> {
    label: string | React.ReactNode;
    variant?: ButtonVariant;
    isActive?: boolean; // For toggles like '2nd', 'Deg', etc.
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
    label,
    variant = 'number',
    isActive = false,
    className,
    onClick,
    ...props
}) => {
    const { theme } = useThemeStore();

    const getVariantStyles = (variant: ButtonVariant) => {
        switch (variant) {
            case 'equal':
                return 'bg-gradient-to-r from-[#00f5ff] to-[#00d2ff] text-[#0f2027] shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(0,245,255,0.5)]';
            case 'operator':
                return `bg-white/10 text-[#00f5ff] hover:bg-white/15 ${theme.text}`;
            case 'function':
                return `bg-white/5 text-white/60 hover:bg-white/10 ${theme.text}`;
            case 'scientific':
                return isActive
                    ? 'bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/20'
                    : `bg-[#0f2027]/50 border border-[#00f5ff]/10 text-[#00f5ff] hover:bg-[#00f5ff]/10 ${theme.text}`;
            case 'number':
            default:
                return `bg-white/5 text-white hover:bg-white/10 ${theme.text}`;
        }
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className={cn(
                'relative overflow-hidden rounded-2xl text-xl font-medium transition-all duration-200 flex items-center justify-center select-none outline-none focus:ring-2 focus:ring-[#00f5ff]/50 focus:ring-offset-2 focus:ring-offset-transparent active:scale-95 touch-manipulation',
                getVariantStyles(variant),
                className
            )}
            {...props}
        >
            {/* Ripple effect container could go here if managed internally, 
          but for now relying on motion.button for feedback */}
            <span className="relative z-10">{label}</span>
        </motion.button>
    );
};

export default CalculatorButton;
