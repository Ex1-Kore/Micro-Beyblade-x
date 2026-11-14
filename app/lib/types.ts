// Type Definitions for Beyblade X Simulator

export type SystemType = 'BX' | 'UX' | 'CX';
export type BeyType = 'Attack' | 'Defense' | 'Stamina' | 'Balance';
export type BladeSeriesType = 'BX' | 'UX' | 'CX';

export interface BladePart {
    id: string;
    name: string;
    code?: string;
    weight: number;
    atk: number;
    def: number;
    sta: number;
    desc: string;
    color: string;
    /** โมเมนต์ความเฉื่อยสัมพัทธ์ (1.0 = baseline BX, UX ~1.15-1.25, CX ~1.2-1.3) */
    inertiaFactor: number;
    /** ซีรีส์ที่ชิ้นส่วนนี้สังกัด */
    series: BladeSeriesType;
    /** path รูปภาพใน /public/blade/<series>/<img>.png — null = ยังไม่มีรูป */
    img?: string | null;
}

export interface SubBladePart {
    id: string;
    name: string;
    weight: number;
    atk: number;
    def: number;
    sta: number;
}

export interface RatchetPart {
    id: string;
    name: string;
    /** ความสูงหน่วย mm */
    height: number;
    sides: number;
    weight: number;
    atk: number;
    def: number;
    sta: number;
    desc: string;
    /** ชื่อไฟล์รูปใน /public/products/RATCHETS/<img>.png — null = ยังไม่มีรูป */
    img?: string | null;
}

export interface BitPart {
    id: string;
    name: string;
    type: BeyType;
    weight: number;
    speed: number;
    atk: number;
    def: number;
    sta: number;
    /** ค่าต้านทาน Burst (1-5) ใช้ในสูตร physics risk score — ค่าจริงจากกล่อง/Wiki (ต้านทานระเบิด) */
    burstResist: number;
    /** ชื่อไฟล์รูปใน /public/products/BITS/<img>.png — null = ยังไม่มีรูป */
    img?: string | null;
    desc: string;
}

export interface Combo {
    system: SystemType;
    blade: BladePart;
    subblade?: SubBladePart | null;
    ratchet: RatchetPart;
    bit: BitPart;
}

export interface ComboStats {
    totalWeight: number;
    attack: number;
    defense: number;
    stamina: number;
    speed: number;
    burstResist: number;
    primaryType: BeyType;
    overallScore: number;
    tier: string;
    analysis: string;
}

export interface DeckAnalysis {
    hasDuplicates: boolean;
    totalDeckWeight: number;
    filledSlots: number;
    coverage: number;
    dominantType: string;
    balanceScore: number;
}

export interface PhysicsResult {
    omega: number;
    momentOfInertia: number;
    rotationalKE: number;
    linearKE: number;
    totalKE: number;
    impactForce: number;
    rpmBand: 'low' | 'optimal' | 'extreme';
    burstRiskScore: number;
    burstRiskLevel: 'low' | 'moderate' | 'high';
    trajectoryType: string;
    trajectoryDesc: string;
}
