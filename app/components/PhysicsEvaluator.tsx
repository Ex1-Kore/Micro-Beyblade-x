'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Wind, ShieldAlert, Clock, Save, CheckCircle, Info, ChevronDown, ChevronUp, FlaskConical } from 'lucide-react';
import type { Combo } from '../lib/types';
import { calcPhysics, MU_BY_TYPE } from '../lib/physics';

interface PhysicsEvaluatorProps {
    currentCombo: Combo;
}

// ── FormulaBox — กล่องอธิบายสูตร ─────────────────────────────────────────────
function FormulaBox({ label, formula, desc, value, unit, color = 'text-sky-400' }: {
    label: string; formula: string; desc: string;
    value: string; unit: string; color?: string;
}) {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-3 space-y-1">
            <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
                    <div className={`text-xl font-black ${color}`}>{value} <span className="text-sm font-semibold text-slate-400">{unit}</span></div>
                </div>
                <button
                    onClick={() => setOpen(v => !v)}
                    className="mt-1 p-1 rounded-lg text-slate-500 hover:text-sky-400 hover:bg-slate-800 transition-colors shrink-0"
                    title="ดูสูตร"
                >
                    {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>
            {open && (
                <div className="border-t border-slate-700 pt-2 space-y-1 text-xs">
                    <div className="font-mono text-amber-300 bg-slate-950 px-2 py-1 rounded">{formula}</div>
                    <div className="text-slate-400 leading-relaxed">{desc}</div>
                </div>
            )}
        </div>
    );
}

// ── RpmMeter ─────────────────────────────────────────────────────────────────
function RpmMeter({ rpm, band }: { rpm: number; band: string }) {
    const pct = Math.min(100, (rpm / 10000) * 100);
    const color = band === 'low' ? 'bg-amber-500' : band === 'optimal' ? 'bg-emerald-500' : 'bg-rose-500';
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
                <span>0 RPM</span><span>10,000 RPM</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Low</span>
                <span className="text-slate-400">Optimal</span>
                <span className="text-slate-400">Extreme</span>
            </div>
        </div>
    );
}

