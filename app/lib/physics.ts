/**
 * ══════════════════════════════════════════════════════════════
 *  Beyblade X — Physics Engine (โมดูลฟิสิกส์)
 *  ภาษา: TypeScript  |  หน่วยมาตรฐาน SI (kg, m, s, J, N, N·m)
 * ══════════════════════════════════════════════════════════════
 *
 *  สูตรหลักที่ปรับปรุงใหม่ (รวม Time Decay & Bit Contact Friction)
 *  ─────────────────────────────────────────────────────────────
 *
 *  1) ความเร็วเชิงมุม (Angular Velocity)
 *     ω = 2π × RPM / 60          หน่วย: rad/s
 *
 *  2) โมเมนต์ความเฉื่อย (Moment of Inertia)
 *     I = ½ × m × r² × k         หน่วย: kg·m²
 *
 *  3) โมเมนตัมเชิงมุม (Angular Momentum)
 *     L = I × ω                   หน่วย: kg·m²/s
 *
 *  4) ทอร์กที่หยุดสปิน (Spin-down Torque)
 *     τ_friction = μ × m × g × r_bit   (ใช้รัศมีปลาย Bit แทนรัศมีวงกว้าง)
 *
 *  5) อัตราลดทอนรอบหมุน (RPM Decay)
 *     α = τ_friction / I          (Angular deceleration)
 *     DecayRateRPM = α × 60 / (2π)
 *     CurrentRPM = InitialRPM - (DecayRateRPM × t)
 *
 *  6) พลังงานและแรงกระแทก (คำนวณจาก CurrentRPM)
 *     E_rot = ½ × I × ω_current²
 *     F_impact = (m·v + L/r)·sin(θ) / Δt   (r = EFFECTIVE_RADIUS_M)
 *
 *  7) ความเสถียร (Stability & Center of Gravity)
 *     Stability = (m × r) / h     (น้ำหนัก * รัศมี / ความสูง)
 *
 *  8) ความเสี่ยง Burst
 *     Risk = (sides × 1.1) + ((h×10 - 60) × 0.05) - (bitBurstResist × 0.8)
 *     โดย h = ratchetHeightMm (มิลลิเมตรจริง) · h×10 คือสเกล mm×10 (เช่น 3-60 → 60)
 * ══════════════════════════════════════════════════════════════
 */

// ── ค่าคงที่ฟิสิกส์ ──────────────────────────────────────────────────────────

export const EFFECTIVE_RADIUS_M = 0.024;
export const GRAVITY = 9.81;
export const CONTACT_TIME_S = 0.01;

// ค่าสัมประสิทธิ์แรงเสียดทาน μ
export const MU_BY_TYPE: Record<string, number> = {
    Attack:  0.18,
    Balance: 0.12,
    Defense: 0.08,
    Stamina: 0.05,
};

// รัศมีหน้าสัมผัสพื้นของ Bit (m) — Attack บานกว้างสุด, Stamina แหลมสุด
export const BIT_RADIUS_M: Record<string, number> = {
    Attack:  0.0035, // 3.5mm
    Balance: 0.0025, // 2.5mm
    Defense: 0.0020, // 2.0mm
    Stamina: 0.0015, // 1.5mm
};

// ── Types ─────────────────────────────────────────────────────────────────────

export type RpmBand = 'low' | 'optimal' | 'extreme';
export type BurstRisk = 'low' | 'moderate' | 'high';

export interface PhysicsInput {
    totalWeightG: number;
    inertiaFactor: number;
    rpm: number;           // Initial RPM
    timeElapsedS?: number; // Time elapsed since shoot
    linearSpeedMs: number;
    angleDeg: number;
    ratchetSides: number;
    ratchetHeightMm: number; // ความสูง
    bitBurstResist: number;
    bitType: 'Attack' | 'Defense' | 'Stamina' | 'Balance';
}

export interface PhysicsOutput {
    currentRpm: number;
    decayRateRPM: number;
    omega: number;
    momentOfInertia: number;
    angularMomentum: number;
    rotationalKE: number;
    linearKE: number;
    totalKE: number;
    impactForce: number;
    spinDownTorque: number;
    estimatedSpinTime: number;
    stabilityScore: number;
    rpmBand: RpmBand;
    burstRiskScore: number;
    burstRiskLevel: BurstRisk;
    trajectoryType: string;
    trajectoryDesc: string;
    rpmBandLabel: string;
    rpmBandDesc: string;
}

// ── ฟังก์ชันหลัก ─────────────────────────────────────────────────────────────

