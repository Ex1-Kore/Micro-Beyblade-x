import 'server-only';
import prisma from './prisma';

export type BannerPosition = 'top' | 'wiki';
export type BannerNetwork = 'shopee' | 'lazada' | 'tiktok' | 'generic';

export const BANNER_POSITIONS: BannerPosition[] = ['top', 'wiki'];
export const BANNER_NETWORKS: BannerNetwork[] = ['shopee', 'lazada', 'tiktok', 'generic'];

/**
 * ดึงแบนเนอร์ที่ active และอยู่ในช่วงเวลา (startsAt/endsAt) ของตำแหน่งที่กำหนด
 * ถ้าส่ง network มาด้วย จะ filter เฉพาะเครือข่ายนั้น (เช่น shopee หรือ lazada)
 */
export async function getActiveBanners(position: BannerPosition, network?: BannerNetwork) {
    const now = new Date();
    return prisma.banner.findMany({
        where: {
            position,
            active: true,
            ...(network ? { network } : {}),
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
