'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, X, Zap } from 'lucide-react';
import { PARTS_DB } from '../../lib/parts-db';
import type { BitPart } from '../../lib/types';

interface BitEntry {
    code?: string;
    abbr: string;
    name: string;
    type: 'Attack' | 'Stamina' | 'Defense' | 'Balance';
    desc: string;
    img: string;
    weight: number;
    speed: number;
    atk: number;
    def: number;
    sta: number;
    burstResist: number;
}

// แสดงเฉพาะ Bit ที่มีไฟล์รูปใน public/products/BITS/ ตาม readme.md (25 รายการ)
const BITS: BitEntry[] = PARTS_DB.bits.filter((b: BitPart): b is BitPart & { img: string } => Boolean(b.img)).map((b: BitPart & { img: string }) => {
    const m = b.name.match(/\(([^)]+)\)/);
    const name = m ? m[1] : b.name;
    return {
        abbr: b.id,
        name,
        type: b.type as BitEntry['type'],
        desc: b.desc,
        img: b.img,
        weight: b.weight,
        speed: b.speed,
        atk: b.atk,
        def: b.def,
        sta: b.sta,
        burstResist: b.burstResist,
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

const TYPE_IMG: Record<BitEntry['type'], string> = {
    Attack:  '/products/TYPE/attack.png',
    Stamina: '/products/TYPE/stamina.png',
    Defense: '/products/TYPE/defense.png',
    Balance: '/products/TYPE/balance.png',
};

type FilterType = 'ALL' | 'Attack' | 'Stamina' | 'Defense' | 'Balance';

/** สรุปรูปแบบการเคลื่อนที่จากชนิดปลาย + ความเร็ว + คำอธิบายของ Bit */
function movementText(bit: BitEntry): string {
    const base = bit.desc.split('—')[0].trim();
    if (bit.type === 'Attack') {
        if (bit.speed >= 85) return `${base} — ออกตัวพุ่งเป็นวงกว้างแล้วเร่งเข้าหาคู่แข่งทันที`;
        if (bit.speed >= 60) return `${base} — วิ่งเป็นวงและสลับเป็นแนวเข้าชนตามจังหวะ`;
        return `${base} — เคลื่อนที่ระยะสั้น เน้นชนระยะประชิดมากกว่าวิ่งรอบสนาม`;
    }
    if (bit.type === 'Stamina') {
        if (bit.speed <= 30) return `${base} — หมุนทรงตัวอยู่กับที่ วงหมุนแคบและสูญเสียพลังงานน้อย`;
        return `${base} — ไถลเป็นวงแคบช้าๆ ก่อนทรงตัวเข้าสู่การหมุนนิ่ง`;
    }
    if (bit.type === 'Defense') {
        if (bit.speed <= 25) return `${base} — ปักหลักกลางสนาม ขยับน้อยเมื่อรับแรงชน`;
        return `${base} — ยึดพื้นที่และสไลด์รับแรงชนก่อนกลับเข้าศูนย์กลาง`;
    }
    if (bit.speed >= 60) return `${base} — ออกตัวเร็วในช่วงแรก แล้วค่อยๆ ทรงตัวเป็นการหมุนนิ่ง`;
    return `${base} — เคลื่อนที่ผสมระหว่างไถลและหมุนนิ่งตามแรงเหวี่ยง`;
}

/** ข้อดี/ข้อเสีย สรุปจากสถิติใน PARTS_DB (ไม่ใช่ค่าที่เดาขึ้นใหม่) */
function bitProfile(bit: BitEntry): { pros: string[]; cons: string[] } {
    const pros: string[] = [];
    const cons: string[] = [];

    if (bit.speed >= 85) pros.push('ความเร็วออกตัวสูงมาก ใช้กดดันคู่แข่งได้ก่อน');
    else if (bit.speed >= 65) pros.push('ออกตัวไว ใช้เปลี่ยนจังหวะได้ดี');
    if (bit.atk >= 25) pros.push('พลังโจมตีสูง เหมาะกับการทำ Finish');
    if (bit.def >= 30) pros.push('กันกระแทกได้ดี ตั้งรับแน่น');
    if (bit.sta >= 30) pros.push('หมุนได้นาน เหมาะกับเกมยืดเยื้อ');
    if (bit.burstResist >= 3) pros.push('ทนทานต่อการ Burst');

    if (bit.speed < 30) cons.push('ความเร็วต่ำ ตามเกมรุกของคู่แข่งได้ยาก');
    else if (bit.speed < 50) cons.push('ความเร็วไม่สูง ต้องอาศัยจังหวะ');
    if (bit.atk < 10) cons.push('พลังโจมตีน้อย');
    if (bit.def < 15) cons.push('รับแรงชนได้จำกัด');
    if (bit.sta < 15) cons.push('พลังการหมุนหมดไว');
    if (bit.burstResist <= 1) cons.push('กัน Burst ได้น้อย');

    if (pros.length < 2) pros.push(bit.weight <= 2.2 ? 'น้ำหนักเบา ช่วยให้แกนหมุนคล่องตัว' : 'น้ำหนักช่วยเพิ่มแรงเฉื่อยในการหมุน');
    if (cons.length < 2) cons.push(bit.weight <= 2.2 ? 'น้ำหนักเบา จึงถูกชนเคลื่อนที่ได้ง่าย' : 'น้ำหนักมาก อาจออกตัวช้ากว่า');

    return { pros: pros.slice(0, 4), cons: cons.slice(0, 4) };
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className="w-9 text-[10px] font-black text-slate-500">{label}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, (value / 40) * 100)}%` }} />
            </div>
            <span className="w-6 text-right text-[11px] font-bold text-slate-300">{value}</span>
        </div>
    );
}

function Prop({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
            <div className="text-[10px] text-slate-500">{label}</div>
            <div className="text-sm font-bold text-white">{value}</div>
        </div>
    );
}

function BitCard({ bit, onSelect }: { bit: BitEntry; onSelect: (bit: BitEntry) => void }) {
    return (
        <button
            type="button"
            onClick={() => onSelect(bit)}
            aria-label={`เปิดรายละเอียด ${bit.abbr} ${bit.name}`}
            className={`group w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-[#121826] text-left transition-all hover:-translate-y-0.5 hover:border-slate-600 hover:shadow-lg ${TYPE_GLOW[bit.type]}`}
        >
            <div className="relative flex h-32 items-center justify-center bg-slate-950 p-3">
                <Image
                    src={`/products/BITS/${bit.img}.png`}
                    alt={bit.name}
                    width={88} height={88}
                    className="max-h-24 w-auto object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                {bit.code && (
                    <span className="absolute left-2 top-2 rounded border border-slate-700 bg-slate-900/80 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">{bit.code}</span>
                )}
            </div>
            <div className="space-y-2 p-3">
                <div className="flex items-center justify-between gap-1">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black leading-none text-white">{bit.abbr}</span>
                        <span className="text-xs text-slate-400">{bit.name}</span>
                    </div>
                    <span className={`flex shrink-0 items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-bold ${TYPE_STYLE[bit.type]}`}>
                        <Image
                            src={TYPE_IMG[bit.type]}
                            alt=""
                            width={14}
                            height={14}
                            className="h-3.5 w-3.5 object-contain"
                        />
                        {bit.type}
                    </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-500">{bit.desc}</p>
                <div className="text-[10px] text-slate-600 transition-colors group-hover:text-amber-400">คลิกเพื่อดูรายละเอียด →</div>
            </div>
        </button>
    );
}

