'use client';

import { Layers, Plus } from 'lucide-react';
import type { BladePart, SubBladePart, RatchetPart, BitPart, SystemType } from '../lib/types';
import { PARTS_DB } from '../lib/parts-db';

interface ComboBuilderProps {
    system: SystemType;
    selectedBlade: BladePart;
    selectedSubBlade: SubBladePart | null;
    selectedRatchet: RatchetPart;
    selectedBit: BitPart;
    onSystemChange: (sys: SystemType) => void;
    onBladeChange: (blade: BladePart) => void;
    onSubBladeChange: (sb: SubBladePart) => void;
    onRatchetChange: (ratchet: RatchetPart) => void;
    onBitChange: (bit: BitPart) => void;
    onLoadPreset: (name: string) => void;
    onAddToDeckSlot: (index: number) => void;
}

export default function ComboBuilder({
    system,
    selectedBlade,
    selectedSubBlade,
    selectedRatchet,
    selectedBit,
    onSystemChange,
    onBladeChange,
    onSubBladeChange,
    onRatchetChange,
    onBitChange,
    onLoadPreset,
    onAddToDeckSlot,
}: ComboBuilderProps) {
    return (
        <div className="space-y-6">

            {/* System Selector */}
            <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-sm shadow-lg shadow-slate-950/30 hover:shadow-cyan-500/10 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-cyan-400" /> เลือกรุ่น/ระบบสินค้า (Series)
                    </label>
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-950/50 to-cyan-900/50 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                        {system} SYSTEM
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {(['BX', 'UX', 'CX'] as SystemType[]).map((sys) => (
                        <button
                            key={sys}
                            id={`system-btn-${sys}`}
                            onClick={() => onSystemChange(sys)}
                            className={`py-3 px-4 rounded-xl border text-center font-bold text-sm transition-all duration-200 ${system === sys
                                ? 'border-cyan-400 bg-gradient-to-r from-cyan-500/30 to-cyan-600/20 text-cyan-300 shadow-lg shadow-cyan-500/30'
                                : 'border-slate-700/50 bg-slate-800/30 text-slate-400 hover:border-slate-600/50 hover:bg-slate-800/50'
                                }`}
                        >
                            {sys} System
                        </button>
                    ))}
                </div>
            </div>

            {/* Parts Dropdowns */}
            <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 p-8 rounded-3xl border border-slate-700/50 space-y-7 backdrop-blur-sm shadow-lg shadow-slate-950/30 hover:shadow-cyan-500/10 transition-all duration-300">

                {/* Sub-blade Selector for CX */}
                {system === 'CX' && (
                    <div className="space-y-3 pb-6 border-b border-slate-700/50">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                                Sub-Blade / Core Ring (ชิ้นส่วนย่อย CX)
                            </label>
                            <span className="text-xs text-yellow-400 font-bold bg-yellow-950/30 px-2.5 py-1 rounded-full border border-yellow-500/30">
                                +{selectedSubBlade?.weight}g
                            </span>
                        </div>
                        <select
                            id="select-subblade"
                            value={selectedSubBlade?.id}
                            onChange={(e) => {
                                const sb = PARTS_DB.CX.subblades.find(s => s.id === e.target.value);
                                if (sb) onSubBladeChange(sb);
                            }}
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all cursor-pointer backdrop-blur-sm hover:border-slate-600/50"
                        >
                            {PARTS_DB.CX.subblades.map(sb => (
                                <option key={sb.id} value={sb.id}>{sb.name} (+{sb.weight}g)</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* 1. Blade Selection */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-[11px] font-bold border border-red-500/30">1</span>
                            <span>Blade (ชิ้นส่วนบนสุด)</span>
                        </label>
                        <span className="text-xs text-yellow-400 font-bold bg-yellow-950/30 px-2.5 py-1 rounded-full border border-yellow-500/30">{selectedBlade.weight}g</span>
                    </div>
                    <select
                        id="select-blade"
                        value={selectedBlade.id}
                        onChange={(e) => {
                            const blades = PARTS_DB[system].blades;
                            const b = blades.find((item: BladePart) => item.id === e.target.value);
                            if (b) onBladeChange(b);
                        }}
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all cursor-pointer backdrop-blur-sm hover:border-slate-600/50"
                    >
                        {PARTS_DB[system].blades.map((b: BladePart) => (
                            <option key={b.id} value={b.id}>{b.code ? `${b.code} ${b.name}` : b.name} ({b.weight}g)</option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-400 italic px-2 py-2 bg-slate-950/30 rounded-lg border border-slate-800/50">{selectedBlade.desc}</p>
                </div>

                {/* 2. Ratchet Selection */}
                <div className="space-y-3 pb-6 border-b border-slate-700/50">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[11px] font-bold border border-blue-500/30">2</span>
                            <span>Ratchet (ส่วนล็อกกลาง / ความสูง)</span>
                        </label>
                        <span className="text-xs text-yellow-400 font-bold bg-yellow-950/30 px-2.5 py-1 rounded-full border border-yellow-500/30">{selectedRatchet.weight}g</span>
                    </div>
                    <select
                        id="select-ratchet"
                        value={selectedRatchet.id}
                        onChange={(e) => {
                            const r = PARTS_DB.ratchets.find((item: RatchetPart) => item.id === e.target.value);
                            if (r) onRatchetChange(r);
                        }}
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all cursor-pointer backdrop-blur-sm hover:border-slate-600/50"
                    >
                        {PARTS_DB.ratchets.map((r: RatchetPart) => (
                            <option key={r.id} value={r.id}>{r.name} ({r.weight}g)</option>
                        ))}
                    </select>
                    <div className="flex gap-4 text-xs text-slate-400 px-2 py-2 bg-slate-950/30 rounded-lg border border-slate-800/50">
                        <span>ความสูง: <strong className="text-slate-200">{selectedRatchet.height}mm</strong></span>
                        <span>มุม/แฉก: <strong className="text-slate-200">{selectedRatchet.sides} แฉก</strong></span>
                    </div>
                </div>

                {/* 3. Bit Selection */}
                <div className="space-y-3 pb-6 border-b border-slate-700/50">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-bold border border-emerald-500/30">3</span>
                            <span>Bit (แกนล่าง / ฟันเฟือง X-Dash)</span>
                        </label>
                        <span className="text-xs text-yellow-400 font-bold bg-yellow-950/30 px-2.5 py-1 rounded-full border border-yellow-500/30">{selectedBit.weight}g</span>
                    </div>
                    <select
                        id="select-bit"
                        value={selectedBit.id}
                        onChange={(e) => {
                            const bt = PARTS_DB.bits.find((item: BitPart) => item.id === e.target.value);
                            if (bt) onBitChange(bt);
                        }}
                        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all cursor-pointer backdrop-blur-sm hover:border-slate-600/50"
                    >
                        {PARTS_DB.bits.map((bt: BitPart) => (
                            <option key={bt.id} value={bt.id}>{bt.name} ({bt.weight}g)</option>
                        ))}
                    </select>
                    <div className="flex justify-between text-xs text-slate-400 px-2 py-2 bg-slate-950/30 rounded-lg border border-slate-800/50">
                        <span>สปริงล็อก: <strong className="text-slate-200">{selectedBit.bst >= 15 ? 'แน่นพิเศษ (High)' : 'ปกติ (Normal)'}</strong></span>
                        <span>สายหลัก: <strong className="text-slate-200">{selectedBit.type}</strong></span>
                    </div>
                </div>

                {/* Quick Presets */}
                <div className="pt-6 flex flex-wrap items-center justify-between gap-3 bg-slate-950/30 p-4 rounded-xl border border-slate-700/50">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">⚡ แนะนำคอมโบ Meta:</span>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { name: 'DranSword', label: 'DranSword 3-60F' },
                            { name: 'WizardRod', label: 'WizardRod 9-60B' },
                            { name: 'PhoenixWing', label: 'PhoenixWing 5-60P' },
                            { name: 'DranBuster', label: 'DranBuster 1-60A' },
                        ].map(p => (
                            <button
                                key={p.name}
                                id={`preset-${p.name}`}
                                onClick={() => onLoadPreset(p.name)}
                                className="text-xs bg-gradient-to-r from-slate-700/50 to-slate-800/50 hover:from-slate-600/70 hover:to-slate-700/70 px-3 py-1.5 rounded-lg text-slate-300 transition-all border border-slate-600/30 hover:border-cyan-500/50 font-medium"
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Add to Deck Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    id="add-deck-slot-1"
                    onClick={() => onAddToDeckSlot(0)}
                    className="py-4 px-5 bg-gradient-to-br from-blue-600/80 to-blue-700/80 hover:from-blue-500 hover:to-blue-600 text-white rounded-2xl font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-900/40 hover:shadow-blue-500/30 flex items-center justify-center gap-2 border border-blue-400/20 hover:border-blue-400/40 active:scale-95"
                >
                    <Plus className="w-5 h-5" /> ใส่เด็ค Slot 1
                </button>
                <button
                    id="add-deck-slot-2"
                    onClick={() => onAddToDeckSlot(1)}
                    className="py-4 px-5 bg-gradient-to-br from-indigo-600/80 to-indigo-700/80 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-2xl font-bold text-sm transition-all duration-200 shadow-lg shadow-indigo-900/40 hover:shadow-indigo-500/30 flex items-center justify-center gap-2 border border-indigo-400/20 hover:border-indigo-400/40 active:scale-95"
                >
                    <Plus className="w-5 h-5" /> ใส่เด็ค Slot 2
                </button>
                <button
                    id="add-deck-slot-3"
                    onClick={() => onAddToDeckSlot(2)}
                    className="py-4 px-5 bg-gradient-to-br from-purple-600/80 to-purple-700/80 hover:from-purple-500 hover:to-purple-600 text-white rounded-2xl font-bold text-sm transition-all duration-200 shadow-lg shadow-purple-900/40 hover:shadow-purple-500/30 flex items-center justify-center gap-2 border border-purple-400/20 hover:border-purple-400/40 active:scale-95"
                >
                    <Plus className="w-5 h-5" /> ใส่เด็ค Slot 3
                </button>
            </div>

        </div>
    );
}
