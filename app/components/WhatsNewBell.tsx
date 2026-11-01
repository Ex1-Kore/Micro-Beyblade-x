'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Bell, X, FileText, ChevronRight } from 'lucide-react';
import { WIKI_CATEGORY_LABELS } from '../lib/wiki-categories';

interface Article {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    category: string;
    coverImage: string | null;
    imageAlt: string | null;
    updatedAt: string;
    createdAt: string;
}

const STORAGE_KEY = 'mbx_whatsnew_lastseen';

function readLastSeen(): number {
    if (typeof window === 'undefined') return 0;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return 0;
        const t = Date.parse(raw);
        return Number.isFinite(t) ? t : 0;
    } catch {
        return 0;
    }
}

function writeLastSeen(ts: number) {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, new Date(ts).toISOString());
    } catch {
        /* ignore */
    }
}

function formatRelative(iso: string): string {
    const t = Date.parse(iso);
    if (!Number.isFinite(t)) return '';
    const diff = Date.now() - t;
    const day = 24 * 60 * 60 * 1000;
    if (diff < day) return 'วันนี้';
    if (diff < 2 * day) return 'เมื่อวาน';
    if (diff < 7 * day) return `${Math.floor(diff / day)} วันที่แล้ว`;
    return new Date(t).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function WhatsNewBell() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [lastSeen, setLastSeen] = useState<number>(() =>
        typeof window === 'undefined' ? 0 : readLastSeen(),
    );

    useEffect(() => {
        let cancelled = false;
        fetch('/api/wiki', { cache: 'no-store' })
            .then((r) => (r.ok ? r.json() : null))
            .then((json) => {
                if (cancelled || !json?.ok) return;
                setArticles(Array.isArray(json.data) ? json.data : []);
            })
            .catch(() => {})
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const unread = articles.filter((a) => Date.parse(a.updatedAt) > lastSeen).length;

    const markAllRead = useCallback(() => {
        const maxTs = articles.reduce((m, a) => Math.max(m, Date.parse(a.updatedAt)), 0);
        if (maxTs > 0) {
            writeLastSeen(maxTs);
            setLastSeen(maxTs);
        }
    }, [articles]);

    const handleOpen = () => {
        setOpen(true);
        // mark as read when opening
        markAllRead();
    };

    const handleClose = () => setOpen(false);

    // close on ESC
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    // lock body scroll when open
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    const badgeText = unread > 9 ? '9+' : String(unread);

    return (
        <>
            <button
                type="button"
                onClick={handleOpen}
                aria-label="What's New — แจ้งเตือนเนื้อหาใหม่"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-slate-600/50 text-slate-300 hover:text-white hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all hover:bg-slate-800/30 backdrop-blur-sm flex-shrink-0"
            >
                <Bell className="w-4 h-4" />
                {unread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-rose-500/40 animate-pulse">
                        {badgeText}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-20 px-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label="What's New"
                >
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />
                    <div className="relative w-full max-w-lg bg-[#121826] border border-slate-700/60 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col max-h-[80vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-gradient-to-r from-[#0f1c2e]/90 to-[#121826]/90">
                            <div className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-cyan-400" />
                                <h2 className="text-lg font-black text-white">What&apos;s New</h2>
                                <span className="text-xs text-slate-500">เนื้อหาใหม่</span>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                aria-label="ปิด"
                                className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="overflow-y-auto flex-1">
                            {loading && (
                                <div className="px-5 py-10 text-center text-slate-500 text-sm">
                                    กำลังโหลด...
                                </div>
                            )}
                            {!loading && articles.length === 0 && (
                                <div className="px-5 py-10 text-center text-slate-500 text-sm">
                                    ยังไม่มีเนื้อหาใหม่
                                </div>
                            )}
                            {!loading && articles.length > 0 && (
                                <ul className="divide-y divide-slate-800/60">
                                    {articles.map((a) => {
                                        const label =
                                            WIKI_CATEGORY_LABELS[a.category as keyof typeof WIKI_CATEGORY_LABELS] ??
                                            a.category;
                                        return (
                                            <li key={a.id}>
                                                <Link
                                                    href={`/wiki/${a.slug}`}
                                                    onClick={handleClose}
                                                    className="flex gap-3 px-5 py-4 hover:bg-slate-800/40 transition-colors group"
                                                >
                                                    {a.coverImage ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={a.coverImage}
                                                            alt={a.imageAlt || a.title}
                                                            className="w-14 h-14 rounded-lg object-cover border border-slate-800 flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                                                            <FileText className="w-5 h-5 text-slate-500" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                                                                {label}
                                                            </span>
                                                            <span className="text-[10px] text-slate-600">
                                                                {formatRelative(a.updatedAt)}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                                                            {a.title}
                                                        </h3>
                                                        {a.excerpt && (
                                                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                                                {a.excerpt}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors self-center flex-shrink-0" />
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-3 border-t border-slate-800/80 bg-[#0f1c2e]/60">
                            <Link
                                href="/wiki"
                                onClick={handleClose}
                                className="flex items-center justify-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                ดูบทความทั้งหมด <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}