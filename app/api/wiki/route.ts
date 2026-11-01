/**
 * /api/wiki
 *   GET — รายการบทความที่เผยแพร่แล้ว (สาธารณะ) สำหรับ What's New / กระดิ่งแจ้งเตือน
 */
import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const articles = await prisma.wikiArticle.findMany({
            where: { status: 'published' },
            orderBy: [{ updatedAt: 'desc' }],
            take: 20,
            select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                category: true,
                coverImage: true,
                imageAlt: true,
                updatedAt: true,
                createdAt: true,
            },
        });
        return NextResponse.json({ ok: true, data: articles });
    } catch (err) {
        console.error('[GET /api/wiki]', err);
        return NextResponse.json({ ok: false, error: 'Failed to load articles' }, { status: 500 });
    }
}