import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Package, Star, Layers, Zap, Trophy, Weight } from 'lucide-react';
import { BASIC_LINE, UNIQUE_LINE, CUSTOM_LINE, EVENT_LINE, getProductDetails, getProductImgPath } from '../../lib/products';
import type { Product } from '../../lib/products';

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ icon, title, count, color }: {
    icon: React.ReactNode; title: string; count: number; color: string;
}) {
    return (
        <div className={`flex items-center justify-between mb-4`}>
            <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                    {icon}
                </div>
                <h2 className="text-xl font-black text-white">{title}</h2>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
                {count} รายการ
            </span>
        </div>
    );
}

function ProductCard({ product }: { product: Product }) {
    const details = getProductDetails(product.name);
    const productImg = getProductImgPath(product);

    return (
        <Link
            href={`/wiki/products/${product.slug}`}
            className="group bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:-translate-y-1 transition-all flex flex-col backdrop-blur-sm shadow-lg shadow-slate-950/30 hover:shadow-cyan-500/10"
        >
            <div className="relative aspect-square bg-slate-900/40 m-3 rounded-xl overflow-hidden">
                {productImg ? (
                    <Image
                        src={productImg}
                        alt={product.name}
                        fill
                        className="object-contain p-3 group-hover:scale-110 transition-transform duration-300"
                        sizes="(min-width: 1024px) 240px, (min-width: 640px) 200px, 50vw"
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="w-14 h-14 text-slate-700 group-hover:text-slate-600 transition-colors" />
                    </div>
                )}
            </div>
            <div className="p-4 flex-1 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
                        {product.code}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{product.releaseDate}</span>
                </div>
                <div className="text-sm font-bold text-slate-100 leading-snug line-clamp-2">
                    {product.name}
                </div>
                {details.blade ? (
                    <>
                        <div className="flex flex-wrap gap-1 text-[10px] font-bold">
                            <span className="rounded border border-cyan-800/40 bg-cyan-950/40 px-1.5 py-0.5 text-cyan-300">
                                Blade: {details.blade.name}
                            </span>
                            <span className="rounded border border-blue-800/40 bg-blue-950/40 px-1.5 py-0.5 text-blue-300">
                                Ratchet: {details.ratchet?.name ?? '—'}
                            </span>
                            <span className="rounded border border-emerald-800/40 bg-emerald-950/40 px-1.5 py-0.5 text-emerald-300">
                                Bit: {details.bit?.name ?? '—'}
                            </span>
                        </div>
                        <div className="mt-auto flex items-center gap-1.5 text-xs text-yellow-400 font-bold pt-1 border-t border-slate-800">
                            <Weight className="w-3.5 h-3.5" />
                            {details.blade.weight !== null ? `${details.blade.weight} g` : 'เบลด'}
                            {details.ratchet && details.ratchet.weight !== null && (
                                <span className="text-slate-500 font-medium">+ {details.ratchet.weight} g</span>
                            )}
                            {details.bit && details.bit.weight !== null && (
                                <span className="text-slate-500 font-medium">+ {details.bit.weight} g</span>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="mt-auto text-xs text-slate-600 pt-1 border-t border-slate-800">อุปกรณ์/เซ็ต</div>
                )}
            </div>
        </Link>
    );
}

function ProductCardGrid({ products }: { products: Product[] }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
                <ProductCard key={p.slug} product={p} />
            ))}
        </div>
    );
}

