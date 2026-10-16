'use client';

import { useEffect, useState } from 'react';

type BannerData = {
    id: string;
    title: string;
    imageUrl: string;
    targetUrl: string;
    network: string;
    alt: string;
};

const NETWORK_LABEL: Record<string, string> = {
    shopee: 'Shopee',
    lazada: 'Lazada',
    tiktok: 'TikTok Shop',
    generic: 'สปอนเซอร์',
};

export default function BannerSlot({
    position,
    className = '',
}: {
    position: 'top' | 'wiki';
    className?: string;
}) {
    const [banners, setBanners] = useState<BannerData[] | null>(null);

    useEffect(() => {
        let alive = true;
        fetch(`/api/banners?position=${position}`)
            .then((res) => res.json())
            .then((json: { ok: boolean; data?: BannerData[] }) => {
                if (alive) setBanners(Array.isArray(json.data) ? json.data : []);
            })
            .catch(() => {
                if (alive) setBanners([]);
            });
        return () => {
            alive = false;
        };
    }, [position]);

    const recordClick = (id: string) => {
        const payload = JSON.stringify({ id });
        try {
            if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
                navigator.sendBeacon(
                    '/api/banners/click',
                    new Blob([payload], { type: 'application/json' }),
                );
            } else {
                void fetch('/api/banners/click', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: payload,
                    keepalive: true,
                });
            }
        } catch {
            /* ไม่ขวางการนำทางถ้าบันทึกคลิกพลาด */
        }
    };

    if (!banners || banners.length === 0) return null;

    return (
        <div className={className}>
            <div className="space-y-3">
                {banners.map((b) => (
                    <a
                        key={b.id}
                        href={b.targetUrl}
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                        onClick={() => recordClick(b.id)}
                        className="relative block overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/70 hover:border-cyan-600 transition-colors"
                    >
                        <span className="absolute left-3 top-3 rounded bg-slate-950/80 px-2 py-0.5 text-xs font-bold text-slate-300 border border-slate-700">
                            {NETWORK_LABEL[b.network] ?? NETWORK_LABEL.generic}
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={b.imageUrl}
                            alt={b.alt || b.title}
                            className="block w-full h-auto"
                            loading="lazy"
                        />
                        {b.title && (
                            <div className="border-t border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-300">
                                {b.title}
                            </div>
                        )}
                    </a>
                ))}
            </div>
        </div>
    );
}
