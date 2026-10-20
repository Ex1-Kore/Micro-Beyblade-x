'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Markdown from '../wiki/markdown';
import {
    WIKI_CATEGORIES,
    WIKI_CATEGORY_LABELS,
    WIKI_STATUSES,
    type WikiCategory,
    type WikiStatus,
} from '../lib/wiki-categories';

type Article = {
    id: string;
    slug: string;
    title: string;
    category: string;
    content: string;
    status: string;
    excerpt: string;
    coverImage: string;
    imageAlt: string;
    sortOrder: number;
    updatedAt: string;
};

const EMPTY = {
    id: '',
    slug: '',
    title: '',
    category: 'mechanics' as WikiCategory,
    content: '',
    status: 'draft' as WikiStatus,
    excerpt: '',
    coverImage: '',
    imageAlt: '',
    sortOrder: 0,
};

type FormState = typeof EMPTY;

const inputCls =
    'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500';
const labelCls = 'block text-xs font-bold text-slate-400 mb-1';

function slugify(s: string): string {
    return s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export default function AdminWikiManager() {
    const router = useRouter();
    const [articles, setArticles] = useState<Article[]>([]);
    const [form, setForm] = useState<FormState>(EMPTY);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const isEditing = useMemo(() => Boolean(form.id), [form.id]);

    const [reloadKey, setReloadKey] = useState(0);
    const reload = useCallback(() => setReloadKey((k) => k + 1), []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch('/api/admin/wiki', { cache: 'no-store' });
                if (res.status === 401) {
                    router.replace('/admin/login');
                    return;
                }
                const json = (await res.json()) as { ok: boolean; data?: Article[] };
                if (!cancelled) setArticles(json.data ?? []);
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
            title: form.title,
            slug: form.slug,
            category: form.category,
            status: form.status,
            excerpt: form.excerpt,
            coverImage: form.coverImage,
            imageAlt: form.imageAlt,
            sortOrder: Number(form.sortOrder) || 0,
            content: form.content,
        };
        try {
            const res = await fetch(
                isEditing ? `/api/admin/wiki/${form.id}` : '/api/admin/wiki',
                {
                    method: isEditing ? 'PATCH' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                },
            );
            const json = (await res.json()) as { ok: boolean; error?: string };
            if (json.ok) {
                setMessage(isEditing ? 'บันทึกการแก้ไขแล้ว' : 'สร้างบทความแล้ว');
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
        if (!confirm('ยืนยันลบบทความนี้?')) return;
        try {
            const res = await fetch(`/api/admin/wiki/${id}`, { method: 'DELETE' });
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

    async function togglePublish(a: Article) {
        const next = a.status === 'published' ? 'draft' : 'published';
        try {
            await fetch(`/api/admin/wiki/${a.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: next }),
            });
            reload();
        } catch {
            setError('เปลี่ยนสถานะไม่สำเร็จ');
        }
    }

    function edit(a: Article) {
        setForm({
            id: a.id,
            slug: a.slug,
            title: a.title,
            category: (WIKI_CATEGORIES as readonly string[]).includes(a.category)
                ? (a.category as WikiCategory)
                : 'mechanics',
            content: a.content,
            status: a.status === 'published' ? 'published' : 'draft',
            excerpt: a.excerpt,
            coverImage: a.coverImage,
            imageAlt: a.imageAlt,
            sortOrder: a.sortOrder,
        });
        setMessage('');
        setError('');
        setShowPreview(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function logout() {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.replace('/admin/login');
        router.refresh();
    }

    return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans">
            <header className="border-b border-slate-800 bg-[#121826]/90 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                    <h1 className="font-black text-white">จัดการบทความ Wiki</h1>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/banners"
                            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-cyan-600"
                        >
                            แบนเนอร์
                        </Link>
                        <Link
                            href="/wiki"
                            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-cyan-600"
                        >
                            ดู Wiki
                        </Link>
                        <button
                            onClick={logout}
                            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-rose-600 hover:text-rose-400"
                        >
                            ออกจากระบบ
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
                <form onSubmit={save} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-white">
                            {isEditing ? `แก้ไขบทความ: ${form.title || form.id}` : 'สร้างบทความใหม่'}
                        </h2>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowPreview((v) => !v)}
                                className="text-sm text-slate-400 hover:text-white"
                            >
                                {showPreview ? 'ซ่อนตัวอย่าง' : 'ดูตัวอย่าง Markdown'}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={reset} className="text-sm text-slate-400 hover:text-white">
                                    ยกเลิกการแก้ไข
                                </button>
                            )}
                        </div>
                    </div>

                    {message && <p className="text-sm text-emerald-400">{message}</p>}
                    {error && <p className="text-sm text-rose-400">{error}</p>}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className={labelCls}>หัวข้อ *</label>
                            <input
                                className={inputCls}
                                value={form.title}
                                onChange={(e) => {
                                    const title = e.target.value;
                                    setForm((f) => ({
                                        ...f,
                                        title,
                                        slug: !isEditing && (!f.slug || f.slug === slugify(f.title)) ? slugify(title) : f.slug,
                                    }));
                                }}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelCls}>slug * (a-z, 0-9, -)</label>
                            <input
                                className={inputCls}
                                value={form.slug}
                                onChange={(e) => set('slug', e.target.value)}
                                placeholder="my-article"
                                required
                            />
                        </div>
                        <div>
                            <label className={labelCls}>หมวดหมู่ *</label>
                            <select
                                className={inputCls}
                                value={form.category}
                                onChange={(e) => set('category', e.target.value as WikiCategory)}
                            >
                                {WIKI_CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {WIKI_CATEGORY_LABELS[c]} ({c})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>สถานะ</label>
                            <select
                                className={inputCls}
                                value={form.status}
                                onChange={(e) => set('status', e.target.value as WikiStatus)}
                            >
                                {WIKI_STATUSES.map((s) => (
                                    <option key={s} value={s}>
                                        {s === 'published' ? 'published — เผยแพร่' : 'draft — ฉบับร่าง'}
                                    </option>
                                ))}
                            </select>
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
                        <div className="sm:col-span-2">
                            <label className={labelCls}>คำโปรย / excerpt (ไม่บังคับ)</label>
                            <input
                                className={inputCls}
                                value={form.excerpt}
                                onChange={(e) => set('excerpt', e.target.value)}
                                maxLength={300}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>URL ภาพหน้าปก (ไม่บังคับ)</label>
                            <input
                                className={inputCls}
                                value={form.coverImage}
                                onChange={(e) => set('coverImage', e.target.value)}
                                placeholder="https://... หรือ /blade/bx/..."
                            />
                        </div>
                        <div>
                            <label className={labelCls}>คำบรรยายภาพ (alt)</label>
                            <input
                                className={inputCls}
                                value={form.imageAlt}
                                onChange={(e) => set('imageAlt', e.target.value)}
                                maxLength={160}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelCls}>เนื้อหา (Markdown) *</label>
                            <textarea
                                className={`${inputCls} min-h-[260px] font-mono leading-relaxed`}
                                value={form.content}
                                onChange={(e) => set('content', e.target.value)}
                                placeholder={'## หัวข้อย่อย\n\nเนื้อหา... **ตัวหนา**, - รายการ'}
                            />
                        </div>
                    </div>

                    {showPreview && (
                        <div className="rounded-2xl border border-slate-800 bg-[#121826] p-5">
                            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">ตัวอย่าง</p>
                            <Markdown content={form.content || '_ยังไม่มีเนื้อหา_'} />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-cyan-500 px-4 py-2 font-bold text-black hover:bg-cyan-400 disabled:opacity-50"
                    >
                        {saving ? 'กำลังบันทึก…' : isEditing ? 'บันทึกการแก้ไข' : 'สร้างบทความ'}
                    </button>
                </form>

                <section className="space-y-3">
                    <h2 className="font-bold text-white">บทความทั้งหมด ({articles.length})</h2>
                    {loading ? (
                        <p className="text-sm text-slate-400">กำลังโหลด…</p>
                    ) : articles.length === 0 ? (
                        <p className="text-sm text-slate-400">ยังไม่มีบทความ</p>
                    ) : (
                        <div className="space-y-3">
                            {articles.map((a) => (
                                <div
                                    key={a.id}
                                    className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-center"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2 text-sm">
                                            <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-cyan-300">
                                                /wiki/{a.slug}
                                            </span>
                                            <span className="text-slate-400">
                                                {WIKI_CATEGORY_LABELS[a.category as WikiCategory] ?? a.category}
                                            </span>
                                            <span
                                                className={
                                                    a.status === 'published' ? 'text-emerald-400' : 'text-amber-400'
                                                }
                                            >
                                                {a.status === 'published' ? '● published' : '○ draft'}
                                            </span>
                                        </div>
                                        <p className="truncate text-sm font-bold text-white">{a.title}</p>
                                        {a.excerpt && <p className="truncate text-xs text-slate-500">{a.excerpt}</p>}
                                    </div>
                                    <div className="flex shrink-0 gap-2">
                                        <button
                                            onClick={() => togglePublish(a)}
                                            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-cyan-600"
                                        >
                                            {a.status === 'published' ? 'ถอน' : 'เผยแพร่'}
                                        </button>
                                        <button
                                            onClick={() => edit(a)}
                                            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-cyan-600"
                                        >
                                            แก้ไข
                                        </button>
                                        <button
                                            onClick={() => remove(a.id)}
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
