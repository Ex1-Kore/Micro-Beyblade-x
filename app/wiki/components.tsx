import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import BannerSlot from '../components/BannerSlot';

export function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
    return (
        <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                {icon}
            </div>
            <div>
                <h2 className="text-xl font-black text-white">{title}</h2>
                {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
}

export function FormulaCard({ symbol, name, formula, unit, explain, example }: {
    symbol: string; name: string; formula: string;
    unit: string; explain: string; example?: string;
}) {
    return (
        <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-5 space-y-3">
            <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-amber-400">{symbol}</span>
                <span className="text-base font-bold text-white">{name}</span>
                <span className="ml-auto text-xs font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{unit}</span>
            </div>
            <div className="font-mono text-sm text-sky-300 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                {formula}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{explain}</p>
            {example && (
                <div className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 rounded-lg px-3 py-2">
                    <span className="font-bold">ตัวอย่าง: </span>{example}
                </div>
            )}
        </div>
    );
}

export function InfoBox({ color, title, children }: { color: string; title: string; children: React.ReactNode }) {
    const styles: Record<string, string> = {
        blue:   'bg-sky-950/40 border-sky-800/50 text-sky-300',
        amber:  'bg-amber-950/40 border-amber-800/50 text-amber-300',
        emerald:'bg-emerald-950/40 border-emerald-800/50 text-emerald-300',
        rose:   'bg-rose-950/40 border-rose-800/50 text-rose-300',
        violet: 'bg-violet-950/40 border-violet-800/50 text-violet-300',
    };
    return (
        <div className={`border rounded-xl p-4 text-sm leading-relaxed ${styles[color] ?? styles['blue']}`}>
            <div className="font-bold mb-1">{title}</div>
            {children}
        </div>
    );
}

export function TableRow({ cells, header }: { cells: string[]; header?: boolean }) {
    const Tag = header ? 'th' : 'td';
    return (
        <tr className={header ? 'bg-slate-800' : 'border-t border-slate-800 hover:bg-slate-900/50'}>
            {cells.map((c, i) => (
                <Tag key={i} className={`px-3 py-2 text-left text-sm ${header ? 'text-slate-300 font-bold' : 'text-slate-400'}`}>
                    {c}
                </Tag>
            ))}
        </tr>
    );
}

export function WikiLayout({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans">
            <nav className="border-b border-slate-800 bg-[#121826]/90 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
                    <Link href="/wiki" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
                        <ChevronRight className="w-4 h-4 rotate-180" /> กลับสารานุกรม
                    </Link>
                    <span className="text-slate-700">/</span>
                    <div className="flex items-center gap-2 text-white font-bold">
                        {icon} {title}
                    </div>
                </div>
            </nav>
            <BannerSlot position="top" className="max-w-5xl mx-auto px-4 pt-6" />
            <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
                {children}
                <BannerSlot position="wiki" />
            </main>
            <footer className="border-t border-slate-800 py-4 mt-20 bg-slate-950 text-center text-xs text-slate-500">
                <p>Beyblade X Wiki ภาษาไทย • ข้อมูลอิงจาก Takara Tomy Standard และ WBO community</p>
            </footer>
        </div>
    );
}
