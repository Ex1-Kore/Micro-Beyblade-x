/**
 * /api/admin/banners/[id]
 *   PATCH  — แก้ไขแบนเนอร์ (admin, partial)
 *   DELETE — ลบแบนเนอร์ (admin)
 */
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { isAdmin } from '../../../../lib/admin-auth';
import { normalizeBannerInput } from '../../../../lib/banner-input';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
    if (!(await isAdmin())) {
        return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    try {
        const body = (await req.json()) as Record<string, unknown>;
        const parsed = normalizeBannerInput(body, true);
        if (!parsed.ok) {
            return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
        }
        const updated = await prisma.banner.update({
            where: { id },
            data: parsed.data as never,
        });
        return NextResponse.json({ ok: true, data: updated });
    } catch (err) {
        console.error('[PATCH /api/admin/banners/[id]]', err);
        return NextResponse.json({ ok: false, error: 'Failed to update banner' }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
    if (!(await isAdmin())) {
        return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    try {
        await prisma.banner.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[DELETE /api/admin/banners/[id]]', err);
        return NextResponse.json({ ok: false, error: 'Failed to delete banner' }, { status: 500 });
    }
}
