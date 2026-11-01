import { PARTS_DB } from './parts-db';
import { BX_PRODUCT_IMAGE_MAP } from './bx-product-images';
import type { BladePart, BitPart, RatchetPart } from './types';
import * as fs from 'fs';
import * as path from 'path';

// ── Persistent cache across HMR reloads ──────────────────────────────────
const g = globalThis as unknown as {
    __productImageMap?: Map<string, string[]>;
    __productImageScanDone?: boolean;
    __productDetailsCache?: Map<string, ProductDetails>;
    __bladeIndexMap?: Map<string, BladePart>;
    __ratchetIndexMap?: Map<string, RatchetPart>;
    __bitIndexMap?: Map<string, BitPart>;
};

function buildProductImageMap(): Map<string, string[]> {
    const baseDir = path.join(process.cwd(), 'public', 'products');
    const map = new Map<string, string[]>();
    for (const series of ['BX', 'ux', 'cx']) {
        const dir = path.join(baseDir, series);
        if (!fs.existsSync(dir)) continue;
        for (const file of fs.readdirSync(dir)) {
            if (!file.endsWith('.png')) continue;
            // Normalize: remove newlines, collapse spaces
            const normalized = file.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
            // Key = product code (e.g., "BX-05")
            const code = normalized.split(' ')[0];
            if (code && /^[A-Z]{2}-?\d+/.test(code)) {
                const entry = `${series}/${normalized}`;
                if (!map.has(code)) map.set(code, []);
                map.get(code)!.push(entry);
            }
        }
    }
    return map;
}

function getProductImageMap(): Map<string, string[]> {
    if (!g.__productImageMap) {
        g.__productImageMap = buildProductImageMap();
    }
    return g.__productImageMap;
}

// ── Build Index Maps for faster lookups ────────────────────────────────
function buildBladeIndexMap(): Map<string, BladePart> {
    const map = new Map<string, BladePart>();
    const allBlades = [
        ...PARTS_DB.BX.blades,
        ...PARTS_DB.UX.blades,
        ...PARTS_DB.CX.blades,
    ];
    for (const blade of allBlades) {
        if (!map.has(blade.name)) {
            map.set(blade.name, blade);
        }
    }
    return map;
}

function buildRatchetIndexMap(): Map<string, RatchetPart> {
    const map = new Map<string, RatchetPart>();
    for (const ratchet of PARTS_DB.ratchets) {
        if (!map.has(ratchet.name)) {
            map.set(ratchet.name, ratchet);
        }
    }
    return map;
}

function buildBitIndexMap(): Map<string, BitPart> {
    const map = new Map<string, BitPart>();
    for (const bit of PARTS_DB.bits) {
        if (!map.has(bit.id)) {
            map.set(bit.id, bit);
        }
    }
    return map;
}

function getBladeIndexMap(): Map<string, BladePart> {
    if (!g.__bladeIndexMap) g.__bladeIndexMap = buildBladeIndexMap();
    return g.__bladeIndexMap;
}

function getRatchetIndexMap(): Map<string, RatchetPart> {
    if (!g.__ratchetIndexMap) g.__ratchetIndexMap = buildRatchetIndexMap();
    return g.__ratchetIndexMap;
}

function getBitIndexMap(): Map<string, BitPart> {
    if (!g.__bitIndexMap) g.__bitIndexMap = buildBitIndexMap();
    return g.__bitIndexMap;
}

// Pre-scan once at module load (server only)
if (!g.__productImageScanDone) {
    getProductImageMap();
    // Pre-build index maps
    getBladeIndexMap();
    getRatchetIndexMap();
    getBitIndexMap();
    g.__productImageScanDone = true;
}

export interface Product {
    code: string;
    name: string;
    releaseDate: string;
    note?: string;
    slug: string;
    image?: string;
}

type RawProduct = Omit<Product, 'slug'>;

function toProduct(section: string, index: number, p: RawProduct): Product {
    return { ...p, slug: `${section}-${index}` };
}

