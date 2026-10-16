'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const json = (await res.json()) as { ok: boolean; error?: string };
            if (json.ok) {
                router.replace('/admin/banners');
                router.refresh();
            } else {
                setError(json.error ?? 'เข้าสู่ระบบไม่สำเร็จ');
            }
        } catch {
            setError('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center p-4">
            <form
                onSubmit={submit}
                className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4"
            >
                <div>
                    <h1 className="text-xl font-black text-white">ผู้ดูแลระบบ — แบนเนอร์</h1>
                    <p className="text-sm text-slate-400 mt-1">ใส่รหัสผ่านเพื่อจัดการแบนเนอร์ affiliate</p>
                </div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="รหัสผ่าน"
                    autoFocus
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-500"
                />
                {error && <p className="text-sm text-rose-400">{error}</p>}
                <button
                    type="submit"
                    disabled={loading || !password}
                    className="w-full rounded-xl bg-cyan-500 px-4 py-2 font-bold text-black hover:bg-cyan-400 disabled:opacity-50"
                >
                    {loading ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}
                </button>
            </form>
        </div>
    );
}
