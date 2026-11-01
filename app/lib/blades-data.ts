// Shared data for Blades — ใช้ร่วมกันระหว่าง /wiki/blades และ /wiki/blade/[id]
// ค่า stats (weight, atk, def, sta, inertiaFactor, radiusMm, heightMm, distribution) เป็นข้อมูลจริงจาก parts-db / lab specs

import { BX_PRODUCT_IMAGE_MAP } from './bx-product-images';

export type BladeSeries = 'BX' | 'UX' | 'CX';
export type BladeType = 'Attack' | 'Defense' | 'Stamina' | 'Balance';

export interface BladeEntry {
    id: string;
    name: string;
    /** รหัสสินค้า เช่น BX-01, UX-03, CX-13 */
    code?: string;
    series: BladeSeries;
    type: BladeType;
    weight: number;
    atk: number;
    def: number;
    sta: number;
    inertiaFactor: number;
    desc: string;
    note?: string | null;
    /** Mechanical specs */
    radiusMm?: number;
    heightMm?: number;
    distribution?: string;
    /** ชื่อไฟล์รูปใน /public/blade/<series>/ (ไม่รวม .png) — null = ยังไม่มีรูป */
    img: string | null;
}

export const BLADES: BladeEntry[] = [
    // BX (21)
    { id:'DranSword', code: 'BX-01', name:'Dran Sword', series:'BX', type:'Attack', weight:35.2, atk:0, def:0, sta:0, inertiaFactor:1.0, desc:'Dran Sword', radiusMm:23.5, heightMm:10.2, distribution:'Tri-Angular Centripetal Mass', img:'Dran Sword' },
    { id:'HellsScythe', code: 'BX-02', name:'Hells Scythe', series:'BX', type:'Balance', weight:32.8, atk:0, def:0, sta:0, inertiaFactor:1.0, desc:'Hells Scythe', radiusMm:23.2, heightMm:9.8, distribution:'Symmetrical Perimeter Balance', img:'Hells Scythe' },
    { id:'WizardArrow', code: 'BX-03', name:'Wizard Arrow', series:'BX', type:'Stamina', weight:31.5, atk:0, def:0, sta:0, inertiaFactor:1.0, desc:'Wizard Arrow', radiusMm:23.8, heightMm:9.5, distribution:'Outward Mass', img:'Wizard Arrow' },
    { id:'KnightShield', code: 'BX-04', name:'Knight Shield', series:'BX', type:'Defense', weight:32.1, atk:0, def:0, sta:0, inertiaFactor:0.98, desc:'Knight Shield', radiusMm:22.8, heightMm:10.5, distribution:'Compact Center Mass', img:'Knight Shield' },
    { id:'KnightLance', code: 'BX-13', name:'Knight Lance', series:'BX', type:'Defense', weight:32.4, atk:0, def:0, sta:0, inertiaFactor:1.0, desc:'Knight Lance', radiusMm:23.0, heightMm:11.0, distribution:'Upper-Weight Distribution', img:'Knight Lance' },
    { id:'LeonClaw', code: 'BX-15', name:'Leon Claw', series:'BX', type:'Balance', weight:31.8, atk:0, def:0, sta:0, inertiaFactor:0.95, desc:'Leon Claw', radiusMm:23.1, heightMm:10.0, distribution:'Penta-Point Weight', img:'Leon Claw' },
    { id:'ViperTail', code: 'BX-16-01', name:'Viper Tail', series:'BX', type:'Stamina', weight:34.1, atk:0, def:0, sta:0, inertiaFactor:1.07, desc:'Viper Tail', radiusMm:23.4, heightMm:10.4, distribution:'Downforce Mass', img:'Viper Tail' },
    { id:'RhinoHorn', code: 'BX-19', name:'Rhino Horn', series:'BX', type:'Defense', weight:33.2, atk:0, def:0, sta:0, inertiaFactor:0.95, desc:'Rhino Horn', radiusMm:21.5, heightMm:10.8, distribution:'High-Density Center Mass', img:'Rhino Horn' },
    { id:'DranDagger', code: 'BX-20-01', name:'Dran Dagger', series:'BX', type:'Attack', weight:34.6, atk:0, def:0, sta:0, inertiaFactor:1.02, desc:'Dran Dagger', radiusMm:23.6, heightMm:10.1, distribution:'Multi-Point Impact Vector', img:'Dran Dagger' },
    { id:'HellsChain', code: 'BX-21', name:'Hells Chain', series:'BX', type:'Balance', weight:33.1, atk:0, def:0, sta:0, inertiaFactor:1.02, desc:'Hells Chain', radiusMm:23.3, heightMm:10.3, distribution:'Dual-Tier Mass Distribution', img:'Hells Chain' },
    { id:'PhoenixWing', code: 'BX-23', name:'Phoenix Wing', series:'BX', type:'Attack', weight:38.0, atk:0, def:0, sta:0, inertiaFactor:1.1, desc:'Phoenix Wing', radiusMm:24.2, heightMm:10.6, distribution:'High Moment of Inertia', img:'Phoenix Wing' },
    { id:'UnicornSting', code: 'BX-26', name:'Unicorn Sting', series:'BX', type:'Balance', weight:32.9, atk:0, def:0, sta:0, inertiaFactor:1.02, desc:'Unicorn Sting', radiusMm:23.3, heightMm:10.0, distribution:'Asymmetrical Dynamic Balance', img:'Unicorn Sting' },
    { id:'SphinxCowl', code: 'BX-27-01', name:'Sphinx Cowl', series:'BX', type:'Defense', weight:33.5, atk:0, def:0, sta:0, inertiaFactor:1.02, desc:'Sphinx Cowl', radiusMm:22.9, heightMm:11.2, distribution:'Heavy armored shell', img:'Sphinx Cowl' },
    { id:'WeissTiger', code: 'BX-33', name:'Weiss Tiger', series:'BX', type:'Balance', weight:33.0, atk:0, def:0, sta:0, inertiaFactor:1.02, desc:'Weiss Tiger', radiusMm:23.5, heightMm:10.1, distribution:'Triple-claw counter centrifugal design', img:'Weiss Tiger' },
    { id:'CobaltDragoon', code: 'BX-34', name:'Cobalt Dragoon', series:'BX', type:'Attack', weight:37.8, atk:0, def:0, sta:0, inertiaFactor:1.12, desc:'Cobalt Dragoon', radiusMm:24.0, heightMm:10.5, distribution:'Reverse Vector Mass', img:'Cobalt Dragoon' },
    { id:'WhaleWave', code: 'BX-36-01', name:'Whale Wave', series:'BX', type:'Attack', weight:36.5, atk:0, def:0, sta:0, inertiaFactor:1.05, desc:'Whale Wave', radiusMm:23.9, heightMm:10.9, distribution:'Top-Heavy Wave Distribution', img:'Whale Wave' },
    { id:'CrimsonGaruda', code: 'BX-38', name:'Crimson Garuda', series:'BX', type:'Stamina', weight:31.8, atk:0, def:0, sta:0, inertiaFactor:1.02, desc:'Crimson Garuda', radiusMm:23.7, heightMm:9.6, distribution:'Wide wing OWD', img:'Crimson Garuda' },
    { id:'ShelterDrake', code: 'BX-39-01', name:'Shelter Drake', series:'BX', type:'Attack', weight:34.2, atk:0, def:0, sta:0, inertiaFactor:0.96, desc:'Shelter Drake', radiusMm:23.6, heightMm:10.7, distribution:'Armored Top Distribution', img:'Shelter Drake' },
    { id:'TriceraPress', code: 'BX-44', name:'Tricera Press', series:'BX', type:'Defense', weight:33.8, atk:0, def:0, sta:0, inertiaFactor:1.06, desc:'Tricera Press', radiusMm:23.1, heightMm:10.6, distribution:'Thick triangular armor mass', img:'Tricera Press' },
    { id:'SamuraiCalibur', code: 'BX-45', name:'Samurai Calibur', series:'BX', type:'Balance', weight:33.3, atk:0, def:0, sta:0, inertiaFactor:1.18, desc:'Samurai Calibur', radiusMm:23.7, heightMm:10.2, distribution:'Katana dual-edge distribution', img:'Samurai Calibur' },
    { id:'DranStrike', code: 'BX-49', name:'Dran Strike', series:'BX', type:'Attack', weight:35.8, atk:0, def:0, sta:0, inertiaFactor:1.0, desc:'Dran Strike', radiusMm:23.8, heightMm:10.3, distribution:'Asymmetric impact vectors', img:'Dran Strike' },

    { id:'WyvernGale', code: 'BX-24-01', name:'Wyvern Gale', series:'BX', type:'Balance', weight:32.1, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'ปีกมังกร 2 แฉก หมุนนานเสถียร', img: null },
    { id:'CobaltDrake', code: 'BX-00', name:'Cobalt Drake', series:'BX', type:'Balance', weight:37.8, atk:0, def:0, sta:0, inertiaFactor:1.15, desc:'มังกรโคบอลต์ หมุนซ้าย เน้นชนแบบ Counter', img: null },
    { id:'BlackShell', code: 'BX-35-01', name:'Black Shell', series:'BX', type:'Balance', weight:32.5, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'เปลือกดำทรงกลม ป้องกันสูงซับแรงรอบด้าน', img: null },
    { id:'MammothTusk', code: 'BX-00', name:'Mammoth Tusk', series:'BX', type:'Balance', weight:32.0, atk:0, def:0, sta:0, inertiaFactor:0.95, desc:'งาแมมมอธ ป้องกันสูง น้ำหนักรวมตัวดี', img: null },
    { id:'SamuraiSteel', code: 'BX-00', name:'Samurai Steel', series:'BX', type:'Balance', weight:31.2, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'เบลดซามูไร 4 แฉก สมดุลรอบด้าน', img: null },
    { id:'VictoryValkyrie', code: 'BX-00', name:'Victory Valkyrie', series:'BX', type:'Balance', weight:33.3, atk:0, def:0, sta:0, inertiaFactor:0.97, desc:'Valkyrie แห่งชัยชนะ โจมตีเร็ว Legacy BX', img: null },
    { id:'StormPegasis', code: 'BX-00', name:'Storm Pegasis', series:'BX', type:'Balance', weight:31.1, atk:0, def:0, sta:0, inertiaFactor:0.95, desc:'Pegasis พายุ โจมตีเร็วคล่องตัวสูง Legacy', img: null },
    { id:'SuppressSuperion', code: 'BX-54', name:'Suppress Superion', series:'BX', type:'Balance', weight:40.0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Suppress Superion (BX-50 variant)', img: null },
    { id:'LusterDragoon', code: 'BX-52', name:'Luster Dragoon', series:'BX', type:'Balance', weight:42.8, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'BX Expand Blade ซ้าย โจมตีสูง (BX-52) — ⚠️ k ยังไม่ตรวจสอบ', img: null },
    { id:'GoatTackle', code: 'BX-46-02', name:'Goat Tackle', series:'BX', type:'Balance', weight:31.5, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Goat Tackle (retool)', img: null },
    { id:'KeelShark', code: 'BX-14-01', name:'Keel Shark', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Keel Shark (BX-14)', img: null },
    { id:'ScytheIncendio', code: 'BX-08-01', name:'Scythe Incendio', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Scythe Incendio (BX-08/14)', img: null },
    { id:'HelmKnight', code: 'BX-06', name:'Helm Knight', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Helm Knight (BX-08/14/20/53)', img: null },
    { id:'KnightHelm', code: 'BX-06', name:'Knight Helm', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Knight Helm (BX-06)', img: null },
    { id:'ChainIncendio', code: 'BX-21-01', name:'Chain Incendio', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Chain Incendio (BX-21/31)', img: null },
    { id:'PearlTiger', code: 'BX-33', name:'Pearl Tiger', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Pearl Tiger (BX-33)', img: null },
    { id:'ObsidianShell', code: 'BX-35-01', name:'Obsidian Shell', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Obsidian Shell (BX-35)', img: null },
    { id:'WandWizard', code: 'BX-35-04', name:'Wand Wizard', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Wand Wizard (BX-35)', img: null },
    { id:'SoarPhoenix', code: 'BX-35-05', name:'Soar Phoenix', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Soar Phoenix (BX-35)', img: null },
    { id:'TideWhale', code: 'BX-36-01', name:'Tide Whale', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Tide Whale (BX-36)', img: null },
    { id:'SavageBear', code: 'BX-37', name:'Savage Bear', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Savage Bear (BX-37)', img: null },
    { id:'ScarletGaruda', code: 'BX-38', name:'Scarlet Garuda', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Scarlet Garuda (BX-38)', img: null },
    { id:'BusterDran', code: 'BX-48-05', name:'Buster Dran', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Buster Dran (BX-48)', img: null },
    { id:'RingAether', code: 'BX-50-01', name:'Ring Aether', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Ring Aether (BX-50)', img: null },
    { id:'ImpactDrake', code: 'BX-50-03', name:'Impact Drake', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Impact Drake (BX-50)', img: null },
    { id:'CircleGhost', code: 'BX-50-04', name:'Circle Ghost', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Circle Ghost (BX-50)', img: null },
    { id:'WolfFlameD', code: 'BX-50-05', name:'Wolf Flame D', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Wolf Flame D (BX-50)', img: null },
    { id:'CerberusReaperB', code: 'BX-50-06', name:'Cerberus Reaper B', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Cerberus Reaper B (BX-50)', img: null },
    { id:'AeroPegasus', code: 'BX-53-01', name:'Aero Pegasus', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Aero Pegasus (BX-53)', img: null },
    { id:'TyrannoBeat', code: 'BX-31-01', name:'Tyranno Beat', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Tyranno Beat (BX-31)', img: null },
    { id:'BeatTyranno', code: 'BX-31-01', name:'Beat Tyranno', series:'BX', type:'Balance', weight:0, atk:0, def:0, sta:0, inertiaFactor:1.00, desc:'⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ — Beat Tyranno (BX-31)', img: null },
    // UX (13)
    { id:'DranBuster', code: 'UX-01', name:'Dran Buster', series:'UX', type:'Attack', weight:35.5, atk:0, def:0, sta:0, inertiaFactor:1.2, desc:'Dran Buster', radiusMm:24.5, heightMm:10.4, distribution:'Eccentric Smash Mass', img:'Dran Buster' },
    { id:'HellsHammer', code: 'UX-02', name:'Hells Hammer', series:'UX', type:'Balance', weight:33.6, atk:0, def:0, sta:0, inertiaFactor:1.15, desc:'Hells Hammer', radiusMm:23.6, heightMm:10.8, distribution:'3-point hammer mass', img:'Hells Hammer' },
    { id:'WizardRod', code: 'UX-03', name:'Wizard Rod', series:'UX', type:'Stamina', weight:35.0, atk:0, def:0, sta:0, inertiaFactor:1.22, desc:'Wizard Rod', radiusMm:24.2, heightMm:9.4, distribution:'Max OWD', img:'Wizard Rod' },
    { id:'LeonCrest', code: 'UX-07', name:'Leon Crest', series:'UX', type:'Defense', weight:34.8, atk:0, def:0, sta:0, inertiaFactor:1.18, desc:'Leon Crest', radiusMm:23.5, heightMm:10.2, distribution:'Nearly-complete peripheral mass', img:'Leon Crest' },
    { id:'PhoenixRudder', code: 'UX-08', name:'Phoenix Rudder', series:'UX', type:'Stamina', weight:33.9, atk:0, def:0, sta:0, inertiaFactor:1.08, desc:'Phoenix Rudder', radiusMm:23.9, heightMm:9.7, distribution:'Outer-blade radial mass', img:'Phoenix Rudder' },
    { id:'SilverWolf', code: 'UX-09', name:'Silver Wolf', series:'UX', type:'Stamina', weight:34.2, atk:0, def:0, sta:0, inertiaFactor:1.25, desc:'Silver Wolf', radiusMm:24.0, heightMm:9.8, distribution:'Outer mass with free-spinning ring', img:'Silver Wolf' },
    { id:'SamuraiSaber', code: 'UX-11', name:'Samurai Saber', series:'UX', type:'Attack', weight:35.1, atk:0, def:0, sta:0, inertiaFactor:1.16, desc:'Samurai Saber', radiusMm:24.1, heightMm:10.5, distribution:'Dual long-edge mass', img:'Samurai Saber' },
    { id:'KnightMail', code: 'UX-12', name:'Knight Mail', series:'UX', type:'Defense', weight:36.2, atk:0, def:0, sta:0, inertiaFactor:1.18, desc:'Knight Mail', radiusMm:23.3, heightMm:11.5, distribution:'Tall armored mass', img:'Knight Mail' },
    { id:'SharkScale', code: 'UX-15', name:'Shark Scale', series:'UX', type:'Attack', weight:34.9, atk:0, def:0, sta:0, inertiaFactor:1.12, desc:'Shark Scale', radiusMm:23.7, heightMm:9.2, distribution:'Low shark profile', img:'Shark Scale' },
    { id:'ClockMirage', code: 'UX-17', name:'Clock Mirage', series:'UX', type:'Stamina', weight:33.7, atk:0, def:0, sta:0, inertiaFactor:1.12, desc:'Clock Mirage', radiusMm:23.8, heightMm:9.9, distribution:'Rubber edge damping', img:'Clock Mirage' },
    { id:'MeteorDragoon', code: 'UX-18', name:'Meteor Dragoon', series:'UX', type:'Attack', weight:36.8, atk:0, def:0, sta:0, inertiaFactor:1.18, desc:'Meteor Dragoon', radiusMm:24.1, heightMm:10.6, distribution:'Left-spin outer mass', img:'Meteor Dragoon' },
    { id:'MummyCurse', code: 'UX-19', name:'Mummy Curse', series:'UX', type:'Defense', weight:35.6, atk:0, def:0, sta:0, inertiaFactor:1.08, desc:'Mummy Curse', radiusMm:23.4, heightMm:10.4, distribution:'Vertical armored mass', img:'Mummy Curse' },
    { id:'BulletGriffon', code: 'UX-20', name:'Bullet Griffon', series:'UX', type:'Balance', weight:34.5, atk:0, def:0, sta:0, inertiaFactor:1.22, desc:'Bullet Griffon', radiusMm:23.8, heightMm:10.1, distribution:'Moderate outer mass', img:'Bullet Griffon' },

    // CX (15)
    { id:'DranBrave', code: 'CX-01', name:'Dran Brave', series:'CX', type:'Attack', weight:37.2, atk:0, def:0, sta:0, inertiaFactor:1.28, desc:'Dran Brave', radiusMm:23.9, heightMm:10.3, distribution:'Triangular impact mass', img:'Dran Brave' },
    { id:'WizardArc', code: 'CX-02', name:'Wizard Arc', series:'CX', type:'Stamina', weight:36.8, atk:0, def:0, sta:0, inertiaFactor:1.26, desc:'Wizard Arc', radiusMm:24.3, heightMm:9.5, distribution:'Assist-wheel OWD', img:'Wizard Arc' },
    { id:'PerseusDark', code: 'CX-03', name:'Perseus Dark', series:'CX', type:'Defense', weight:37.0, atk:0, def:0, sta:0, inertiaFactor:1.2, desc:'Perseus Dark', radiusMm:23.2, heightMm:10.7, distribution:'Heavy armored ring', img:'Perseus Dark' },
    { id:'HellsReaper', code: 'CX-05', name:'Hells Reaper', series:'CX', type:'Balance', weight:36.5, atk:0, def:0, sta:0, inertiaFactor:1.2, desc:'Hells Reaper', radiusMm:23.6, heightMm:10.2, distribution:'Configurable mass distribution', img:'Hells Reaper' },
    { id:'FoxBrush', code: 'CX-06', name:'Fox Brush', series:'CX', type:'Attack', weight:35.9, atk:0, def:0, sta:0, inertiaFactor:1.1, desc:'Fox Brush', radiusMm:23.8, heightMm:10.1, distribution:'Dense toothed edge', img:'Fox Brush' },
    { id:'PegasusBlast', code: 'CX-07', name:'Pegasus Blast', series:'CX', type:'Attack', weight:36.1, atk:0, def:0, sta:0, inertiaFactor:1.0, desc:'Pegasus Blast', radiusMm:24.0, heightMm:9.8, distribution:'Low center mass boost', img:'Pegasus Blast' },
    { id:'SolEclipse', code: 'CX-09', name:'Sol Eclipse', series:'CX', type:'Balance', weight:36.05, atk:0, def:0, sta:0, inertiaFactor:1.05, desc:'Sol Eclipse', radiusMm:23.7, heightMm:10.0, distribution:'Reversible symmetric structure', img:'Sol Eclipse' },
    { id:'WolfHunt', code: 'CX-10', name:'Wolf Hunt', series:'CX', type:'Balance', weight:36.4, atk:0, def:0, sta:0, inertiaFactor:1.05, desc:'Wolf Hunt', radiusMm:23.6, heightMm:10.0, distribution:'Centralized adjustable mass', img:'Wolf Hunt' },
    { id:'EmperorMight', code: 'CX-11', name:'Emperor Might', series:'CX', type:'Attack', weight:38.5, atk:0, def:0, sta:0, inertiaFactor:1.2, desc:'Emperor Might', radiusMm:24.1, heightMm:10.5, distribution:'Heavy smash mass', img:'Emperor Might' },
    { id:'PhoenixFlare', code: 'CX-12', name:'Phoenix Flare', series:'CX', type:'Defense', weight:39.81, atk:0, def:0, sta:0, inertiaFactor:1.2, desc:'Phoenix Flare', radiusMm:23.8, heightMm:10.4, distribution:'Dense coated metal', img:'Phoenix Flare' },
    { id:'BahamutBlitz', code: 'CX-13', name:'Bahamut Blitz', series:'CX', type:'Attack', weight:40.76, atk:0, def:0, sta:0, inertiaFactor:1.3, desc:'Bahamut Blitz', radiusMm:24.4, heightMm:10.8, distribution:'Eccentric high-mass distribution', img:'Bahamut Blitz' },
    { id:'KnightFortress', code: 'CX-14', name:'Knight Fortress', series:'CX', type:'Defense', weight:37.99, atk:0, def:0, sta:0, inertiaFactor:1.15, desc:'Knight Fortress', radiusMm:23.2, heightMm:11.0, distribution:'Four-piece armored mass', img:'Knight Fortress' },
    { id:'RagnaRage', code: 'CX-15', name:'Ragna Rage', series:'CX', type:'Stamina', weight:38.36, atk:0, def:0, sta:0, inertiaFactor:1.18, desc:'Ragna Rage', radiusMm:24.1, heightMm:9.6, distribution:'Symmetric ring mass', img:'Ragna Rage' },
    { id:'UnicornDelta', code: 'CX-17', name:'Unicorn Delta', series:'CX', type:'Balance', weight:37.5, atk:0, def:0, sta:0, inertiaFactor:1.12, desc:'Unicorn Delta', radiusMm:23.6, heightMm:10.1, distribution:'Triangular balanced mass', img:'Unicorn Delta' },
    { id:'DrakeBrave', code: 'CX-00', name:'Drake Brave', series:'CX', type:'Attack', weight:44.6, atk:0, def:0, sta:0, inertiaFactor:1.20, desc:'Drake Brave', radiusMm:undefined, heightMm:undefined, distribution:'Rare Bey Get Battle (CX-00) — Metal Coat Blue', img: null },
    { id:'LusterDragoon', code: 'BX-52', name:'Luster Dragoon', series:'BX', type:'Attack', weight:42.8, atk:75, def:15, sta:10, inertiaFactor:1.00, desc:'Luster Dragoon', radiusMm:undefined, heightMm:undefined, distribution:'BX Expand Blade (Left Spin) — ⚠️ k ยังไม่ตรวจสอบ', img: null },
];

export const AUTHORITATIVE_COUNTS = {
    BX: 21,
    UX: 13,
    CX: 15,
    total: 49,
    withImg: 49,
    withoutImg: 0,
};

export function getBladeImagePath(blade: BladeEntry): string | null {
    if (blade.series === 'BX') {
        const file = BX_PRODUCT_IMAGE_MAP[blade.name];
        if (file) return `/products/BX/${encodeURIComponent(file)}`;
    }
    if (!blade.img) return null;
    return `/blade/${blade.series.toLowerCase()}/${encodeURIComponent(blade.img)}.png`;
}

export function estimateInertiaKgM2(weightG: number, radiusMm?: number): number | null {
    if (!radiusMm || !weightG) return null;
    const m = weightG / 1000;
    const r = radiusMm / 1000;
    return m * r * r;
}