function ProductTable({ products, showNote = false }: { products: Product[]; showNote?: boolean }) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-700/50 bg-slate-950/40 backdrop-blur-sm">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-gradient-to-r from-slate-800/50 to-slate-800/30">
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 w-24">รหัสสินค้า</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-300">ชื่อสินค้า</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 w-36">วันวางจำหน่าย</th>
                        {showNote && <th className="px-4 py-3 text-left text-xs font-bold text-slate-300 w-48">หมายเหตุ</th>}
                    </tr>
                </thead>
                <tbody>
                    {products.map((p, i) => (
                        <tr key={i} className="border-t border-slate-800/50 hover:bg-slate-900/30 transition-colors">
                            <td className="px-4 py-3">
                                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
                                    {p.code}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-slate-200 font-medium">
                                {p.name}
                                {p.note && !showNote && (
                                    <span className="ml-2 text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.5 rounded">
                                        {p.note}
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-slate-400 text-xs">{p.releaseDate}</td>
                            {showNote && (
                                <td className="px-4 py-3 text-xs text-amber-400">{p.note ?? '—'}</td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
    const totalProducts = BASIC_LINE.length + UNIQUE_LINE.length + CUSTOM_LINE.length + EVENT_LINE.length;

    return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans">

            {/* Nav */}
            <nav className="border-b border-slate-800 bg-[#121826]/90 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                        <ChevronRight className="w-4 h-4 rotate-180" /> หน้าหลัก
                    </Link>
                    <span className="text-slate-700">/</span>
                    <Link href="/wiki" className="text-slate-400 hover:text-white transition-colors">Wiki</Link>
                    <span className="text-slate-700">/</span>
                    <span className="text-white font-bold flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-cyan-400" /> รายการสินค้าทั้งหมด
                    </span>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">

                {/* Hero */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 text-xs font-bold px-4 py-1.5 rounded-full">
                        <Package className="w-3.5 h-3.5" /> Takara Tomy Official Release List
                    </div>
                    <h1 className="text-4xl font-black text-white">
                        รายการสินค้า <span className="text-cyan-400">Beyblade X</span> ทั้งหมด
                    </h1>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto">
                        รายการผลิตภัณฑ์ Beyblade X ทั้งหมดที่ออกจำหน่ายโดย Takara Tomy ตั้งแต่เปิดตัวเมื่อ 15 ก.ค. 2566 จนถึงปัจจุบัน
                    </p>
                    <div className="flex justify-center gap-4 pt-2 flex-wrap">
                        {[
                            { label: 'Basic Line', count: BASIC_LINE.length, color: 'text-cyan-400' },
                            { label: 'Unique Line', count: UNIQUE_LINE.length, color: 'text-amber-400' },
                            { label: 'Custom Line', count: CUSTOM_LINE.length, color: 'text-violet-400' },
                            { label: 'Event (UX)', count: EVENT_LINE.length, color: 'text-rose-400' },
                            { label: 'รวมทั้งหมด', count: totalProducts, color: 'text-white' },
                        ].map(item => (
                            <div key={item.label} className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2 text-center">
                                <div className={`text-2xl font-black ${item.color}`}>{item.count}</div>
                                <div className="text-xs text-slate-400">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Jump */}
                <div className="bg-[#121826] border border-slate-800 rounded-2xl p-4 flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-slate-500 font-bold">ข้ามไปที่:</span>
                    {[
                        ['#basic', 'Basic Line (BX)'],
                        ['#unique', 'Unique Line (UX)'],
                        ['#custom', 'Custom Line (CX)'],
                        ['#event', 'Event Limited'],
                    ].map(([href, label]) => (
                        <a key={href} href={href}
                            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700">
                            {label}
                        </a>
                    ))}
                </div>

                {/* Basic Line */}
                <section id="basic" className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm shadow-lg shadow-slate-950/30">
                    <SectionTitle
                        icon={<Layers className="w-5 h-5 text-cyan-400" />}
                        title="Basic Line (BX)"
                        count={BASIC_LINE.length}
                        color="bg-cyan-950/60"
                    />
                    <p className="text-xs text-slate-500 mb-6">
                        สายหลักของ Beyblade X — แสดงรหัสสินค้า + ชื่อ Blade + Ratchet + Bit ครบทั้ง {BASIC_LINE.length} รายการตาม{' '}
                        <code className="rounded bg-slate-800 px-1 text-slate-400">public/products/BX/readme.md</code>{' '}
                        <Link href="/wiki/blades" className="font-bold text-cyan-400 hover:text-cyan-300">
                            ดูรายการ Blade ทั้งหมด →
                        </Link>
                    </p>
                    <ProductCardGrid products={BASIC_LINE} />
                </section>

                {/* Unique Line */}
                <section id="unique" className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm shadow-lg shadow-slate-950/30">
                    <SectionTitle
                        icon={<Star className="w-5 h-5 text-amber-400" />}
                        title="Unique Line (UX)"
                        count={UNIQUE_LINE.length}
                        color="bg-amber-950/60"
                    />
                    <p className="text-xs text-slate-500 mb-6">
                        ซีรีส์พรีเมียม เบลดออกแบบให้มวลกระจายขอบนอกสูง เพิ่ม Angular Momentum — เริ่มวางจำหน่าย มี.ค. 2567
                    </p>
                    <ProductCardGrid products={UNIQUE_LINE} />
                </section>

                {/* Custom Line */}
                <section id="custom" className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm shadow-lg shadow-slate-950/30">
                    <SectionTitle
                        icon={<Zap className="w-5 h-5 text-violet-400" />}
                        title="Custom Line (CX)"
                        count={CUSTOM_LINE.length}
                        color="bg-violet-950/60"
                    />
                    <p className="text-xs text-slate-500 mb-6">
                        ระบบ 4-5 ชิ้น มี Sub-Blade / Assist Blade สลับได้ — ปรับค่า Inertia Factor ได้ละเอียดสูงสุด เริ่มวางจำหน่าย มี.ค. 2568
                    </p>
                    <ProductCardGrid products={CUSTOM_LINE} />
                </section>

                {/* Event */}
                <section id="event" className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm shadow-lg shadow-slate-950/30">
                    <SectionTitle
                        icon={<Trophy className="w-5 h-5 text-rose-400" />}
                        title="Event & Limited Releases"
                        count={EVENT_LINE.length}
                        color="bg-rose-950/60"
                    />
                    <p className="text-xs text-slate-500 mb-6">
                        สินค้า Limited Edition จากงาน Event, นิตยสาร CoroCoro, Tournament Prize และ Exclusive ต่างๆ
                    </p>
                    <ProductTable products={EVENT_LINE} showNote />
                </section>

                {/* Source note */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-xs text-slate-500 text-center space-y-1">
                    <p>ข้อมูลรวบรวมจาก <span className="text-slate-400">beyblade.wiki</span> และ Takara Tomy official announcements</p>
                    <p>อัพเดทล่าสุด: สิงหาคม 2569 (2026) • ข้อมูลอาจมีการเปลี่ยนแปลงตามการออกสินค้าใหม่</p>
                </div>

            </main>

            <footer className="border-t border-slate-800 py-4 bg-slate-950 text-center text-xs text-slate-500">
                <p>Beyblade X Wiki ภาษาไทย • ข้อมูลอ้างอิงจาก Takara Tomy Standard และ beyblade.wiki</p>
            </footer>
        </div>
    );
}