export const BASIC_LINE: Product[] = [
    { code: 'BX-00', name: 'Mammoth Tusk 2-80E', releaseDate: '27 ธ.ค. 2024' },
    { code: 'BX-00', name: 'Samurai Steel 5-70GF', releaseDate: '15 มิ.ย. 2025' },
    { code: 'BX-01', name: 'Dran Sword 3-60F', releaseDate: '15 ก.ค. 2023', note: 'Starter' },
    { code: 'BX-02', name: 'Hells Scythe 4-60T', releaseDate: '15 ก.ค. 2023', note: 'Starter' },
    { code: 'BX-03', name: 'Wizard Arrow 4-80B', releaseDate: '15 ก.ค. 2023', note: 'Starter' },
    { code: 'BX-04', name: 'Knight Shield 3-80N', releaseDate: '15 ก.ค. 2023', note: 'Starter' },
    { code: 'BX-05', name: 'Wizard Arrow 4-80B', releaseDate: '15 ก.ค. 2023' },
    { code: 'BX-06', name: 'Knight Shield 3-80N', releaseDate: '15 ก.ค. 2023' },
    { code: 'BX-07', name: 'Start Dash Set', releaseDate: '15 ก.ค. 2023' },
    { code: 'BX-08', name: '3on3 Deck Set', releaseDate: '15 ก.ค. 2023' },
    { code: 'BX-09', name: 'Beybattle Pass', releaseDate: '15 ก.ค. 2023' },
    { code: 'BX-10', name: 'Xtreme Stadium', releaseDate: '15 ก.ค. 2023' },
    { code: 'BX-11', name: 'Launcher Grip', releaseDate: '15 ก.ค. 2023' },
    { code: 'BX-12', name: '3on3 Deck Case', releaseDate: '15 ก.ค. 2023' },
    { code: 'BX-13', name: 'Knight Lance 4-80HN', releaseDate: '10 ส.ค. 2023' },
    { code: 'BX-14', name: 'Random Booster Volume 1', releaseDate: '9 ก.ย. 2023' },
    { code: 'BX-15', name: 'Leon Claw 5-60P', releaseDate: '7 ต.ค. 2023', note: 'Starter' },
    { code: 'BX-16', name: 'Random Booster Viper Tail Select', releaseDate: '7 ต.ค. 2023' },
    { code: 'BX-17', name: 'Battle Entry Set', releaseDate: '7 ต.ค. 2023' },
    { code: 'BX-18', name: 'String Launcher', releaseDate: '7 ต.ค. 2023' },
    { code: 'BX-19', name: 'Rhino Horn 3-80S', releaseDate: '2 พ.ย. 2023' },
    { code: 'BX-20', name: 'Dran Dagger Deck Set', releaseDate: '2 พ.ย. 2023' },
    { code: 'BX-21', name: 'Hells Chain Deck Set', releaseDate: '2 พ.ย. 2023' },
    { code: 'BX-22', name: 'Dran Sword 3-60F Entry Package', releaseDate: '2 ธ.ค. 2023' },
    { code: 'BX-23', name: 'Phoenix Wing 9-60GF', releaseDate: '27 ธ.ค. 2023', note: 'Starter' },
    { code: 'BX-24', name: 'Random Booster Vol. 2', releaseDate: '27 ธ.ค. 2023' },
    { code: 'BX-25', name: 'Gear Case', releaseDate: '27 ธ.ค. 2023' },
    { code: 'BX-26', name: 'Unicorn Sting 5-60GP', releaseDate: '27 ม.ค. 2024' },
    { code: 'BX-27', name: 'Random Booster Sphinx Cowl Select', releaseDate: '22 ก.พ. 2024' },
    { code: 'BX-28', name: 'String Launcher (White Ver.)', releaseDate: '30 มี.ค. 2024' },
    { code: 'BX-29', name: 'Custom Grip (White Ver.)', releaseDate: '30 มี.ค. 2024' },
    { code: 'BX-30', name: 'Custom Grip (Red Ver.)', releaseDate: '30 มี.ค. 2024' },
    { code: 'BX-31', name: 'Random Booster Vol. 3 Tyranno Beat 4-70Q', releaseDate: '27 เม.ย. 2024' },
    { code: 'BX-32', name: 'Wide Xtreme Stadium', releaseDate: '12 ต.ค. 2024' },
    { code: 'BX-33', name: 'Weiss Tiger 3-60U', releaseDate: '15 มิ.ย. 2024' },
    { code: 'BX-34', name: 'Cobalt Dragoon 2-60C', releaseDate: '13 ก.ค. 2024', note: 'Starter' },
    { code: 'BX-35', name: 'Random Booster Vol. 4 (Black Shell 4-60D)', releaseDate: '13 ก.ค. 2024' },
    { code: 'BX-36', name: 'Random Booster Whale Wave Select (Whale Wave 5-80E)', releaseDate: '14 ก.ย. 2024' },
    { code: 'BX-37', name: 'Double Xtreme Stadium Set', releaseDate: '12 ต.ค. 2024' },
    { code: 'BX-38', name: 'Crimson Garuda 4-70TP', releaseDate: '2 พ.ย. 2024' },
    { code: 'BX-39', name: 'Random Booster Shelter Drake Select', releaseDate: '15 ก.พ. 2025' },
    { code: 'BX-40', name: 'Winder Launcher L', releaseDate: '29 มี.ค. 2025' },
    { code: 'BX-41', name: 'Rubber Custom Grip (Gunmetal Ver.)', releaseDate: '29 มี.ค. 2025' },
    { code: 'BX-42', name: 'Rubber Custom Grip (Blue Ver.)', releaseDate: '29 มี.ค. 2025' },
    { code: 'BX-43', name: 'Gear Case (White Ver.)', releaseDate: '29 มี.ค. 2025' },
    { code: 'BX-44', name: 'Tricera Press M-85BS', releaseDate: '28 มิ.ย. 2025' },
    { code: 'BX-45', name: 'Samurai Calibur 6-70M', releaseDate: '9 ส.ค. 2025' },
    { code: 'BX-46', name: 'Battle Entry Set Infinity', releaseDate: '11 ต.ค. 2025' },
].map((p, i) => toProduct('basic', i, p));

