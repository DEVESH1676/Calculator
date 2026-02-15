import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/useThemeStore';
import { cn } from '../../utils/cn';

interface InputDisplayProps {
    input: string;
    result?: string;
    error?: boolean;
    className?: string;
    isScientific?: boolean;
}

const InputDisplay: React.FC<InputDisplayProps> = ({
    input,
    result,
    error = false,
    className,
    isScientific = false,
}) => {
    const { theme } = useThemeStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to end on input change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [input]);

    return (
        <div className={cn('flex flex-col justify-end text-right w-full overflow-hidden', className)}>
            {/* Secondary Display (Result / Equation) */}
            <div className="h-8 min-h-[2rem] mb-1 flex items-center justify-end overflow-hidden">
                <AnimatePresence mode="wait">
                    {result && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                                'text-sm font-mono truncate',
                                error ? 'text-red-400' : 'text-white/50'
                            )}
                        >
                            {result}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Display (Input) */}
            <motion.div
                layout
                className={cn(
                    'w-full flex items-center justify-end overflow-x-auto custom-scrollbar',
                    theme.text
                )}
                ref={scrollRef}
            >
                <motion.span
                    key={input}
                    initial={{ scale: 0.95, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.1 }}
                    className={cn(
                        'font-mono font-bold whitespace-nowrap tracking-wider',
                        isScientific ? 'text-4xl md:text-5xl' : 'text-5xl md:text-6xl'
                    )}
                >
                    {input || '0'}
                </motion.span>
            </motion.div>
        </div>
    );
};

export default InputDisplay;
