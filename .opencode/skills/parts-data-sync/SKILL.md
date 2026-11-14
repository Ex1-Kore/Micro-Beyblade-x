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
| **Beyblade X Wiki (fandom) API** | ชื่อเบย์/รัatchet/บิต, น้ำหนัก (g), ความสูง (mm), ชนิด, สถิติ ATK/DEF/STA | `https://beyblade.fandom.com/api.php` — หน้า HTML ตอบ 403 ให้ใช้ API: `action=parse&page=<Page>&prop=wikitext` หรือ `action=query&generator=categorymembers&gcmtitle=Category:<X>&prop=revisions&rvslots=main&formatversion=2`. หน้าที่ใช้บ่อย: `List of Basic Line parts`, `List of Unique Line parts`, `List of Custom Line parts`, `Category:Ratchets`, `Category:RBT-Ratchets` |
| `public/data/beybuilder-parts.json` | น้ำหนัก (กรัม), ความสูง (mm), spin, system | สร้างจาก BeyBuilderX (`info/beybuilder-x/parts.js`, GPL-2.0) ด้วย `scripts/extract-beybuilder-parts.mjs` — ใช้เป็น**ข้อมูลอ้างอิงเท่านั้น** |
| repo อ้างอิงภายนอก `beyblade-x-repo` (เครื่อง workspace) | ค่าจริงของชิ้นส่วนรุ่นใหม่ | ⚠️ ตรวจ 2026-11-13: ไม่พบโฟลเดอร์นี้ใน workspace แล้ว — ให้ยึด Wiki API + JSON ข้างบน + ข้อมูลที่ผู้ใช้ให้ + สเปกใน `public/` แทน |
| ไฟล์รูป/สเปกใน `public/` | ยืนยันชื่อและหน้าตา | ไม่ใช่แหล่งตัวเลขเกม |

## 2. กฎเหล็ก (ห้ามละเกิด)

1. **ค่าจริงแก้ได้**: `weight` (กรัม), `height` (mm), `sides`, `type` ของ bit, `name`, `desc` — เมื่อมีแหล่งอ้างอิง ให้ใส่ที่มาใน `desc` ด้วย
2. **สถิติเกมห้ามเดา**: `atk`, `def`, `sta`, `speed`, `burstResist`, `inertiaFactor`, `color` เป็นสเกล 0–100 ที่ตั้งใจไว้ — ถ้าไม่มีแหล่งอ้างอิง **ให้คงค่าเดิม** และรายงานว่ายังไม่ได้เพิ่ม (หมายเหตุ: `bst` (Burst) ถูกลบออกแล้ว 2026-11-14 เพราะไม่มีข้อเท็จจริง — ใช้ `burstResist` แทน)
3. **ห้ามเพิ่มชิ้นส่วนที่ไม่มีข้อมูลจริง** — ยังค้าง: GloryValkyrie UX-20, HellsNether UX-21 (ต้องมีสถิติเกมจริง) ส่วน DranStrike BX-49 / HeavensRing BX-50 / LusterDragoon BX-52 เพิ่มแล้ว 2026-11-14 (มีน้ำหนักจริง แต่ยังไม่มีสถิติเกม) อย่าเดาสถิติเพื่อให้ครบ
4. **`id` ต้อง unique** ทั้งระบบ และใช้รูปแบบ `PascalCase` เดิม (เช่น `PhoenixWing`) — DB ใช้ `id` เป็น primary key; ตรวจหลังแก้ด้วยสคริปต์ในหัวข้อ 6
5. ชิ้นส่วนที่ยังไม่มีรูป → `img: null` (ห้ามใส่ path ที่ไม่มีไฟล์จริง)
6. **`BX_BLADES` ไม่ใช่ 1:1 กับ `BX_CATALOG`** — `BX_CATALOG` (95) = 1 entry ต่อ *ไฟล์สินค้า* (รวม re-release/สี/Hasbro rename) แล้ว `BX_BLADES` ยุบเหลือ 1 entry ต่อเบลดจริงด้วย `bxCanonicalId()` / `BX_HASBRO_ALIAS` / `BX_UX_CX_IDS` และใช้ `BX_WEIGHT_FIX` เติมน้ำหนักที่ catalog ขาด — **อย่าแก้ `BX_CATALOG`** (product page/`BASIC_LINE`/slug พึ่งพามัน)
7. **`CX_BLADES` = 1 entry ต่อ CX คอมโบที่ขายจริง** (Lock Chip + Main Blade + Assist) — superset ของโฟลเดอร์ `public/products/CX/` (คอมโบที่ยังไม่มีโฟลเดอร์ใช้ `img: null`)
8. **ถ้าแก้ id space (ยุบ/ย้าย) ต้อง export ใน `BLADE_ID_ALIASES`** — `POST /api/seed` remap `SavedCombo.bladeId` ผ่าน map นี้ก่อน prune เพื่อกัน FK กับ `Blade` พัง

## 3. โครงสร้างฟิลด์ (`app/lib/types.ts`)

