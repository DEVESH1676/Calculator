import React from 'react';
import { useToastStore } from '../../store/useToastStore';
import { useThemeStore } from '../../store/useThemeStore';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const GlobalToastProvider: React.FC = () => {
    const { toasts, removeToast } = useToastStore();
    const { theme } = useThemeStore();

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} className="text-green-500" />;
            case 'error':
                return <AlertCircle size={20} className="text-red-500" />;
            case 'warning':
                return <AlertTriangle size={20} className="text-yellow-500" />;
            case 'info':
            default:
                return <Info size={20} className="text-blue-500" />;
        }
    };

    const getBorderColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'border-green-500/50';
            case 'error':
                return 'border-red-500/50';
            case 'warning':
                return 'border-yellow-500/50';
            case 'info':
            default:
                return 'border-blue-500/50';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        layout
                        className={`pointer-events-auto min-w-[300px] max-w-sm rounded-xl p-4 shadow-2xl backdrop-blur-xl border ${getBorderColor(
                            toast.type
                        )} ${theme.glass} flex items-start gap-3`}
                    >
                        <div className="mt-0.5">{getIcon(toast.type)}</div>
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${theme.text}`}>{toast.message}</p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className={`p-1 rounded-lg hover:bg-black/10 transition-colors ${theme.text} opacity-60 hover:opacity-100`}
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default GlobalToastProvider;
