import type { BladePart, SubBladePart, RatchetPart, BitPart } from './types';
import { BX_CATALOG } from './bx-catalog';

// ─── BX (Basic Line) Blades ──────────────────────────────────────────────────
// BX_CATALOG holds one entry per BX *product file* (95) — re-releases, colour
// variants and Hasbro renames included. For the parts list we collapse it to one
// entry per physical blade and drop the parts that actually belong to UX/CX.
//
// Name pairs + re-release ids verified against Beyblade X Wiki
// "List of Basic Line parts" / individual blade pages (2026-11-14):
//   Helm Knight→Knight Shield · Scythe Incendio→Hells Scythe ·
//   Chain Incendio→Hells Chain · Lance Knight→Knight Lance ·
//   Soar Phoenix→Phoenix Wing · Tide Whale→Whale Wave
// (Hasbro-only aliases kept in the catalog but folded here:)
//   Keel Shark=Shark Edge · Pearl Tiger=Weiss Tiger · Obsidian Shell=Black Shell ·
//   Ring Aether=Heavens Ring · Savage Bear=Bear Scratch ·
//   Suppress Superion=Sieg Superion · Scarlet Garuda=Crimson Garuda
//
// BX-numbered products can ship UX/CX parts (e.g. BX-50 Random Booster Vol. 5,
// BX-35-04, BX-48-05, BX-53-01). Those ids are dropped from BX here and carried
// by UX_BLADES / CX_BLADES under the surviving id (see BLADE_ID_ALIASES).
const BX_UX_CX_IDS: Record<string, string> = {
    AeroPegasus: 'AeroPegasus', // UX-00
    ImpactDrake: 'ImpactDrake', // UX, BX-50-03
    CircleGhost: 'GhostCircle', // UX (GhostCircle M-85DS, BX-50-04)
    WandWizard: 'WizardRod', // UX (WizardRod 1-60R, BX-35-04)
    BusterDran: 'DranBuster', // UX (DranBuster 2-80Q, BX-48-05)
    WolfFlameD: 'WolfFlame', // CX (WolfFlame D9-65L, BX-50-05)
    CerberusReaperB: 'CerberusReaper', // CX (CerberusReaper B0-80WB, BX-50-06)
};

/** Hasbro-only id → the Takara Tomy id that already exists in BX_CATALOG. */
const BX_HASBRO_ALIAS: Record<string, string> = {
    HelmKnight: 'KnightShield',
    ScytheIncendio: 'HellsScythe',
    ChainIncendio: 'HellsChain',
    LanceKnight: 'KnightLance',
    SoarPhoenix: 'PhoenixWing',
    TideWhale: 'WhaleWave',
};

/** Fold re-release counters (WizardArrow2 → WizardArrow) and Hasbro aliases. */
function bxCanonicalId(id: string): string {
    const base = id.replace(/\d+$/, '');
    const alias = BX_HASBRO_ALIAS[base] ?? BX_HASBRO_ALIAS[id];
    if (alias) return alias;
    return BX_CATALOG.some((e) => e.id === base) ? base : id;
}

/**
 * ทุก id ใน `BX_CATALOG` ที่ถูกยุบ/ย้ายไป id อื่นใน `PARTS_DB`
 * (re-release counter, Hasbro rename, ย้ายไป UX/CX).
 * `POST /api/seed` ใช้ map นี้ remap `SavedCombo.bladeId` **ก่อน** prune เพื่อไม่ให้
 * คอมโบที่บันทึกไว้ชี้ไป id ที่ถูกลบ (FK กับตาราง Blade)
 */
export const BLADE_ID_ALIASES: Record<string, string> = (() => {
    const map: Record<string, string> = { ...BX_UX_CX_IDS };
    for (const entry of BX_CATALOG) {
        if (map[entry.id]) continue;
        const canonical = bxCanonicalId(entry.id);
        if (canonical !== entry.id) map[entry.id] = canonical;
    }
    return map;
})();

/** Real weights the catalog lacked or rounded — Beyblade X Wiki blade pages (2026-11-14). */
const BX_WEIGHT_FIX: Record<string, number> = {
    KeelShark: 34.5, // Shark Edge, BX-14
    SavageBear: 29.6, // Bear Scratch, BX-37
    RingAether: 37.4, // Heavens Ring, BX-50
    TyrannoBeat: 37.0, // Beat Tyranno, BX-31
    DranStrike: 41.4, // Strike Dran, BX-49 (catalog had 41)
    LusterDragoon: 43.0, // BX-52 (catalog had 42.8)
    StormPegasis: 31.0, // X-Over Project, BX-00 (catalog had 31.1)
    VictoryValkyrie: 33.2, // X-Over Project, BX-00 (catalog had 33.3)
};

const BX_BLADES: BladePart[] = (() => {
    const byCanonical = new Map<string, BladePart>();
    const score = (b: BladePart): number => (b.weight > 0 ? 2 : 0) + (b.atk + b.def + b.sta > 0 ? 4 : 0);
    for (const entry of BX_CATALOG) {
        if (BX_UX_CX_IDS[entry.id]) continue;
        const id = bxCanonicalId(entry.id);
        const blade: BladePart = {
            id,
            name: entry.name,
            code: entry.code,
            weight: BX_WEIGHT_FIX[id] ?? entry.weight,
            atk: entry.atk,
            def: entry.def,
            sta: entry.sta,
            series: 'BX',
            inertiaFactor: entry.inertiaFactor,
            img: entry.file.replace(/\.png$/, ''),
            desc: BX_WEIGHT_FIX[id]
                ? entry.desc.replace('⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ', `⚠️ น้ำหนัก ${BX_WEIGHT_FIX[id]}g (Beyblade X Wiki) · ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ`)
                : entry.desc,
            color: entry.color,
        };
        const prev = byCanonical.get(id);
        if (!prev || score(blade) > score(prev)) byCanonical.set(id, blade);
    }
    // Basic Line blade that has no BX product file in the catalog.
    byCanonical.set('PhoenixFeather', {
        id: 'PhoenixFeather',
        name: 'Phoenix Feather',
        code: 'BX-00',
        weight: 33.3,
        atk: 0,
        def: 0,
        sta: 0,
        series: 'BX',
        inertiaFactor: 1,
        img: null,
        desc: 'Feather Phoenix — Basic Line Attack 33.3g (Beyblade X Wiki) — ⚠️ ยังไม่มีสถิติเกม ATK/DEF/STA',
        color: 'from-orange-400 to-red-600',
    });
    return [...byCanonical.values()];
})();

