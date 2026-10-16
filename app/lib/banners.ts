import 'server-only';
import prisma from './prisma';

export type BannerPosition = 'top' | 'wiki';

export const BANNER_POSITIONS: BannerPosition[] = ['top', 'wiki'];

/**
 * ดึงแบนเนอร์ที่ active และอยู่ในช่วงเวลา (startsAt/endsAt) ของตำแหน่งที่กำหนด
 */
export async function getActiveBanners(position: BannerPosition) {
    const now = new Date();
    return prisma.banner.findMany({
        where: {
            position,
            active: true,
            OR: [{ startsAt: null }, { startsAt: { lte: now } }],
            AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
}

/**
 * เพิ่มยอดคลิกให้แบนเนอร์ (fire-and-forget จาก client)
 */
export async function incrementBannerClick(id: string): Promise<boolean> {
    const res = await prisma.banner.updateMany({
        where: { id, active: true },
        data: { clickCount: { increment: 1 } },
    });
    return res.count > 0;
}
