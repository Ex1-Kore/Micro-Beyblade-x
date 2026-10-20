---
name: parts-data-sync
description: วิธีเพิ่มหรือแก้ไขชิ้นส่วน Beyblade X ใน app/lib/parts-db.ts — แหล่งข้อมูลอ้างอิง, กฎแยกค่าจริง (น้ำหนัก/ชนิด bit) ออกจากสถิติเกมที่ห้ามเดา, โครงสร้างฟิลด์ของแต่ละชนิด, การจับคู่รูปภาพ และขั้นตอนตรวจสอบหลังแก้. ใช้เมื่อผู้ใช้ขอเพิ่มเบลด/รัatchet/บิต, แก้น้ำหนัก, หรือแก้ปัญหารูปชิ้นส่วน.
compatibility: ต้องอยู่ในโปรเจกต์ Micro-Beyblade-x
metadata:
  project: micro-beyblade-x
  scope: project
---

# Parts Data Sync — อัปเดตชุดข้อมูลชิ้นส่วน

ไฟล์เดียวที่เป็นแหล่งข้อมูลหลักของชิ้นส่วนคือ **`app/lib/parts-db.ts`** (static TypeScript, ไม่ได้อยู่ใน DB)

## 1. แหล่งข้อมูล (เรียงตามความน่าเชื่อถือ)

| แหล่ง | ใช้ทำอะไร | หมายเหตุ |
| --- | --- | --- |
| `public/data/beybuilder-parts.json` | น้ำหนัก (กรัม), ความสูง (mm), spin, system | สร้างจาก BeyBuilderX (`info/beybuilder-x/parts.js`, GPL-2.0) ด้วย `scripts/extract-beybuilder-parts.mjs` — ใช้เป็น**ข้อมูลอ้างอิงเท่านั้น** |
| repo อ้างอิงภายนอก `beyblade-x-repo` (เครื่อง workspace) | ค่าจริงของชิ้นส่วนรุ่นใหม่ | sync ครั้งล่าสุด 2026-10-16 |
| ไฟล์รูป/สเปกใน `public/` | ยืนยันชื่อและหน้าตา | ไม่ใช่แหล่งตัวเลขเกม |

## 2. กฎเหล็ก (ห้ามละเกิด)

1. **ค่าจริงแก้ได้**: `weight` (กรัม), `height` (mm), `sides`, `type` ของ bit, `name`, `desc`
2. **สถิติเกมห้ามเดา**: `atk`, `def`, `sta`, `bst`, `speed`, `burstResist`, `inertiaFactor`, `color` เป็นสเกล 0–100 ที่ตั้งใจไว้ — ถ้าไม่มีแหล่งอ้างอิง **ให้คงค่าเดิม** และรายงานว่ายังไม่ได้เพิ่ม
3. **ห้ามเพิ่มชิ้นส่วนที่ไม่มีข้อมูลจริง** — รอบก่อน ๆ ยังค้างรายการแบบนี้อยู่ (DranStrike BX-49, HeavensRing BX-50, LusterDragoon BX-52, GloryValkyrie UX-20, HellsNether UX-21) อย่าเดาสถิติเพื่อให้ครบ
4. **`id` ต้อง unique** ทั้งระบบ และใช้รูปแบบ `PascalCase` เดิม (เช่น `PhoenixWing`) — DB ใช้ `id` เป็น primary key
5. ชิ้นส่วนที่ยังไม่มีรูป → `img: null` (ห้ามใส่ path ที่ไม่มีไฟล์จริง)

## 3. โครงสร้างฟิลด์ (`app/lib/types.ts`)

```ts
// เบลด — BladePart
{ id, name, weight, atk, def, sta, series: 'BX'|'UX'|'CX', inertiaFactor,
  desc, color, img: string|null }   // img = ชื่อไฟล์ไม่มีนามสกุล

// ซับเบลด CX — SubBladePart (ไม่มี img / series)
{ id, name, weight, atk, def, sta }

// รัatchet — RatchetPart
{ id, name, height, sides, weight, atk, def, sta, bst, desc }

// บิต — BitPart
{ id, name, type: 'Attack'|'Defense'|'Stamina'|'Balance', weight, speed,
  atk, def, sta, bst, burstResist, desc }
```

