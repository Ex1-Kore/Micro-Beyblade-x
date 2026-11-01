import React from 'react';
import Image from 'next/image';
import { Zap ,ChevronRight } from 'lucide-react';
import { SectionHeader, FormulaCard, InfoBox, TableRow, WikiLayout } from '../components';

export default function Page() {
    return (
        <WikiLayout title="กลยุทธ์ (Competitive Strategy)" icon={<Zap className="w-4 h-4 text-cyan-400" />}>
            <section id="strategy" className="bg-[#121826] border border-slate-800 rounded-2xl p-6 space-y-4">
                    <SectionHeader icon={<Zap className="w-5 h-5 text-amber-400" />} title="8. กลยุทธ์การเลือกคอมโบ" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoBox
                            color="rose"
                            icon={<Image src="/products/TYPE/attack.png" alt="" width={20} height={20} className="w-5 h-5 object-contain" />}
                            title="สาย Attack — โจมตี"
                        >
                            เป้าหมาย: Over Finish หรือ X-treme Finish ในรอบแรก
                            เลือก Blade หนัก (ATK สูง) + Ratchet แฉกน้อย (1-3 แฉก) + Bit โจมตี (LF, GF, A)
                            ตัวอย่าง Meta: Phoenix Wing 1-60 LF
                        </InfoBox>
                        <InfoBox
                            color="emerald"
                            icon={<Image src="/products/TYPE/stamina.png" alt="" width={20} height={20} className="w-5 h-5 object-contain" />}
                            title="สาย Stamina — หมุนนาน"
                        >
                            เป้าหมาย: สปินนานกว่าคู่แข่ง ชนะด้วย Spin Finish
                            เลือก Blade k สูง (UX) + Ratchet สมมาตรหรือแฉกมาก (9-60 / 5-60) + Bit Stamina (B, O, FB)
                            ตัวอย่าง Meta: Wizard Rod 9-60 B
                        </InfoBox>
                        <InfoBox
                            color="blue"
                            icon={<Image src="/products/TYPE/defense.png" alt="" width={20} height={20} className="w-5 h-5 object-contain" />}
                            title="สาย Defense — ป้องกัน"
                        >
                            เป้าหมาย: ดูดซับแรงชน ให้คู่แข่ง Burst หรือ Over Finish เอง
                            เลือก Blade DEF สูง + Ratchet สูง (3-80, 5-80) + Bit ปักหลัก (N, HN, UN)
                            ตัวอย่าง: Leon Crest 5-80 UN
                        </InfoBox>
                        <InfoBox
                            color="violet"
                            icon={<Image src="/products/TYPE/balance.png" alt="" width={20} height={20} className="w-5 h-5 object-contain" />}
                            title="สาย Balance — ยืดหยุ่น"
                        >
                            เป้าหมาย: รับมือทุกสถานการณ์ใน 3on3
                            เลือก Blade สมดุล + Ratchet กลาง (4-60, 5-60) + Bit Balance (T, GP, TP)
                            ตัวอย่าง: Hells Scythe 4-60 GP
                        </InfoBox>
                    </div>
                </section>
        </WikiLayout>
    );
}
