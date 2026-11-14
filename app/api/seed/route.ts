/**
 * POST /api/seed — seed ชิ้นส่วนทั้งหมดลง DB (ใช้ครั้งเดียว หรือเมื่อ reset)
 * ควรเรียกหลังจาก migrate แล้วเสมอ
 */
import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import { PARTS_DB, BLADE_ID_ALIASES } from '../../lib/parts-db';
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

        // remap saved combos ก่อน prune: id ที่ถูกยุบ/ย้าย (re-release, Hasbro rename,
        // ย้ายไป UX/CX) → id ที่ยังอยู่ใน PARTS_DB เพื่อไม่ให้ FK กับ Blade พัง
        const liveBladeIds = new Set(allBlades.map((b) => b.id));
        let remappedCombos = 0;
        for (const [oldId, newId] of Object.entries(BLADE_ID_ALIASES)) {
            if (oldId === newId || !liveBladeIds.has(newId)) continue;
            const { count } = await prisma.savedCombo.updateMany({
                where: { bladeId: oldId },
                data: { bladeId: newId },
            });
            remappedCombos += count;
        }

        // prune BX blades ที่ไม่อยู่ใน PARTS_DB.BX.blades (ข้อมูลเก่าค้าง/ถูกยุบไปแล้ว)
        const bxIds = PARTS_DB.BX.blades.map((b) => b.id);
        const pruned = await prisma.blade.deleteMany({
            where: { series: 'BX', id: { notIn: bxIds } },
        });

        // upsert ratchets
        for (const r of PARTS_DB.ratchets) {
            await prisma.ratchet.upsert({
                where: { id: r.id },
                update: {
                    name: r.name, height: r.height, sides: r.sides, weight: r.weight,
                    atk: r.atk, def: r.def, sta: r.sta, desc: r.desc,
                },
                create: {
                    id: r.id, name: r.name, height: r.height, sides: r.sides, weight: r.weight,
                    atk: r.atk, def: r.def, sta: r.sta, desc: r.desc,
                },
            });
        }

        // upsert bits
        for (const bt of PARTS_DB.bits) {
            await prisma.bit.upsert({
                where: { id: bt.id },
                update: {
                    name: bt.name, type: bt.type, weight: bt.weight, speed: bt.speed,
                    atk: bt.atk, def: bt.def, sta: bt.sta,
                    burstResist: bt.burstResist, desc: bt.desc,
                },
                create: {
                    id: bt.id, name: bt.name, type: bt.type, weight: bt.weight, speed: bt.speed,
                    atk: bt.atk, def: bt.def, sta: bt.sta,
                    burstResist: bt.burstResist, desc: bt.desc,
                },
            });
        }

        const counts = {
            blades:   allBlades.length,
            ratchets: PARTS_DB.ratchets.length,
            bits:     PARTS_DB.bits.length,
            remappedCombos,
            prunedBlades: pruned.count,
        };

        return NextResponse.json({ ok: true, seeded: counts });
    } catch (err) {
        console.error('[POST /api/seed]', err);
        return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
}