## 4. ขั้นตอนเพิ่มชิ้นส่วน

1. อ่าน `app/lib/parts-db.ts` หา array ที่ต้องการ (`BX_BLADES` / `UX_BLADES` / `CX_BLADES` / `CX_SUBBLADES` / `RATCHETS` / `BITS`) — เป็น const ภายในไฟล์ ไม่ได้ export
2. ยืนยันค่าจริงจากแหล่งอ้างอิง (BeyBuilderX JSON หรือข้อมูลที่ผู้ใช้ให้) — ถ้าไม่มี ให้ถาม
3. เพิ่ม object ท้าย array ของชนิดนั้น (เรียงตามลำดับเดิมของไฟล์)
4. อัปเดตรูป: ถ้ามีไฟล์จริง ให้ตั้ง `img` = ชื่อไฟล์ **ไม่มี `.png`** และต้องตรงกับชื่อไฟล์ใน `public/blade/<series ตัวพิมพ์เล็ก>/`
5. รันตรวจสอบ (ดูหัวข้อ 6)

## 5. กฎจับคู่รูปภาพ

- โค้ดสร้าง path ที่ `app/components/BeyCard.tsx`:
  ```ts
  `/blade/${blade.series.toLowerCase()}/${blade.img}.png`
  ```
  → `series: 'BX'` + `img: 'Phoenix Wing'` = `/blade/bx/Phoenix Wing.png`
- โฟลเดอร์รูป: `public/blade/bx/` (67 ไฟล์) · `public/blade/ux/` (19) · `public/blade/cx/` (5)
- **Known issue**: ชื่อไฟล์จริงหลายไฟล์เป็นแบบ `BL-PRD-096092-01.png` ไม่ตรงกับ `img` แบบชื่อสินค้า → รูป 404 (ปัจจุบัน `img: null` 15 รายการ)
- แก้ไขวิธีที่ถูก: **เปลี่ยนชื่อไฟล์ใน `public/blade/<series>/` ให้ตรงกับ `img`** หรือเพิ่ม alias map — อย่าแก้ path ใน component เพราะรูปอื่นใช้ร่วมกัน
- รูปสินค้า (ไม่ใช่เบลด) อยู่ที่ `public/products/{bx,ux,cx}/` และถูก map ใน `app/lib/products.ts` (ตรวจ path ก่อนอ้างอิง — บางรายการยัง 404)

## 6. ขั้นตอนตรวจสอบหลังแก้

```bash
pnpm exec tsc --noEmit      # ต้องผ่าน
pnpm lint                   # ต้องผ่าน
```

นับจำนวนชิ้นส่วนหลังแก้ (คาดว่าเพิ่มขึ้นตามที่เพิ่ม):

```bash
awk '/^const (BX_BLADES|UX_BLADES|CX_BLADES|CX_SUBBLADES|RATCHETS|BITS)[^=]*= \[/{name=$2;c=0;i=1;next}
     i&&/^\];/{print name": "c;i=0;next} i&&/id:/{c++}' app/lib/parts-db.ts
```

ฐานข้อมูลปัจจุบัน (ก่อนแก้): BX 39 · UX 23 · CX 3 · CX_SUB 3 · Ratchet 37 · Bit 54 = 159

## 7. หลังแก้ parts-db → อัปเดต DB

`parts-db.ts` เป็น static data ส่วนตาราง `Blade`/`Ratchet`/`Bit` ใน DB เป็นข้อมูลสำเนาที่ seed ผ่าน `POST /api/seed` (ต้อง login admin)

```bash
curl -X POST http://localhost:3000/api/seed -H 'Cookie: mbx_admin=<token>'
```

หรือ seed ตรงด้วย Prisma ถ้ากำลังทำงาน local — ดู `app/api/seed/route.ts` เป็นต้นแบบ (ใช้ `upsert` ต่อ id)
