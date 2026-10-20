/**
 * ตรวจ URL ที่ปลอดภัยสำหรับ render ในหน้าเว็บ
 * ยอมรับเฉพาะ http(s) หรือ path สัมพัทธ์ในเว็บ (ขึ้นต้นด้วย "/" เดี่ยว)
 * ปฏิเสธ "//host", "/\\host", ช่องว่าง และ scheme อื่น (เช่น javascript:)
 */
export function asSafeUrl(v: unknown): string | null {
    if (typeof v !== 'string') return null;
    const s = v.trim();
    if (!s) return null;
    if (/^\/(?!\/)[^\s\\]*$/.test(s)) return s;
    try {
        const u = new URL(s);
        if (u.protocol === 'http:' || u.protocol === 'https:') return s;
        return null;
    } catch {
        return null;
    }
}
