'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Star } from 'lucide-react';
import { BLADES, type BladeEntry, type BladeType as BeyType, type BladeSeries as Series, AUTHORITATIVE_COUNTS, getBladeImagePath, estimateInertiaKgM2 } from '../../lib/blades-data';

// ── Helpers ───────────────────────────────────────────────────────────────────

const TYPE_STYLE: Record<BeyType, string> = {
    Attack:  'bg-rose-950/60 text-rose-400 border-rose-800/40',
    Defense: 'bg-blue-950/60 text-blue-400 border-blue-800/40',
    Stamina: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40',
    Balance: 'bg-violet-950/60 text-violet-400 border-violet-800/40',
};
const TYPE_IMG: Record<BeyType, string> = {
    Attack:  '/products/TYPE/attack.png',
    Defense: '/products/TYPE/defense.png',
    Stamina: '/products/TYPE/stamina.png',
    Balance: '/products/TYPE/balance.png',
};
const SERIES_STYLE: Record<Series, { text: string; border: string; bg: string }> = {
    BX: { text: 'text-cyan-400',   border: 'border-cyan-800/50',   bg: 'bg-cyan-950/40' },
    UX: { text: 'text-amber-400',  border: 'border-amber-800/50',  bg: 'bg-amber-950/40' },
    CX: { text: 'text-violet-400', border: 'border-violet-800/50', bg: 'bg-violet-950/40' },
};