function BitDetail({ bit, onClose }: { bit: BitEntry; onClose: () => void }) {
    const { pros, cons } = bitProfile(bit);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={`รายละเอียด ${bit.abbr} ${bit.name}`}
            onClick={onClose}
        >
            <div
                className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#101725] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="ปิดรายละเอียด"
                    className="absolute right-3 top-3 z-10 rounded-lg border border-slate-700 bg-slate-900/80 p-1.5 text-slate-400 transition-colors hover:border-slate-500 hover:text-white"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="grid md:grid-cols-[240px_1fr]">
                    <div className="flex flex-col items-center justify-center gap-3 border-b border-slate-800 bg-slate-950 p-6 md:border-b-0 md:border-r">
                        <Image
                            src={`/products/BITS/${bit.img}.png`}
                            alt={bit.name}
                            width={144} height={144}
                            className="h-36 w-36 object-contain drop-shadow-2xl"
                        />
                        <span className={`flex items-center gap-1 rounded border px-2.5 py-1 text-xs font-bold ${TYPE_STYLE[bit.type]}`}>
                            <Image
                                src={TYPE_IMG[bit.type]}
                                alt=""
                                width={16}
                                height={16}
                                className="h-4 w-4 object-contain"
                            />
                            {bit.type}
                        </span>
                    </div>

                    <div className="space-y-5 p-6">
                        <div>
                            <div className="text-3xl font-black leading-none text-white">{bit.abbr}</div>
                            <div className="mt-1 text-sm text-slate-400">{bit.name}</div>
                        </div>

                        <p className="text-sm leading-relaxed text-slate-300">{bit.desc}</p>

                        <div className="space-y-2">
                            <h3 className="text-xs font-black text-slate-400">คุณสมบัติทางกายภาพ</h3>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                <Prop label="น้ำหนัก" value={`${bit.weight} g`} />
                                <Prop label="ความเร็ว" value={`${bit.speed}/100`} />
                                <Prop label="Burst Resist" value={`${bit.burstResist}/5`} />
                            </div>
                            <div className="space-y-1.5 pt-1">
                                <StatBar label="ATK" value={bit.atk} color="bg-rose-500" />
                                <StatBar label="DEF" value={bit.def} color="bg-blue-500" />
                                <StatBar label="STA" value={bit.sta} color="bg-emerald-500" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-xs font-black text-slate-400">รูปแบบการเคลื่อนที่</h3>
                            <p className="text-sm leading-relaxed text-slate-300">{movementText(bit)}</p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-3">
                                <h3 className="mb-2 text-xs font-black text-emerald-400">ข้อดี</h3>
                                <ul className="space-y-1.5">
                                    {pros.map((p) => (
                                        <li key={p} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                                            <span className="mt-0.5 shrink-0 text-emerald-400">+</span>
                                            <span>{p}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-3">
                                <h3 className="mb-2 text-xs font-black text-rose-400">ข้อเสีย</h3>
                                <ul className="space-y-1.5">
                                    {cons.map((c) => (
                                        <li key={c} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                                            <span className="mt-0.5 shrink-0 text-rose-400">−</span>
                                            <span>{c}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <p className="text-[11px] leading-relaxed text-slate-600">
                            * ข้อดี/ข้อเสียสรุปจากการวิเคราะห์สถิติในระบบและลักษณะปลายตามคำอธิบายของ Bit
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BitsPage() {
    const [filterType, setFilterType] = useState<FilterType>('ALL');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<BitEntry | null>(null);

    const filtered = BITS.filter(b => {
        if (filterType !== 'ALL' && b.type !== filterType) return false;
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
                    <p className="text-slate-400 text-sm">Bit คือชิ้นส่วนปลายแกนล่าง — ครบ 25 รายการตาม <code className="rounded bg-slate-800 px-1 text-slate-300">public/products/BITS/readme.md</code></p>
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
                                    {group.items.map((bit, i) => <BitCard key={`${bit.abbr}-${i}`} bit={bit} onSelect={setSelected} />)}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-slate-600"><div className="text-4xl mb-2">🔍</div>ไม่พบ Bit ที่ตรงกับเงื่อนไข</div>
                )}

                <div className="text-center text-xs text-slate-700 py-4">
                    ข้อมูลอ้างอิงจาก Takara Tomy Beyblade X / BeyBuilder X (Fabel) • รูปทั้งหมดจาก `public/products/BITS/` • แสดงเฉพาะรายการที่มีรูปตาม readme.md
                </div>
            </main>

            <footer className="border-t border-slate-800 py-4 bg-slate-950 text-center text-xs text-slate-500">
                Beyblade X Wiki ภาษาไทย • Bits Reference (จำแนกตามสาย)
            </footer>

            {selected && <BitDetail bit={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}
