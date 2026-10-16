/**
 * GET /api/banners?position=top|wiki — คืนแบนเนอร์ที่ active และอยู่ในช่วงเวลา
 * (public — ใช้โดย BannerSlot ฝั่ง client)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getActiveBanners, BANNER_POSITIONS, type BannerPosition } from '../../lib/banners';

export async function GET(req: NextRequest) {
    const raw = req.nextUrl.searchParams.get('position') ?? 'top';
    if (!BANNER_POSITIONS.includes(raw as BannerPosition)) {
        return NextResponse.json({ ok: false, error: 'invalid position' }, { status: 400 });
    }

    try {
        const banners = await getActiveBanners(raw as BannerPosition);
        const data = banners.map((b) => ({
            id: b.id,
            title: b.title,
            imageUrl: b.imageUrl,
            targetUrl: b.targetUrl,
            network: b.network,
            alt: b.alt,
            position: b.position,
        }));
        return NextResponse.json({ ok: true, data });
    } catch (err) {
        console.error('[GET /api/banners]', err);
        return NextResponse.json({ ok: false, error: 'Failed to fetch banners' }, { status: 500 });
    }
}