export const UNIQUE_LINE: Product[] = [
    { code: 'UX-01', name: 'Dran Buster 1-60A', releaseDate: '30 มี.ค. 2024' },
    { code: 'UX-02', name: 'Hells Hammer 3-70H', releaseDate: '30 มี.ค. 2024' },
    { code: 'UX-03', name: 'Wizard Rod 5-70DB', releaseDate: '30 มี.ค. 2024' },
    { code: 'UX-04', name: 'Battle Entry Set', releaseDate: '27 เม.ย. 2024' },
    { code: 'UX-05', name: 'Random Booster Shinobi Shadow Select — Shinobi Shadow 1-80MN', releaseDate: '18 พ.ค. 2024' },
    { code: 'UX-06', name: 'Leon Crest 7-60GN', releaseDate: '10 ส.ค. 2024' },
    { code: 'UX-07', name: 'Phoenix Rudder Deck Set (Phoenix Rudder 9-70G)', releaseDate: '10 ส.ค. 2024' },
    { code: 'UX-08', name: 'Silver Wolf 3-80FB', releaseDate: '12 ต.ค. 2024' },
    { code: 'UX-09', name: 'Samurai Saber 2-70 Level', releaseDate: '2 พ.ย. 2024' },
    { code: 'UX-10', name: 'Customize Set U (Knight Mail 3-85BS)', releaseDate: '2 พ.ย. 2024' },
    { code: 'UX-11', name: 'Impact Drake 9-60LR', releaseDate: '28 ธ.ค. 2024' },
    { code: 'UX-12', name: 'Random Booster Vol. 5 (Ghost Circle 0-80GB)', releaseDate: '28 ธ.ค. 2024' },
    { code: 'UX-13', name: 'Golem Rock 1-60UN', releaseDate: '25 ม.ค. 2025' },
    { code: 'UX-14', name: 'Scorpio Spear 0-70Z', releaseDate: '26 เม.ย. 2025' },
    { code: 'UX-15', name: 'Shark Scale 4-50UF (Shark Scale Deck Set)', releaseDate: '9 ส.ค. 2025' },
    { code: 'UX-16', name: 'Random Booster Clock Mirage Select', releaseDate: '11 ต.ค. 2025' },
    { code: 'UX-17', name: 'Meteor Dragoon 3-70J', releaseDate: '27 ธ.ค. 2025' },
    { code: 'UX-18', name: 'Random Booster Vol. 8 (Mummy Curse 7-55W)', releaseDate: '27 ธ.ค. 2025' },
    { code: 'UX-19', name: 'Bullet Griffon H (UX Expand Blade)', releaseDate: '25 เม.ย. 2026' },
].map((p, i) => toProduct('unique', i, p));

