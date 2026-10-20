/**
 * /api/admin/wiki
 *   GET  — list บทความทั้งหมด รวม draft (admin)
 *   POST — สร้างบทความใหม่ (admin)
 */
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { isAdmin } from '../../../lib/admin-auth';
import { normalizeWikiInput } from '../../../lib/wiki-input';

export const dynamic = 'force-dynamic';

export async function GET() {
    if (!(await isAdmin())) {
        return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
    try {
        const articles = await prisma.wikiArticle.findMany({ orderBy: [{ updatedAt: 'desc' }] });
        return NextResponse.json({ ok: true, data: articles });
    } catch (err) {
        console.error('[GET /api/admin/wiki]', err);
        return NextResponse.json({ ok: false, error: 'Failed to load articles' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
    try {
        const body = (await req.json()) as Record<string, unknown>;
        const parsed = normalizeWikiInput(body, false);
        if (!parsed.ok) {
            return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
        }
        const created = await prisma.wikiArticle.create({ data: parsed.data as never });
        return NextResponse.json({ ok: true, data: created }, { status: 201 });
    } catch (err) {
        if (typeof err === 'object' && err !== null && (err as { code?: string }).code === 'P2002') {
            return NextResponse.json({ ok: false, error: 'slug นี้ถูกใช้แล้ว' }, { status: 409 });
        }
        console.error('[POST /api/admin/wiki]', err);
        return NextResponse.json({ ok: false, error: 'Failed to create article' }, { status: 500 });
    }
}