function StatBar({ value, color }: { value: number; color: string }) {
    return (
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(value, 99)}%` }} />
        </div>
    );
}

function BladeCard({ blade, onPreview }: { blade: BladeEntry; onPreview: (blade: BladeEntry) => void }) {
    const ss = SERIES_STYLE[blade.series];
    const imagePath = getBladeImagePath(blade);
    return (
        <div className="bg-[#121826] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-all group hover:shadow-lg hover:shadow-slate-900/50">
            {/* Image */}
            <button
                type="button"
                onClick={() => onPreview(blade)}
                className="relative w-full bg-slate-950 flex items-center justify-center h-36 p-3 cursor-zoom-in group-hover:brightness-110 transition-all"
                aria-label={`ดูรายละเอียด ${blade.name}`}
            >
                {imagePath ? (
                    <Image
                        src={imagePath}
                        alt={`${blade.code ?? ''} ${blade.name}`}
                        width={110}
                        height={110}
                        className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300 max-h-28 w-auto"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-600 text-xs font-bold text-center px-1">
                        {blade.code} {blade.name}
                    </div>
                )}
                {/* Series badge top-right */}
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded border ${ss.bg} ${ss.text} ${ss.border}`}>
                    {blade.series}
                </span>
                {/* No-image indicator */}
                {!getBladeImagePath(blade) && (
                    <span className="absolute bottom-2 right-2 text-[9px] text-slate-700">ยังไม่มีรูป</span>
                )}
                <span className="absolute bottom-2 left-2 text-[9px] text-slate-300 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700">
                    คลิกเพื่อดูรายละเอียด
                </span>
            </button>

            {/* Info */}
            <div className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-1">
                    <div className="font-bold text-white text-sm leading-tight">{blade.code ? `${blade.code} ${blade.name}` : blade.name}</div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 flex items-center gap-0.5 ${TYPE_STYLE[blade.type]}`}>
                        <Image
                            src={TYPE_IMG[blade.type]}
                            alt=""
                            width={14}
                            height={14}
                            className="w-3.5 h-3.5 object-contain"
                        />
                        {blade.type}
                    </span>
                </div>

                {(blade.ratchet || blade.bit || blade.productSlug) && (
                    <div className="flex flex-wrap items-center gap-1 text-[10px] font-bold">
                        {blade.ratchet && (
                            <span className="rounded border border-blue-800/40 bg-blue-950/40 px-1.5 py-0.5 text-blue-300">
                                Ratchet {blade.ratchet}
                            </span>
                        )}
                        {blade.bit && (
                            <span className="rounded border border-emerald-800/40 bg-emerald-950/40 px-1.5 py-0.5 text-emerald-300">
                                Bit {blade.bit}
                            </span>
                        )}
                        {blade.productSlug && (
                            <Link
                                href={`/wiki/products/${blade.productSlug}`}
                                className="ml-auto text-cyan-400 hover:text-cyan-300"
                            >
                                ดูสินค้า →
                            </Link>
                        )}
                    </div>
                )}

                {/* Stats */}
                <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between text-slate-500">
                        <span>ATK <span className="text-rose-400 font-bold">{blade.atk}</span></span>
                        <span>DEF <span className="text-blue-400 font-bold">{blade.def}</span></span>
                        <span>STA <span className="text-emerald-400 font-bold">{blade.sta}</span></span>
                        <span>k <span className="text-amber-400 font-bold">{blade.inertiaFactor}</span></span>
                    </div>
                    <StatBar value={blade.atk} color="bg-rose-500" />
                    <StatBar value={blade.def} color="bg-blue-500" />
                    <StatBar value={blade.sta} color="bg-emerald-500" />
                </div>

                <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{blade.weight}g</span>
                    <span className="text-slate-600">{blade.desc}</span>
                </div>
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type FilterType   = 'ALL' | BeyType;
type FilterSeries = 'ALL' | Series;

export default function BladesPage() {
    const [filterType,   setFilterType]   = useState<FilterType>('ALL');
    const [filterSeries, setFilterSeries] = useState<FilterSeries>('ALL');
    const [search,       setSearch]       = useState('');
    const [sortBy,       setSortBy]       = useState<'code' | 'name' | 'weight' | 'atk' | 'sta' | 'def'>('code');
    const [selectedBlade, setSelectedBlade] = useState<BladeEntry | null>(null);

    const filtered = BLADES
        .filter(b => {
            if (filterType   !== 'ALL' && b.type   !== filterType)   return false;
            if (filterSeries !== 'ALL' && b.series !== filterSeries) return false;
            if (search && !`${b.code ?? ''} ${b.name}`.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'code') {
                const ac = a.code ?? '';
                const bc = b.code ?? '';
                if (ac && bc) return ac.localeCompare(bc);
                if (ac) return -1;
                if (bc) return 1;
                return a.name.localeCompare(b.name);
            }
            if (sortBy === 'name')   return a.name.localeCompare(b.name);
            if (sortBy === 'weight') return b.weight - a.weight;
            if (sortBy === 'atk')    return b.atk - a.atk;
            if (sortBy === 'def')    return b.def - a.def;
            if (sortBy === 'sta')    return b.sta - a.sta;
            return 0;
        });

    return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans">

            {/* Nav */}
            <nav className="border-b border-slate-800 bg-[#121826]/90 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm flex-wrap">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                        <ChevronRight className="w-4 h-4 rotate-180" />หน้าหลัก
                    </Link>
                    <span className="text-slate-700">/</span>
                    <Link href="/wiki" className="text-slate-400 hover:text-white transition-colors">Wiki</Link>
                    <span className="text-slate-700">/</span>
                    <span className="text-white font-bold flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-cyan-400" />รายการ Blade ทั้งหมด
                    </span>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">

                {/* Hero */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black text-white">รายการ <span className="text-cyan-400">Blade</span> ทั้งหมด</h1>
                    <p className="text-slate-400 text-sm">Blade คือชิ้นส่วนหลักที่กำหนดรูปร่าง น้ำหนัก และแรงปะทะของเบย์</p>
                    <div className="flex justify-center gap-3 pt-1 flex-wrap text-xs">
                        {[
                            [`${AUTHORITATIVE_COUNTS.BX} BX`, 'text-cyan-400'],
                            [`${AUTHORITATIVE_COUNTS.UX} UX`, 'text-amber-400'],
                            [`${AUTHORITATIVE_COUNTS.CX} CX`, 'text-violet-400'],
                            [`${AUTHORITATIVE_COUNTS.total} รวม`, 'text-white'],
                            [`${AUTHORITATIVE_COUNTS.withImg} มีรูป`, 'text-emerald-400'],
                            [`${AUTHORITATIVE_COUNTS.withoutImg} รอรูป`, 'text-slate-500'],
                        ].map(([label, color]) => (
                            <div key={label as string} className="bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-1.5 text-center">
                                <span className={`font-black ${color}`}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[#121826] border border-slate-800 rounded-2xl p-4 space-y-3">
                    <input
                        type="text"
                        placeholder="ค้นหา Blade… (เช่น BX-01, Phoenix Wing, Wizard Rod)"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-all"
                    />
                    <div className="flex flex-wrap gap-2 justify-between">
                        {/* Type */}
                        <div className="flex flex-wrap gap-1.5">
                            {(['ALL','Attack','Stamina','Defense','Balance'] as FilterType[]).map(t => (
                                <button key={t} onClick={() => setFilterType(t)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                                        filterType === t
                                            ? t === 'ALL' ? 'bg-white text-black border-white'
                                            : `${TYPE_STYLE[t as BeyType]} opacity-100 brightness-150`
                                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                                    }`}>
                                    {t === 'ALL' ? 'ทุกประเภท' : t}
                                </button>
                            ))}
                        </div>
                        {/* Series */}
                        <div className="flex flex-wrap gap-1.5">
                            {(['ALL','BX','UX','CX'] as FilterSeries[]).map(s => (
                                <button key={s} onClick={() => setFilterSeries(s)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                                        filterSeries === s
                                            ? 'bg-cyan-400 text-black border-cyan-400'
                                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                                    }`}>
                                    {s === 'ALL' ? 'ทุก Series' : s}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Sort */}
                    <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-xs text-slate-500">เรียงตาม:</span>
                        {(['code','name','weight','atk','def','sta'] as const).map(s => (
                            <button key={s} onClick={() => setSortBy(s)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                                    sortBy === s
                                        ? 'bg-amber-400 text-black border-amber-400'
                                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                                }`}>
                                {s === 'code' ? 'รหัส' : s === 'name' ? 'ชื่อ' : s === 'weight' ? 'น้ำหนัก' : s.toUpperCase()}
                            </button>
                        ))}
                        <span className="text-xs text-slate-600 ml-2">แสดง {filtered.length} / {BLADES.length}</span>
                    </div>
                </div>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {filtered.map((b, i) => <BladeCard key={i} blade={b} onPreview={setSelectedBlade} />)}
                    </div>
                ) : (
                    <div className="text-center py-16 text-slate-600">
                        <div className="text-4xl mb-2">🔍</div>
                        ไม่พบ Blade ที่ตรงกับเงื่อนไข
                    </div>
                )}

                <div className="text-center text-xs text-slate-700 py-4">
                    ข้อมูลอ้างอิงจาก Takara Tomy Beyblade X Official • k = Inertia Factor
                </div>
            </main>

            <footer className="border-t border-slate-800 py-4 bg-slate-950 text-center text-xs text-slate-500">
                Beyblade X Wiki ภาษาไทย • Blades Reference
            </footer>

            {selectedBlade && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-6">
                    <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-[#121826] shadow-2xl shadow-black/70 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400">Blade Preview</p>
                                <h2 className="text-lg font-black text-white">{selectedBlade.code ? `${selectedBlade.code} ${selectedBlade.name}` : selectedBlade.name}</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedBlade(null)}
                                className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-300 hover:border-slate-500 hover:text-white"
                            >
                                ปิด
                            </button>
                        </div>
                        <div className="p-4 sm:p-6 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                            <div className="relative flex min-h-[220px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 p-4">
                                {getBladeImagePath(selectedBlade) ? (
                                    <Image
                                        src={getBladeImagePath(selectedBlade)!}
                                        alt={selectedBlade.code ? `${selectedBlade.code} ${selectedBlade.name}` : selectedBlade.name}
                                        width={220}
                                        height={220}
                                        className="max-h-56 w-auto object-contain"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-3xl border border-slate-700 bg-slate-800 flex items-center justify-center text-center px-2 text-sm font-bold text-slate-600">
                                        {selectedBlade.code ? `${selectedBlade.code} ${selectedBlade.name}` : selectedBlade.name}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300">
                                    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                                        <Star className="w-3.5 h-3.5 text-cyan-400" /> ข้อมูลสรุป
                                    </div>
                                    <p className="leading-relaxed text-slate-300">{selectedBlade.desc}</p>
                                </div>
                                {selectedBlade.note && (
                                    <div className="rounded-2xl border border-cyan-800/30 bg-cyan-950/20 p-4 text-sm text-slate-200">
                                        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                                            ข้อมูลเพิ่มเติม
                                        </div>
                                        <p className="leading-relaxed">{selectedBlade.note}</p>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">ประเภท</p>
                                        <p className="mt-1 font-bold text-white">{selectedBlade.type}</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Series</p>
                                        <p className="mt-1 font-bold text-white">{selectedBlade.series}</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">น้ำหนัก</p>
                                        <p className="mt-1 font-bold text-white">{selectedBlade.weight}g</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">ATK / DEF / STA</p>
                                        <p className="mt-1 font-bold text-white">{selectedBlade.atk} / {selectedBlade.def} / {selectedBlade.sta}</p>
                                    </div>
                                </div>
                                {(selectedBlade.radiusMm || selectedBlade.heightMm || selectedBlade.distribution) && (
                                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300">
                                        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">Mechanical Specs (Lab)</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-[10px] text-slate-500">Mass (m)</p>
                                                <p className="font-bold text-white">{selectedBlade.weight} g</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500">Radius (R)</p>
                                                <p className="font-bold text-white">{selectedBlade.radiusMm ? `${selectedBlade.radiusMm} mm` : '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500">Height (H)</p>
                                                <p className="font-bold text-white">{selectedBlade.heightMm ? `${selectedBlade.heightMm} mm` : '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500">Estimated I</p>
                                                <p className="font-bold text-white">{
                                                    selectedBlade.radiusMm
                                                        ? (() => {
                                                            const i = estimateInertiaKgM2(selectedBlade.weight, selectedBlade.radiusMm!);
                                                            return i ? `${i.toExponential(3)} kg·m²` : '—';
                                                          })()
                                                        : '—'
                                                }</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-[10px] text-slate-500">Distribution</p>
                                                <p className="font-bold text-white">{selectedBlade.distribution ?? '—'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-wrap items-center gap-4 pt-2">
                                    <Link
                                        href={`/wiki/blade/${selectedBlade.id}`}
                                        className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                                    >
                                        อ่านบทวิเคราะห์เต็ม →
                                    </Link>
                                    {selectedBlade.productSlug && (
                                        <Link
                                            href={`/wiki/products/${selectedBlade.productSlug}`}
                                            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                                        >
                                            ดูสินค้าในรหัสนี้ →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
