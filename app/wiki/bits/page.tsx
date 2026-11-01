'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Zap } from 'lucide-react';
import { PARTS_DB } from '../../lib/parts-db';
import type { BitPart } from '../../lib/types';

interface BitEntry {
    code?: string;
    abbr: string;
    name: string;
    series?: 'BX' | 'UX' | 'CX';
    type: 'Attack' | 'Stamina' | 'Defense' | 'Balance';
    desc: string;
    img: string | null;
}

const BITS: BitEntry[] = PARTS_DB.bits.map((b: BitPart) => {
    const m = b.name.match(/\(([^)]+)\)/);
    const name = m ? m[1] : b.name;
    return {
        abbr: b.id,
        name,
        type: b.type as BitEntry['type'],
        desc: b.desc,
        img: b.img ?? null,
    };
});

const TYPE_STYLE: Record<string, string> = {
    Attack:  'bg-rose-950/60 text-rose-400 border-rose-800/40',
    Stamina: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40',
    Defense: 'bg-blue-950/60 text-blue-400 border-blue-800/40',
    Balance: 'bg-violet-950/60 text-violet-400 border-violet-800/40',
};

const TYPE_GLOW: Record<string, string> = {
    Attack: 'shadow-rose-900/40',
    Stamina: 'shadow-emerald-900/40',
    Defense: 'shadow-blue-900/40',
    Balance: 'shadow-violet-900/40',
};

const SERIES_LABEL: Record<string, string> = {
    BX: 'Basic Line', UX: 'Unique Line', CX: 'Custom Line',
};

type FilterType = 'ALL' | 'Attack' | 'Stamina' | 'Defense' | 'Balance';
type FilterSeries = 'ALL' | 'BX' | 'UX' | 'CX';

function BitCard({ bit }: { bit: BitEntry }) {
    return (
        <div className={`bg-[#121826] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-all hover:shadow-lg ${TYPE_GLOW[bit.type]} group`}>
            <div className="relative bg-slate-950 flex items-center justify-center h-32 p-3">
                {bit.img ? (
                    <Image
                        src={`/products/BITS/${bit.img}.png`}
                        alt={bit.name}
                        width={88} height={88}
                        className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300 max-h-24 w-auto"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-black text-slate-600">
                        {bit.abbr}
                    </div>
                )}
                {bit.code && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-400 border border-slate-700">{bit.code}</span>
                )}
            </div>
            <div className="p-3 space-y-2">
                <div className="flex items-center justify-between gap-1">
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-black text-white text-lg leading-none">{bit.abbr}</span>
                        <span className="text-slate-400 text-xs">{bit.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${TYPE_STYLE[bit.type]}`}>
                        {bit.type}
                    </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{bit.desc}</p>
                {bit.series && <div className="text-[10px] text-slate-700">{SERIES_LABEL[bit.series]}</div>}
            </div>
        </div>
    );
}

export default function BitsPage() {
    const [filterType, setFilterType] = useState<FilterType>('ALL');
    const [filterSeries, setFilterSeries] = useState<FilterSeries>('ALL');
    const [search, setSearch] = useState('');

    const filtered = BITS.filter(b => {
        if (filterType !== 'ALL' && b.type !== filterType) return false;
        if (filterSeries !== 'ALL' && b.series !== filterSeries) return false;
        if (search && !b.name.toLowerCase().includes(search.toLowerCase()) &&
            !b.abbr.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const TYPE_ORDER = ['Attack', 'Stamina', 'Defense', 'Balance'] as const;
    const grouped = TYPE_ORDER.map(t => ({ type: t, items: filtered.filter(b => b.type === t) })).filter(g => g.items.length > 0);

    return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans">
            <nav className="border-b border-slate-800 bg-[#121826]/90 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm flex-wrap">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                        <ChevronRight className="w-4 h-4 rotate-180" />หน้าหลัก
                    </Link>
                    <span className="text-slate-700">/</span>
                    <Link href="/wiki" className="text-slate-400 hover:text-white transition-colors">Wiki</Link>
                    <span className="text-slate-700">/</span>
                    <span className="text-white font-bold flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" />รายการ Bit ทั้งหมด (จำแนกตามสาย)</span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black text-white">รายการ <span className="text-amber-400">Bit</span> ทั้งหมด <span className="text-slate-500 text-xl">(จำแนกตามสาย)</span></h1>
                    <p className="text-slate-400 text-sm">Bit คือชิ้นส่วนปลายแกนล่าง — ดูรูปเพื่อจำชื่อ/เลือใช้ได้เร็วขึ้น</p>
                    <div className="flex justify-center gap-3 pt-1 flex-wrap">
                        {(['Attack','Stamina','Defense','Balance'] as const).map(t => (
                            <div key={t} className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${TYPE_STYLE[t]}`}>
                                {t} × {BITS.filter(b => b.type === t).length}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[#121826] border border-slate-800 rounded-2xl p-4 space-y-3">
                    <input
                        type="text"
                        placeholder="ค้นหา… (เช่น Ball, Flat, Needle)"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-all"
                    />
                    <div className="flex flex-wrap gap-2">
                        <div className="flex flex-wrap gap-1.5">
                            {(['ALL','Attack','Stamina','Defense','Balance'] as FilterType[]).map(t => (
                                <button key={t} onClick={() => setFilterType(t)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                                        filterType === t
                                            ? t === 'ALL' ? 'bg-white text-black border-white' : `${TYPE_STYLE[t]} !opacity-100`
                                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                                    }`}>{t === 'ALL' ? 'ทุกสาย' : t}</button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5 ml-auto">
                            {(['ALL','BX','UX','CX'] as FilterSeries[]).map(s => (
                                <button key={s} onClick={() => setFilterSeries(s)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                                        filterSeries === s ? 'bg-cyan-400 text-black border-cyan-400' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                                    }`}>{s === 'ALL' ? 'ทุกซีรีส์' : s}</button>
                            ))}
                        </div>
                    </div>
                    <div className="text-xs text-slate-500">แสดง {filtered.length} / {BITS.length} Bit</div>
                </div>

                {/* Grouped sections */}
                {grouped.length > 0 ? (
                    <div className="space-y-10">
                        {grouped.map(group => (
                            <section key={group.type}>
                                <div className="flex items-center gap-3 mb-3">
                                    <h2 className="text-xl font-black text-white">{group.type}</h2>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${TYPE_STYLE[group.type]}`}>{group.items.length}</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                    {group.items.map((bit, i) => <BitCard key={`${bit.abbr}-${i}`} bit={bit} />)}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-slate-600"><div className="text-4xl mb-2">🔍</div>ไม่พบ Bit ที่ตรงกับเงื่อนไข</div>
                )}

                <div className="text-center text-xs text-slate-700 py-4">
                    ข้อมูลอ้างอิงจาก Takara Tomy Beyblade X / BeyBuilder X (Fabel) • รูปจาก `public/products/BITS/` • บางรายการยังไม่มีรูปภาพ (แสดงอักษรย่อแทน)
                </div>
            </main>

            <footer className="border-t border-slate-800 py-4 bg-slate-950 text-center text-xs text-slate-500">
                Beyblade X Wiki ภาษาไทย • Bits Reference (จำแนกตามสาย)
            </footer>
        </div>
    );
}