export const CUSTOM_LINE: Product[] = [
    { code: 'CX-01', name: 'Dran Brave S6-60V', releaseDate: '29 มี.ค. 2025' },
    { code: 'CX-02', name: 'Wizard Arc R4-55LO', releaseDate: '29 มี.ค. 2025' },
    { code: 'CX-03', name: 'Perseus Dark B6-80W', releaseDate: '29 มี.ค. 2025' },
    { code: 'CX-04', name: 'Battle Entry Set C', releaseDate: '27 เม.ย. 2025' },
    { code: 'CX-05', name: 'Random Booster Vol. 6', releaseDate: '27 เม.ย. 2025' },
    { code: 'CX-06', name: 'Random Booster Fox Brush Select', releaseDate: '17 พ.ค. 2025' },
    { code: 'CX-07', name: 'Pegasus Blast ATr', releaseDate: '19 ก.ค. 2025' },
    { code: 'CX-08', name: 'Cerberus Flame W5-80WB (RB Vol. 7)', releaseDate: '19 ก.ค. 2025' },
    { code: 'CX-09', name: 'Sol Eclipse D5-70TK', releaseDate: '27 ก.ย. 2025' },
    { code: 'CX-10', name: 'Wolf Hunt F0-60DB', releaseDate: '1 พ.ย. 2025' },
    { code: 'CX-11', name: 'Emperor Might Deck Set', releaseDate: '1 พ.ย. 2025' },
    { code: 'CX-13', name: 'Bahamut Bliz BK1-50I', releaseDate: '28 มี.ค. 2026' },
    { code: 'CX-14', name: 'Knight Fortress GV8-70UN', releaseDate: '28 มี.ค. 2026' },
].map((p, i) => toProduct('custom', i, p));

export const SPECIAL_LINE: Product[] = [
    { code: 'BXG-01', name: 'Dranzer Spiral 3-80T', releaseDate: '15 ก.ค. 2023' },
].map((p, i) => toProduct('special', i, p));

export const EVENT_LINE: Product[] = [
    { code: 'BX-01', name: 'Dran Sword 3-60F (Starter)', releaseDate: '10 มิ.ย. 2023', note: 'CoroCoro Spirit Festival', image: '/blade/bx/Dran Sword.png' },
    { code: 'BX-02', name: 'Hells Scythe 4-60T (Starter)', releaseDate: '10 มิ.ย. 2023', note: 'CoroCoro Spirit Festival', image: '/blade/bx/Hells Scythe.png' },
    { code: 'BX-00', name: 'Cobalt Drake 4-60F (Blue)', releaseDate: 'ก.ย. 2023', note: 'Rare Bey Get Battle', image: '/blade/bx/Cobalt Drake.png' },
    { code: 'BX-00', name: 'Hells Scythe 4-60T (Gold)', releaseDate: 'ก.ย. 2023', note: 'Rare Bey Get Battle', image: '/blade/bx/Hells Scythe.png' },
    { code: 'BX-00', name: 'Knight Shield 3-80N (Gold)', releaseDate: '2023', note: 'Beyblade Battle Base Tournament Prize', image: '/blade/bx/Knight Shield.png' },
    { code: 'BX-23', name: 'Phoenix Wing 9-60GF (Starter)', releaseDate: '10 ธ.ค. 2023', note: "Toys R' Us", image: '/blade/bx/Phoenix Wing.png' },
    { code: 'BX-00', name: 'Phoenix Feather 3-60F', releaseDate: 'ม.ค. 2024', note: 'CoroCoro Comic', image: '/blade/bx/Phoenix Feather.png' },
    { code: 'BX-00', name: 'Hells Scythe 3-80F (SP X Bey)', releaseDate: '27 ม.ค. 2024', note: 'CoroCoro Comic', image: '/blade/bx/Hells Scythe.png' },
    { code: 'BX-00', name: 'Dran Sword 3-60F (Sushiro Ver.)', releaseDate: '14 ก.พ. 2024', note: 'Sushiro Hong Kong Exclusive', image: '/blade/bx/Dran Sword.png' },
    { code: 'BX-00', name: 'Leon Claw 5-60P (Metal Coat: Gold)', releaseDate: '22 ก.พ. 2024', note: 'Limited', image: '/blade/bx/Leon Claw.png' },
    { code: 'BX-00', name: 'Shark Edge 5-60GF (Metal Coat: Blue)', releaseDate: '23 มี.ค. 2024', note: 'Limited', image: '/blade/bx/Shark Edge.png' },
    { code: 'UX-00', name: 'Wyvern Hover 2-80GN', releaseDate: '24 ต.ค. 2025', note: 'Event', image: '/blade/bx/Wyvern Gale.png' },
    { code: 'UX-00', name: 'Orochi Cluster 6-60LF', releaseDate: '21 ม.ค. 2026', note: 'Event' },
].map((p, i) => toProduct('event', i, p));

