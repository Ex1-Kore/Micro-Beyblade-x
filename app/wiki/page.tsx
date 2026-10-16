import React from 'react';
import Link from 'next/link';
import { BookOpen, FlaskConical, Layers, Zap, ChevronRight } from 'lucide-react';
import BannerSlot from '../components/BannerSlot';

export default function WikiHub() {
    return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans">
            <nav className="border-b border-slate-800 bg-[#121826]/90 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
                        <ChevronRight className="w-4 h-4 rotate-180" /> กลับหน้าหลัก
                    </Link>
                    <span className="text-slate-700">/</span>
                    <div className="flex items-center gap-2 text-white font-bold">
                        <BookOpen className="w-4 h-4 text-cyan-400" /> Wiki เบยเบลด X
                    </div>
                </div>
            </nav>

            <BannerSlot position="top" className="max-w-5xl mx-auto px-4 pt-6" />

            <main className="max-w-5xl mx-auto px-4 py-10 space-y-14">
                {/* Hero */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 text-xs font-bold px-4 py-1.5 rounded-full">
                        <BookOpen className="w-3.5 h-3.5" /> ฐานข้อมูลความรู้
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                        Wiki เบยเบลด X<br />
                        <span className="text-cyan-400">สารานุกรมฉบับภาษาไทย</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
                        เลือกหมวดหมู่ที่ต้องการศึกษา ไม่ว่าจะเป็นระบบพื้นฐาน ฟิสิกส์ กลยุทธ์ หรือรายการสินค้าทั้งหมด
                    </p>
                </div>

                {/* Hub Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link href="/wiki/system" className="group bg-[#121826] border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all">
                        <Layers className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                        <h2 className="text-2xl font-bold text-white mb-2">ระบบและชิ้นส่วน</h2>
                        <p className="text-slate-400 text-sm">Xtreme Gear Sports คืออะไร? ระบบชิ้นส่วน Blade, Ratchet, Bit และความแตกต่างระหว่างซีรีส์ BX, UX, CX</p>
                    </Link>
                    
                    <Link href="/wiki/mechanics" className="group bg-[#121826] border border-slate-800 rounded-2xl p-6 hover:border-rose-500/50 transition-all">
                        <FlaskConical className="w-8 h-8 text-rose-400 mb-4 group-hover:scale-110 transition-transform" />
                        <h2 className="text-2xl font-bold text-white mb-2">กลศาสตร์ฟิสิกส์</h2>
                        <p className="text-slate-400 text-sm">โมเมนตัมเชิงมุม, พลังงานจลน์, Spin-down Torque, แรงกระแทก Impulse และระบบ Burst</p>
                    </Link>
                    
                    <Link href="/wiki/strategy" className="group bg-[#121826] border border-slate-800 rounded-2xl p-6 hover:border-amber-500/50 transition-all">
                        <Zap className="w-8 h-8 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
                        <h2 className="text-2xl font-bold text-white mb-2">กลยุทธ์และการจัดเด็ค</h2>
                        <p className="text-slate-400 text-sm">การเลือกคอมโบให้เหมาะกับสาย Attack, Stamina, Defense และ Balance สำหรับแข่ง 3on3</p>
                    </Link>

                    <Link href="/wiki/glossary" className="group bg-[#121826] border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all">
                        <BookOpen className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
                        <h2 className="text-2xl font-bold text-white mb-2">อภิธานศัพท์</h2>
                        <p className="text-slate-400 text-sm">รวมคำศัพท์เฉพาะที่ใช้ในวงการ Beyblade X และความหมายทางฟิสิกส์</p>
                    </Link>
                </div>
                
                {/* Secondary Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-800">
                    <Link href="/wiki/products" className="bg-slate-900 border border-slate-800 p-4 rounded-xl hover:bg-slate-800 transition-colors text-center">
                        <div className="text-sm font-bold text-slate-300">📦 สินค้าทั้งหมด</div>
                    </Link>
                    <Link href="/wiki/blades" className="bg-slate-900 border border-slate-800 p-4 rounded-xl hover:bg-slate-800 transition-colors text-center">
                        <div className="text-sm font-bold text-slate-300">⚔ Blades</div>
                    </Link>
                    <Link href="/wiki/ratchets" className="bg-slate-900 border border-slate-800 p-4 rounded-xl hover:bg-slate-800 transition-colors text-center">
                        <div className="text-sm font-bold text-slate-300">🔩 Ratchets</div>
                    </Link>
                    <Link href="/wiki/bits" className="bg-slate-900 border border-slate-800 p-4 rounded-xl hover:bg-slate-800 transition-colors text-center">
                        <div className="text-sm font-bold text-slate-300">⚙ Bits</div>
                    </Link>
                </div>

            </main>
        </div>
    );
}
