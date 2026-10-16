import 'server-only';
import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'mbx_admin';
export const ADMIN_MAX_AGE = 60 * 60 * 12; // 12 ชั่วโมง

/** รหัสผ่าน admin — ตั้งใน env (ADMIN_PASSWORD). ถ้าไม่ตั้ง = ปิดระบบ admin */
function adminPassword(): string {
    return process.env.ADMIN_PASSWORD ?? '';
}

/** secret ที่ใช้เซ็น cookie — แยกจากรหัสผ่านได้ (ADMIN_SECRET) ไม่งั้น fallback เป็นรหัสผ่าน */
function sessionSecret(): string {
    return process.env.ADMIN_SECRET ?? adminPassword();
}

/** ค่า cookie ที่ถูกต้อง (HMAC ของ secret) — เทียบแบบ constant-time */
function expectedToken(): string {
    return createHmac('sha256', sessionSecret()).update('mbx-admin-session:v1').digest('hex');
}

export function verifyPassword(input: string): boolean {
    const pw = adminPassword();
    if (!pw || !input) return false;
    const a = Buffer.from(input);
    const b = Buffer.from(pw);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
}

export function sessionToken(): string {
    return expectedToken();
}

/** ตรวจว่าปัจจุบันล็อกอินเป็น admin หรือไม่ (อ่าน cookie) */
export async function isAdmin(): Promise<boolean> {
    const jar = await cookies();
    const value = jar.get(ADMIN_COOKIE)?.value;
    if (!value) return false;
    const expected = expectedToken();
    if (value.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}
