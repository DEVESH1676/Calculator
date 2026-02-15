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

        <div className={`flex relative p-1 rounded-2xl ${theme.glass} border ${theme.border} gap-1 shadow-inner`}>
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeMode === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => navigate(tab.path)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 relative z-10',
                            isActive ? 'text-white' : `${theme.text} hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100`
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-tab"
                                className={`absolute inset-0 ${theme.accent} rounded-xl shadow-md`}
                                initial={false}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <Icon size={16} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </span>
                    </button>
                );
            })}
        </div>
    );

};

export default TabNavigation;
