import { PARTS_DB } from './parts-db';
import { BX_CATALOG } from './bx-catalog';
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

export const BASIC_LINE: Product[] = BX_CATALOG.map((entry, index) => {
    const combo = entry.ratchet && entry.bit ? ` ${entry.ratchet}${entry.bit}` : '';
    const variant = entry.variant ? ` (${entry.variant})` : '';
    return {
        code: entry.code,
        name: `${entry.name}${combo}${variant}`,
        releaseDate: '—',
        note: entry.variant ?? undefined,
        image: `/products/BX/${entry.file}`,
        slug: `basic-${index}`,
    };
});

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

export const SPECIAL_LINE: Product[] = [];

export const EVENT_LINE: Product[] = [
    { code: 'UX-00', name: 'Wyvern Hover 2-80GN', releaseDate: '24 ต.ค. 2025', note: 'Event' },
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

/** ค้นหา BladePart ใน PARTS_DB จากชื่อ — ใช้สร้าง path รูป UX/CX จากชื่อไฟล์จริง */
function findBladePartByName(bladeName: string): BladePart | null {
    for (const series of ['UX', 'CX'] as const) {
        const blade = PARTS_DB[series].blades.find((b) => b.name === bladeName);
        if (blade) return blade;
    }
    return null;
}

export function getBladeImgPath(bladeName: string, productCode?: string): string | null {
    // 1) ถ้ามี product code → หาไฟล์จาก public/products/<series>/ (BX ใช้ products/BX)
    if (productCode) {
        const matched = findProductImageFile({ code: productCode, name: bladeName } as Product);
        if (matched) return `/products/${matched}`;
    }
    // 2) BX: ใช้ map ไปยัง public/products/BX/
    const bxFile = BX_PRODUCT_IMAGE_MAP[bladeName];
    if (bxFile) return `/products/BX/${encodeURIComponent(bxFile)}`;
    // 3) UX/CX: ใช้ชื่อไฟล์จริงจาก PARTS_DB → /blade/<series>/<img>.png
    const blade = findBladePartByName(bladeName);
    if (blade?.img) {
        return `/blade/${blade.series.toLowerCase()}/${encodeURIComponent(blade.img)}.png`;
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