```ts
// เบลด — BladePart
{ id, name, weight, atk, def, sta, series: 'BX'|'UX'|'CX', inertiaFactor,
  desc, color, img: string|null }   // img = ชื่อไฟล์ไม่มีนามสกุล

// ซับเบลด CX — SubBladePart (ไม่มี img / series)
{ id, name, weight, atk, def, sta }

// รัatchet — RatchetPart
{ id, name, height, sides, weight, atk, def, sta, desc }

// บิต — BitPart
{ id, name, type: 'Attack'|'Defense'|'Stamina'|'Balance', weight, speed,
  atk, def, sta, burstResist, desc }   // burstResist = ต้านทานระเบิด (ค่าจริงจากกล่อง/Wiki)
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
- รูปสินค้า (ไม่ใช่เบลด) อยู่ที่ `public/products/`:
  - `BX/<code>/` — BX ใช้รหัสสินค้าเป็นชื่อโฟลเดอร์ (`app/lib/products.ts` map ใช้)
  - `UX/<TTid>/` · `CX/<TTid>/` — จัดเป็น **name-centric** แล้ว (2026-11-14): รูปหลัก `<TTid>/<TTid>.png` + สี/รุ่นพิเศษ `<TTid>/_variants/<entry>.png` โดย `<TTid>` ตรงกับ `id` ใน `parts-db.ts`
  - เกณฑ์เลือกรูปชัดสุด/การจับคู่ variant → ดู skill `beyblade-project-overview` หัวข้อ "โครงสร้างรูปสินค้า name-centric"
  - **แอปยังไม่ชี้มาโครงสร้างนี้** — ยังใช้ `/blade/<series>/<img>.png` อยู่ (ต้องแก้ path builder ก่อน)

## 6. ขั้นตอนตรวจสอบหลังแก้

```bash
pnpm exec tsc --noEmit      # ต้องผ่าน
pnpm lint                   # ต้องผ่าน
```

นับจำนวนชิ้นส่วนหลังแก้ (แม่นยำกว่า awk เพราะ `BX_BLADES` เป็น IIFE):

```bash
pnpm exec tsc app/lib/parts-db.ts app/lib/bx-catalog.ts app/lib/types.ts \
  --outDir /tmp/mbx-parts --module commonjs --target es2020 \
  --moduleResolution node --skipLibCheck --esModuleInterop
node -e 'const{PARTS_DB:p}=require("/tmp/mbx-parts/parts-db.js");console.log("BX",p.BX.blades.length,"UX",p.UX.blades.length,"CX",p.CX.blades.length,"SUB",p.CX.subblades.length,"Ratchet",p.ratchets.length,"Bit",p.bits.length);const d=a=>{const s=new Set();return a.filter(x=>s.has(x.id)?1:(s.add(x.id),0)).map(x=>x.id)};for(const k of ["BX","UX","CX"])console.log("dup",k,d(p[k].blades));console.log("dup ratchet",d(p.ratchets),"dup bit",d(p.bits))'
```

จำนวนชิ้นส่วนปัจจุบัน (2026-11-14): **BX 36 · UX 29 · CX 34 · CX_SUB 3 · Ratchet 38 · Bit 56** = **196** (Bit: Attack 18 / Stamina 11 / Defense 11 / Balance 16)

## 7. หลังแก้ parts-db → อัปเดต DB

`parts-db.ts` เป็น static data ส่วนตาราง `Blade`/`Ratchet`/`Bit` ใน DB เป็นข้อมูลสำเนาที่ seed ผ่าน `POST /api/seed` (ต้อง login admin)

```bash
curl -X POST http://localhost:3000/api/seed -H 'Cookie: mbx_admin=<token>'
```

หรือ seed ตรงด้วย Prisma ถ้ากำลังทำงาน local — ดู `app/api/seed/route.ts` เป็นต้นแบบ (ใช้ `upsert` ต่อ id)

## 8. ข้อควรระวังด้านข้อมูล (สถานะ 2026-11-14)

- **สเกลสถิติ Ratchet ไม่สม่ำเสมอ** — ค่าเดิมบางตัวเป็นสเกลแอป 0–100 บางตัวอ้าง BeyBase/Wiki (เช่น `1-50`, `9-65`, `7-80`) รอบ 2026-11-14 เติมค่าใหม่ตาม Wiki (`1-70` `4-50` `6-70` `7-55` `9-70` `M-65` `M-85`) → ยังต้องมีรอบ normalize ให้เป็นสเกลเดียวในอนาคต
- **ยังไม่มีข้อมูลจริง (ห้ามเดา)**: น้ำหนัก `M-65` (Metal Ratchet), `MO (Metal Orb)` (BX-55), `MT (Metal Taper)` (CX-20) — Wiki ยังไม่ประกาศ (ตั้ง `weight: 0`); รัatchet `5-50` ไม่มีสถิติ ATK/DEF/STA; เบลดหลายตัวยัง `atk/def/sta = 0`
- **น้ำหนักเบลดที่อัปเดตจาก Wiki**: Shark Edge 34.5 · Bear Scratch 29.6 · Heavens Ring 37.4 · Beat Tyranno 37.0 · Strike Dran 41.4 · Luster Dragoon 43.0 · Storm Pegasis 31.0 · Victory Valkyrie 33.2 · Sieg Superion 40.0 · Rhino Reaper 42.5 · Cerberus Flame 46.9 · Hells Reaper 45.1