// ── SavedComboBadge ───────────────────────────────────────────────────────────
function SavedBadge({ name }: { name: string }) {
    return (
        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-700 rounded-xl px-3 py-2 text-sm text-emerald-400">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>บันทึก <strong>{name}</strong> ลง DB แล้ว</span>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PhysicsEvaluator({ currentCombo }: PhysicsEvaluatorProps) {
    const [rpm, setRpm]             = useState(5500);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [linearSpeed, setLinear]  = useState(3.5);
    const [angleDeg, setAngle]      = useState(45);
    const [saving, setSaving]       = useState(false);
    const [savedName, setSavedName] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    const totalWeight = useMemo(() => {
        let w = currentCombo.blade.weight + currentCombo.ratchet.weight + currentCombo.bit.weight;
        if (currentCombo.subblade) w += currentCombo.subblade.weight;
        return w;
    }, [currentCombo]);

    const result = useMemo(() => calcPhysics({
        totalWeightG:    totalWeight,
        inertiaFactor:   currentCombo.blade.inertiaFactor,
        rpm,
        timeElapsedS:    timeElapsed,
        linearSpeedMs:   linearSpeed,
        angleDeg,
        ratchetSides:    currentCombo.ratchet.sides,
        ratchetHeightMm: currentCombo.ratchet.height,
        bitBurstResist:  currentCombo.bit.burstResist,
        bitType:         currentCombo.bit.type,
    }), [totalWeight, currentCombo, rpm, timeElapsed, linearSpeed, angleDeg]);

    const burstColor = result.burstRiskLevel === 'low'
        ? 'text-emerald-400' : result.burstRiskLevel === 'moderate'
        ? 'text-amber-400' : 'text-rose-500';

    const burstLabel = result.burstRiskLevel === 'low'
        ? 'ต่ำ (Low)' : result.burstRiskLevel === 'moderate'
        ? 'ปานกลาง (Moderate)' : 'สูง (High!)';

    const handleSave = useCallback(async () => {
        setSaving(true);
        setSavedName(null);
        setSaveError(null);
        try {
            const res = await fetch('/api/combos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system:          currentCombo.system,
                    bladeId:         currentCombo.blade.id,
                    ratchetId:       currentCombo.ratchet.id,
                    bitId:           currentCombo.bit.id,
                    subBladeId:      currentCombo.subblade?.id ?? null,
                    rpm,
                    linearSpeed,
                    angleDeg,
                    totalKE:         result.totalKE,
                    impactForce:     result.impactForce,
                    angularMomentum: result.angularMomentum,
                    burstRiskLevel:  result.burstRiskLevel,
                }),
            });
            const json = await res.json() as { ok: boolean; data?: { name: string }; error?: string };
            if (json.ok && json.data) {
                setSavedName(json.data.name);
            } else {
                setSaveError(json.error ?? 'Unknown error');
            }
        } catch (e) {
            setSaveError(String(e));
        } finally {
            setSaving(false);
        }
    }, [currentCombo, rpm, linearSpeed, angleDeg, result]);

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="bg-[#121826] p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <FlaskConical className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">ประเมินฟิสิกส์การชน</h2>
                        <p className="text-xs text-slate-400">คำนวณตามหลักกลศาสตร์ Angular Momentum & Impulse</p>
                    </div>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">รอบเริ่มต้น (Initial RPM)</label>
                        <input
                            type="number" value={rpm} min={500} max={10000} step={100}
                            onChange={e => setRpm(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400 transition-all"
                        />
                        <div className="text-[11px] text-slate-500">ตอนยิงจากลันเชอร์</div>
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-amber-400">เวลาที่ผ่านไป {timeElapsed}s</label>
                        <input
                            type="range" value={timeElapsed} min={0} max={60} step={1}
                            onChange={e => setTimeElapsed(Number(e.target.value))}
                            className="w-full accent-amber-500 mt-2"
                        />
                        <div className="text-[11px] text-slate-500">จำลองรอบตกตามเวลา</div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">ความเร็วเชิงเส้น (m/s)</label>
                        <input
                            type="number" value={linearSpeed} min={0.5} max={10} step={0.1}
                            onChange={e => setLinear(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400 transition-all"
                        />
                        <div className="text-[11px] text-slate-500">v = ความเร็วก่อนชน</div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400">มุมปะทะ (°)</label>
                        <select
                            value={angleDeg}
                            onChange={e => setAngle(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400 transition-all cursor-pointer"
                        >
                            <option value={90}>90° — ชนตรง (Direct)</option>
                            <option value={60}>60° — เฉียงน้อย</option>
                            <option value={45}>45° — เฉียงปานกลาง</option>
                            <option value={30}>30° — เฉียงมาก</option>
                            <option value={15}>15° — เฉียดผ่าน (Glancing)</option>
                        </select>
                        <div className="text-[11px] text-slate-500">sin(90°)=1.0 → แรงเต็ม</div>
                    </div>
                </div>

                {/* RPM Meter */}
                <div className="mt-4">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-sm font-bold text-white">Current RPM: {Math.round(result.currentRpm)}</span>
                        <span className={`text-[11px] font-bold ${result.rpmBand === 'low' ? 'text-amber-500' : result.rpmBand === 'optimal' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {result.rpmBandLabel}
                        </span>
                    </div>
                    <RpmMeter rpm={result.currentRpm} band={result.rpmBand} />
                </div>

                {/* RPM Analysis */}
                <div className={`mt-3 p-3 rounded-xl text-xs leading-relaxed border ${
                    result.rpmBand === 'low'     ? 'bg-amber-950/40 border-amber-800/50 text-amber-300' :
                    result.rpmBand === 'optimal' ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300' :
                                                   'bg-rose-950/40 border-rose-800/50 text-rose-300'
                }`}>
                    <span className="font-bold">วิเคราะห์: </span>{result.rpmBandDesc}
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <FormulaBox
                    label="โมเมนตัมเชิงมุม (Angular Momentum)"
                    formula="L = I × ω  =  (½·m·r²·k) × (2π·RPM/60)"
                    desc="L คือ 'ความดื้อในการหมุน' — ยิ่ง L สูง เบย์ยิ่งต้านทานการหยุดหมุน ต้านแรงปะทะได้ดีกว่า และสปินได้นานกว่า"
                    value={result.angularMomentum.toFixed(5)}
                    unit="kg·m²/s"
                    color="text-sky-400"
                />

                <FormulaBox
                    label="พลังงานจลน์รวม (Total KE)"
                    formula="E = ½·I·ω²  +  ½·m·v²"
                    desc="รวมพลังงานหมุน (E_rot) กับพลังงานเคลื่อนที่ (E_lin) — ค่าสูงหมายถึงศักยภาพความเสียหายต่อคู่แข่งสูง"
                    value={result.totalKE.toFixed(3)}
                    unit="J"
                    color="text-amber-400"
                />

                <FormulaBox
                    label="แรงกระแทกประสิทธิผล (Impact Force)"
                    formula="F = (m·v + L/r)·sin θ / Δt"
                    desc="อิงหลัก Impulse-Momentum Theorem: J = Δp, F = J/Δt โดย Δt ≈ 10ms (contact time) และ r = รัศมีหน้าสัมผัส (EFFECTIVE_RADIUS_M) ใช้แปลงโมเมนตัมเชิงมุม L เป็นโมเมนตัมเชิงเส้น มุมปะทะ θ กำหนดองค์ประกอบแรงตั้งฉาก"
                    value={result.impactForce.toFixed(2)}
                    unit="N"
                    color="text-rose-400"
                />

                <FormulaBox
                    label="เวลาหมุนโดยประมาณ (Spin Time)"
                    formula="t = L / τ   โดย τ = μ·m·g·r"
                    desc={`ทอร์กแรงเสียดทาน τ = ${result.spinDownTorque.toFixed(4)} N·m — ยิ่ง L มากและ τ น้อย (Stamina Bit) เวลาหมุนยิ่งนาน`}
                    value={result.estimatedSpinTime.toFixed(1)}
                    unit="วินาที"
                    color="text-emerald-400"
                />

            </div>

            {/* Trajectory + Burst */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div className="bg-[#121826] p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                        <Wind className="w-4 h-4 text-cyan-400" /> พฤติกรรมการเคลื่อนที่
                    </div>
                    <div className="text-base font-extrabold text-cyan-400">{result.trajectoryType}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{result.trajectoryDesc}</p>
                    <div className="text-[11px] text-slate-600 border-t border-slate-800 pt-2">
                        Bit: <span className="text-slate-400">{currentCombo.bit.name}</span> · μ = {(MU_BY_TYPE[currentCombo.bit.type] ?? 0.10).toFixed(3)}
                    </div>
                </div>

                <div className="bg-[#121826] p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                        <ShieldAlert className="w-4 h-4 text-purple-400" /> ความเสี่ยง Burst
                    </div>
                    <div className={`text-base font-extrabold ${burstColor}`}>{burstLabel}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        แรทเชท <strong className="text-slate-300">{currentCombo.ratchet.name}</strong> ({currentCombo.ratchet.sides} แฉก) ·
                        Bit resist: <strong className="text-slate-300">{currentCombo.bit.burstResist}</strong>
                    </p>
                    <div className="text-[11px] font-mono text-slate-600 border-t border-slate-800 pt-2">
                        Risk = {currentCombo.ratchet.sides}×1.1 + ({currentCombo.ratchet.height}×10−60)×0.05 − {currentCombo.bit.burstResist}×0.8{totalWeight > 65 ? ' − 0.5' : ''} = <span className={burstColor}>{result.burstRiskScore.toFixed(2)}</span>
                    </div>
                </div>

            </div>

            {/* Detailed breakdown */}
            <div className="bg-[#121826] p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 mb-3 text-sm font-bold text-slate-200">
                    <Info className="w-4 h-4 text-slate-400" /> ค่าดิบทั้งหมด (Raw Values)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                        { label: 'ω (rad/s)',        value: result.omega.toFixed(1) },
                        { label: 'I (kg·m²)',         value: result.momentOfInertia.toExponential(3) },
                        { label: 'E_rot (J)',         value: result.rotationalKE.toFixed(3) },
                        { label: 'E_lin (J)',         value: result.linearKE.toFixed(4) },
                        { label: 'τ (N·m)',           value: result.spinDownTorque.toFixed(5) },
                        { label: 'm (kg)',            value: (totalWeight / 1000).toFixed(4) },
                        { label: 'Decay (RPM/s)',     value: result.decayRateRPM.toFixed(1) },
                        { label: 'Stability Score',   value: result.stabilityScore.toFixed(1) },
                        { label: 'Height (mm)',       value: String(currentCombo.ratchet.height) },
                        { label: 'Burst Risk Score',  value: result.burstRiskScore.toFixed(2) },
                    ].map(item => (
                        <div key={item.label} className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                            <div className="text-slate-500 text-[10px]">{item.label}</div>
                            <div className="text-slate-200 font-mono font-bold">{item.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Save to DB */}
            <div className="bg-[#121826] p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <div className="text-sm font-bold text-slate-200 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-400" /> บันทึกผลลัพธ์ลง Database
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            บันทึกคอมโบ + physics snapshot ปัจจุบันลง SQLite ผ่าน Prisma
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-900/30"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'กำลังบันทึก…' : 'บันทึก'}
                    </button>
                </div>

                {saveError && (
                    <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 rounded-lg px-3 py-2">
                        ⚠ {saveError} — ตรวจสอบว่า seed DB แล้ว (<code>/api/seed</code>)
                    </div>
                )}
                {savedName && <SavedBadge name={savedName} />}
            </div>

        </div>
    );
}
