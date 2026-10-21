import Link from 'next/link';
import { ChevronRight, Layers, Swords, Shield, Zap, RotateCw } from 'lucide-react';
import type { ReactNode } from 'react';
import { COLLECTION, type CollectionEntry } from '@/app/lib/collection-data';
import { PARTS_DB } from '@/app/lib/parts-db';

// ── Lookup helpers ─────────────────────────────────────────────────────────────
const ALL_BLADES = [...PARTS_DB.BX.blades, ...PARTS_DB.UX.blades, ...PARTS_DB.CX.blades];
const BLADE_BY_NAME = new Map(ALL_BLADES.map((b) => [b.name, b]));
const RATCHET_BY_ID = new Map(PARTS_DB.ratchets.map((r) => [r.id, r]));
const BIT_BY_ID = new Map(PARTS_DB.bits.map((b) => [b.id, b]));

const TYPE_COLOR: Record<string, string> = {
    Attack: 'text-red-400 bg-red-950/40 border-red-800/40',
    Defense: 'text-blue-400 bg-blue-950/40 border-blue-800/40',
    Stamina: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
    Balance: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
};

const TYPE_ICON: Record<string, ReactNode> = {
    Attack: <Swords className="w-3.5 h-3.5" />,
    Defense: <Shield className="w-3.5 h-3.5" />,
    Stamina: <RotateCw className="w-3.5 h-3.5" />,
    Balance: <Zap className="w-3.5 h-3.5" />,
};

interface Enriched extends CollectionEntry {
    series: string | null;
    bladeWeight: number | null;
    type: string | null;
    ratchetWeight: number | null;
    bitType: string | null;
    bitWeight: number | null;
    totalWeight: number | null;
}

function enrich(e: CollectionEntry): Enriched {
    const blade = BLADE_BY_NAME.get(e.blade);
    const ratchet = RATCHET_BY_ID.get(e.ratchet);
    const bit = BIT_BY_ID.get(e.bit);
    const total =
        blade && ratchet && bit
            ? Math.round((blade.weight + ratchet.weight + bit.weight) * 10) / 10
            : null;
    return {
        ...e,
        series: blade?.series ?? null,
        bladeWeight: blade?.weight ?? null,
        type: blade ? null : null, // placeholder, filled below
        ratchetWeight: ratchet?.weight ?? null,
        bitType: bit?.type ?? null,
        bitWeight: bit?.weight ?? null,
        totalWeight: total,
    };
}

// Determine a "primary type" label from the blade if known, else from bit type
function primaryType(e: Enriched): string {
    const blade = BLADE_BY_NAME.get(e.blade);
    if (blade) {
        // reuse atk/def/sta to guess dominant stat
        const { atk, def, sta } = blade;
        const max = Math.max(atk, def, sta);
        if (max === 0) return e.bitType ?? 'Balance';
        if (atk === max) return 'Attack';
        if (def === max) return 'Defense';
        if (sta === max) return 'Stamina';
        return 'Balance';
    }
    return e.bitType ?? 'Balance';
}

