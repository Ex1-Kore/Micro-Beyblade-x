'use client';

import Link from 'next/link';
import { Sliders, Layers, FlaskConical, BookOpen } from 'lucide-react';

export type AppTab = 'builder' | 'deck' | 'physics';

interface AppHeaderProps {
    activeTab: AppTab;
    onTabChange: (tab: AppTab) => void;
}

const TABS: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    { id: 'builder', label: 'จัดคอมโบ', icon: <Sliders className="w-4 h-4" /> },
    { id: 'deck', label: 'จัดเด็ค 3on3', icon: <Layers className="w-4 h-4" /> },
    { id: 'physics', label: 'ฟิสิกส์การชน', icon: <FlaskConical className="w-4 h-4" /> },
];

export default function AppHeader({ activeTab, onTabChange }: AppHeaderProps) {
    return (
        <header className="border-b border-slate-700/50 bg-gradient-to-r from-[#0f1c2e]/95 via-[#121826]/95 to-[#0f1c2e]/95 backdrop-blur-lg sticky top-0 z-50 shadow-xl shadow-cyan-500/5">
            <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row flex-wrap justify-between items-center gap-3">

                {/* Logo */}
                <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-black font-extrabold text-lg sm:text-2xl shadow-lg shadow-cyan-500/40 group-hover:shadow-cyan-500/60 transition-all duration-300 group-hover:scale-110">
                        X
                    </div>
                    <div>
                        <h1 className="font-extrabold text-lg sm:text-2xl tracking-widest text-white flex items-center gap-2 group-hover:text-cyan-300 transition-colors">
                            BEYBLADE <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(0,240,255,0.8)] animate-pulse">X</span>
                        </h1>
                        <p className="text-[10px] sm:text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Combo &amp; Physics Simulator (BX / UX / CX)</p>
                    </div>
                </div>

<div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
                    <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-700/50 text-sm gap-1 backdrop-blur-sm hover:border-slate-600/50 transition-all overflow-x-auto max-w-full">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                id={`tab-${tab.id}`}
                                onClick={() => onTabChange(tab.id)}
                                className={`px-3 sm:px-4 py-2 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${activeTab === tab.id
                                        ? tab.id === 'physics'
                                            ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/40 scale-105'
                                            : 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-black shadow-lg shadow-cyan-500/40 scale-105'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    <Link
                        href="/wiki"
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-slate-600/50 text-slate-300 hover:text-white hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all text-sm font-bold hover:bg-slate-800/30 backdrop-blur-sm flex-shrink-0"
                    >
                        <BookOpen className="w-4 h-4" /> Wiki
                    </Link>
                    <Link
                        href="/collection"
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-slate-600/50 text-slate-300 hover:text-white hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20 transition-all text-sm font-bold hover:bg-slate-800/30 backdrop-blur-sm flex-shrink-0"
                    >
                        <Layers className="w-4 h-4" /> Collection
                    </Link>
                </div>
            </div>
        </header>
    );
}
