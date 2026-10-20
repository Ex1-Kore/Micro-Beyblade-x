import { WIKI_CATEGORIES, WIKI_STATUSES, type WikiCategory, type WikiStatus } from './wiki-categories';
import { asSafeUrl } from './safe-url';

export type WikiArticleInput = {
    slug: string;
    title: string;
    category: WikiCategory;
    content: string;
    status: WikiStatus;
    excerpt: string;
    coverImage: string;
    imageAlt: string;
    sortOrder: number;
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** slug ที่ชนกับหน้าคงที่ของ wiki (static ชนะ dynamic → บทความจะถูกบัง) */
const RESERVED_SLUGS = new Set([
    'system',
    'mechanics',
    'strategy',
    'glossary',
    'how-to-play',
    'parts',
    'products',
    'blades',
    'ratchets',
    'bits',
    'cx-parts',
]);

function asString(v: unknown, fallback = ''): string {
    return typeof v === 'string' ? v.trim() : fallback;
}

/**
 * ตรวจ/แปลง payload บทความ wiki ให้ปลอดภัยก่อนเข้า Prisma
 * partial=true สำหรับ PATCH (ฟิลด์ที่ไม่ส่งมา = ไม่แก้)
 */
export function normalizeWikiInput(
    body: Record<string, unknown>,
    partial = false,
): { ok: true; data: Partial<WikiArticleInput> } | { ok: false; error: string } {
    const out: Partial<WikiArticleInput> = {};

    if (!partial || 'slug' in body) {
        const slug = asString(body.slug).toLowerCase();
        if (!SLUG_RE.test(slug)) {
            return { ok: false, error: 'slug ใช้ได้เฉพาะ a-z, 0-9 และ - (เช่น my-article)' };
        }
        if (RESERVED_SLUGS.has(slug)) {
            return { ok: false, error: `slug "${slug}" สงวนไว้ให้หน้าคงที่ของ wiki` };
        }
        out.slug = slug;
    }

    if (!partial || 'title' in body) {
        const title = asString(body.title);
        if (!title || title.length > 120) {
            return { ok: false, error: 'title ต้องมี 1–120 ตัวอักษร' };
        }
        out.title = title;
    }

    if (!partial || 'category' in body) {
        const category = asString(body.category);
        if (!WIKI_CATEGORIES.includes(category as WikiCategory)) {
            return { ok: false, error: `category ต้องเป็นหนึ่งใน: ${WIKI_CATEGORIES.join(', ')}` };
        }
        out.category = category as WikiCategory;
    }

    if (!partial || 'content' in body) {
        const content = asString(body.content);
        if (content.length > 50000) {
            return { ok: false, error: 'content ยาวเกิน 50000 ตัวอักษร' };
        }
        out.content = content;
    }

    if (!partial || 'status' in body) {
        const status = asString(body.status, 'draft') || 'draft';
        if (!WIKI_STATUSES.includes(status as WikiStatus)) {
            return { ok: false, error: 'status ต้องเป็น "draft" หรือ "published"' };
        }
        out.status = status as WikiStatus;
    }

    if (!partial || 'excerpt' in body) {
        const excerpt = asString(body.excerpt);
        if (excerpt.length > 300) return { ok: false, error: 'excerpt ยาวเกิน 300 ตัวอักษร' };
        out.excerpt = excerpt;
    }

    if (!partial || 'coverImage' in body) {
        const raw = asString(body.coverImage);
        if (!raw) {
            out.coverImage = '';
        } else {
            const safe = asSafeUrl(raw);
            if (!safe) return { ok: false, error: 'coverImage ต้องเป็น http(s) หรือ path สัมพัทธ์' };
            out.coverImage = safe;
        }
    }

    if (!partial || 'imageAlt' in body) {
        const imageAlt = asString(body.imageAlt);
        if (imageAlt.length > 160) return { ok: false, error: 'imageAlt ยาวเกิน 160 ตัวอักษร' };
        out.imageAlt = imageAlt;
    }

    if (!partial || 'sortOrder' in body) {
        const n = Number(body.sortOrder);
        out.sortOrder = Number.isFinite(n) ? Math.trunc(n) : 0;
    }

    return { ok: true, data: out };
}