export default function CollectionPage() {
    const items = COLLECTION.map((e) => {
        const en = enrich(e);
        return { ...en, type: primaryType(en) };
    });

    const bySeries: Record<string, typeof items> = {};
    for (const it of items) {
        const key = it.series ?? 'ไม่ทราบซีรีส์';
        (bySeries[key] ??= []).push(it);
    }
    const seriesOrder = ['BX', 'UX', 'CX', 'ไม่ทราบซีรีส์'];
    const sortedSeries = seriesOrder.filter((s) => bySeries[s]);

    const counts = {
        total: items.length,
        BX: items.filter((i) => i.series === 'BX').length,
        UX: items.filter((i) => i.series === 'UX').length,
        CX: items.filter((i) => i.series === 'CX').length,
        unknown: items.filter((i) => !i.series).length,
    };

    return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans">
            <nav className="border-b border-slate-800 bg-[#121826]/90 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm flex-wrap">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                        <ChevronRight className="w-4 h-4 rotate-180" /> หน้าหลัก
                    </Link>
                    <span className="text-slate-700">/</span>
                    <Link href="/wiki" className="text-slate-400 hover:text-white transition-colors">Wiki</Link>
                    <span className="text-slate-700">/</span>
                    <span className="text-white font-bold flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-violet-400" /> My Collection
                    </span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
                {/* Hero */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 bg-violet-950/50 border border-violet-800/50 text-violet-400 text-xs font-bold px-4 py-1.5 rounded-full">
                        <Layers className="w-3.5 h-3.5" /> Personal Collection
                    </div>
                    <h1 className="text-4xl font-black text-white">
                        My <span className="text-violet-400">Collection</span>
                    </h1>
                    <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                        รวมเบย์ที่มีในมือ {counts.total} ลูก — บันทึกเป็น <strong className="text-white">สต็อกคอมโบ</strong> (จะอัปเดตคอมโบจริงภายหลัง)
                    </p>
                    <div className="flex justify-center gap-3 pt-1 flex-wrap">
                        {[
                            ['ทั้งหมด', counts.total],
                            ['BX', counts.BX],
                            ['UX', counts.UX],
                            ['CX', counts.CX],
                        ].map(([label, count]) => (
                            <div key={label as string} className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2 text-center min-w-[72px]">
                                <div className="text-2xl font-black text-violet-400">{count}</div>
                                <div className="text-xs text-slate-400">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Note */}
                <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl px-4 py-3 text-xs text-amber-200">
                    ⚠️ น้ำหนักและสถิติอ้างอิงจาก <code className="text-amber-300">parts-db.ts</code> (ค่าตัวแทน) — ของจริงอาจต่าง ±0.1–0.5g
                    คอมโบที่แสดงเป็น <strong>สต็อกคอมโบ</strong> จะอัปเดตเป็นคอมโบที่组装จริงภายหลัง
                </div>

                {/* Groups */}
                {sortedSeries.map((series) => (
                    <section
                        key={series}
                        className="bg-[#121826] border border-slate-800 rounded-2xl p-6 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-violet-400 flex items-center gap-2">
                                <Layers className="w-5 h-5" /> {series}
                            </h2>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-950/40 text-violet-400 border border-violet-800/40">
                                {bySeries[series].length} ลูก
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {bySeries[series].map((it) => {
                                const typeCls = TYPE_COLOR[it.type] ?? TYPE_COLOR.Balance;
                                return (
                                    <div
                                        key={it.id}
                                        className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-violet-700/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="font-bold text-white text-sm leading-tight">{it.blade}</div>
                                            <span
                                                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeCls}`}
                                            >
                                                {TYPE_ICON[it.type]} {it.type}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-mono">
                                            <span className="text-slate-400">{it.ratchet}</span>
                                            <span className="text-slate-600">·</span>
                                            <span className="text-slate-400">{it.bit}</span>
                                            {it.totalWeight !== null && (
                                                <>
                                                    <span className="text-slate-600">·</span>
                                                    <span className="text-slate-300">{it.totalWeight}g</span>
                                                </>
                                            )}
                                        </div>
                                        {it.bladeWeight !== null && (
                                            <div className="text-[10px] text-slate-500">
                                                Blade {it.bladeWeight}g
                                                {it.ratchetWeight !== null && ` · Ratchet ${it.ratchetWeight}g`}
                                                {it.bitWeight !== null && ` · Bit ${it.bitWeight}g`}
                                            </div>
                                        )}
                                        {it.note && (
                                            <div className="text-[11px] text-slate-400 leading-snug border-t border-slate-800 pt-2">
                                                {it.note}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}

                <div className="text-center text-xs text-slate-600 py-4">
                    ข้อมูลจาก <code className="text-slate-400">info/my-collection.md</code> · อัปเดตล่าสุด 2026-10-21
                </div>
            </main>

            <footer className="border-t border-slate-800 py-4 bg-slate-950 text-center text-xs text-slate-500">
                Beyblade X — My Collection
            </footer>
        </div>
    );
}