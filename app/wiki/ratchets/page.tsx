'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Layers } from 'lucide-react';
import { PARTS_DB } from '../../lib/parts-db';
import type { RatchetPart } from '../../lib/types';

interface RatchetEntry {
    code: string;
    name: string;
    sides: number;
    heightMm: number;
    series: 'BX' | 'UX' | 'CX';
    desc: string;
    /** ชื่อไฟล์ใน /public/products/RATCHETS/ (ไม่รวม .png) เช่น "3-60_p" */
    img: string | null;
}

const RATCHETS: RatchetEntry[] = PARTS_DB.ratchets.map((r: RatchetPart) => ({
    code: r.id,
    name: r.name,
    sides: r.sides,
    heightMm: r.height,
    series: 'BX',
    desc: r.desc,
    img: r.img ?? null,
}));

// Detailed ratchet mechanical/spec taxonomy (updated 2026)
type RatchetSpecEntry = {
    code: string;
    teeth: number | string;
    heightMm: number;
    avgWeightG?: number;
    weightRange?: string;
    profile: 'Low' | 'Standard' | 'High' | string;
    character: string;
};

const RATCHET_GROUPS: { title: string; note?: string; items: RatchetSpecEntry[] }[] = [
    {
        title: 'Low-Profile (5.0 - 5.5 mm)',
        note: 'ความสูงเตี้ยพิเศษ เหมาะกับการมุดและสาย Attack',
        items: [
            { code: '1-50', teeth: 1, heightMm: 5.0, avgWeightG: 5.70, weightRange: '5.62–5.78g', profile: 'Low', character: 'Eccentric single heavy mass; powerful under-body smash; top Attack choice' },
            { code: '4-50', teeth: 4, heightMm: 5.0, avgWeightG: 6.12, profile: 'Low', character: '4-corner balanced low profile; resists low-angle knockback' },
            { code: '4-55', teeth: 4, heightMm: 5.5, avgWeightG: 6.25, profile: 'Low', character: 'Semi-standard low height for CX; allows slight clearance when tilted' },
        ],
    },
    {
        title: 'Standard Profile (6.0 - 6.5 mm)',
        note: 'Competitive meta standard; balance of impact range and grip',
        items: [
            { code: '1-60', teeth: 1, heightMm: 6.0, avgWeightG: 6.10, profile: 'Standard', character: 'Eccentric single tooth for high smash impact' },
            { code: '2-60', teeth: 2, heightMm: 6.0, avgWeightG: 6.05, profile: 'Standard', character: 'Twin teeth narrow face; low drag for left-spin/power blades' },
            { code: '3-60', teeth: 3, heightMm: 6.0, avgWeightG: 6.38, profile: 'Standard', character: 'Classic 3-tooth triangle; pairs with 3-tooth blades for strong rebound' },
            { code: '4-60', teeth: 4, heightMm: 6.0, avgWeightG: 6.35, profile: 'Standard', character: 'Square profile: stable balance for Balance types' },
            { code: '5-60', teeth: 5, heightMm: 6.0, avgWeightG: 6.60, profile: 'Standard', character: 'Dense 5-tooth defensive profile; hides lock angles well' },
            { code: '9-60', teeth: 9, heightMm: 6.0, avgWeightG: 6.55, weightRange: '6.45–6.62g', profile: 'Standard', character: 'Top-tier Stamina: near-complete ring, minimal vibration' },
        ],
    },
    {
        title: 'High Profile (7.0 - 8.5 mm)',
        note: 'High profiles are used for down-force angles, needle bits, and heavy impact setups',
        items: [
            { code: '3-70 / 4-70 / 5-70 / 9-70', teeth: '3/4/5/9', heightMm: 7.0, avgWeightG: 6.70, profile: 'High', character: 'Lifted contact plane for heavy Smash, good for Hammers/Rods' },
            { code: '6-70', teeth: 6, heightMm: 7.0, avgWeightG: 6.80, profile: 'High', character: 'Hex profile: dense peripheral mass, excellent center grip' },
            { code: '2-70', teeth: 2, heightMm: 7.0, avgWeightG: 6.20, profile: 'High', character: 'Tall narrow twin-tooth reduces drag for rail-based tactics' },
            { code: '3-80 / 4-80 / 5-80 / 9-80', teeth: '3/4/5/9', heightMm: 8.0, avgWeightG: 6.95, profile: 'High', character: 'Classic high-profile line, pairs with Needle Bits for deep center poke' },
            { code: '8-70 / 8-80', teeth: 8, heightMm: 7.0, avgWeightG: 7.68, weightRange: '7.55–7.75g', profile: 'High', character: 'Heavy champion: one of the highest mass ratchets in the game' },
            { code: '3-85', teeth: 3, heightMm: 8.5, avgWeightG: 7.20, profile: 'High', character: 'Highest ratchet: designed for maximum high-angle impact (Knight Mail use)' },
        ],
    },
];

