import 'server-only';
import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'mbx_admin';
export const ADMIN_MAX_AGE = 60 * 60 * 12; // 12 ชั่วโมง

const TOKEN_CTX = 'mbx-admin-session:v1';

/** รหัสผ่าน admin — ตั้งใน env (ADMIN_PASSWORD). ถ้าไม่ตั้ง = ปิดระบบ admin */
function adminPassword(): string {
    return process.env.ADMIN_PASSWORD ?? '';
}

/** secret ที่ใช้เซ็น cookie — แยกจากรหัสผ่านได้ (ADMIN_SECRET) ไม่งั้น fallback เป็นรหัสผ่าน */
function sessionSecret(): string {
    return process.env.ADMIN_SECRET ?? adminPassword();
}

/** เซ็น payload (exp) ด้วย HMAC — constant-time เทียบฝั่งตรวจ */
function sign(payload: string): string {
    return createHmac('sha256', sessionSecret()).update(`${TOKEN_CTX}:${payload}`).digest('hex');
}

export function verifyPassword(input: string): boolean {
    const pw = adminPassword();
    if (!pw || !input) return false;
    const a = Buffer.from(input);
    const b = Buffer.from(pw);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
}

/** token = "<exp epoch ms>.<hmac>" — หมดอายุได้เองแม้ cookie ค้าง */
export function sessionToken(): string {
    const exp = Date.now() + ADMIN_MAX_AGE * 1000;
    return `${exp}.${sign(String(exp))}`;
}

function isValidToken(value: string): boolean {
    const idx = value.indexOf('.');
    if (idx <= 0) return false;
    const exp = value.slice(0, idx);
    const sig = value.slice(idx + 1);
    if (!/^\d+$/.test(exp)) return false;
    if (Number(exp) < Date.now()) return false;
    const expected = sign(exp);
    if (sig.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

/** ตรวจว่าปัจจุบันล็อกอินเป็น admin หรือไม่ (อ่าน cookie + ตรวจลายเซ็น/อายุ) */
export async function isAdmin(): Promise<boolean> {
    const jar = await cookies();
    const value = jar.get(ADMIN_COOKIE)?.value;
    if (!value) return false;
    return isValidToken(value);
}
