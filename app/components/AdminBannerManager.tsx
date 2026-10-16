'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Banner = {
    id: string;
    position: 'top' | 'wiki';
    title: string;
    imageUrl: string;
    targetUrl: string;
    network: string;
    alt: string;
    active: boolean;
    sortOrder: number;
    startsAt: string | null;
    endsAt: string | null;
    clickCount: number;
    createdAt: string;
};

const EMPTY = {
    id: '',
    position: 'top' as 'top' | 'wiki',
    title: '',
    imageUrl: '',
    targetUrl: '',
    network: 'shopee',
    alt: '',
    active: true,
    sortOrder: 0,
    startsAt: '',
    endsAt: '',
};

type FormState = typeof EMPTY;

function toLocalInput(iso: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminBannerManager() {
    const router = useRouter();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [form, setForm] = useState<FormState>(EMPTY);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const isEditing = useMemo(() => Boolean(form.id), [form.id]);

    const [reloadKey, setReloadKey] = useState(0);
    const reload = useCallback(() => setReloadKey((k) => k + 1), []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch('/api/admin/banners', { cache: 'no-store' });
                if (res.status === 401) {
                    router.replace('/admin/login');
                    return;
                }
                const json = (await res.json()) as { ok: boolean; data?: Banner[] };
                if (!cancelled) setBanners(json.data ?? []);
            } catch {
                if (!cancelled) setError('โหลดข้อมูลไม่สำเร็จ');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [reloadKey, router]);

    function set<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    function reset() {
        setForm(EMPTY);
        setError('');
        setMessage('');
    }

    async function save(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');
        setMessage('');
        const payload = {
            position: form.position,
            title: form.title,
            imageUrl: form.imageUrl,
            targetUrl: form.targetUrl,
            network: form.network,
            alt: form.alt,
            active: form.active,
            sortOrder: Number(form.sortOrder) || 0,
            startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
            endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
        };
        try {
            const res = await fetch(
                isEditing ? `/api/admin/banners/${form.id}` : '/api/admin/banners',
                {
                    method: isEditing ? 'PATCH' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                },
            );
            const json = (await res.json()) as { ok: boolean; error?: string };
            if (json.ok) {
                setMessage(isEditing ? 'บันทึกการแก้ไขแล้ว' : 'เพิ่มแบนเนอร์แล้ว');
                reset();
                reload();
            } else {
                setError(json.error ?? 'บันทึกไม่สำเร็จ');
            }
        } catch {
            setError('บันทึกไม่สำเร็จ');
        } finally {
            setSaving(false);
        }
    }

    async function remove(id: string) {
        if (!confirm('ยืนยันลบแบนเนอร์นี้?')) return;
        try {
            const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessage('ลบแล้ว');
                if (form.id === id) reset();
                reload();
            } else {
                setError('ลบไม่สำเร็จ');
            }
        } catch {
            setError('ลบไม่สำเร็จ');
        }
    }

    async function toggleActive(b: Banner) {
        try {
            await fetch(`/api/admin/banners/${b.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !b.active }),
            });
            reload();
        } catch {
            setError('เปลี่ยนสถานะไม่สำเร็จ');
        }
    }

    function edit(b: Banner) {
        setForm({
            id: b.id,
            position: b.position,
            title: b.title,
            imageUrl: b.imageUrl,
            targetUrl: b.targetUrl,
            network: b.network,
            alt: b.alt,
            active: b.active,
            sortOrder: b.sortOrder,
            startsAt: toLocalInput(b.startsAt),
            endsAt: toLocalInput(b.endsAt),
        });
        setMessage('');
        setError('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function logout() {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.replace('/admin/login');
        router.refresh();
    }

    const inputCls =
        'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500';
    const labelCls = 'block text-xs font-bold text-slate-400 mb-1';

    return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans">
            <header className="border-b border-slate-800 bg-[#121826]/90 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <h1 className="font-black text-white">จัดการแบนเนอร์ (Affiliate)</h1>
                    <button
                        onClick={logout}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-rose-600 hover:text-rose-400"
                    >
                        ออกจากระบบ
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                <form onSubmit={save} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-white">
                            {isEditing ? `แก้ไขแบนเนอร์ ${form.id}` : 'เพิ่มแบนเนอร์ใหม่'}
                        </h2>
                        {isEditing && (
                            <button type="button" onClick={reset} className="text-sm text-slate-400 hover:text-white">
                                ยกเลิกการแก้ไข
                            </button>
                        )}
                    </div>

                    {message && <p className="text-sm text-emerald-400">{message}</p>}
                    {error && <p className="text-sm text-rose-400">{error}</p>}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelCls}>ตำแหน่ง</label>
                            <select
                                className={inputCls}
                                value={form.position}
                                onChange={(e) => set('position', e.target.value as 'top' | 'wiki')}
                            >
                                <option value="top">top — ใต้ header ทุกหน้า</option>
                                <option value="wiki">wiki — แทรกในหน้า wiki</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>เครือข่าย</label>
                            <select
                                className={inputCls}
                                value={form.network}
                                onChange={(e) => set('network', e.target.value)}
                            >
                                <option value="shopee">Shopee</option>
                                <option value="lazada">Lazada</option>
                                <option value="tiktok">TikTok Shop</option>
                                <option value="generic">อื่น ๆ / สปอนเซอร์</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelCls}>ชื่อ/หัวข้อ (ไม่บังคับ)</label>
                            <input className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelCls}>URL รูปภาพ *</label>
                            <input
                                className={inputCls}
                                value={form.imageUrl}
                                onChange={(e) => set('imageUrl', e.target.value)}
                                placeholder="https://..."
                                required
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelCls}>ลิงก์ปลายทาง (affiliate) *</label>
                            <input
                                className={inputCls}
                                value={form.targetUrl}
                                onChange={(e) => set('targetUrl', e.target.value)}
                                placeholder="https://s.shopee.co.th/..."
                                required
                            />
                        </div>
                        <div>
                            <label className={labelCls}>คำบรรยายภาพ (alt)</label>
                            <input className={inputCls} value={form.alt} onChange={(e) => set('alt', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>ลำดับการแสดง (sortOrder)</label>
                            <input
                                type="number"
                                className={inputCls}
                                value={form.sortOrder}
                                onChange={(e) => set('sortOrder', Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>เริ่มแสดง (เว้นว่าง = ทันที)</label>
                            <input
                                type="datetime-local"
                                className={inputCls}
                                value={form.startsAt}
                                onChange={(e) => set('startsAt', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>สิ้นสุด (เว้นว่าง = ไม่มีกำหนด)</label>
                            <input
                                type="datetime-local"
                                className={inputCls}
                                value={form.endsAt}
                                onChange={(e) => set('endsAt', e.target.value)}
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-slate-300">
                        <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} />
                        เปิดใช้งาน (active)
                    </label>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-cyan-500 px-4 py-2 font-bold text-black hover:bg-cyan-400 disabled:opacity-50"
                    >
                        {saving ? 'กำลังบันทึก…' : isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มแบนเนอร์'}
                    </button>
                </form>

                <section className="space-y-3">
                    <h2 className="font-bold text-white">รายการแบนเนอร์ ({banners.length})</h2>
                    {loading ? (
                        <p className="text-sm text-slate-400">กำลังโหลด…</p>
                    ) : banners.length === 0 ? (
                        <p className="text-sm text-slate-400">ยังไม่มีแบนเนอร์</p>
                    ) : (
                        <div className="space-y-3">
                            {banners.map((b) => (
                                <div
                                    key={b.id}
                                    className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-center"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={b.imageUrl}
                                        alt={b.alt || b.title}
                                        className="h-16 w-28 shrink-0 rounded-lg border border-slate-700 object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-cyan-300">
                                                {b.position}
                                            </span>
                                            <span className="text-slate-400">{b.network}</span>
                                            <span className={b.active ? 'text-emerald-400' : 'text-slate-500'}>
                                                {b.active ? '● active' : '○ ปิด'}
                                            </span>
                                        </div>
                                        <p className="truncate text-sm text-white">{b.title || '(ไม่มีชื่อ)'}</p>
                                        <p className="truncate text-xs text-slate-500">{b.targetUrl}</p>
                                        <p className="text-xs text-slate-500">คลิก: {b.clickCount}</p>
                                    </div>
                                    <div className="flex shrink-0 gap-2">
                                        <button
                                            onClick={() => toggleActive(b)}
                                            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-cyan-600"
                                        >
                                            {b.active ? 'ปิด' : 'เปิด'}
                                        </button>
                                        <button
                                            onClick={() => edit(b)}
                                            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-cyan-600"
                                        >
                                            แก้ไข
                                        </button>
                                        <button
                                            onClick={() => remove(b.id)}
                                            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-rose-600 hover:text-rose-400"
                                        >
                                            ลบ
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
