import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calculator, DollarSign, Scale, Terminal } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export type CalculatorMode = 'standard' | 'financial' | 'unit' | 'programmer';

interface Tab {
    id: CalculatorMode;
    label: string;
    icon: React.ElementType;
    path: string;
}

const tabs: Tab[] = [
    { id: 'standard', label: 'Standard', icon: Calculator, path: '/' },
    { id: 'financial', label: 'Financial', icon: DollarSign, path: '/financial' },
    { id: 'unit', label: 'Unit', icon: Scale, path: '/unit' },
    { id: 'programmer', label: 'Programmer', icon: Terminal, path: '/programmer' },
];

const TabNavigation: React.FC = () => {
    const { theme } = useThemeStore();
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveMode = (pathname: string): CalculatorMode => {
        if (pathname === '/') return 'standard';
        const mode = pathname.substring(1);
        return (['financial', 'unit', 'programmer'].includes(mode) ? mode : 'standard') as CalculatorMode;
    };

    const activeMode = getActiveMode(location.pathname);

    return (
        <div className="flex bg-black/5 p-1 rounded-xl overflow-x-auto custom-scrollbar gap-1">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeMode === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => navigate(tab.path)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative',
                            isActive
                                ? `${theme.accent} text-white shadow-lg`
                                : `${theme.text} hover:bg-black/5 opacity-70 hover:opacity-100`
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-tab"
                                className="absolute inset-0 bg-white/10 rounded-lg"
                                initial={false}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                        <Icon size={16} className="relative z-10" />
                        <span className="hidden sm:inline relative z-10">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default TabNavigation;
