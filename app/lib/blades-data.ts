// Shared data for Blades — ใช้ร่วมกันระหว่าง /wiki/blades และ /wiki/blade/[id]
// ค่า stats (weight, atk, def, sta, inertiaFactor, radiusMm, heightMm, distribution) เป็นข้อมูลจริงจาก parts-db / lab specs

import { BX_PRODUCT_IMAGE_MAP } from './bx-product-images';
import { BX_CATALOG } from './bx-catalog';

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
    /** BX: ชื่อไฟล์ใน /public/products/BX/ (ไม่รวม .png) · UX/CX: ชื่อไฟล์ใน /public/blade/<series>/ */
    img: string | null;
    /** Ratchet ที่มากับสินค้า (BX) */
    ratchet?: string | null;
    /** Bit ที่มากับสินค้า (BX) */
    bit?: string | null;
    /** slug ของสินค้าใน /wiki/products/<slug> */
    productSlug?: string;
}

export const BLADES: BladeEntry[] = [
    // BX (95) — generated from public/products/BX/readme.md
    ...BX_CATALOG.map((entry, index): BladeEntry => ({
        id: entry.id,
        name: entry.name,
        code: entry.code,
        series: 'BX',
        type: entry.type,
        weight: entry.weight,
        atk: entry.atk,
        def: entry.def,
        sta: entry.sta,
        inertiaFactor: entry.inertiaFactor,
        desc: entry.desc,
        note: entry.variant,
        img: entry.file.replace(/\.png$/, ''),
        ratchet: entry.ratchet,
        bit: entry.bit,
        productSlug: `basic-${index}`,
    })),

    // UX (13)
    { id:'DranBuster', code: 'UX-01', name:'Dran Buster', series:'UX', type:'Attack', weight:35.5, atk:0, def:0, sta:0, inertiaFactor:1.2, desc:'Dran Buster', radiusMm:24.5, heightMm:10.4, distribution:'Eccentric Smash Mass', img:'UX-01 Dran Buster 1-60A' },
    { id:'HellsHammer', code: 'UX-02', name:'Hells Hammer', series:'UX', type:'Balance', weight:33.6, atk:0, def:0, sta:0, inertiaFactor:1.15, desc:'Hells Hammer', radiusMm:23.6, heightMm:10.8, distribution:'3-point hammer mass', img:'UX-02 Hells Hammer 3-70H' },
    { id:'WizardRod', code: 'UX-03', name:'Wizard Rod', series:'UX', type:'Stamina', weight:35.0, atk:0, def:0, sta:0, inertiaFactor:1.22, desc:'Wizard Rod', radiusMm:24.2, heightMm:9.4, distribution:'Max OWD', img:'UX-03 Wizard Rod 5-70DB' },
    { id:'LeonCrest', code: 'UX-07', name:'Leon Crest', series:'UX', type:'Defense', weight:34.8, atk:0, def:0, sta:0, inertiaFactor:1.18, desc:'Leon Crest', radiusMm:23.5, heightMm:10.2, distribution:'Nearly-complete peripheral mass', img:'UX-06 Leon Crest 7-60GN' },
    { id:'PhoenixRudder', code: 'UX-08', name:'Phoenix Rudder', series:'UX', type:'Stamina', weight:33.9, atk:0, def:0, sta:0, inertiaFactor:1.08, desc:'Phoenix Rudder', radiusMm:23.9, heightMm:9.7, distribution:'Outer-blade radial mass', img:'UX-07 Phoenix Rudder 9-70G' },
    { id:'SilverWolf', code: 'UX-09', name:'Silver Wolf', series:'UX', type:'Stamina', weight:34.2, atk:0, def:0, sta:0, inertiaFactor:1.25, desc:'Silver Wolf', radiusMm:24.0, heightMm:9.8, distribution:'Outer mass with free-spinning ring', img:'UX-08 Silver Wolf 3-80FB' },
    { id:'SamuraiSaber', code: 'UX-11', name:'Samurai Saber', series:'UX', type:'Attack', weight:35.1, atk:0, def:0, sta:0, inertiaFactor:1.16, desc:'Samurai Saber', radiusMm:24.1, heightMm:10.5, distribution:'Dual long-edge mass', img:'UX-09 Samurai Saber 2-70 Level' },
    { id:'KnightMail', code: 'UX-12', name:'Knight Mail', series:'UX', type:'Defense', weight:36.2, atk:0, def:0, sta:0, inertiaFactor:1.18, desc:'Knight Mail', radiusMm:23.3, heightMm:11.5, distribution:'Tall armored mass', img:'UX-10 Knight Mail 3-85BS' },
    { id:'SharkScale', code: 'UX-15', name:'Shark Scale', series:'UX', type:'Attack', weight:34.9, atk:0, def:0, sta:0, inertiaFactor:1.12, desc:'Shark Scale', radiusMm:23.7, heightMm:9.2, distribution:'Low shark profile', img:'UX-15 Shark Scale 4-50UF' },
    { id:'ClockMirage', code: 'UX-17', name:'Clock Mirage', series:'UX', type:'Stamina', weight:33.7, atk:0, def:0, sta:0, inertiaFactor:1.12, desc:'Clock Mirage', radiusMm:23.8, heightMm:9.9, distribution:'Rubber edge damping', img:'UX-16 Clock Mirage' },
    { id:'MeteorDragoon', code: 'UX-18', name:'Meteor Dragoon', series:'UX', type:'Attack', weight:36.8, atk:0, def:0, sta:0, inertiaFactor:1.18, desc:'Meteor Dragoon', radiusMm:24.1, heightMm:10.6, distribution:'Left-spin outer mass', img:'UX-17 Meteor Dragoon 3-70J' },
    { id:'MummyCurse', code: 'UX-19', name:'Mummy Curse', series:'UX', type:'Defense', weight:35.6, atk:0, def:0, sta:0, inertiaFactor:1.08, desc:'Mummy Curse', radiusMm:23.4, heightMm:10.4, distribution:'Vertical armored mass', img:'UX-18 Mummy Curse 7-55W' },
    { id:'BulletGriffon', code: 'UX-20', name:'Bullet Griffon', series:'UX', type:'Balance', weight:34.5, atk:0, def:0, sta:0, inertiaFactor:1.22, desc:'Bullet Griffon', radiusMm:23.8, heightMm:10.1, distribution:'Moderate outer mass', img:'UX-19 Bullet Griffon H' },

    // CX (15)
    { id:'DranBrave', code: 'CX-01', name:'Dran Brave', series:'CX', type:'Attack', weight:37.2, atk:0, def:0, sta:0, inertiaFactor:1.28, desc:'Dran Brave', radiusMm:23.9, heightMm:10.3, distribution:'Triangular impact mass', img:'CX-01 Dran Brave S6-60V' },
    { id:'WizardArc', code: 'CX-02', name:'Wizard Arc', series:'CX', type:'Stamina', weight:36.8, atk:0, def:0, sta:0, inertiaFactor:1.26, desc:'Wizard Arc', radiusMm:24.3, heightMm:9.5, distribution:'Assist-wheel OWD', img:'CX-00 Wizard Arc R4-55LO' },
    { id:'PerseusDark', code: 'CX-03', name:'Perseus Dark', series:'CX', type:'Defense', weight:37.0, atk:0, def:0, sta:0, inertiaFactor:1.2, desc:'Perseus Dark', radiusMm:23.2, heightMm:10.7, distribution:'Heavy armored ring', img:null },
    { id:'HellsReaper', code: 'CX-05', name:'Hells Reaper', series:'CX', type:'Balance', weight:36.5, atk:0, def:0, sta:0, inertiaFactor:1.2, desc:'Hells Reaper', radiusMm:23.6, heightMm:10.2, distribution:'Configurable mass distribution', img:null },
    { id:'FoxBrush', code: 'CX-06', name:'Fox Brush', series:'CX', type:'Attack', weight:35.9, atk:0, def:0, sta:0, inertiaFactor:1.1, desc:'Fox Brush', radiusMm:23.8, heightMm:10.1, distribution:'Dense toothed edge', img:null },
    { id:'PegasusBlast', code: 'CX-07', name:'Pegasus Blast', series:'CX', type:'Attack', weight:36.1, atk:0, def:0, sta:0, inertiaFactor:1.0, desc:'Pegasus Blast', radiusMm:24.0, heightMm:9.8, distribution:'Low center mass boost', img:null },
    { id:'SolEclipse', code: 'CX-09', name:'Sol Eclipse', series:'CX', type:'Balance', weight:36.05, atk:0, def:0, sta:0, inertiaFactor:1.05, desc:'Sol Eclipse', radiusMm:23.7, heightMm:10.0, distribution:'Reversible symmetric structure', img:null },
    { id:'WolfHunt', code: 'CX-10', name:'Wolf Hunt', series:'CX', type:'Balance', weight:36.4, atk:0, def:0, sta:0, inertiaFactor:1.05, desc:'Wolf Hunt', radiusMm:23.6, heightMm:10.0, distribution:'Centralized adjustable mass', img:null },
    { id:'EmperorMight', code: 'CX-11', name:'Emperor Might', series:'CX', type:'Attack', weight:38.5, atk:0, def:0, sta:0, inertiaFactor:1.2, desc:'Emperor Might', radiusMm:24.1, heightMm:10.5, distribution:'Heavy smash mass', img:null },
    { id:'PhoenixFlare', code: 'CX-12', name:'Phoenix Flare', series:'CX', type:'Defense', weight:39.81, atk:0, def:0, sta:0, inertiaFactor:1.2, desc:'Phoenix Flare', radiusMm:23.8, heightMm:10.4, distribution:'Dense coated metal', img:null },
    { id:'BahamutBlitz', code: 'CX-13', name:'Bahamut Blitz', series:'CX', type:'Attack', weight:40.76, atk:0, def:0, sta:0, inertiaFactor:1.3, desc:'Bahamut Blitz', radiusMm:24.4, heightMm:10.8, distribution:'Eccentric high-mass distribution', img:'CX-13 Starter Bahamut Blitz BK1-50I' },
    { id:'KnightFortress', code: 'CX-14', name:'Knight Fortress', series:'CX', type:'Defense', weight:37.99, atk:0, def:0, sta:0, inertiaFactor:1.15, desc:'Knight Fortress', radiusMm:23.2, heightMm:11.0, distribution:'Four-piece armored mass', img:null },
    { id:'RagnaRage', code: 'CX-15', name:'Ragna Rage', series:'CX', type:'Stamina', weight:38.36, atk:0, def:0, sta:0, inertiaFactor:1.18, desc:'Ragna Rage', radiusMm:24.1, heightMm:9.6, distribution:'Symmetric ring mass', img:null },
    { id:'UnicornDelta', code: 'CX-17', name:'Unicorn Delta', series:'CX', type:'Balance', weight:37.5, atk:0, def:0, sta:0, inertiaFactor:1.12, desc:'Unicorn Delta', radiusMm:23.6, heightMm:10.1, distribution:'Triangular balanced mass', img:null },
    { id:'DrakeBrave', code: 'CX-00', name:'Drake Brave', series:'CX', type:'Attack', weight:44.6, atk:0, def:0, sta:0, inertiaFactor:1.20, desc:'Drake Brave', radiusMm:undefined, heightMm:undefined, distribution:'Rare Bey Get Battle (CX-00) — Metal Coat Blue', img: null },
];

export const AUTHORITATIVE_COUNTS = {
    BX: BLADES.filter((b) => b.series === 'BX').length,
    UX: BLADES.filter((b) => b.series === 'UX').length,
    CX: BLADES.filter((b) => b.series === 'CX').length,
    total: BLADES.length,
    withImg: BLADES.filter((b) => b.img).length,
    withoutImg: BLADES.filter((b) => !b.img).length,
};

export function getBladeImagePath(blade: BladeEntry): string | null {
    if (blade.series === 'BX') {
        if (blade.img) return `/products/BX/${encodeURIComponent(blade.img)}.png`;
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
