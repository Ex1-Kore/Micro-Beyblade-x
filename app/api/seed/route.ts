/**
 * POST /api/seed — seed ชิ้นส่วนทั้งหมดลง DB (ใช้ครั้งเดียว หรือเมื่อ reset)
 * ควรเรียกหลังจาก migrate แล้วเสมอ
 */
import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import { PARTS_DB } from '../../lib/parts-db';
import { isAdmin } from '../../lib/admin-auth';

export async function POST() {
    if (!(await isAdmin())) {
        return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
        // upsert blades
        const allBlades = [
            ...PARTS_DB.BX.blades,
            ...PARTS_DB.UX.blades,
            ...PARTS_DB.CX.blades,
        ];

        for (const b of allBlades) {
            await prisma.blade.upsert({
                where: { id: b.id },
                update: {
                    name: b.name, series: b.series, weight: b.weight,
                    atk: b.atk, def: b.def, sta: b.sta,
                    inertiaFactor: b.inertiaFactor, desc: b.desc, color: b.color,
                },
                create: {
                    id: b.id, name: b.name, series: b.series, weight: b.weight,
                    atk: b.atk, def: b.def, sta: b.sta,
                    inertiaFactor: b.inertiaFactor, desc: b.desc, color: b.color,
                },
            });
        }

        // prune BX blades ที่ไม่อยู่ใน readme 95 รายการ (ข้อมูลเก่าค้างจาก seed ก่อนหน้า)
        const bxIds = PARTS_DB.BX.blades.map((b) => b.id);
        await prisma.blade.deleteMany({
            where: { series: 'BX', id: { notIn: bxIds } },
        });

        // upsert ratchets
        for (const r of PARTS_DB.ratchets) {
            await prisma.ratchet.upsert({
                where: { id: r.id },
                update: {
                    name: r.name, height: r.height, sides: r.sides, weight: r.weight,
                    atk: r.atk, def: r.def, sta: r.sta, bst: r.bst, desc: r.desc,
                },
                create: {
                    id: r.id, name: r.name, height: r.height, sides: r.sides, weight: r.weight,
                    atk: r.atk, def: r.def, sta: r.sta, bst: r.bst, desc: r.desc,
                },
            });
        }

        // upsert bits
        for (const bt of PARTS_DB.bits) {
            await prisma.bit.upsert({
                where: { id: bt.id },
                update: {
                    name: bt.name, type: bt.type, weight: bt.weight, speed: bt.speed,
                    atk: bt.atk, def: bt.def, sta: bt.sta, bst: bt.bst,
                    burstResist: bt.burstResist, desc: bt.desc,
                },
                create: {
                    id: bt.id, name: bt.name, type: bt.type, weight: bt.weight, speed: bt.speed,
                    atk: bt.atk, def: bt.def, sta: bt.sta, bst: bt.bst,
                    burstResist: bt.burstResist, desc: bt.desc,
                },
            });
        }

        const counts = {
            blades:   allBlades.length,
            ratchets: PARTS_DB.ratchets.length,
            bits:     PARTS_DB.bits.length,
        };

        return NextResponse.json({ ok: true, seeded: counts });
    } catch (err) {
        console.error('[POST /api/seed]', err);
        return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
}