export const ALL_PRODUCTS: Product[] = [
    ...BASIC_LINE,
    ...UNIQUE_LINE,
    ...CUSTOM_LINE,
    ...SPECIAL_LINE,
    ...EVENT_LINE,
];

export function getProductBySlug(slug: string): Product | undefined {
    return ALL_PRODUCTS.find((p) => p.slug === slug);
}

const BX_BLADE_IMAGES: string[] = [
    'Bear Scratch', 'Black Shell', 'Cobalt Dragoon', 'Cobalt Drake', 'Crimson Garuda', 'Croc Crunch',
    'Dragoon Storm', 'Dran Dagger', 'Dran Strike', 'Dran Sword', 'Dranzer Spiral', 'Driger S',
    'Hells Chain', 'Hells Scythe', 'Knight Lance', 'Knight Shield', 'Leon Claw',
    'Lightning L-Drago (Rapid Hit)', 'Lightning L-Drago (Upper)',
    'Mammoth Tusk', 'Phoenix Feather', 'Phoenix Wing', 'Ptera Swing', 'Rhino Horn',
    'Samurai Calibur', 'Shark Edge', 'Shelter Drake', 'Shinobi Knife', 'Sphinx Cowl',
    'Storm Pegasis', 'Tricera Press', 'Unicorn Sting', 'Victory Valkyrie', 'Viper Tail',
    'Weiss Tiger', 'Whale Wave', 'Wizard Arrow', 'Wyvern Gale', 'Xeno Xcalibur',
];

const UX_BLADE_IMAGES: string[] = [
    'Aero Pegasus', 'Bullet Griffon', 'Clock Mirage', 'Dran Buster', 'Ghost Circle',
    'Golem Rock', 'Hells Hammer', 'Impact Drake', 'Knight Mail', 'Leon Crest',
    'Meteor Dragoon', 'Mummy Curse', 'Phoenix Rudder', 'Samurai Saber', 'Shark Scale',
    'Shinobi Shadow', 'Silver Wolf', 'Tyranno Beat', 'Wizard Rod',
];

const CX_BLADE_IMAGES: string[] = [
    'Bahamut Blitz', 'Brachio Whip', 'Dran Brave',
];

const BLADE_IMAGE_DIRS: { set: Set<string>; dir: string }[] = [
    { set: new Set(BX_BLADE_IMAGES), dir: 'bx' },
    { set: new Set(UX_BLADE_IMAGES), dir: 'ux' },
    { set: new Set(CX_BLADE_IMAGES), dir: 'cx' },
];

const BLADE_IMAGE_OVERRIDES: Record<string, string> = {
    'Samurai Steel': '/blade/bx/BX-00 Samurai Steel 5-70GF.png',
};

const PRODUCT_IMAGE_OVERRIDES: Record<string, string> = {
    'BX-00': '/blade/bx/BX-00 Samurai Steel 5-70GF.png',
    'BX-03': '/blade/bx/BX-03 Wizard Arrow 4-80B.png',
    'BX-04': '/blade/bx/BX-04 Knight Shield 3-80N.png',
    'BX-05': '/blade/bx/BX-05 Wizard Arrow 4-80B.png',
    'BX-06': '/blade/bx/BX-06 Knight Shield 3-80N.png',
};

export function getBladeImgPath(bladeName: string, productCode?: string): string | null {
    // 1) ถ้ามี product code → หาไฟล์จาก public/products/<series>/ (BX ใช้ products/BX)
    if (productCode) {
        const matched = findProductImageFile({ code: productCode, name: bladeName } as Product);
        if (matched) return `/products/${matched}`;
    }
    // 2) BX: ใช้ map ไปยัง public/products/BX/
    const bxFile = BX_PRODUCT_IMAGE_MAP[bladeName];
    if (bxFile) return `/products/BX/${encodeURIComponent(bxFile)}`;
    // 3) UX/CX: ใช้รูปเดิมใน /blade/<series>/
    for (const { set, dir } of BLADE_IMAGE_DIRS) {
        if (dir !== 'bx' && set.has(bladeName)) return `/blade/${dir}/${encodeURIComponent(bladeName)}.png`;
    }
    return null;
}

