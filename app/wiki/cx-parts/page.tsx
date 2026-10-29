import React from 'react';
import Link from 'next/link';
import { ChevronRight, Layers, Shield, Zap } from 'lucide-react';

// ── Main Blades (CX) ─────────────────────────────────────────────────────────
const MAIN_BLADES = [
    { code: 'CX-00', name: 'Volt',    desc: 'Main Blade ไฟฟ้า โจมตีเร็ว แรงกระแทกสูง' },
    { code: 'CX-01', name: 'Brave',   desc: 'กล้าหาญ โจมตีตรง แรงปะทะหนัก เหมาะ Attack combo' },
    { code: 'CX-02', name: 'Arc',     desc: 'โค้งรับแรง Stamina สูง เหมาะ Stamina combo' },
    { code: 'CX-03', name: 'Dark',    desc: 'มืดทึบ ป้องกันสูง รับแรงได้ดี' },
    { code: 'CX-05', name: 'Reaper',  desc: 'เคียวมรณะ โจมตีสมดุล ใช้ได้ทั้ง Attack และ Balance' },
    { code: 'CX-06', name: 'Brush',   desc: 'แปรงปัด ขอบกวาด เหมาะ Stamina และ Defense' },
    { code: 'CX-07', name: 'Blast',   desc: 'ระเบิดพลัง พุ่งชนรุนแรง Attack สูงสุด' },
    { code: 'CX-08', name: 'Flame',   desc: 'เปลวไฟ Balance ยืดหยุ่น ใช้ได้หลายสถานการณ์' },
    { code: 'CX-09', name: 'Eclipse', desc: 'สุริยุปราคา ป้องกันพร้อม Stamina ยอดเยี่ยม' },
    { code: 'CX-10', name: 'Hunt',    desc: 'ล่าเหยื่อ โจมตีต่อเนื่อง เหมาะ Attack combo' },
    { code: 'CX-11', name: 'Might',   desc: 'พลังยิ่งใหญ่ Balance สมดุลทุกด้าน' },
];

