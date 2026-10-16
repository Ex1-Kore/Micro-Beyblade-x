/**
 * POST /api/banners/click — เพิ่มยอดคลิกให้แบนเนอร์ (public, fire-and-forget)
 * body: { id: string }
 */
import { NextRequest, NextResponse } from 'next/server';
import { incrementBannerClick } from '../../../lib/banners';

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as { id?: string };
        if (!body?.id) {
            return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 });
        }
        const ok = await incrementBannerClick(body.id);
        return NextResponse.json({ ok });
    } catch (err) {
        console.error('[POST /api/banners/click]', err);
        return NextResponse.json({ ok: false, error: 'Failed to record click' }, { status: 500 });
    }
}
