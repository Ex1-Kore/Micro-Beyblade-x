'use client';

import Image from 'next/image';
import { Flame, Shield, RotateCw, Zap, Sparkles, Award, Info } from 'lucide-react';
import type { BladePart, BitPart, RatchetPart, SystemType, ComboStats } from '../lib/types';
import { BX_PRODUCT_IMAGE_MAP } from '../lib/bx-product-images';

interface BeyCardProps {
    system: SystemType;
    selectedBlade: BladePart;
    selectedRatchet: RatchetPart;
    selectedBit: BitPart;
    comboStats: ComboStats;
    isSpinning: boolean;
    onSpin: () => void;
}

const TYPE_COLOR_MAP = {
    Attack: { glow: 'bg-red-500', badge: 'bg-red-500/20 text-red-400 border-red-500/40' },
    Defense: { glow: 'bg-blue-500', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
    Stamina: { glow: 'bg-emerald-500', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
    Balance: { glow: 'bg-purple-500', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
};

/** สร้าง path รูป: BX ใช้ /products/BX/<file>.png, อื่นๆ /blade/<series>/<img>.png */
function getBladeImgPath(blade: BladePart): string | null {
    if (blade.series === 'BX') {
        const file = BX_PRODUCT_IMAGE_MAP[blade.name];
        if (file) return `/products/BX/${encodeURIComponent(file)}`;
    }
    if (!blade.img) return null;
    return `/blade/${blade.series.toLowerCase()}/${blade.img}.png`;
}

interface StatBarProps {
    label: string; value: number; icon: React.ReactNode; color: string; barColor: string;
}
function StatBar({ label, value, icon, color, barColor }: StatBarProps) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-1.5">{icon} {label}</span>
                <span className={`${color} font-bold`}>{value}</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}

export default function BeyCard({
    system, selectedBlade, selectedRatchet, selectedBit,
    comboStats, isSpinning, onSpin,
}: BeyCardProps) {
    const typeColors = TYPE_COLOR_MAP[comboStats.primaryType];
    const imgPath = getBladeImgPath(selectedBlade);
    const isLeftSpin = ['dragoon', 'l-drago', 'cobalt drag'].some(s =>
        selectedBlade.name.toLowerCase().includes(s)
    );

    return (
        <>
            {/* ── Visual Bey Card ─────────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 p-8 rounded-3xl border border-slate-700/50 relative overflow-hidden flex flex-col items-center backdrop-blur-sm shadow-2xl shadow-slate-950/50 hover:shadow-cyan-500/10 transition-all duration-300">

                {/* Background Glow */}
                <div className={`absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none ${typeColors.glow}`} />

                {/* Badges */}
                <div className="w-full flex justify-between items-center mb-6 z-10 gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border uppercase shadow-lg ${typeColors.badge} bg-opacity-50 backdrop-blur-sm flex items-center gap-2`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`/products/TYPE/${comboStats.primaryType.toLowerCase()}.png`}
                            alt={comboStats.primaryType}
                            className="w-4 h-4 object-contain"
                        />
                        {comboStats.primaryType} TYPE
                    </span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500/30 to-amber-400/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/20">
                        {comboStats.tier}
                    </span>
                </div>

                {/* Spinner */}
                <div
                    id="bey-spinner"
                    onClick={onSpin}
                    className="relative my-6 w-56 h-56 flex items-center justify-center cursor-pointer group hover:scale-105 transition-transform duration-300"
                >
                    <div className={`w-56 h-56 flex items-center justify-center transition-transform duration-1000 ease-out ${isSpinning ? 'rotate-[1080deg]' : 'rotate-0'}`}>
                        {imgPath ? (
                            /* รูปจริง */
                            <div className="relative w-48 h-48">
                                <div className={`absolute inset-0 rounded-full blur-2xl opacity-40 ${typeColors.glow}`} />
                                <Image
                                    src={imgPath}
                                    alt={selectedBlade.name}
                                    fill
                                    className="object-contain drop-shadow-2xl"
                                    sizes="176px"
                                    priority
                                />
                            </div>
                        ) : (
                            /* fallback gradient */
                            <div className="w-40 h-40 rounded-full border-4 border-dashed border-slate-700 flex items-center justify-center">
                                <div className={`w-32 h-32 rounded-3xl bg-gradient-to-tr ${selectedBlade.color} border-4 border-slate-300 flex items-center justify-center shadow-2xl`}>
                                    <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-xl bg-cyan-600/30 border border-cyan-400 flex items-center justify-center">
                                            <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center text-black font-extrabold text-[10px]">
                                                {selectedBit.id}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bit badge ทับมุม */}
                    {imgPath && (
                        <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-slate-900/95 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 font-black text-[11px] shadow-lg shadow-cyan-500/30 z-10">
                            {selectedBit.id}
                        </div>
                    )}

                    <div className="absolute -bottom-3 text-[10px] text-slate-500 group-hover:text-cyan-400 transition-colors whitespace-nowrap">
                        คลิกเพื่อทดลองหมุน
                    </div>
                </div>

                {/* Title */}
                <div className="text-center z-10 space-y-1 mt-1">
                    <h2 className="text-2xl font-black text-white tracking-wide">
                        {selectedBlade.name} {selectedRatchet.name}{selectedBit.id}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                        {system} Line • {isLeftSpin ? 'Left Spin' : 'Right Spin'}
                    </p>
                </div>

                {/* Weight */}
                <div className="w-full mt-5 pt-4 border-t border-slate-800 flex justify-between items-center text-sm z-10">
                    <span className="text-slate-400">น้ำหนักรวมประมาณการ:</span>
                    <span className="font-bold text-yellow-400 text-lg">{comboStats.totalWeight} g</span>
                </div>
            </div>

            {/* ── Stat Gauges ─────────────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 p-8 rounded-3xl border border-slate-700/50 space-y-6 backdrop-blur-sm shadow-2xl shadow-slate-950/50 hover:shadow-cyan-500/10 transition-all duration-300">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-100 uppercase tracking-widest flex items-center gap-2">
                        <Award className="w-5 h-5 text-cyan-400" /> ค่าพลังวิเคราะห์ (Stats)
                    </h3>
                    <span className="text-sm font-bold text-cyan-300 bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-500/30">คะแนน: {comboStats.overallScore}/100</span>
                </div>
                <div className="space-y-3">
                    <StatBar label="พลังโจมตี (Attack)" value={comboStats.attack} icon={<Flame className="w-3.5 h-3.5 text-red-500" />} color="text-red-400" barColor="bg-gradient-to-r from-red-600 to-red-400" />
                    <StatBar label="พลังป้องกัน (Defense)" value={comboStats.defense} icon={<Shield className="w-3.5 h-3.5 text-blue-500" />} color="text-blue-400" barColor="bg-gradient-to-r from-blue-600 to-blue-400" />
                    <StatBar label="ความทนทาน (Stamina)" value={comboStats.stamina} icon={<RotateCw className="w-3.5 h-3.5 text-emerald-500" />} color="text-emerald-400" barColor="bg-gradient-to-r from-emerald-600 to-emerald-400" />
                    <StatBar label="ความเร็ว X-Dash" value={comboStats.speed} icon={<Zap className="w-3.5 h-3.5 text-yellow-400" />} color="text-yellow-400" barColor="bg-gradient-to-r from-yellow-500 to-amber-300" />
                    <StatBar label="ต้านทานระเบิด (Burst Resist)" value={comboStats.burstResist} icon={<Sparkles className="w-3.5 h-3.5 text-purple-400" />} color="text-purple-400" barColor="bg-gradient-to-r from-purple-600 to-purple-400" />
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-700/50 text-sm leading-relaxed text-slate-200 space-y-2 backdrop-blur-sm">
                    <div className="font-bold text-cyan-400 flex items-center gap-2">
                        <Info className="w-4 h-4" /> ผลวิเคราะห์จุดเด่นจุดอ่อน:
                    </div>
                    <p>{comboStats.analysis}</p>
                </div>
            </div>
        </>
    );
}
