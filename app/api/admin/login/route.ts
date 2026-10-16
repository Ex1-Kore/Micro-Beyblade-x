/**
 * POST /api/admin/login — ตรวจรหัสผ่าน (env ADMIN_PASSWORD) แล้วตั้ง cookie session
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, ADMIN_COOKIE, ADMIN_MAX_AGE, sessionToken } from '../../../lib/admin-auth';

export async function POST(req: NextRequest) {
    let password = '';
    try {
        const body = (await req.json()) as { password?: string };
        password = body.password ?? '';
    } catch {
        return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
    }

    if (!verifyPassword(password)) {
        return NextResponse.json({ ok: false, error: 'รหัสผ่านไม่ถูกต้อง' }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    const proto = req.headers.get('x-forwarded-proto') ?? req.nextUrl.protocol.replace(':', '');
    res.cookies.set(ADMIN_COOKIE, sessionToken(), {
        httpOnly: true,
        sameSite: 'lax',
        secure: proto === 'https',
        path: '/',
        maxAge: ADMIN_MAX_AGE,
    });
    return res;
}
