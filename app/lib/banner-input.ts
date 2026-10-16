import { BANNER_POSITIONS, type BannerPosition } from './banners';

export type BannerInput = {
    position: BannerPosition;
    title: string;
    imageUrl: string;
    targetUrl: string;
    network: string;
    alt: string;
    active: boolean;
    sortOrder: number;
    startsAt: Date | null;
    endsAt: Date | null;
};

function asString(v: unknown, fallback = ''): string {
    return typeof v === 'string' ? v.trim() : fallback;
}

function asDate(v: unknown): Date | null {
    if (v === null || v === undefined || v === '') return null;
    const d = new Date(String(v));
    return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * ตรวจ/แปลง payload แบนเนอร์เป็นข้อมูลที่ปลอดภัยสำหรับ Prisma
 * partial=true สำหรับ PATCH (ฟิลด์ที่ไม่ส่งมา = ไม่แก้)
 */
export function normalizeBannerInput(
    body: Record<string, unknown>,
    partial = false,
): { ok: true; data: Partial<BannerInput> } | { ok: false; error: string } {
    const out: Partial<BannerInput> = {};

    if (!partial || 'position' in body) {
        const pos = asString(body.position, 'top');
        if (!BANNER_POSITIONS.includes(pos as BannerPosition)) {
            return { ok: false, error: 'position ต้องเป็น "top" หรือ "wiki"' };
        }
        out.position = pos as BannerPosition;
    }

    if (!partial || 'imageUrl' in body) {
        const imageUrl = asString(body.imageUrl);
        if (!imageUrl) return { ok: false, error: 'ต้องระบุ imageUrl' };
        out.imageUrl = imageUrl;
    }

    if (!partial || 'targetUrl' in body) {
        const targetUrl = asString(body.targetUrl);
        if (!targetUrl) return { ok: false, error: 'ต้องระบุ targetUrl' };
        out.targetUrl = targetUrl;
    }

    if (!partial || 'title' in body) out.title = asString(body.title);
    if (!partial || 'alt' in body) out.alt = asString(body.alt);
    if (!partial || 'network' in body) out.network = asString(body.network, 'generic') || 'generic';
    if (!partial || 'active' in body) out.active = body.active === undefined ? true : Boolean(body.active);
    if (!partial || 'sortOrder' in body) {
        const n = Number(body.sortOrder);
        out.sortOrder = Number.isFinite(n) ? Math.trunc(n) : 0;
    }
    if (!partial || 'startsAt' in body) out.startsAt = asDate(body.startsAt);
    if (!partial || 'endsAt' in body) out.endsAt = asDate(body.endsAt);

    return { ok: true, data: out };
}