// ── helpers ──────────────────────────────────────────────────────────────────

/** แปลง sides → label กลม */
function sidesLabel(sides: number) {
    if (sides === 0) return { text: '0 (กลม)', color: 'text-emerald-400' };
    if (sides <= 2)  return { text: `${sides} แฉก`, color: 'text-rose-400' };
    if (sides <= 4)  return { text: `${sides} แฉก`, color: 'text-amber-400' };
    return { text: `${sides} แฉก`, color: 'text-sky-400' };
}

/** แปลง height → สี */
function heightColor(h: number) {
    if (h <= 6.0) return 'text-slate-300';
    if (h <= 7.0) return 'text-amber-300';
    return 'text-rose-300';
}

const SERIES_STYLE: Record<string, { text: string; border: string; bg: string }> = {
    BX: { text: 'text-cyan-400',   border: 'border-cyan-800/50',   bg: 'bg-cyan-950/40'   },
    UX: { text: 'text-amber-400',  border: 'border-amber-800/50',  bg: 'bg-amber-950/40'  },
    CX: { text: 'text-violet-400', border: 'border-violet-800/50', bg: 'bg-violet-950/40' },
};

type FilterSides  = 'ALL' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

function RatchetCard({ r }: { r: RatchetEntry }) {
    const sl = sidesLabel(r.sides);
    const st = SERIES_STYLE[r.series];
    return (
        <div className="bg-[#121826] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-all group">
            {/* Image */}
            <div className="relative bg-slate-950 flex items-center justify-center h-36">
                {r.img ? (
                    <Image
                        src={`/products/RATCHETS/${r.img}.png`}
                        alt={r.name}
                        width={110}
                        height={110}
                        className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center font-black text-slate-500 text-lg">
                        {r.name}
                    </div>
                )}
                <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-400 border border-slate-700">
                    {r.code}
                </span>
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded border ${st.bg} ${st.text} ${st.border}`}>
                    {r.series}
                </span>
            </div>

            {/* Info */}
            <div className="p-3 space-y-2">
                <div className="font-black text-white text-xl leading-none font-mono">{r.name}</div>
                <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className={`font-bold ${sl.color}`}>{sl.text}</span>
                    <span className="text-slate-700">·</span>
                    <span className={`font-bold ${heightColor(r.heightMm)}`}>{r.heightMm} mm</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
            </div>
        </div>
    );
}

export default function RatchetsPage() {
    const [filterSides,  setFilterSides]  = useState<FilterSides>('ALL');
    const [search, setSearch]             = useState('');

    const filtered = RATCHETS.filter(r => {
        if (filterSides  !== 'ALL' && r.sides  !== Number(filterSides))  return false;
        if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const allSides: FilterSides[] = ['ALL','0','1','2','3','4','5','6','7','8','9'];

    return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans">

            {/* Nav */}
            <nav className="border-b border-slate-800 bg-[#121826]/90 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm flex-wrap">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                        <ChevronRight className="w-4 h-4 rotate-180" />หน้าหลัก
                    </Link>
                    <span className="text-slate-700">/</span>
                    <Link href="/wiki" className="text-slate-400 hover:text-white transition-colors">Wiki</Link>
                    <span className="text-slate-700">/</span>
                    <span className="text-white font-bold flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-sky-400" />รายการ Ratchet ทั้งหมด
                    </span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">

                {/* Hero */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black text-white">
                        รายการ <span className="text-sky-400">Ratchet</span> ทั้งหมด
                    </h1>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto">
                        ชื่อ Ratchet อ่านแบบนี้ —{' '}
                        <span className="font-mono text-amber-300">3-60</span>{' '}
                        = <strong className="text-white">3 แฉก</strong>, ความสูง{' '}
                        <strong className="text-white">6.0 mm</strong>
                    </p>
                    <p className="text-slate-500 text-xs">
                        ครบ {RATCHETS.length} รายการตามฐานข้อมูล • รูปทั้งหมดจาก{' '}
                        <code className="rounded bg-slate-800 px-1 text-slate-300">public/products/RATCHETS/</code>
                    </p>
                    {/* Height legend */}
                    <div className="flex justify-center gap-4 text-xs pt-1">
                        <span className="text-slate-300">≤6.0mm = เตี้ย</span>
                        <span className="text-amber-300">7.0mm = กลาง</span>
                        <span className="text-rose-300">≥8.0mm = สูง</span>
                    </div>
                </div>

                {/* Detailed Ratchet Taxonomy */}
                <div className="bg-[#0f1724] border border-slate-800 rounded-2xl p-5 space-y-4">
                    <h2 className="text-xl font-bold text-white">Ratchet Mechanical Taxonomy (Lab Specs, 2026)</h2>
                    <p className="text-slate-400 text-sm">Ratchet เป็นตัวกำหนดจุดศูนย์ถ่วงและ Burst resistance — ตารางด้านล่างสรุปโปรไฟล์ตามความสูงและน้ำหนักเฉลี่ย</p>
                    <div className="grid gap-4">
                        {RATCHET_GROUPS.map((g) => (
                            <div key={g.title} className="bg-[#0b1220] border border-slate-800 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-100">{g.title}</h3>
                                    {g.note && <div className="text-xs text-slate-400">{g.note}</div>}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm">
                                    {g.items.map(it => (
                                        <div key={it.code} className="rounded-md p-2 border border-slate-800 bg-slate-900/40">
                                            <div className="flex items-baseline justify-between">
                                                <div className="font-mono font-bold text-white">{it.code}</div>
                                                <div className="text-xs text-slate-400">{it.profile}</div>
                                            </div>
                                            <div className="text-xs text-slate-300 mt-1">
                                                <div>แฉก / ฟัน: <span className="font-bold text-white">{it.teeth}</span></div>
                                                <div>ความสูง: <span className="font-bold text-white">{it.heightMm} mm</span></div>
                                                {it.avgWeightG && <div>น้ำหนักเฉลี่ย: <span className="font-bold text-white">{it.avgWeightG} g</span></div>}
                                                {it.weightRange && <div>ช่วงน้ำหนัก: <span className="font-bold text-white">{it.weightRange}</span></div>}
                                                <div className="mt-1 text-slate-200">{it.character}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[#121826] border border-slate-800 rounded-2xl p-4 space-y-3">
                    <input
                        type="text"
                        placeholder="ค้นหา Ratchet… (เช่น 3-60, 9-80)"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 transition-all"
                    />
                    <div className="flex flex-wrap gap-2 justify-between">
                        {/* Sides */}
                        <div className="flex flex-wrap gap-1.5">
                            <span className="text-xs text-slate-500 self-center mr-1">แฉก:</span>
                            {allSides.map(s => (
                                <button key={s} onClick={() => setFilterSides(s)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                                        filterSides === s
                                            ? 'bg-amber-400 text-black border-amber-400'
                                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                                    }`}>
                                    {s === 'ALL' ? 'ทั้งหมด' : s === '0' ? 'กลม' : `${s} แฉก`}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="text-xs text-slate-500">แสดง {filtered.length} / {RATCHETS.length} Ratchets</div>
                </div>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {filtered.map((r, i) => <RatchetCard key={i} r={r} />)}
                    </div>
                ) : (
                    <div className="text-center py-16 text-slate-600">
                        <div className="text-4xl mb-2">🔍</div>
                        ไม่พบ Ratchet ที่ตรงกับเงื่อนไข
                    </div>
                )}

                {/* Guide box */}
                <div className="bg-[#121826] border border-slate-800 rounded-2xl p-5 space-y-3 text-sm">
                    <div className="font-bold text-white">แนะนำการเลือก Ratchet</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
                        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                            <div className="font-bold text-rose-400 mb-1">⚔ สาย Attack</div>
                            แฉกน้อย (1–3) ลด Burst Risk เพิ่มโอกาสชนแรง
                            แนะนำ: <span className="font-mono text-white">1-60, 2-60, 3-60</span>
                        </div>
                        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                            <div className="font-bold text-emerald-400 mb-1">🌀 สาย Stamina</div>
                            แฉกมาก (7–9) หรือกลม (0) กระจายน้ำหนัก L สูง
                            แนะนำ: <span className="font-mono text-white">0-80, 9-60, 9-70</span>
                        </div>
                        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                            <div className="font-bold text-blue-400 mb-1">🛡 สาย Defense</div>
                            สูง (8mm+) เพิ่มมุมรับแรง ทน Burst ปานกลาง
                            แนะนำ: <span className="font-mono text-white">3-80, 5-80, 3-85</span>
                        </div>
                    </div>
                </div>

                <div className="text-center text-xs text-slate-700 py-4">
                    ข้อมูลอ้างอิงจาก Takara Tomy Beyblade X Official • รูปจาก `public/products/RATCHETS/`
                </div>
            </main>

            <footer className="border-t border-slate-800 py-4 bg-slate-950 text-center text-xs text-slate-500">
                Beyblade X Wiki ภาษาไทย • Ratchets Reference
            </footer>
        </div>
    );
}
