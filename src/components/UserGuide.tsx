import React from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { X, Book, Command, Calculator, Brain, TrendingUp } from 'lucide-react';

interface UserGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserGuide: React.FC<UserGuideProps> = ({ isOpen, onClose }) => {
    const { theme } = useThemeStore();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
                className={`w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl ${theme.glass} border ${theme.border} shadow-2xl relative custom-scrollbar`}
            >
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 p-2 rounded-full ${theme.buttonBg} ${theme.text} hover:opacity-80 transition-all`}
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Book className={theme.primary} size={32} />
                        <h2 className="text-2xl font-bold">User Guide</h2>
                    </div>

                    <div className="space-y-8">
                        <section>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Calculator size={20} /> Standard & Scientific
                            </h3>
                            <ul className="list-disc list-inside space-y-2 opacity-80 text-sm">
                                <li>Use keyboard shortcuts for basic math (0-9, +, -, *, /, Enter).</li>
                                <li>Press <strong>Esc</strong> to clear input.</li>
                                <li>History sidebar allows you to reuse previous results.</li>
                                <li>Toggle Scientific mode for Trig, Log, and Roots.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Command size={20} /> Graphing Engine
                            </h3>
                            <ul className="list-disc list-inside space-y-2 opacity-80 text-sm">
                                <li>Click the <strong>Graph Icon</strong> to split the screen.</li>
                                <li>Enter functions like <code>sin(x) * x</code> or <code>x^2 - 4</code>.</li>
                                <li>Use mouse to <strong>Pan</strong> (Drag) and <strong>Zoom</strong> (Scroll).</li>
                                <li>Click the <strong>Target Icon</strong> to find Roots and Extrema automatically.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <TrendingUp size={20} /> Financial & Unit
                            </h3>
                            <ul className="list-disc list-inside space-y-2 opacity-80 text-sm">
                                <li><strong>EMI</strong>: Calculate loans with Amortization schedules.</li>
                                <li><strong>SIP</strong>: Project wealth growth with interactive charts.</li>
                                <li><strong>CAGR</strong>: Calculate compound annual growth rate.</li>
                                <li><strong>Unit</strong>: Convert currencies (live rates) and physical units.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <Brain size={20} /> AI Assistant
                            </h3>
                            <ul className="list-disc list-inside space-y-2 opacity-80 text-sm">
                                <li>Ask natural questions like <em>"50k at 10% for 5 years"</em>.</li>
                                <li>Calculate <em>"BMI 80kg 180cm"</em> instantly.</li>
                                <li>Get step-by-step formula explanations.</li>
                            </ul>
                        </section>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center opacity-50 text-xs">
                        Calculator v1.0 • Offline Ready (PWA) • Powered by React & Vite
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserGuide;
