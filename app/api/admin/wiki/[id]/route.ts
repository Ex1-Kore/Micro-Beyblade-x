/**
 * /api/admin/wiki/[id]
 *   PATCH  — แก้ไขบทความ (admin, partial)
 *   DELETE — ลบบทความ (admin)
 */
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { isAdmin } from '../../../../lib/admin-auth';
import { normalizeWikiInput } from '../../../../lib/wiki-input';

type Ctx = { params: Promise<{ id: string }> };

function isCode(err: unknown, code: string): boolean {
    return typeof err === 'object' && err !== null && (err as { code?: string }).code === code;
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
    if (!(await isAdmin())) {
        return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    try {
        const body = (await req.json()) as Record<string, unknown>;
        const parsed = normalizeWikiInput(body, true);
        if (!parsed.ok) {
            return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
        }
        const updated = await prisma.wikiArticle.update({ where: { id }, data: parsed.data as never });
        return NextResponse.json({ ok: true, data: updated });
    } catch (err) {
        if (isCode(err, 'P2025')) {
            return NextResponse.json({ ok: false, error: 'ไม่พบบทความ' }, { status: 404 });
        }
        if (isCode(err, 'P2002')) {
            return NextResponse.json({ ok: false, error: 'slug นี้ถูกใช้แล้ว' }, { status: 409 });
        }
        console.error('[PATCH /api/admin/wiki/[id]]', err);
        return NextResponse.json({ ok: false, error: 'Failed to update article' }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
    if (!(await isAdmin())) {
        return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    try {
        await prisma.wikiArticle.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch (err) {
        if (isCode(err, 'P2025')) {
            return NextResponse.json({ ok: false, error: 'ไม่พบบทความ' }, { status: 404 });
        }
        console.error('[DELETE /api/admin/wiki/[id]]', err);
        return NextResponse.json({ ok: false, error: 'Failed to delete article' }, { status: 500 });
    }
}