// ── Assist Blades (CX) ───────────────────────────────────────────────────────
const ASSIST_BLADES = [
    { code: 'CX-01', name: 'Slash',    effect: '+ATK',      desc: 'เพิ่มพลังโจมตี ขอบคมแหลม กวาดคู่แข่งออกสนาม' },
    { code: 'CX-02', name: 'Round',    effect: '+DEF/STA',  desc: 'ขอบกลม ซับแรงชน เพิ่มป้องกันและ Stamina' },
    { code: 'CX-03', name: 'Bumper',   effect: '+DEF',      desc: 'กันชน ดูดซับแรงกระแทก ป้องกันสูงมาก' },
    { code: 'Break', name: 'Break',    effect: '+ATK',      desc: 'แตกหัก เพิ่มแรงปะทะจากมุมบน' },
    { code: 'CX-05-01', name: 'Turn',  effect: '+Balance',  desc: 'หมุนปรับทิศทาง เพิ่มความยืดหยุ่น Balance' },
    { code: 'CX-05-02', name: 'Charge',effect: '+ATK/SPD',  desc: 'ชาร์จพลัง เพิ่มความเร็วโจมตีช่วงสั้น' },
    { code: 'CX-06', name: 'Jaggy',    effect: '+ATK',      desc: 'ขอบหยักๆ เพิ่มแรงกระทบและ X-Dash' },
    { code: 'CX-07', name: 'Assault',  effect: '+ATK',      desc: 'จู่โจม เน้นโจมตีหนัก Over Finish ง่ายขึ้น' },
    { code: 'CX-08', name: 'Wheel',    effect: '+STA',      desc: 'ล้อหมุน กระจายน้ำหนักขอบนอก Stamina สูง' },
    { code: 'CX-09', name: 'Dual',     effect: '+Balance',  desc: 'คู่ขนาน สมดุลทั้งโจมตีและป้องกัน' },
    { code: 'CX-10', name: 'Free',     effect: '+STA',      desc: 'หมุนอิสระ ลดแรงเสียดทาน Stamina เพิ่ม' },
    { code: 'CX-11', name: 'Heavy',    effect: '+DEF/ATK',  desc: 'หนักพิเศษ เพิ่มมวลรวม ป้องกันและโจมตีสูงขึ้น' },
    { code: 'CX-13', name: 'Knuckle',  effect: '+ATK',      desc: 'กำปั้น ชนตรงจุด — Infinity Series' },
    { code: 'CX-14', name: 'Vertical', effect: '+DEF',      desc: 'แนวตั้ง ซับแรงชนจากมุมบน — Infinity Series' },
    { code: 'Erase', name: 'Erase',    effect: '+DEF',      desc: 'ลบล้าง ลดแรงปะทะจากคู่แข่ง' },
    { code: 'Flow', name: 'Flow',     effect: '+STA',      desc: 'ไหลลื่น ลดแรงเสียดทาน เพิ่ม Stamina' },
    { code: 'Gravity', name: 'Gravity',  effect: '+DEF',      desc: 'แรงโน้มถ่วง เพิ่มน้ำหนักและเสถียรภาพ' },
    { code: 'Guard', name: 'Guard',    effect: '+DEF',      desc: 'ป้องกัน ซับแรงชนรอบด้าน' },
    { code: 'Massive', name: 'Massive',  effect: '+DEF/STA',  desc: 'มหึมา เพิ่มมวลรวม ป้องกันและ Stamina' },
    { code: 'Odd', name: 'Odd',      effect: '+Balance',  desc: 'คี่ ปรับสมดุลแบบไม่สมมาตร' },
    { code: 'Outer', name: 'Outer',    effect: '+STA',      desc: 'ขอบนอก กระจายน้ำหนักออกขอบ Stamina สูง' },
    { code: 'Peak', name: 'Peak',     effect: '+ATK',      desc: 'ยอดเขา ปะทะจากมุมบนแรง' },
    { code: 'Quell', name: 'Quell',    effect: '+DEF',      desc: 'ระงับ ลดแรงปะทะจากคู่แข่ง' },
    { code: 'Tough', name: 'Tough',    effect: '+DEF',      desc: 'ทนทาน เพิ่มความทนทานต่อ Burst' },
    { code: 'Zillion', name: 'Zillion',  effect: '+ATK',      desc: 'ซิลเลียน พลังโจมตีสูงสุด — Infinity Series' },
    { code: 'Force', name: 'Force',    effect: '+ATK',      desc: 'พลัง แรงปะทะมหาศาล' },
    { code: 'I', name: 'I',        effect: '+Balance',  desc: 'แกนกลาง ปรับ Inertia Factor' },
];

// ── Lock Chips (CX) ──────────────────────────────────────────────────────────
const LOCK_CHIPS = [
    { code: 'CX-01', name: 'Brave',    bey: 'Dran Brave',    desc: 'ล็อกชิป Dran Brave ระบุตัวตน Blade ในระบบ CX' },
    { code: 'CX-02', name: 'Arc',      bey: 'Wizard Arc',    desc: 'ล็อกชิป Wizard Arc' },
    { code: 'CX-03', name: 'Dark',     bey: 'Perseus Dark',  desc: 'ล็อกชิป Perseus Dark' },
    { code: 'CX-05', name: 'Reaper',   bey: 'Hells Reaper',  desc: 'ล็อกชิป Hells Reaper (Random Booster Vol.6)' },
    { code: 'CX-06', name: 'Brush',    bey: 'Fox Brush',     desc: 'ล็อกชิป Fox Brush (Random Booster)' },
    { code: 'CX-07', name: 'Blast',    bey: 'Pegasus Blast', desc: 'ล็อกชิป Pegasus Blast' },
    { code: 'CX-08', name: 'Flame',    bey: 'Cerberus Flame',desc: 'ล็อกชิป Cerberus Flame (RB Vol.7)' },
    { code: 'CX-09', name: 'Eclipse',  bey: 'Sol Eclipse',   desc: 'ล็อกชิป Sol Eclipse' },
    { code: 'CX-10', name: 'Hunt',     bey: 'Wolf Hunt',     desc: 'ล็อกชิป Wolf Hunt' },
    { code: 'CX-11', name: 'Might',    bey: 'Emperor Might', desc: 'ล็อกชิป Emperor Might' },
    { code: 'CX-13', name: 'Bliz',     bey: 'Bahamut Bliz',  desc: 'ล็อกชิป Bahamut Bliz — Infinity Series' },
    { code: 'CX-00', name: 'Drake',   bey: 'Drake Brave',   desc: 'ล็อกชิป Drake — Rare Bey Get Battle (Metal Coat Blue)' },
];