// ─── UX (Unique Line) Blades — 29 ตัว ────────────────────────────────────────
// 22 Unique Line blades + 7 Ratchet-Integrated blades (Beyblade X Wiki
// "List of Unique Line parts", 2026-11-14). Basic Line blades that shipped in
// UX bundles (Dran Dagger, Leon Claw, Phoenix Feather, Sphinx Cowl, Weiss Tiger,
// Wyvern Gale) are listed under BX, not here.
const UX_BLADES: BladePart[] = [
    { id: 'DranBuster',     name: 'Dran Buster',     weight: 36.4, atk: 98, def: 20, sta: 15, series: 'UX', inertiaFactor: 1.20, img: 'UX-01 Dran Buster 1-60A', desc: 'ดาบยักษ์เล่มเดียว พลังชนมหาศาล One-Hit KO', color: 'from-blue-700 to-indigo-950' },
    { id: 'HellsHammer',    name: 'Hells Hammer',    weight: 33.2, atk: 75, def: 50, sta: 50, series: 'UX', inertiaFactor: 1.15, img: 'UX-02 Hells Hammer 3-70H', desc: 'ทรงค้อน 3 แฉกเน้นการตบกดจากมุมบน', color: 'from-rose-600 to-orange-500' },
    { id: 'WizardRod',      name: 'Wizard Rod',      weight: 35.2, atk: 45, def: 85, sta: 98, series: 'UX', inertiaFactor: 1.22, img: 'UX-03 Wizard Rod 5-70DB', desc: 'เบลดน้ำหนักนอกกระจายสมบูรณ์ หมุนนานระดับ Meta', color: 'from-amber-400 to-yellow-600' },
    { id: 'ShinobiShadow',  name: 'Shinobi Shadow',  weight: 28.4, atk: 65, def: 32, sta: 45, series: 'UX', inertiaFactor: 0.90, img: 'UX-05 Shinobi Shadow 1-80MN', desc: 'เงาชูริเคน เบาสุดในสาย UX คล่องตัวสูง', color: 'from-gray-800 to-slate-900' },
    { id: 'LeonCrest',      name: 'Leon Crest',      weight: 34.8, atk: 30, def: 95, sta: 60, series: 'UX', inertiaFactor: 1.18, img: 'UX-06 Leon Crest 7-60GN', desc: 'กำแพงโลหะทรงหนาพิเศษ ป้องกันสูงสุด', color: 'from-emerald-600 to-teal-800' },
    { id: 'PhoenixRudder',  name: 'Phoenix Rudder',  weight: 34.4, atk: 48, def: 50, sta: 80, series: 'UX', inertiaFactor: 1.08, img: 'UX-07 Phoenix Rudder 9-70G', desc: 'หางเสือ Phoenix ช่วยรักษาวงโคจรหมุนนาน', color: 'from-orange-400 to-red-600' },
    { id: 'SilverWolf',     name: 'Silver Wolf',     weight: 36.6, atk: 40, def: 70, sta: 85, series: 'UX', inertiaFactor: 1.25, img: 'UX-08 Silver Wolf 3-80FB', desc: 'ขอบวงนอกหมุนอิสระ สลายแรงปะทะ Stamina Meta', color: 'from-slate-400 to-slate-200' },
    { id: 'SamuraiSaber',   name: 'Samurai Saber',   weight: 36.1, atk: 68, def: 60, sta: 58, series: 'UX', inertiaFactor: 1.16, img: 'UX-09 Samurai Saber 2-70 Level', desc: 'ดาบซามูไรสมดุล 4 แฉก ยืดหยุ่นสูง', color: 'from-red-500 to-amber-700' },
    { id: 'KnightMail',     name: 'Knight Mail',     weight: 36.5, atk: 35, def: 90, sta: 60, series: 'UX', inertiaFactor: 1.18, img: 'UX-10 Knight Mail 3-85BS', desc: 'เกราะอัศวิน UX ป้องกันสูงสุดในสาย UX', color: 'from-blue-800 to-indigo-900' },
    { id: 'ImpactDrake',    name: 'Impact Drake',    weight: 39.0, atk: 92, def: 38, sta: 35, series: 'UX', inertiaFactor: 1.10, img: 'UX-11 Impact Drake 9-60LR', desc: 'มังกรชนพลัง โจมตีสูงมาก ขอบอาวุธแหลม', color: 'from-teal-600 to-blue-700' },
    { id: 'GhostCircle',    name: 'Ghost Circle',    weight: 26.6, atk: 30, def: 72, sta: 72, series: 'UX', inertiaFactor: 1.10, img: 'UX-12 Ghost Circle 0-80GB', desc: 'วงกลมผี ขอบกลม สมดุลป้องกันและ Stamina', color: 'from-violet-800 to-purple-900' },
    { id: 'GolemRock',      name: 'Golem Rock',      weight: 34.0, atk: 32, def: 85, sta: 55, series: 'UX', inertiaFactor: 1.05, img: 'UX-13 Golem Rock 1-60UN', desc: 'โกเลมหิน ขอบทื่อหนาป้องกันและรับแรงดี', color: 'from-stone-600 to-stone-800' },
    { id: 'ScorpioSpear',   name: 'Scorpio Spear',   weight: 39.6, atk: 55, def: 55, sta: 55, series: 'UX', inertiaFactor: 1.15, img: 'UX-14 Scorpio Spear 0-70Z', desc: 'หางแมงป่อง Balance ยืดหยุ่น สลับ Mode ได้', color: 'from-amber-600 to-red-700' },
    { id: 'SharkScale',     name: 'Shark Scale',     weight: 37.6, atk: 72, def: 38, sta: 45, series: 'UX', inertiaFactor: 1.12, img: 'UX-15 Shark Scale 4-50UF', desc: 'เกล็ดฉลาม UX ขอบโจมตีสูง', color: 'from-cyan-700 to-blue-800' },
    { id: 'AeroPegasus',    name: 'Aero Pegasus',    weight: 38.3, atk: 55, def: 38, sta: 72, series: 'UX', inertiaFactor: 1.05, img: 'UX-00 Aero Pegasus 3-70A', desc: 'ปีกม้า Pegasus อากาศพลศาสตร์สูง หมุนนาน', color: 'from-sky-400 to-indigo-500' },
    { id: 'ClockMirage',    name: 'Clock Mirage',    weight: 37.7, atk: 50, def: 55, sta: 75, series: 'UX', inertiaFactor: 1.12, img: 'UX-16 Clock Mirage', desc: 'ภาพลวงนาฬิกา หมุนสวนทาง สร้างแรงเหวี่ยงสูง', color: 'from-indigo-400 to-violet-600' },
    { id: 'MeteorDragoon',  name: 'Meteor Dragoon',  weight: 39.2, atk: 85, def: 42, sta: 42, series: 'UX', inertiaFactor: 1.18, img: 'UX-17 Meteor Dragoon 3-70J', desc: 'มังกรอุกกาบาต พุ่งชนเร็วและแรง', color: 'from-purple-700 to-blue-900' },
    { id: 'MummyCurse',     name: 'Mummy Curse',     weight: 37.2, atk: 40, def: 65, sta: 70, series: 'UX', inertiaFactor: 1.08, img: 'UX-18 Mummy Curse 7-55W', desc: 'คำสาปมัมมี่ ขอบห่อหุ้มป้องกันและ Stamina', color: 'from-yellow-700 to-amber-900' },
    { id: 'BulletGriffon',  name: 'Bullet Griffon',  weight: 61.2, atk: 78, def: 58, sta: 50, series: 'UX', inertiaFactor: 1.22, img: 'UX-19 Bullet Griffon H', desc: 'กริฟฟินกระสุน สมดุลสูง น้ำหนักมาก', color: 'from-amber-500 to-orange-700' },
    { id: 'WyvernHover',    name: 'Wyvern Hover',    weight: 35.0, atk: 42, def: 48, sta: 80, series: 'UX', inertiaFactor: 1.08, img: null,              desc: 'มังกร Wyvern ลอยตัว Stamina สูง', color: 'from-teal-400 to-cyan-600' },
    { id: 'OrochiCluster',  name: 'Orochi Cluster',  weight: 36.4, atk: 60, def: 62, sta: 62, series: 'UX', inertiaFactor: 1.14, img: null,              desc: 'งูใหญ่หลายหัว Balance ยืดหยุ่นรอบด้าน', color: 'from-green-800 to-emerald-600' },
    { id: 'HellsNether', name: 'Hells Nether', weight: 42.0, atk: 0, def: 0, sta: 0, series: 'UX', inertiaFactor: 1.00, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Hells Nether (UX-21)', color: 'from-red-800 to-gray-900' },
    { id: 'GloryValkyrie', name: 'Glory Valkyrie', weight: 45.4, atk: 0, def: 0, sta: 0, series: 'UX', inertiaFactor: 1.00, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Glory Valkyrie (UX-20)', color: 'from-sky-500 to-blue-800' },
    { id: 'SeizeJaguar', name: 'Seize Jaguar', weight: 39.4, atk: 0, def: 0, sta: 0, series: 'UX', inertiaFactor: 1.00, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Seize Jaguar (UX)', color: 'from-amber-600 to-orange-700' },
    { id: 'CutterShinobi', name: 'Cutter Shinobi', weight: 37.4, atk: 0, def: 0, sta: 0, series: 'UX', inertiaFactor: 1.00, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Cutter Shinobi (UX)', color: 'from-slate-700 to-gray-900' },
    { id: 'RampartAegis', name: 'Rampart Aegis', weight: 32.7, atk: 0, def: 0, sta: 0, series: 'UX', inertiaFactor: 1.00, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Rampart Aegis (UX)', color: 'from-blue-600 to-indigo-800' },
    { id: 'ValorBison', name: 'Valor Bison', weight: 41.0, atk: 0, def: 0, sta: 0, series: 'UX', inertiaFactor: 1.00, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Valor Bison (UX)', color: 'from-amber-700 to-stone-600' },
    { id: 'StunMedusa', name: 'Stun Medusa', weight: 27.1, atk: 0, def: 0, sta: 0, series: 'UX', inertiaFactor: 1.00, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Stun Medusa (UX)', color: 'from-violet-600 to-purple-800' },
    { id: 'HackViking', name: 'Hack Viking', weight: 32.7, atk: 0, def: 0, sta: 0, series: 'UX', inertiaFactor: 1.00, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Hack Viking (UX)', color: 'from-sky-600 to-blue-800' },
];

// ─── CX (Custom Line) Blades — 34 combos ─────────────────────────────────────
// Each entry is a released CX *combo* (Lock Chip + Main Blade + Assist), a
// superset of the name-centric product folders in public/products/CX/ (some
// combos have no folder yet → img: null). Verified against Beyblade X Wiki
// "List of Custom Line parts" + individual pages (2026-11-14).
const CX_BLADES: BladePart[] = [
    { id: 'DranBrave',   name: 'Dran Brave',   weight: 37.7, atk: 88, def: 40, sta: 35, series: 'CX', inertiaFactor: 1.28, img: 'CX-01 Dran Brave S6-60V', desc: 'ระบบ CX ถอดสลับ Sub-Blade ได้ โจมตีสูง', color: 'from-cyan-600 to-blue-700' },
    { id: 'WizardArc',   name: 'Wizard Arc',   weight: 35.6, atk: 40, def: 75, sta: 85, series: 'CX', inertiaFactor: 1.26, img: 'CX-00 Wizard Arc R4-55LO', desc: 'กระจายน้ำหนักแบบ Custom หมุนนานมาก',       color: 'from-yellow-400 to-amber-600' },
    { id: 'HellsReaper', name: 'Hells Reaper', weight: 36.3, atk: 72, def: 55, sta: 55, series: 'CX', inertiaFactor: 1.20, img: null, desc: 'เคียวมรณะ CX สมดุลทุกด้าน',                color: 'from-red-800 to-gray-900' },
    { id: 'PegasusBlast', name: 'Pegasus Blast', weight: 39.4, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.24, img: null, desc: 'ระเบิดพลัง พุ่งชนรุนแรง Attack สูงสุด (CX-07) — ⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ', color: 'from-sky-500 to-indigo-700' },
    { id: 'PerseusDark', name: 'Perseus Dark', weight: 37.2, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.22, img: null, desc: 'มืดทึบ ป้องกันสูง รับแรงได้ดี (CX-03) — ⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ', color: 'from-slate-700 to-violet-900' },
    { id: 'CerberusFlame', name: 'Cerberus Flame', weight: 37.6, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: 'เปลวไฟ Balance ยืดหยุ่น (CX-08) — ⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ', color: 'from-orange-600 to-red-800' },
    { id: 'WhaleFlame', name: 'Whale Flame', weight: 35.7, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: 'เปลวไฟ Balance ยืดหยุ่น (CX-08 variant) — ⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ', color: 'from-blue-500 to-cyan-700' },
    { id: 'ValkyrieVolt', name: 'Valkyrie Volt', weight: 41.3, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.26, img: 'CX-00 ValkyrieVolt S4-70V', desc: 'Main Blade ไฟฟ้า โจมตีเร็ว แรงกระแทกสูง (CX-00) — ⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ', color: 'from-yellow-400 to-blue-600' },
    { id: 'SolEclipse', name: 'Sol Eclipse', weight: 39.9, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.05, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Sol Eclipse (CX-09)', color: 'from-amber-500 to-yellow-700' },
    { id: 'WolfHunt', name: 'Wolf Hunt', weight: 38.8, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.05, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Wolf Hunt (CX-10)', color: 'from-slate-500 to-gray-700' },
    { id: 'EmperorMight', name: 'Emperor Might', weight: 45.1, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Emperor Might (CX-11)', color: 'from-red-800 to-amber-600' },
    { id: 'PhoenixFlare', name: 'Phoenix Flare', weight: 39.6, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Phoenix Flare (CX-12)', color: 'from-red-600 to-rose-700' },
    { id: 'BahamutBlitz', name: 'Bahamut Blitz', weight: 40.7, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.30, img: 'CX-13 Starter Bahamut Blitz BK1-50I', desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Bahamut Blitz (CX-13)', color: 'from-indigo-600 to-blue-900' },
    { id: 'KnightFortress', name: 'Knight Fortress', weight: 37.8, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.15, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Knight Fortress (CX-14)', color: 'from-blue-800 to-indigo-900' },
    { id: 'RagnaRage', name: 'Ragna Rage', weight: 38.3, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.18, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Ragna Rage (CX-15)', color: 'from-orange-600 to-red-800' },
    { id: 'UnicornDelta', name: 'Unicorn Delta', weight: 37.4, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.12, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Unicorn Delta (CX-17)', color: 'from-violet-600 to-cyan-600' },
    { id: 'BrachioWhip', name: 'Brachio Whip', weight: 39.8, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: 'CX-18 BrachioWhip OW5-70Nr', desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Brachio Whip (CX-18)', color: 'from-green-600 to-emerald-800' },
    { id: 'CrocoTread', name: 'Croco Tread', weight: 38.3, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Croco Tread (CX-19)', color: 'from-green-700 to-emerald-900' },
    { id: 'DrakeBrave', name: 'Drake Brave', weight: 44.6, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: 'เดรกเบรฟ (CX-00) — Rare Bey Get Battle, Metal Coat Blue, Lock Chip Drake, Main Blade Brave, Assist Gravity (G), Ratchet 4-70, Bit Ignition (I), Attack, Right Spin, น้ำหนักรวม ~53.3g — ⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ', color: 'from-teal-600 to-blue-700' },
    { id: 'KrakenWriggle', name: 'Kraken Wriggle', weight: 35.7, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Kraken Wriggle (CX)', color: 'from-blue-700 to-indigo-900' },
    { id: 'HornetFort', name: 'Hornet Fort', weight: 35.4, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Hornet Fort (CX, retool)', color: 'from-yellow-600 to-amber-800' },
    { id: 'BucksAntlers', name: 'Bucks Antlers', weight: 36.1, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Bucks Antlers (CX, retool)', color: 'from-amber-600 to-orange-700' },
    { id: 'HurricaneEnlil', name: 'Hurricane Enlil', weight: 34.4, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Hurricane Enlil (CX)', color: 'from-sky-500 to-indigo-600' },
    { id: 'LeonFang', name: 'Leon Fang', weight: 37.9, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — Leon Fang (CX)', color: 'from-amber-500 to-yellow-700' },
    // FoxBrush (CX-06-1) — เพิ่มจากผู้ใช้เมื่อ 2026-11-11 · code CX-06-1, ประเภท Attack
    { id: 'FoxBrush', name: 'Fox Brush', code: 'CX-06-1', weight: 35.9, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.1, img: null, desc: '⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ — FoxBrush (CX-06-1)', color: 'from-red-600 to-orange-700' },
    // ── เพิ่ม 2026-11-14 จาก Beyblade X Wiki (มีรูปใน public/products/CX/) ──
    { id: 'CerberusDark', name: 'Cerberus Dark', weight: 0, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: 'CerberusDark W1-60F (CX-08) — Attack · ⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ', color: 'from-slate-700 to-red-900' },
    { id: 'EvaArc', name: 'Eva Arc', weight: 0, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: 'EvaArc B0-70E (CX-00 Evangelion Deck Set) — Balance · ⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ', color: 'from-purple-700 to-violet-900' },
    { id: 'EvaBrave', name: 'Eva Brave', weight: 0, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: 'EvaBrave A1-70V (CX-00 Evangelion Deck Set) — Attack · ⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ', color: 'from-purple-600 to-emerald-800' },
    { id: 'EvaBrush', name: 'Eva Brush', weight: 0, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: 'EvaBrush T2-70A (CX-00 Evangelion Deck Set) — Attack · ⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ', color: 'from-fuchsia-600 to-purple-900' },
    { id: 'HellsArc', name: 'Hells Arc', weight: 0, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: 'HellsArc T3-85O (CX-05 Random Booster Vol. 6) — Stamina · ⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ', color: 'from-red-800 to-gray-900' },
    { id: 'PhoenixForce', name: 'Phoenix Force', weight: 0, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: 'PhoenixForce WHM-65MT (CX-20) — Balance, Custom Line · ⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ', color: 'from-orange-500 to-red-700' },
    { id: 'RhinoReaper', name: 'Rhino Reaper', weight: 42.5, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: 'RhinoReaper C4-55D (CX-05 Random Booster Vol. 6) — Defense 42.5g (Beyblade X Wiki) · ⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ', color: 'from-stone-500 to-stone-800' },
    { id: 'WolfFlame', name: 'Wolf Flame', weight: 0, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: 'WolfFlame D9-65L (BX-50 Random Booster Vol. 5, Custom Line) — Lock Chip Wolf + Main Blade Flame + Assist Dual · Attack · ⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ', color: 'from-slate-600 to-orange-800' },
    { id: 'CerberusReaper', name: 'Cerberus Reaper', weight: 0, atk: 0, def: 0, sta: 0, series: 'CX', inertiaFactor: 1.20, img: null, desc: 'CerberusReaper B0-80WB (BX-50 Random Booster Vol. 5, Custom Line) — Lock Chip Cerberus + Main Blade Reaper + Assist Bumper · Stamina · ⚠️ ยังไม่มีน้ำหนัก/สถิติ ATK/DEF/STA ตรวจสอบ', color: 'from-orange-700 to-stone-800' },
];

// ─── Sub-Blades (CX only) ─────────────────────────────────────────────────────
const CX_SUBBLADES: SubBladePart[] = [
    { id: 'S60',  name: 'S-Core (Slash Heavy)',    weight: 4.5, atk: 10, def: -5, sta: -5 },
    { id: 'R55',  name: 'R-Core (Round Guard)',    weight: 4.2, atk: -5, def: 10, sta:  5 },
    { id: 'B80',  name: 'B-Core (Balanced Mass)',  weight: 4.0, atk:  0, def:  0, sta:  0 },
];
// ─── Ratchets (38 ตัว) ────────────────────────────────────────────────────────
// naming: sides-height(mm×10), e.g. 3-60 = 3 sides, 6.0mm. ตรวจกับ Beyblade X Wiki
// "Category:Ratchets" + "Category:RBT-Ratchets" (2026-11-14) — 38 รุ่น
// (M-65/M-85 เป็น Metal Ratchet; สถิติ ATK/DEF/STA อ้าง Beyblade X Wiki)
const RATCHETS: RatchetPart[] = [
    { id: '1-50',  name: '1-50',  height: 5.0, sides: 1, weight: 5.7, atk: 18, def:  9, sta:  3,  img: '1-50_p', desc: '1 แฉก สูง 5.0mm เตี้ยสุดสาย 1 (BeyBase: ATK18/DEF9/STA3)' },
    { id: '1-60',  name: '1-60',  height: 6.0, sides: 1, weight: 6.0, atk: 12, def:  2, sta:  2,  img: '1-60_p', desc: '1 แฉก น้ำหนักเอียงสร้างแรงเหวี่ยง ชนแรงระเบิด เสี่ยง Burst สูง' },
    { id: '1-70',  name: '1-70',  height: 7.0, sides: 1, weight: 6.1, atk: 17, def:  6, sta:  7,  img: '1-70_p', desc: '1 แฉก สูง 7mm (Beyblade X Wiki: ATK17/DEF6/STA7 — 6.1g)' },
    { id: '1-80',  name: '1-80',  height: 8.0, sides: 1, weight: 6.5, atk: 14, def:  2, sta:  2,  img: '1-80_p', desc: '1 แฉก สูง 8mm เพิ่มมุมปะทะจากด้านบน แรงกระแทกสูงสุด' },
    { id: '2-60',  name: '2-60',  height: 6.0, sides: 2, weight: 6.2, atk:  9, def:  3, sta:  3,  img: '2-60_p', desc: '2 แฉก สมมาตร 180° โจมตีไว' },
    { id: '2-70',  name: '2-70',  height: 7.0, sides: 2, weight: 6.3, atk:  9, def:  3, sta:  4,  img: '2-70_p', desc: '2 แฉก สูง 7mm เพิ่มมุมกด' },
    { id: '2-80',  name: '2-80',  height: 8.0, sides: 2, weight: 6.6, atk: 10, def:  3, sta:  3,  img: '2-80_p', desc: '2 แฉก สูง 8mm กระแทกมุมบน แรงสูง' },
    { id: '3-60',  name: '3-60',  height: 6.0, sides: 3, weight: 6.4, atk:  8, def:  5, sta:  5,  img: '3-60_p', desc: '3 แฉก สูง 6mm ยอดนิยม ทน Burst ดี สมดุลทุกสาย' },
    { id: '3-70',  name: '3-70',  height: 7.0, sides: 3, weight: 6.5, atk:  8, def:  5, sta:  5,  img: '3-70_p', desc: '3 แฉก สูง 7mm ปรับมุมโจมตี' },
    { id: '3-80',  name: '3-80',  height: 8.0, sides: 3, weight: 7.1, atk:  7, def:  4, sta:  5,  img: '3-80_p', desc: '3 แฉก สูง 8mm เพิ่มมุมกดจากด้านบน' },
    { id: '3-85',  name: '3-85',  height: 8.5, sides: 3, weight: 6.44, atk:  7, def:  4, sta:  4,  img: '3-85_p', desc: '3 แฉก สูง 8.5mm สูงที่สุดในสาย 3 แฉก' },
    { id: '4-50',  name: '4-50',  height: 5.0, sides: 4, weight: 5.9, atk: 12, def: 13, sta:  5,  img: '4-50_p', desc: '4 แฉก สูง 5.0mm เตี้ย (Beyblade X Wiki: ATK12/DEF13/STA5 — 5.9g)' },
    { id: '4-55',  name: '4-55',  height: 5.5, sides: 4, weight: 4.75, atk:  7, def:  5, sta:  6,  img: '4-55_p', desc: 'เตี้ยพิเศษ 5.5mm มุดงัดคู่แข่งได้ดี' },
    { id: '4-60',  name: '4-60',  height: 6.0, sides: 4, weight: 6.4, atk:  6, def:  6, sta:  6,  img: '4-60_p', desc: '4 แฉก ทรงสี่เหลี่ยมเพิ่มมุมปะทะ' },
    { id: '4-70',  name: '4-70',  height: 7.0, sides: 4, weight: 6.4, atk:  6, def:  6, sta:  7,  img: '4-70_p', desc: '4 แฉก สูง 7mm สมดุลดี' },
    { id: '4-80',  name: '4-80',  height: 8.0, sides: 4, weight: 7.1, atk:  5, def:  7, sta:  7,  img: '4-80_p', desc: '4 แฉก สูง 8mm ป้องกันและ Stamina สูง' },
    { id: '5-50',  name: '5-50',  height: 5.0, sides: 5, weight: 6.2, atk:  0, def:  0, sta:  0,  img: '5-50_p', desc: '5 แฉก สูง 5.0mm เตี้ยพิเศษ ศูนย์ถ่วงต่ำ — ⚠️ ยังไม่มีสถิติ ATK/DEF/STA ตรวจสอบ' },
    { id: '5-60',  name: '5-60',  height: 6.0, sides: 5, weight: 6.6, atk:  4, def:  8, sta:  9,  img: '5-60_p', desc: '5 แฉก สมดุลกลม หมุนนิ่ง เหมาะ Stamina' },
    { id: '5-70',  name: '5-70',  height: 7.0, sides: 5, weight: 6.7, atk:  4, def:  8, sta:  9,  img: '5-70_p', desc: '5 แฉก สูง 7mm เพิ่มเสถียรภาพ' },
    { id: '5-80',  name: '5-80',  height: 8.0, sides: 5, weight: 7.2, atk:  3, def:  9, sta: 10,  img: '5-80_p', desc: '5 แฉก สูง 8mm Defense+Stamina ยอดเยี่ยม' },
    { id: 'M-65',  name: 'M-65',  height: 6.5, sides: 3, weight: 0, atk: 10, def: 11, sta: 19,  img: 'M-65_p', desc: 'Metal Ratchet สูง 6.5mm (CX-20) วงแหวนโลหะ 3 ปุ่ม (Beyblade X Wiki: ATK10/DEF11/STA19) — ⚠️ น้ำหนักยังไม่ประกาศ' },
    { id: 'M-85',  name: 'M-85',  height: 8.5, sides: 5, weight: 10.6, atk:  8, def: 19, sta: 13,  img: 'M-85_p', desc: 'Metal Ratchet สูง 8.5mm หนักสุด ~10.6g Simple-type (Beyblade X Wiki: ATK8/DEF19/STA13)' },
    { id: '6-60',  name: '6-60',  height: 6.0, sides: 6, weight: 6.2, atk:  3, def:  9, sta:  9,  img: '6-60_p', desc: '6 แฉก เพิ่มความสมดุลรอบด้าน' },
    { id: '6-70',  name: '6-70',  height: 7.0, sides: 6, weight: 6.3, atk: 14, def:  7, sta:  9,  img: '6-70_p', desc: '6 แฉก สูง 7mm (Beyblade X Wiki: ATK14/DEF7/STA9 — 6.3g)' },
    { id: '6-80',  name: '6-80',  height: 8.0, sides: 6, weight: 7.0, atk:  2, def: 10, sta: 10,  img: '6-80_p', desc: '6 แฉก สูง 8mm Stamina+Defense สูงมาก' },
    { id: '7-55',  name: '7-55',  height: 5.5, sides: 7, weight: 5.2, atk:  6, def: 14, sta: 10,  img: '7-55_p', desc: '7 แฉก สูง 5.5mm Simple-type (Beyblade X Wiki: ATK6/DEF14/STA10 — 5.2g)' },
    { id: '7-60',  name: '7-60',  height: 6.0, sides: 7, weight: 6.7, atk:  4, def:  8, sta:  8,  img: '7-60_p', desc: '7 แฉก เพิ่มน้ำหนักรอบนอก' },
    { id: '7-70',  name: '7-70',  height: 7.0, sides: 7, weight: 6.8, atk:  3, def:  9, sta:  9,  img: '7-70_p', desc: '7 แฉก สูง 7mm สมดุลสูง' },
    { id: '7-80',  name: '7-80',  height: 8.0, sides: 7, weight: 7.8, atk:  7, def: 14, sta:  9,  img: '7-80_p', desc: '7 แฉก สูง 8mm (BeyBase: ATK7/DEF14/STA9 — 7.83g)' },
    { id: '8-70',  name: '8-70',  height: 7.0, sides: 8, weight: 7.68, atk:  2, def: 10, sta: 10,  img: '8-70_p', desc: '8 แฉก สูง 7mm เหมาะ Defense สูงสุด' },
    { id: '8-80',  name: '8-80',  height: 8.0, sides: 8, weight: 7.3, atk:  2, def: 10, sta: 10,  img: '8-80_p', desc: '8 แฉก สูง 8mm Heaviest Ratchet สาย Defense' },
    { id: '9-60',  name: '9-60',  height: 6.0, sides: 9, weight: 6.2, atk:  3, def:  9, sta: 10,  img: '9-60_p', desc: '9 แฉก เล็กถี่ ลดมุมปะทะ ป้องกันและหมุนนานสุด' },
    { id: '9-65',  name: '9-65',  height: 6.5, sides: 9, weight: 4.48, atk: 13, def: 10, sta:  7,  img: '9-65_p', desc: '9 แฉก สูง 6.5mm Simple-type (BeyBase: ATK13/DEF10/STA7 — 4.48g)' },
    { id: '9-70',  name: '9-70',  height: 7.0, sides: 9, weight: 6.3, atk: 13, def: 10, sta:  7,  img: '9-70_p', desc: '9 แฉก สูง 7mm (Beyblade X Wiki: ATK13/DEF10/STA7 — 6.3g)' },
    { id: '9-80',  name: '9-80',  height: 8.0, sides: 9, weight: 7.2, atk:  2, def: 10, sta: 10,  img: '9-80_p', desc: '9 แฉก สูง 8mm สมดุลสูงสุด Stamina Meta' },
    { id: '0-80',  name: '0-80',  height: 8.0, sides: 0, weight: 7.6, atk:  0, def:  5, sta: 12,  img: '0-80_p', desc: 'ไม่มีแฉก ทรงกลมสมบูรณ์ Stamina และทน Burst สูงสุด' },
    { id: '0-60',  name: '0-60',  height: 6.0, sides: 0, weight: 6.8, atk:  0, def:  4, sta: 11,  img: '0-60_p', desc: 'ไม่มีแฉก ทรงกลม 6mm Stamina เน้น' },
    { id: '0-70',  name: '0-70',  height: 7.0, sides: 0, weight: 6.4, atk:  0, def:  5, sta: 12,  img: '0-70_p', desc: 'ไม่มีแฉก ทรงกลม 7mm สูงกลาง Stamina สุดยอด' },
];

// ─── Bits (56 ตัว) — จัดกลุ่มตามประเภท · อ้างอิง Beyblade X Wiki 2026-11-14 ───
// Attack 18 · Stamina 11 · Defense 11 · Balance 16
// (Tr/Op เป็น Ratchet-Integrated Bits; สถิติ ATK/DEF/STA เป็นสเกลแอป 0–100)
const BITS: BitPart[] = [
    // Attack (18)
    { id: 'F',   name: 'F (Flat)',          type: 'Attack',  weight: 2.2,  speed: 85, atk: 25, def:  5, sta:  5,  burstResist: 2, img: 'Flat_p', desc: 'ปลายตัดราบ วิ่งไว พุ่ง X-Dash ง่าย' },
    { id: 'LF',  name: 'LF (Low Flat)',     type: 'Attack',  weight: 2.1,  speed: 95, atk: 30, def:  2, sta:  2,  burstResist: 2, img: 'LowFlat_p', desc: 'ปลายตัดราบเตี้ยพิเศษ พุ่ง X-Dash เร็วสุดขีด' },
    { id: 'GF',  name: 'GF (Gear Flat)',    type: 'Attack',  weight: 2.3,  speed:100, atk: 35, def:  0, sta:  0,  burstResist: 3, img: 'GearFlat_p', desc: 'เฟืองรอบตัวจับรางแน่น ความเร็วสูงสุด' },
    { id: 'R',   name: 'R (Rush)',          type: 'Attack',  weight: 2.1,  speed: 80, atk: 22, def:  8, sta: 10,  burstResist: 2, img: 'Rush_p', desc: 'ปลายตัดรอยหยัก วิ่งวนคุมทิศทาง' },
    { id: 'A',   name: 'A (Accel)',         type: 'Attack',  weight: 2.6,  speed: 90, atk: 28, def:  4, sta:  4,  burstResist: 2, img: 'Accel_p', desc: 'เร่งความเร็วจากขอบสนามรวดเร็ว' },
    { id: 'RA',  name: 'RA (Rubber Accel)', type: 'Attack',  weight: 2.7,  speed: 88, atk: 30, def:  6, sta:  5,  burstResist: 3, img: null, desc: 'ยางกันลื่นเร่งความเร็วควบคุมทิศทางได้' },
    { id: 'LR',  name: 'LR (Low Rush)',     type: 'Attack',  weight: 2.2,  speed: 82, atk: 24, def:  6, sta:  6,  burstResist: 2, img: null, desc: 'Rush ระดับต่ำ วิ่งชิดพื้นเร็ว' },
    { id: 'C',   name: 'C (Cyclone)',       type: 'Attack',  weight: 2.2,  speed: 78, atk: 26, def:  5, sta:  8,  burstResist: 2, img: 'Cyclone_p', desc: 'ปลายก้นหอย สร้างแรงหมุนวนกวาดคู่แข่ง' },
    { id: 'Q',   name: 'Q (Quake)',         type: 'Attack',  weight: 2.3,  speed: 25, atk:  5, def: 35, sta: 12,  burstResist: 2, img: 'Quake_p', desc: 'ปลายสั่นสะเทือน ดูดซับแรงชนด้วยการสั่น' },
    { id: 'FF',  name: 'FF (Free Flat)',    type: 'Attack',  weight: 2.4,  speed:  0, atk:  0, def:  0, sta:  0,  burstResist: 1, img: null, desc: 'ปลายหมุนอิสระ ไม่มีกันเบิร์สต์ — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
    { id: 'L',   name: 'L (Level)',         type: 'Attack',  weight: 2.8,  speed: 28, atk:  1, def: 13, sta: 30,  burstResist: 2, img: null, desc: 'ปลายราบระดับ รักษาแนวหมุนสม่ำเสมอ' },
    { id: 'V',   name: 'V (Vortex)',        type: 'Attack',  weight: 2.4,  speed: 30, atk:  2, def: 14, sta: 30,  burstResist: 2, img: null, desc: 'ปลายก้นหอยหมุนในตัว เพิ่ม Stamina ด้วยแรงดูดอากาศ' },
    { id: 'GR',  name: 'GR (Gear Rush)',    type: 'Attack',  weight: 2.12, speed:  0, atk:  0, def:  0, sta:  0,  burstResist: 3, img: null, desc: 'เร่งผ่านเกียร์ — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
    { id: 'I',   name: 'I (Ignition)',      type: 'Attack',  weight: 2.2,  speed:  0, atk:  0, def:  0, sta:  0,  burstResist: 3, img: null, desc: 'ขับเคลื่อนภายใน — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
    { id: 'J',   name: 'J (Jolt)',          type: 'Attack',  weight: 2.5,  speed:  0, atk:  0, def:  0, sta:  0,  burstResist: 3, img: null, desc: 'เคลื่อนที่ฉับไว — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
    { id: 'LC',  name: 'LC (Low Cyclone)',  type: 'Attack',  weight: 2.1,  speed:  0, atk:  0, def:  0, sta:  0,  burstResist: 1, img: null, desc: 'แกนต่ำ วิ่งวน — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
    { id: 'UF',  name: 'UF (Under Flat)',   type: 'Attack',  weight: 2.2,  speed:  0, atk:  0, def:  0, sta:  0,  burstResist: 3, img: null, desc: 'แกนต่ำ วิ่งเร็ว — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
    { id: 'Tr',  name: 'Tr (Turbo)',        type: 'Attack',  weight: 12.53, speed: 0, atk:  0, def:  0, sta:  0,  burstResist: 3, img: null, desc: 'Integrated Bit+Ratchet (12.53g) — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
    // Stamina (11)
    { id: 'B',   name: 'B (Ball)',          type: 'Stamina', weight: 2.0,  speed: 30, atk:  2, def: 15, sta: 30,  burstResist: 1, img: 'Ball_p', desc: 'ปลายทรงกลม ลดแรงเสียดทาน หมุนนานยอดนิยม' },
    { id: 'O',   name: 'O (Orb)',           type: 'Stamina', weight: 2.1,  speed: 25, atk:  0, def: 10, sta: 35,  burstResist: 1, img: 'Orb_p', desc: 'กลมเล็กพิเศษ หมุนนิ่งตรงกลางสนาม' },
    { id: 'MO',  name: 'MO (Metal Orb)',    type: 'Stamina', weight: 0,    speed: 25, atk:  1, def: 12, sta: 36,  burstResist: 2, img: null, desc: 'Metal Orb (BX-55) ปลาย Orb วัสดุโลหะ — Beyblade X Wiki: ATK5/DEF30/STA55/Dash10/Burst30 · ⚠️ น้ำหนักยังไม่ประกาศ' },
    { id: 'FB',  name: 'FB (Free Ball)',    type: 'Stamina', weight: 2.5,  speed: 28, atk:  1, def: 12, sta: 32,  burstResist: 1, img: null, desc: 'ลูกบอลหมุนอิสระ ลดแรงเสียดทานสูงสุด' },
    { id: 'DB',  name: 'DB (Disc Ball)',    type: 'Stamina', weight: 3.2,  speed: 32, atk:  3, def: 18, sta: 32,  burstResist: 2, img: 'DiscBall_p', desc: 'จานวงแหวนป้องกันการเอียงครูดพื้น' },
    { id: 'G',   name: 'G (Glide)',         type: 'Stamina', weight: 2.2,  speed: 65, atk: 16, def: 12, sta: 18,  burstResist: 2, img: 'Glide_p', desc: 'ปลายลื่นไถล เคลื่อนที่ราบเรียบประหยัดพลังงาน' },
    { id: 'LO',  name: 'LO (Low Orb)',      type: 'Stamina', weight: 2.0,  speed: 27, atk:  0, def: 11, sta: 34,  burstResist: 1, img: null, desc: 'Orb ระดับต่ำ สัมผัสพื้นน้อยที่สุด' },
    { id: 'GB',  name: 'GB (Gear Ball)',    type: 'Stamina', weight: 2.2,  speed: 33, atk:  4, def: 14, sta: 30,  burstResist: 2, img: 'GearBall_p', desc: 'เฟืองผสมลูกบอล คงเสถียรภาพขณะหมุนนาน' },
    { id: 'Y',   name: 'Y (Yielding)',      type: 'Stamina', weight: 4.2,  speed:  0, atk:  0, def:  0, sta:  0,  burstResist: 1, img: null, desc: 'หมุนต่อเนื่อง หนักกว่าปกติ — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
    { id: 'Nr',  name: 'Nr (Narrow)',       type: 'Stamina', weight: 1.9,  speed:  0, atk:  0, def:  0, sta:  0,  burstResist: 1, img: null, desc: 'หมุนพื้นที่แคบ เบาสุด 1.9g — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
    { id: 'WB',  name: 'WB (Wall Ball)',    type: 'Stamina', weight: 2.39, speed:  0, atk:  0, def:  0, sta:  0,  burstResist: 1, img: null, desc: 'หมุนกลาง ผนังกว้าง — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
    // Defense (11)
    { id: 'D',   name: 'D (Dot)',           type: 'Defense', weight: 2.0,  speed: 50, atk: 12, def: 12, sta: 18,  burstResist: 1, img: 'Dot_p', desc: 'จุดเดียวเล็กมาก สัมผัสพื้นน้อย หมุนนาน — Wiki จัดเป็น Defense' },
    { id: 'N',   name: 'N (Needle)',        type: 'Defense', weight: 2.0,  speed: 20, atk:  2, def: 30, sta: 15,  burstResist: 1, img: 'Needle_p', desc: 'ปลายแหลมปักหลักกลางสนาม ไม่ไถลตามแรงชน' },
    { id: 'HN',  name: 'HN (High Needle)',  type: 'Defense', weight: 2.0,  speed: 18, atk:  1, def: 32, sta: 14,  burstResist: 1, img: 'Highneedle_p', desc: 'เข็มสูงพิเศษ ยึดเสาหมุนตรงกลางแน่นมาก' },
    { id: 'S',   name: 'S (Spike)',         type: 'Defense', weight: 2.2,  speed: 55, atk: 14, def: 14, sta: 14,  burstResist: 2, img: 'Spike_p', desc: 'ปลายแหลมเล็ก เร็วพอควรหมุนได้นาน' },
    { id: 'W',   name: 'W (Wedge)',         type: 'Defense', weight: 2.3,  speed: 80, atk: 26, def:  6, sta:  6,  burstResist: 2, img: null, desc: 'ปลายลิ่มตัด งัดขอบล่างคู่แข่ง' },
    { id: 'UN',  name: 'UN (Under Needle)', type: 'Defense', weight: 2.3,  speed: 15, atk:  1, def: 35, sta: 12,  burstResist: 1, img: null, desc: 'เข็มใต้จาน ปักพื้นแน่น Defense สูงสุด' },
    { id: 'MN',  name: 'MN (Metal Needle)', type: 'Defense', weight: 2.7,  speed: 22, atk:  2, def: 38, sta: 12,  burstResist: 2, img: 'MetalNeedle_p', desc: 'เข็มโลหะ ทนทาน ป้องกันสูงสุดทุกสาย Needle' },
    { id: 'GN',  name: 'GN (Gear Needle)',  type: 'Defense', weight: 2.2,  speed: 23, atk:  3, def: 33, sta: 13,  burstResist: 2, img: 'GearNeedle_p', desc: 'เฟืองรอบตัวล็อกตำแหน่ง Defense ยอดเยี่ยม' },
    { id: 'BS',  name: 'BS (Bound Spike)',  type: 'Defense', weight: 2.4,  speed: 28, atk:  6, def: 34, sta: 12,  burstResist: 2, img: null, desc: 'เดือยสปริงรับแรงกระแทก กระดอนยืดหยุ่น' },
    { id: 'DS',  name: 'DS (Disk Spike)',   type: 'Defense', weight: 2.5,  speed:  0, atk:  0, def:  0, sta:  0,  burstResist: 2, img: null, desc: 'ปลายแหลม แข็งแรง — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
    { id: 'WW',  name: 'WW (Wall Wedge)',   type: 'Defense', weight: 2.4,  speed:  0, atk:  0, def:  0, sta:  0,  burstResist: 2, img: null, desc: 'ผนังกว้าง ทรงตัวดี — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
    // Balance (16)
    { id: 'T',   name: 'T (Taper)',         type: 'Balance', weight: 2.1,  speed: 70, atk: 18, def: 10, sta: 12,  burstResist: 2, img: 'Taper_p', desc: 'ปลายเฉียง วิ่งเร็วจังหวะแรกก่อนจะค่อยๆ นิ่ง' },
    { id: 'MT',  name: 'MT (Metal Taper)',  type: 'Balance', weight: 0,    speed: 70, atk: 20, def: 12, sta: 12,  burstResist: 3, img: null, desc: 'Metal Taper (CX-20) ปลาย Taper วัสดุโลหะ — Beyblade X Wiki: ATK40/DEF22/STA18/Dash20/Burst80 · ⚠️ น้ำหนักยังไม่ประกาศ' },
    { id: 'HT',  name: 'HT (High Taper)',   type: 'Balance', weight: 2.2,  speed: 72, atk: 20, def: 10, sta: 12,  burstResist: 2, img: 'HighTaper_p', desc: 'Taper สูงกว่าปกติ เพิ่มความเร็วช่วงต้น' },
    { id: 'P',   name: 'P (Point)',         type: 'Balance', weight: 2.1,  speed: 60, atk: 15, def: 15, sta: 15,  burstResist: 2, img: 'Point_p', desc: 'กึ่งแหลมกึ่งตัด หมุนตรงกลางแต่พุ่งชนได้' },
    { id: 'GP',  name: 'GP (Gear Point)',   type: 'Balance', weight: 2.3,  speed: 62, atk: 17, def: 17, sta: 14,  burstResist: 3, img: 'GearPoint_p', desc: 'เฟืองจุด สมดุลสูง ทน Burst ดี' },
    { id: 'U',   name: 'U (Unite)',         type: 'Balance', weight: 2.3,  speed: 58, atk: 15, def: 16, sta: 16,  burstResist: 2, img: 'Unite_p', desc: 'ปลายผสม รวมคุณสมบัติ Stamina/Defense ไว้ด้วยกัน' },
    { id: 'E',   name: 'E (Elevate)',       type: 'Balance', weight: 2.5,  speed: 35, atk:  3, def: 12, sta: 28,  burstResist: 2, img: 'Elevate_p', desc: 'ปลายยกตัวสูงขึ้นลดแรงเสียดทาน' },
    { id: 'H',   name: 'H (Hexa)',          type: 'Balance', weight: 2.5,  speed: 35, atk:  8, def: 32, sta: 18,  burstResist: 2, img: 'Hexa_p', desc: 'ปลายหกเหลี่ยม ยึดเกาะพื้นสนามทรงตัวดี' },
    { id: 'K',   name: 'K (Kick)',          type: 'Balance', weight: 2.4,  speed: 86, atk: 28, def:  5, sta:  5,  burstResist: 2, img: null, desc: 'ปลายแข็งเตะโยน สร้างแรงกระแทกแนวบน' },
    { id: 'Z',   name: 'Z (Zap)',           type: 'Balance', weight: 2.4,  speed:  0, atk:  0, def:  0, sta:  0,  burstResist: 3, img: null, desc: 'เคลื่อนที่ผสม — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
    { id: 'M',   name: 'M (Merge)',         type: 'Balance', weight: 3.4,  speed:  0, atk:  0, def:  0, sta:  0,  burstResist: 3, img: null, desc: 'เคลื่อนที่ผสม หนักกว่าปกติ — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
    { id: 'TP',  name: 'TP (Trans Point)',  type: 'Balance', weight: 2.4,  speed: 64, atk: 18, def: 16, sta: 14,  burstResist: 3, img: null, desc: 'จุดแปลงร่าง ปรับรูปทรงได้ตามแรงเหวี่ยง' },
    { id: 'TK',  name: 'TK (Trans Kick)',   type: 'Balance', weight: 2.5,  speed:  0, atk:  0, def:  0, sta:  0,  burstResist: 3, img: null, desc: 'เปลี่ยนรูปแบบ — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
    { id: 'Op',  name: 'Op (Operate)',      type: 'Balance', weight: 14.2, speed:  0, atk:  0, def:  0, sta:  0,  burstResist: 3, img: null, desc: 'Integrated Bit+Ratchet หนักสุด 14.2g — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
    { id: 'GU',  name: 'GU (Gear Unite)',   type: 'Balance', weight: 2.4,  speed:  0, atk:  0, def:  0, sta:  0,  burstResist: 3, img: null, desc: 'มีเกียร์ ผสมการเคลื่อนที่ — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
    { id: 'LP',  name: 'LP (Low Point)',    type: 'Balance', weight: 2.1,  speed:  0, atk:  0, def:  0, sta:  0,  burstResist: 3, img: null, desc: 'แกนต่ำ เคลื่อนที่ผสม — ⚠️ ยังไม่มีสถิติ speed/ATK/DEF/STA ตรวจสอบ' },
];

// ─── Exported PARTS_DB ────────────────────────────────────────────────────────
export const PARTS_DB = {
    BX: {
        blades: BX_BLADES,
    },
    UX: {
        blades: UX_BLADES,
    },
    CX: {
        blades: CX_BLADES,
        subblades: CX_SUBBLADES,
    },
    ratchets: RATCHETS,
    bits: BITS,
};

// ─── Physics helpers — re-exported from app/lib/physics.ts ───────────────────
export { calcPhysics } from './physics';
