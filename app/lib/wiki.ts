import 'server-only';
import prisma from './prisma';

export {
    WIKI_STATUSES,
    WIKI_CATEGORIES,
    WIKI_CATEGORY_LABELS,
} from './wiki-categories';
export type { WikiStatus, WikiCategory } from './wiki-categories';

/** บทความที่เผยแพร่แล้ว — สำหรับหน้า public */
export async function listPublishedArticles() {
    return prisma.wikiArticle.findMany({
        where: { status: 'published' },
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });
}

/** บทความเดียวที่เผยแพร่แล้วตาม slug — คืน null ถ้าไม่มี/ยังไม่เผยแพร่ */
export async function getPublishedArticleBySlug(slug: string) {
    return prisma.wikiArticle.findFirst({ where: { slug, status: 'published' } });
}

/** ทุกบทความ (รวม draft) — สำหรับ admin */
export async function listAllArticles() {
    return prisma.wikiArticle.findMany({
        orderBy: [{ updatedAt: 'desc' }],
    });
}

/** บทความตาม id — สำหรับ admin */
export async function getArticleById(id: string) {
    return prisma.wikiArticle.findUnique({ where: { id } });
}