function Table({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-slate-800">
                        {headers.map((h, i) => (
                            <th key={i} className="px-3 py-2.5 text-left text-xs font-bold text-slate-300">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-t border-slate-800 hover:bg-slate-900/50 transition-colors">
                            {row.map((cell, j) => (
                                <td key={j} className="px-3 py-2.5 text-slate-300 text-xs">{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function CodeBadge({ code }: { code: string }) {
    return <span className="font-mono text-xs font-bold text-violet-400 bg-violet-950/40 border border-violet-800/40 px-2 py-0.5 rounded">{code}</span>;
}

export default function CxPartsPage() {
    return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans">
            <nav className="border-b border-slate-800 bg-[#121826]/90 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm flex-wrap">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"><ChevronRight className="w-4 h-4 rotate-180" />หน้าหลัก</Link>
                    <span className="text-slate-700">/</span>
                    <Link href="/wiki" className="text-slate-400 hover:text-white transition-colors">Wiki</Link>
                    <span className="text-slate-700">/</span>
                    <span className="text-white font-bold flex items-center gap-1.5"><Layers className="w-4 h-4 text-violet-400" />CX Custom Line Parts</span>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">

                {/* Hero */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 bg-violet-950/50 border border-violet-800/50 text-violet-400 text-xs font-bold px-4 py-1.5 rounded-full">
                        <Layers className="w-3.5 h-3.5" /> Custom Line System
                    </div>
                    <h1 className="text-4xl font-black text-white">ชิ้นส่วน <span className="text-violet-400">CX Custom Line</span></h1>
                    <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                        ระบบ CX ใช้ชิ้นส่วน 5 ชิ้น: <strong className="text-white">Lock Chip + Main Blade + Assist Blade + Ratchet + Bit</strong>
                        — ถอดสลับ Main Blade และ Assist Blade ได้เพื่อปรับค่าสถิติและ Inertia Factor
                    </p>
                    <div className="flex justify-center gap-3 pt-1 flex-wrap">
                        {[['Main Blades', MAIN_BLADES.length], ['Assist Blades', ASSIST_BLADES.length], ['Lock Chips', LOCK_CHIPS.length]].map(([label, count]) => (
                            <div key={label as string} className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2 text-center">
                                <div className="text-2xl font-black text-violet-400">{count}</div>
                                <div className="text-xs text-slate-400">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How CX works */}
                <div className="bg-[#121826] border border-violet-800/30 rounded-2xl p-5 space-y-3">
                    <h2 className="font-bold text-violet-400 flex items-center gap-2"><Shield className="w-4 h-4" /> ระบบ CX ทำงานอย่างไร?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                            <div className="font-bold text-white mb-1">1. Lock Chip</div>
                            ชิประบุตัวตน Blade ล็อกระบบ CX ไว้ อ่านเป็น QR code ได้
                        </div>
                        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                            <div className="font-bold text-white mb-1">2. Main Blade + Assist Blade</div>
                            สองชิ้นรวมกันเป็น Blade สมบูรณ์ สลับ Assist Blade เพื่อเปลี่ยน ATK/DEF/STA
                        </div>
                        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                            <div className="font-bold text-white mb-1">3. Inertia Factor สูงสุด</div>
                            CX Blade มีค่า k ≈ 1.20–1.30 สูงที่สุดในทุก Series — Angular Momentum สูงมาก
                        </div>
                    </div>
                </div>

                {/* Main Blades */}
                <section className="bg-[#121826] border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-violet-400 flex items-center gap-2"><Zap className="w-5 h-5" /> Main Blades</h2>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-950/40 text-violet-400 border border-violet-800/40">{MAIN_BLADES.length} ชิ้น</span>
                    </div>
                    <p className="text-xs text-slate-500">ชิ้นส่วนหลักของ CX Blade กำหนดรูปร่างพื้นฐานและ type ของเบย์</p>
                    <Table
                        headers={['รหัส', 'ชื่อ Main Blade', 'คำอธิบาย']}
                        rows={MAIN_BLADES.map(b => [
                            <CodeBadge key={b.code} code={b.code} />,
                            <span key={b.name} className="font-bold text-white">{b.name}</span>,
                            b.desc,
                        ])}
                    />
                </section>

                {/* Assist Blades */}
                <section className="bg-[#121826] border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-violet-400 flex items-center gap-2"><Layers className="w-5 h-5" /> Assist Blades</h2>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-950/40 text-violet-400 border border-violet-800/40">{ASSIST_BLADES.length} ชิ้น</span>
                    </div>
                    <p className="text-xs text-slate-500">ชิ้นส่วนเสริมที่สลับได้ — เปลี่ยน Assist Blade เพื่อปรับสถิติ ATK/DEF/STA โดยไม่ต้องเปลี่ยน Main Blade</p>
                    <Table
                        headers={['รหัส', 'ชื่อ Assist Blade', 'ผลต่อสถิติ', 'คำอธิบาย']}
                        rows={ASSIST_BLADES.map(b => [
                            <CodeBadge key={b.code} code={b.code} />,
                            <span key={b.name} className="font-bold text-white">{b.name}</span>,
                            <span key={b.effect} className="font-mono text-xs text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">{b.effect}</span>,
                            b.desc,
                        ])}
                    />
                </section>

                {/* Lock Chips */}
                <section className="bg-[#121826] border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-violet-400 flex items-center gap-2"><Shield className="w-5 h-5" /> Lock Chips</h2>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-950/40 text-violet-400 border border-violet-800/40">{LOCK_CHIPS.length} ชิ้น</span>
                    </div>
                    <p className="text-xs text-slate-500">Lock Chip อยู่ตรงกลาง CX Blade ระบุชื่อเบย์ มีลายพิมพ์ QR code ใช้สำหรับระบบลงทะเบียนแข่งขันและ app</p>
                    <Table
                        headers={['รหัส', 'ชื่อ Lock Chip', 'เบย์ที่มาจาก', 'หมายเหตุ']}
                        rows={LOCK_CHIPS.map(l => [
                            <CodeBadge key={l.code} code={l.code} />,
                            <span key={l.name} className="font-bold text-white">{l.name}</span>,
                            <span key={l.bey} className="text-cyan-400">{l.bey}</span>,
                            l.desc,
                        ])}
                    />
                </section>

                <div className="text-center text-xs text-slate-600 py-4">
                    ข้อมูลอ้างอิงจาก beyblade.wiki และ beybxdb.com — Custom Line System (Takara Tomy 2025)
                </div>
            </main>
            <footer className="border-t border-slate-800 py-4 bg-slate-950 text-center text-xs text-slate-500">
                Beyblade X Wiki ภาษาไทย • CX Custom Line Parts Reference
            </footer>
        </div>
    );
}