function findProductImageFile(product: Product): string | null {
    const map = getProductImageMap();
    const candidates = map.get(product.code);
    if (!candidates || candidates.length === 0) return null;

    // If only one candidate, use it directly
    if (candidates.length === 1) return candidates[0];

    // Multiple candidates for same code: match by name similarity
    const nameKeywords = product.name
        .replace(/\([^)]*\)/g, '')
        .replace(/[^\w\s-]/g, ' ')
        .split(/\s+/)
        .filter(k => k.length > 2)
        .map(k => k.toLowerCase());

    let bestMatch = candidates[0];
    let bestScore = -1;

    for (const candidate of candidates) {
        const fileName = candidate.split('/').pop() || '';
        const fileLower = fileName.toLowerCase();
        let score = 0;
        for (const kw of nameKeywords) {
            if (fileLower.includes(kw.toLowerCase())) score++;
        }
        if (score > bestScore) {
            bestScore = score;
            bestMatch = candidate;
        }
    }

    return bestMatch;
}

export function getProductImgPath(product: Product): string | null {
    if (product.image) {
        return product.image;
    }

    const matchedFile = findProductImageFile(product);
    if (matchedFile) {
        return `/products/${matchedFile}`;
    }
    // Fallback to blade image
    const details = getProductDetails(product.name);
    if (details.blade) {
        return getBladeImgPath(details.blade.name, product.code);
    }
    return null;
}

export interface ProductPartDetail {
    name: string;
    weight: number | null;
    desc?: string;
    type?: string;
}

export interface ProductDetails {
    blade: ProductPartDetail | null;
    ratchet: ProductPartDetail | null;
    bit: ProductPartDetail | null;
}

const RATCHET_BIT_RE = /([0-9A-Z]-\d{2})([A-Z]{1,3})/;

export function getProductDetails(name: string): ProductDetails {
    // Check cache first
    if (!g.__productDetailsCache) {
        g.__productDetailsCache = new Map<string, ProductDetails>();
    }
    if (g.__productDetailsCache.has(name)) {
        return g.__productDetailsCache.get(name)!;
    }

    const bladeIndexMap = getBladeIndexMap();
    const ratchetIndexMap = getRatchetIndexMap();
    const bitIndexMap = getBitIndexMap();

    let blade: BladePart | null = null;

    // Exact match first (faster)
    for (const bladeName of bladeIndexMap.keys()) {
        if (name.startsWith(bladeName)) {
            blade = bladeIndexMap.get(bladeName)!;
            break;
        }
    }

    // Fallback: partial match with longest first
    if (!blade) {
        let longestMatch: BladePart | null = null;
        let longestLength = 0;
        for (const bladeName of bladeIndexMap.keys()) {
            if (name.includes(bladeName) && bladeName.length > longestLength) {
                longestMatch = bladeIndexMap.get(bladeName)!;
                longestLength = bladeName.length;
            }
        }
        blade = longestMatch;
    }

    const combo = name.match(RATCHET_BIT_RE);
    const ratchetName = combo?.[1] ?? null;
    const bitId = combo?.[2] ?? null;

    const ratchet = ratchetName ? ratchetIndexMap.get(ratchetName) ?? null : null;
    const bit = bitId ? bitIndexMap.get(bitId) ?? null : null;

    const result: ProductDetails = {
        blade: blade
            ? { name: blade.name, weight: blade.weight, desc: blade.desc }
            : null,
        ratchet: ratchet
            ? {
                name: ratchet.name,
                weight: ratchet.weight,
                desc: ratchet.desc,
                type: `${ratchet.sides} แฉก • สูง ${ratchet.height}mm`,
            }
            : null,
        bit: bit
            ? { name: bit.name, weight: bit.weight, desc: bit.desc, type: bit.type }
            : null,
    };

    // Cache the result
    g.__productDetailsCache!.set(name, result);
    return result;
}