export function calcPhysics(input: PhysicsInput): PhysicsOutput {
    const {
        totalWeightG, inertiaFactor, rpm: initialRpm, timeElapsedS = 0,
        linearSpeedMs, angleDeg, ratchetSides, ratchetHeightMm,
        bitBurstResist, bitType,
    } = input;

    const massKg = totalWeightG / 1000;
    const r = EFFECTIVE_RADIUS_M;

    // ── 1. I = ½·m·r²·k ──────────────────────────────────────────────────────
    const momentOfInertia = 0.5 * massKg * r * r * inertiaFactor;

    // ── 2. τ_friction = μ·m·g·r_bit (ใช้รัศมีปลาย Bit) ─────────────────────────
    const mu = MU_BY_TYPE[bitType] ?? 0.10;
    const r_bit = BIT_RADIUS_M[bitType] ?? 0.002;
    const spinDownTorque = mu * massKg * GRAVITY * r_bit;

    // ── 3. อัตราลดทอน RPM (Decay Rate) ───────────────────────────────────────
    // alpha = τ / I  (rad/s^2) -> RPM/s = alpha * 60 / 2π
    const alpha = spinDownTorque / momentOfInertia;
    const decayRateRPM = (alpha * 60) / (2 * Math.PI);

    // Current RPM
    const currentRpm = Math.max(0, initialRpm - (decayRateRPM * timeElapsedS));

    // ── 4. ω, L, Energy ──────────────────────────────────────────────────────
    const omega = (currentRpm * 2 * Math.PI) / 60;
    const angularMomentum = momentOfInertia * omega;
    const rotationalKE = 0.5 * momentOfInertia * omega * omega;
    const linearKE = 0.5 * massKg * linearSpeedMs * linearSpeedMs;
    const totalKE = rotationalKE + linearKE;

    // ── 5. แรงกระแทก (อิง Current RPM) ────────────────────────────────────────
    // J = (m·v + L/r)·sinθ  โดย L/r แปลงโมเมนตัมเชิงมุมเป็นโมเมนตัมเชิงเส้นผ่านรัศมี r
    const angleRad = (angleDeg * Math.PI) / 180;
    const impulse = massKg * linearSpeedMs * Math.sin(angleRad) + (angularMomentum * Math.sin(angleRad)) / r;
    const impactForce = impulse / CONTACT_TIME_S;

    // ── 6. เวลาหมุนทั้งหมดโดยประมาณ ──────────────────────────────────────────
    const estimatedSpinTime = initialRpm / decayRateRPM;

    // ── 7. ความเสถียร (Stability Index = m*r / h) ─────────────────────────────
    const heightM = ratchetHeightMm / 1000;
    // Normalize ค่าให้อ่านง่าย เช่น เอาไปคูณ 1000
    const stabilityScore = (massKg * r) / heightM * 1000;

    // ── 8. Burst Risk (บวกความสูงเป็นจุดอ่อน) ──────────────────────────────
    // หมายเหตุ: ratchetHeightMm เป็นมิลลิเมตรจริง (5.0–8.5) แต่สเกลสูตรคือ mm×10 (เช่น 3-60 → 60)
    let burstRiskScore = (ratchetSides * 1.1) + ((ratchetHeightMm * 10 - 60) * 0.05) - (bitBurstResist * 0.8);
    if (totalWeightG > 65) burstRiskScore -= 0.5;
    burstRiskScore = Math.max(0, burstRiskScore);

    let burstRiskLevel: BurstRisk;
    if (burstRiskScore <= 3.0) burstRiskLevel = 'low';
    else if (burstRiskScore <= 6.0) burstRiskLevel = 'moderate';
    else burstRiskLevel = 'high';

    // ── 9. RPM Band ──────────────────────────────────────────────────────────
    let rpmBand: RpmBand;
    let rpmBandLabel: string;
    let rpmBandDesc: string;

    if (currentRpm < 4000) {
        rpmBand = 'low';
        rpmBandLabel = 'ต่ำกว่า 4,000 RPM (Low Speed)';
        rpmBandDesc = 'แกว่งตัวง่าย ไจโรสโคปิกต่ำ สูญเสียสมดุลเมื่อปะทะ';
    } else if (currentRpm <= 6500) {
        rpmBand = 'optimal';
        rpmBandLabel = '4,000–6,500 RPM (Optimal Speed)';
        rpmBandDesc = 'ช่วงเวลาที่สมดุลที่สุด ควบคุมทิศทางและต้านแรงชนได้ดีเยี่ยม';
    } else {
        rpmBand = 'extreme';
        rpmBandLabel = 'สูงกว่า 6,500 RPM (Extreme RPM)';
        rpmBandDesc = 'หมุนเร็วมาก แรงกระแทกมหาศาล แต่สปินจะตกลงอย่างรวดเร็ว (High Decay)';
    }

    // ── 10. Trajectory ────────────────────────────────────────────────────────
    let trajectoryType: string;
    let trajectoryDesc: string;

    if (bitType === 'Attack') {
        trajectoryType = 'พุ่งเฉียงรุนแรง / X-Dash Aggressive';
        trajectoryDesc = `วิ่งปะทะวงนอก รัศมีแกน ${r_bit*1000}mm สร้างแรงเสียดทานสูง สปินหมดไวมาก`;
    } else if (bitType === 'Stamina') {
        trajectoryType = 'วนศูนย์กลาง / Center Circle';
        trajectoryDesc = `ปักหลักตรงกลาง รัศมีแกนแค่ ${r_bit*1000}mm เสียดทานต่ำ รักษา L ได้ยาวนาน`;
    } else if (bitType === 'Defense') {
        trajectoryType = 'ปักหลักนิ่ง / Counter Defensive';
        trajectoryDesc = 'ดูดซับแรงปะทะ มวลกระจายตัวดีเพื่อต้านการงัดล้ม';
    } else {
        trajectoryType = 'บาลานซ์ปรับตัว / Adaptive Pattern';
        trajectoryDesc = 'ความสมดุลปานกลาง ยืดหยุ่นปรับเปลี่ยนตามแรงเหวี่ยง';
    }

    return {
        currentRpm, decayRateRPM, omega, momentOfInertia, angularMomentum,
        rotationalKE, linearKE, totalKE,
        impactForce, spinDownTorque, estimatedSpinTime, stabilityScore,
        rpmBand, rpmBandLabel, rpmBandDesc,
        burstRiskScore, burstRiskLevel,
        trajectoryType, trajectoryDesc,
    };
}

export function fmt(value: number, decimals = 2): string {
    return value.toFixed(decimals);
}
