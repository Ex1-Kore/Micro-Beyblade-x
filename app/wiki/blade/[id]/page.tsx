import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Zap, Shield, Star } from 'lucide-react';
import { WikiLayout } from '../../components';
import Markdown from '../../markdown';
import { getPublishedArticleBySlug } from '../../../lib/wiki';
import { BLADES, getBladeImagePath, estimateInertiaKgM2, type BladeEntry } from '../../../lib/blades-data';

export const dynamic = 'force-dynamic';

const TYPE_STYLE: Record<BladeEntry['type'], string> = {
    Attack:  'bg-rose-950/60 text-rose-400 border-rose-800/40',
    Defense: 'bg-blue-950/60 text-blue-400 border-blue-800/40',
    Stamina: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40',
    Balance: 'bg-violet-950/60 text-violet-400 border-violet-800/40',
};

const SERIES_STYLE: Record<BladeEntry['series'], { text: string; border: string; bg: string }> = {
    BX: { text: 'text-cyan-400',   border: 'border-cyan-800/50',   bg: 'bg-cyan-950/40' },
    UX: { text: 'text-amber-400',  border: 'border-amber-800/50',  bg: 'bg-amber-950/40' },
    CX: { text: 'text-violet-400', border: 'border-violet-800/50', bg: 'bg-violet-950/40' },
};

type Props = { params: Promise<{ id: string }> };

export default async function BladeDetailPage({ params }: Props) {
    const { id } = await params;
    const blade = BLADES.find((b) => b.id === id);
    if (!blade) notFound();

    const imagePath = getBladeImagePath(blade);
    const seriesStyle = SERIES_STYLE[blade.series];

    const articleSlug = `blade-${blade.id.toLowerCase()}`;
    const article = await getPublishedArticleBySlug(articleSlug);

    return (
        <WikiLayout title={`${blade.name} — วิเคราะห์`} icon={<Star className="w-4 h-4 text-cyan-400" />}>
            {/* Header */}
            <div className="bg-[#121826] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Link href="/wiki/blades" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                        <ChevronRight className="w-4 h-4 rotate-180" /> รายการ Blade
                    </Link>
                    <span className="text-slate-700">/</span>
                    <span className="text-white font-bold">{blade.name}</span>
                </div>

                <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
                    {/* Image */}
                    <div className="relative flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 p-4">
                        {imagePath ? (
                            <Image
                                src={imagePath}
                                alt={blade.name}
                                width={240}
                                height={240}
                                className="max-h-60 w-auto object-contain"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-3xl border border-slate-700 bg-slate-800 flex items-center justify-center text-center px-2 text-sm font-bold text-slate-600">
                                {blade.name}
                            </div>
                        )}
                        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded border ${seriesStyle.bg} ${seriesStyle.text} ${seriesStyle.border}`}>
                            {blade.series}
                        </span>
                    </div>

                    {/* Specs */}
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-3xl font-black text-white">{blade.name}</h1>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                {blade.code && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-400 border border-slate-700">
                                        {blade.code}
                                    </span>
                                )}
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${TYPE_STYLE[blade.type]}`}>
                                    {blade.type}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 mt-2 leading-relaxed">{blade.desc}</p>
                            {blade.note && <p className="text-sm text-slate-300 mt-2 leading-relaxed">{blade.note}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">น้ำหนัก</p>
                                <p className="mt-1 font-bold text-white">{blade.weight} g</p>
                            </div>
                            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">ATK / DEF / STA</p>
                                <p className="mt-1 font-bold text-white">{blade.atk} / {blade.def} / {blade.sta}</p>
                            </div>
                            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Inertia Factor (k)</p>
                                <p className="mt-1 font-bold text-white">{blade.inertiaFactor}</p>
                            </div>
                            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Radius / Height</p>
                                <p className="mt-1 font-bold text-white">
                                    {blade.radiusMm ?? '—'} mm / {blade.heightMm ?? '—'} mm
                                </p>
                            </div>
                            {blade.distribution && (
                                <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Mass Distribution</p>
                                    <p className="mt-1 font-bold text-white">{blade.distribution}</p>
                                </div>
                            )}
                            {blade.radiusMm && (
                                <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Estimated I (thin-ring)</p>
                                    <p className="mt-1 font-bold text-white">
                                        {(() => {
                                            const i = estimateInertiaKgM2(blade.weight, blade.radiusMm!);
                                            return i ? `${i.toExponential(3)} kg·m²` : '—';
                                        })()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Analysis article from CMS */}
            <section className="space-y-4">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" /> บทวิเคราะห์
                </h2>
                {article ? (
                    <article className="bg-[#121826] border border-slate-800 rounded-2xl p-6 md:p-8">
                        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">
                            <span className="rounded-full bg-cyan-950/50 border border-cyan-800/50 text-cyan-300 px-3 py-1 font-bold">
                                {article.category}
                            </span>
                            <span className="text-slate-500">
                                อัปเดตล่าสุด {new Date(article.updatedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">{article.title}</h3>
                        {article.excerpt && <p className="text-slate-400 mb-6 leading-relaxed">{article.excerpt}</p>}
                        {article.coverImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={article.coverImage}
                                alt={article.imageAlt || article.title}
                                className="rounded-2xl border border-slate-800 mb-6 w-full h-auto"
                            />
                        )}
                        <Markdown content={article.content} />
                    </article>
                ) : (
                    <div className="bg-[#121826] border border-slate-800 rounded-2xl p-8 text-center space-y-3">
                        <p className="text-slate-400">ยังไม่มีบทวิเคราะห์สำหรับ {blade.name}</p>
                        <p className="text-xs text-slate-600">
                            สร้างบทความใน admin (slug: <code className="text-slate-300">{articleSlug}</code>, category: parts) เพื่อเพิ่มเนื้อหาได้เรื่อยๆ
                        </p>
                    </div>
                )}
            </section>
        </WikiLayout>
    );
}
