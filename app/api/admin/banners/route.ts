/**
 * /api/admin/banners
 *   GET  — list แบนเนอร์ทั้งหมด (admin)
 *   POST — สร้างแบนเนอร์ใหม่ (admin)
 */
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { isAdmin } from '../../../lib/admin-auth';
import { normalizeBannerInput } from '../../../lib/banner-input';

export async function GET() {
    if (!(await isAdmin())) {
        return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
    try {
        const data = await prisma.banner.findMany({
            orderBy: [{ position: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
        });
        return NextResponse.json({ ok: true, data });
    } catch (err) {
        console.error('[GET /api/admin/banners]', err);
        return NextResponse.json({ ok: false, error: 'Failed to fetch banners' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
    try {
        const body = (await req.json()) as Record<string, unknown>;
        const parsed = normalizeBannerInput(body, false);
        if (!parsed.ok) {
            return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
        }
        const created = await prisma.banner.create({ data: parsed.data as never });
        return NextResponse.json({ ok: true, data: created }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/admin/banners]', err);
        return NextResponse.json({ ok: false, error: 'Failed to create banner' }, { status: 500 });
    }
}
