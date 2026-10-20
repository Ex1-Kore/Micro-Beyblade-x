export const WIKI_STATUSES = ['draft', 'published'] as const;
export type WikiStatus = (typeof WIKI_STATUSES)[number];

export const WIKI_CATEGORIES = [
    'mechanics',
    'system',
    'strategy',
    'glossary',
    'how-to-play',
    'parts',
    'products',
] as const;
export type WikiCategory = (typeof WIKI_CATEGORIES)[number];

export const WIKI_CATEGORY_LABELS: Record<WikiCategory, string> = {
    mechanics: 'กลศาสตร์ฟิสิกส์',
    system: 'ระบบและชิ้นส่วน',
    strategy: 'กลยุทธ์และการจัดเด็ค',
    glossary: 'อภิธานศัพท์',
    'how-to-play': 'วิธีเล่น',
    parts: 'ชิ้นส่วน',
    products: 'สินค้า',
};
