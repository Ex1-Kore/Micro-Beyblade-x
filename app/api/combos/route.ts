/**
 * GET  /api/combos        — ดึง saved combos ทั้งหมด (ล่าสุด 20 รายการ)
 * POST /api/combos        — บันทึก combo ใหม่พร้อม physics snapshot
 */
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import { isAdmin } from '../../lib/admin-auth';
import { PARTS_DB } from '../../lib/parts-db';

const SYSTEMS = ['BX', 'UX', 'CX'] as const;
const BURST_LEVELS = ['low', 'moderate', 'high'] as const;

function asFiniteNumber(v: unknown): number | null {
    if (typeof v === 'number') return Number.isFinite(v) ? v : null;
    if (typeof v === 'string' && v.trim() !== '') {
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    }
    return null;
}

function inRange(v: unknown, min: number, max: number): number | null {
    const n = asFiniteNumber(v);
    if (n === null || n < min || n > max) return null;
    return n;
}

function asLimitedString(v: unknown, max: number): string | null {
    if (v === undefined || v === null) return '';
    if (typeof v !== 'string') return null;
    const s = v.trim();
    return s.length > max ? null : s;
}

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET() {
    if (!(await isAdmin())) {
        return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const combos = await prisma.savedCombo.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20,
            include: {
                blade:   { select: { id: true, name: true, series: true, weight: true } },
                ratchet: { select: { id: true, name: true, sides: true, height: true } },
                bit:     { select: { id: true, name: true, type: true } },
            },
        });
        return NextResponse.json({ ok: true, data: combos });
    } catch (err) {
        console.error('[GET /api/combos]', err);
        return NextResponse.json({ ok: false, error: 'Failed to fetch combos' }, { status: 500 });
    }
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    if (!(await isAdmin())) {
        return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
    try {
        let raw: Record<string, unknown>;
        try {
            raw = (await req.json()) as Record<string, unknown>;
        } catch {
            return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
        }

        const system = typeof raw.system === 'string' ? raw.system : '';
        const bladeId = typeof raw.bladeId === 'string' ? raw.bladeId.trim() : '';
        const ratchetId = typeof raw.ratchetId === 'string' ? raw.ratchetId.trim() : '';
        const bitId = typeof raw.bitId === 'string' ? raw.bitId.trim() : '';

        if (!(SYSTEMS as readonly string[]).includes(system)) {
            return NextResponse.json({ ok: false, error: 'system ต้องเป็น BX, UX หรือ CX' }, { status: 400 });
        }
        if (!bladeId || !ratchetId || !bitId) {
            return NextResponse.json({ ok: false, error: 'ต้องระบุ bladeId, ratchetId และ bitId' }, { status: 400 });
        }

        const subBladeId = typeof raw.subBladeId === 'string' ? raw.subBladeId.trim() : '';
        if (subBladeId && (system !== 'CX' || !PARTS_DB.CX.subblades.some((s) => s.id === subBladeId))) {
            return NextResponse.json({ ok: false, error: 'subBladeId ใช้ได้เฉพาะระบบ CX และต้องเป็น id ที่มีอยู่' }, { status: 400 });
        }

        const rpm = inRange(raw.rpm, 0, 30000);
        const linearSpeed = inRange(raw.linearSpeed, 0, 200);
        const angleDeg = inRange(raw.angleDeg, 0, 90);
        const totalKE = inRange(raw.totalKE, 0, 100000);
        const impactForce = inRange(raw.impactForce, 0, 1000000);
        const angularMomentum = inRange(raw.angularMomentum, 0, 1000);
        if (
            rpm === null || linearSpeed === null || angleDeg === null ||
            totalKE === null || impactForce === null || angularMomentum === null
        ) {
            return NextResponse.json(
                { ok: false, error: 'ค่าฟิสิกส์ไม่ถูกต้อง (ต้องเป็นตัวเลขในช่วงที่กำหนด)' },
                { status: 400 }
            );
        }

        const rawLevel = raw.burstRiskLevel;
        const burstRiskLevel = rawLevel === undefined || rawLevel === null ? 'moderate' : rawLevel;
        if (typeof burstRiskLevel !== 'string' || !(BURST_LEVELS as readonly string[]).includes(burstRiskLevel)) {
            return NextResponse.json({ ok: false, error: 'burstRiskLevel ต้องเป็น low, moderate หรือ high' }, { status: 400 });
        }

        const name = asLimitedString(raw.name, 100);
        const notes = asLimitedString(raw.notes, 500);
        if (name === null || notes === null) {
            return NextResponse.json({ ok: false, error: 'name ยาวเกิน 100 หรือ notes ยาวเกิน 500 ตัวอักษร' }, { status: 400 });
        }

        const [blade, ratchet, bit] = await Promise.all([
            prisma.blade.findUnique({ where: { id: bladeId } }),
            prisma.ratchet.findUnique({ where: { id: ratchetId } }),
            prisma.bit.findUnique({ where: { id: bitId } }),
        ]);

        if (!blade || !ratchet || !bit) {
            return NextResponse.json(
                { ok: false, error: 'Part not found — seed the DB first (/api/seed)' },
                { status: 404 }
            );
        }

        if (blade.series !== system) {
            return NextResponse.json(
                { ok: false, error: `blade ไม่ตรงกับระบบ ${system} (พบ ${blade.series})` },
                { status: 400 }
            );
        }

        if (system === 'CX' && !subBladeId) {
            return NextResponse.json({ ok: false, error: 'ระบบ CX ต้องระบุ subBladeId' }, { status: 400 });
        }

        const saved = await prisma.savedCombo.create({
            data: {
                name:            name || `${blade.name} ${ratchet.name}${bit.id}`,
                system,
                bladeId,
                ratchetId,
                bitId,
                subBladeId: subBladeId || null,
                rpm,
                linearSpeed,
                angleDeg,
                totalKE,
                impactForce,
                angularMomentum,
                burstRiskLevel,
                notes,
            },
        });

        return NextResponse.json({ ok: true, data: saved }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/combos]', err);
        return NextResponse.json({ ok: false, error: 'Failed to save combo' }, { status: 500 });
    }
}
