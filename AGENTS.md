<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Micro-Beyblade-x — Project AGENTS.md

กฎถาวรสำหรับ Agent ที่ทำงานกับโปรเจกต์นี้ — อ่านก่อนแก้โค้ดทุกครั้ง

## 0. บริบทการสนทนาในโปรเจกต์นี้

- ในโปรเจกต์นี้ Agent (ผู้ช่วย) ชื่อ **x**
- ถ้าผู้ใช้พิมพ์ **"x"** = เรียก x เพื่อสนทนาเรื่อง **Beyblade** (ไม่ใช่คำสั่งโค้ด)

## 1. ภาพรวมโปรเจกต์

- **ชื่อ:** Micro-Beyblade-x · package name `beyblade-x` (private)
- **หน้าที่:** เว็บประกอบคอมโบเบย์เบลด X (BX/UX/CX) + จำลองฟิสิกส์การหมุน การชน และความเสี่ยง Burst + วิกิความรู้ + banner affiliate
- **Path ปัจจุบัน:** `/mnt/backup/GIT/Ex1-Kore/Micro-Beyblade-x` (เดิมเคยเป็น `/home/devg/Ex1-Kore/Micro-Beyblade-x` — เซิร์ฟเวอร์ถูกลง OS ใหม่ 2026-10-18)
- **Framework:** Next.js **16.2.11** (App Router เท่านั้น) + React **19.2.4**
- **Styling:** Tailwind CSS **v4** (`@import "tailwindcss"` ใน `app/globals.css` — ไม่มีไฟล์ config)
- **DB:** SQLite ผ่าน **Prisma 7.9.1** + `@prisma/adapter-libsql` + `@libsql/client`
- **ภาษา:** TypeScript **strict** — ห้าม `any`, exported function ต้องมี return type ชัดเจน
- **Package manager:** **pnpm** (บังคับ — มี `pnpm-workspace.yaml` ที่ root)
- **Node:** `.nvmrc` = `22` · `engines.node` ≥ 20.19 (Prisma 7 บังคับ)
- **Deploy:** Coolify บนเครื่อง `server` (self-hosted) — ไม่ใช่ Vercel

## 2. โครงสร้างโฟลเดอร์

```text
Micro-Beyblade-x/
├── app/
│   ├── page.tsx  layout.tsx  globals.css
│   ├── api/
│   │   ├── combos/            # GET/POST คอมโบ, [id] GET/PUT/DELETE
│   │   ├── seed/              # seed parts ลง DB (ต้องเป็น admin)
│   │   ├── banners/           # GET banner สาธารณะ + POST นับคลิก
│   │   └── admin/             # login/logout + banners CRUD + wiki CRUD (cookie auth)
│   ├── admin/                 # UI admin: login, banners, wiki
│   ├── components/            # client components (ComboBuilder, PartsExplorer, ...)
│   ├── lib/                   # types, parts-db, bx-catalog, bx-product-images,
│   │                          # blades-data, physics, prisma, products,
│   │                          # banners, admin-auth, wiki, wiki-categories,
│   │                          # wiki-input, safe-url, banner-input
│   └── wiki/                  # หน้าวิกิแบบ static + [slug] แบบ dynamic
├── prisma/
│   ├── schema.prisma          # 6 model (ดูหัวข้อ 3)
│   ├── dev.db                 # SQLite local (gitignored)
│   └── migrations/            # init, add_banner, add_subblade_id, add_wiki_article_fields
├── public/
│   ├── blade/{bx,ux,cx}/      # รูปเบลดที่แอปใช้จริง (ชื่อไฟล์ไม่ตรงกับ img ใน parts-db → ดูข้อ 10)
│   ├── bit/ ratchet/ mainblade/ overblade/ metalblade/ assistblade/ lockchip/
│   ├── products/BX/           # รูปสินค้า BX (ชื่อโฟลเดอร์ = รหัสสินค้า)
│   ├── products/{UX,CX}/<TTid>/   # รูปสินค้า name-centric: <TTid>/<TTid>.png + _variants/ (ดูข้อ 10)
│   └── data/beybuilder-parts.json   # ข้อมูลอ้างอิงจาก BeyBuilderX (GPL-2.0)
├── scripts/extract-beybuilder-parts.mjs
├── info/                      # ไฟล์อ้างอิง/ข้อมูลดิบ (ไม่ควร commit)
├── .opencode/skills/           # Agent Skills ของโปรเจกต์ (มาตรฐาน OpenCode V2)
├── AGENTS.md                  # ไฟล์นี้
└── prisma.config.ts
```

## 3. Schema ฐานข้อมูล

| Model | เนื้อหา |
| --- | --- |
| `Blade` | id, name, series (BX/UX/CX), weight, atk, def, sta, inertiaFactor, desc, color |
| `Ratchet` | id, name, height (mm), sides, weight, atk, def, sta, desc |
| `Bit` | id, name, type (Attack/Defense/Stamina/Balance), weight, speed, atk, def, sta, burstResist, desc |
| `SavedCombo` | คอมโบที่บันทึก + snapshot ฟิสิกส์ (rpm, linearSpeed, angleDeg, totalKE, impactForce, angularMomentum, burstRiskLevel) + `subBladeId?` (CX) |
| `WikiArticle` | slug (unique), title, content (Markdown), category, status (draft/published), excerpt, coverImage, imageAlt, sortOrder |
| `Banner` | position (top/wiki), title, imageUrl, targetUrl, network, alt, active, sortOrder, startsAt/endsAt, clickCount |

`provider = "sqlite"` — ถ้าจะย้ายไป Postgres ต้องเปลี่ยน provider + adapter + สร้าง migration ใหม่ (ดู skill `supabase-migration`)

## 4. ชุดข้อมูลชิ้นส่วน (`app/lib/parts-db.ts`)

- const ภายในไฟล์ (ไม่ได้ export): `BX_BLADES`, `UX_BLADES`, `CX_BLADES`, `CX_SUBBLADES`, `RATCHETS`, `BITS`
- export: `PARTS_DB` = `{ BX:{blades}, UX:{blades}, CX:{blades, subblades}, ratchets, bits }` และ `BLADE_ID_ALIASES` (map id ที่ถูกยุบ/ย้าย → id ที่ยังอยู่ ใช้ remap `SavedCombo` ตอน seed)
- จำนวนปัจจุบัน (ตรวจ 2026-11-14): **BX 36 · UX 29 · CX 34 · CX_SUB 3 · Ratchet 38 · Bit 56** (Attack 18 / Stamina 11 / Defense 11 / Balance 16) = **196 ชิ้น**
- ฟิลด์ `bst` (Burst) ถูก **ลบออก** แล้ว (2026-11-14) — เป็นค่าที่ไม่มีข้อเท็จจริง (ไม่บนกล่อง, ไม่ใน Wiki) ใช้ `burstResist` (ค่าจริงจากกล่อง/Wiki) แทน
- `BX_BLADES` สร้างจาก `BX_CATALOG` (95 = 1 entry ต่อ *ไฟล์สินค้า* รวม re-release/สี/Hasbro) แล้วยุบด้วย `bxCanonicalId()` (ตัดเลข re-release), `BX_HASBRO_ALIAS` (Helm Knight→Knight Shield, Scythe Incendio→Hells Scythe, Chain Incendio→Hells Chain, Lance Knight→Knight Lance, Soar Phoenix→Phoenix Wing, Tide Whale→Whale Wave) และ `BX_UX_CX_IDS` (BX-numbered product ที่บรรจุชิ้นส่วน UX/CX: Aero Pegasus/Impact Drake → UX, Circle Ghost→GhostCircle, Wand Wizard→WizardRod, Buster Dran→DranBuster, Wolf Flame D→WolfFlame, Cerberus Reaper B→CerberusReaper) — ใช้ best-score-wins; `BX_CATALOG` ไม่ถูกแก้ (product page/`BASIC_LINE`/slug คงเดิม)
- `CX_BLADES` = 1 entry ต่อ CX *คอมโบ* ที่ออกขายจริง (Lock Chip + Main Blade + Assist) — เป็น superset ของโฟลเดอร์ `public/products/CX/` (คอมโบที่ยังไม่มีโฟลเดอร์ใช้ `img: null`)
- **`POST /api/seed` remap `SavedCombo.bladeId` ผ่าน `BLADE_ID_ALIASES` ก่อน prune** — กัน FK กับ `Blade` พังและกันคอมโบเก่าชี้ไป id ที่ถูกลบ
- **ค่าจริง** (น้ำหนักกรัม, ความสูง mm, ชนิดของ bit) แก้ได้เมื่อมีแหล่งอ้างอิง
- **สถิติเกม** (atk/def/sta/bst/speed/burstResist/inertiaFactor/color) เป็นสเกล 0–100 ที่ตั้งใจไว้ — **ห้ามเดาค่าใหม่**; ค่าที่เติมจากแหล่งอ้างอิงให้ใส่ที่มาใน `desc`
- **แหล่งอ้างอิงหลัก:** Beyblade X Wiki (fandom) API `https://beyblade.fandom.com/api.php` — หน้า `List of Basic Line parts`, `List of Unique Line parts`, `List of Custom Line parts`, `Category:Ratchets`, `Category:RBT-Ratchets` (ใช้ API เพราะหน้า HTML ตอบ 403)
- กติกาการแก้ไขชิ้นส่วน + การจับคู่รูป → skill `parts-data-sync`
- เมื่อพี่ฆังสั่งเพิ่มเบย์เบลดและให้ข้อมูลที่จำเป็นครบแล้ว ให้ลงมือเพิ่มข้อมูลและตรวจสอบตามขั้นตอนทันที ห้ามถามยืนยันซ้ำหรือปฏิเสธเพียงเพราะเป็นการเพิ่มข้อมูล
- ถ้าข้อมูลจำเป็นยังขาด ให้ระบุเฉพาะค่าที่ขาดและขอข้อมูลส่วนนั้น ห้ามแต่งค่าสถิติหรือข้อมูลจริงขึ้นเอง; ทำส่วนที่มีข้อมูลครบต่อได้
- การเพิ่มข้อมูลต้องผ่าน validation และขั้นตอน seed ที่โครงการกำหนด เว้นแต่พี่ฆังสั่งเปลี่ยนขั้นตอนโดยตรง พี่ฆังเป็นเจ้าของโครงการและตัดสินใจเรื่องระบบล็อกอินกับสิทธิ์จัดการข้อมูลได้ ห้ามถือการตั้งค่าปัจจุบันเป็นข้อห้ามถาวร; แจ้งผลกระทบสำคัญสั้น ๆ แล้วทำตามคำสั่งที่ชัดเจนภายในข้อกำหนดระดับสูงกว่าที่ยังมีผล

## 5. คำสั่งที่ใช้จริง

```bash
pnpm install                 # postinstall = prisma generate
pnpm dev                     # next dev
pnpm build                   # next build
pnpm start                   # next start
pnpm lint                    # eslint (ไม่มีสคริปต์ typecheck แยก)
pnpm exec tsc --noEmit       # type check
pnpm prisma generate
pnpm prisma migrate dev      # dev
pnpm prisma migrate deploy   # prod (รันอัตโนมัติใน start command ของ Coolify)
pnpm prisma studio
node scripts/extract-beybuilder-parts.mjs
python3 scripts/monthly_beyblade_news.py --dry-run  # ค้นข่าวรายเดือนและตรวจร่างโดยไม่เผยแพร่
python3 scripts/monthly_beyblade_news.py            # สร้าง/อัปเดตบทความ Wiki รายเดือน
```

## 6. ข้อตกลงการเขียนโค้ด

- **Server Components เป็นค่าเริ่มต้น** — ใช้ `'use client'` เฉพาะเมื่อต้อง interactive / ใช้ browser API
- **Server Actions / Route handlers** สำหรับ mutation — ไม่ต้องสร้าง API เกินจำเป็น
- **Tailwind v4** — ใช้ utility class ในโค้ด, ไม่ต้องแตะ `tailwind.config`
- **Prisma 7** — ใช้ `@prisma/adapter-libsql` ผ่าน `app/lib/prisma.ts` (singleton กัน hot-reload เปิด connection ซ้ำ)
- **TypeScript strict** — ไม่ใช้ `any`, ใส่ return type ให้ exported function, หลีกเลี่ยง `as never` เกินจำเป็น
- เครื่องมือ Python ที่อนุมัติเป็นข้อยกเว้น: `scripts/monthly_beyblade_news.py` เท่านั้น; เป็น automation แยก ไม่ใช่ backend ของเว็บ
- **แก้แค่จุดที่เกี่ยวข้อง** — อย่ารื้อไฟล์ที่ไม่เกี่ยวกับงาน, อ่านโค้ดเดิมก่อนเข้าใจพฤติกรรม
- หน้า admin ทุกตัวต้องเรียก `isAdmin()` ก่อน (cookie `mbx_admin`)
- **เก็บ admin เฉพาะจุดที่เป็นการลบ/แก้ไขข้อมูล**: `DELETE /api/combos/[id]`, `/api/seed`, `/api/admin/*` — ส่วน `GET`/`POST /api/combos` **ต้องเปิดสาธารณะ** เพราะผู้ใช้ทั่วไปกด "บันทึกคอมโบ" ผ่าน `PhysicsEvaluator` (ไม่มี cookie admin)
- ค่า URL ที่จะ render ต้องผ่าน `asSafeUrl()` (`app/lib/safe-url.ts`)
- payload จากผู้ใช้ต้อง validate ผ่านฟังก์ชันใน `app/lib/*-input.ts` ห้ามเขียน validation ซ้ำ
- อย่าตั้ง `output: 'standalone'` ใน `next.config.ts` (App Router default)

## 7. การตรวจสอบก่อนรายงานว่าเสร็จ

```bash
pnpm exec tsc --noEmit && pnpm lint
```

- ต้องรันจริงทุกครั้งที่แก้โค้ด และรายงานผล (ผ่าน/ไม่ผ่าน)
- ถ้าเปลี่ยน `prisma/schema.prisma` → ต้องรัน `pnpm prisma generate` และสร้าง migration
- ถ้าแตะชิ้นส่วนใน `parts-db.ts` → seed DB ใหม่ด้วย `POST /api/seed` (ต้อง login admin)
- ห้ามสรุปว่า "ทดสอบผ่าน" ถ้าไม่ได้รันจริง

## 8. ความปลอดภัยและขอบเขต

- **ห้าม**อ่าน แสดง หรือ commit ค่าลับ (`.env.local`, token, password, connection string) — อ้างอิงเป็นชื่อตัวแปรเท่านั้น
- **ห้าม** push ไป remote `origin` (GitHub `Insurgent-Dev`) โดยไม่ได้รับอนุญาตจากผู้ใช้
- **ห้าม**ลบข้อมูล/ทำลายระบบ/แก้ฐานข้อมูลของ Coolify หรือเครื่อง server โดยไม่ได้รับอนุญาต
- ถ้าข้อกำหนดกำกวม (เช่น เลือกแนวทาง deploy, เพิ่ม dependency, เปลี่ยน schema) → **ถามก่อนลงมือ**
- อย่าแก้ไฟล์นอกโปรเจกต์นี้ (เครื่อง server, repo อื่น) เว้นแต่ผู้ใช้สั่งเฉพาะ
- `git status` มี 1,400+ ไฟล์ที่ขึ้น "M" เพราะ **file mode** (644→755) เปลี่ยนทั้ง repo — ให้สังเกตก่อนสรุปว่ามีงานค้าง

## 9. Git

| remote | URL | หมายเหตุ |
| --- | --- | --- |
| `ex1kore` | `https://github.com/Ex1-Kore/Micro-Beyblade-x.git` | upstream ที่ `main` track อยู่ |
| `gitea` | `http://192.168.1.200:3000/Ex1-Kore/Micro-Beyblade-x.git` | **Coolify deploy ดึงจาก remote นี้** |
| `origin` | `https://github.com/Insurgent-Dev/Micro-Beyblade-x.git` | ของทีม — ให้ผู้ใช้ push เอง |

- branch: `main` · HEAD ล่าสุด: `b7ead78` (chore: untrack prisma/dev.db + เพิ่มโน้ตวิจัย)
- โปรเจกต์นี้เป็น **repo ของทีมเอง** — กฎ global ข้อ #4 (ห้าม push เอง) ใช้กับ `origin` เท่านั้น
- ก่อน deploy ต้อง `git push gitea main` และ **สั่ง deploy เองด้วย** (auto-deploy ไม่ทำงาน — ไม่มี Gitea webhook) → ดู skill `coolify-deploy`
- `prisma/dev.db` ไม่ได้ track แล้ว (อยู่ใน `.gitignore`) — local ใช้ `DATABASE_URL="file:/mnt/backup/GIT/Ex1-Kore/Micro-Beyblade-x/prisma/dev.db"` ใน `.env`

## 10. สถานะงานที่ค้างอยู่ (2026-11-14)

> ⚠️ **งานยังไม่สมบูรณ์** — ดู [`plan.md`](./plan.md) สำหรับรายละเอียดทั้งหมด
> ข้อมูลชิ้นส่วนบนเว็บ **เป็นข้อมูลที่จำลองขึ้น (simulated/mock)** เพื่อให้เว็บทำงานได้เท่านั้น
> ยังไม่ใช่ข้อมูลที่ถูกต้องตามข้อเท็จจริง — เราจะหาข้อมูลที่ถูกต้องมาปรับปรุงในภายหลัง

- **จัดรูปสินค้า UX/CX เป็น name-centric แล้ว (2026-11-14)** — `public/products/{UX,CX}/<TTid>/<TTid>.png` + `_variants/` (UX 28 เบลด/54 ไฟล์ · CX 26 เบลด/36 ไฟล์ = 90 ไฟล์) ต้นฉบับเดิมพักไว้ที่ `public/products/_backup-2026-11-14/` (gitignore)
- **ยังไม่ต่อสายเข้าแอป** — `getBladeImagePath()` (`app/lib/blades-data.ts`), `getBladeImgPath()` (`app/lib/products.ts`) และ `BeyCard.tsx` ยังชี้ `/blade/<series>/<img>.png` ต้องแก้ path builder ให้ชี้ `/products/<SERIES>/<id>/<id>.png` ก่อนรูปใหม่จึงถูกใช้
- **รูปเบลด 404 บางส่วน** — โค้ดเรียก `/blade/<series>/<img>.png` แต่ไฟล์จริงชื่อ `BL-PRD-*.png`; ใน `parts-db.ts` มี `img: null` 40 รายการ (BX 1 · UX 10 · CX 29) และ `app/lib/products.ts` อ้าง path ที่ไม่มีจริงบางรายการ
- **บทความวิกิ + banner ใน production หายหายไป** — volume `/app/data` ถูกสร้างใหม่ตอนลง OS ใหม่ 18 ต.ค. (ชิ้นส่วนกลับมาแล้วหลัง seed) → ต้องใส่เนื้อหาใหม่ที่ `/admin/wiki` และ `/admin/banners`
- **ชิ้นส่วนที่ยังไม่เพิ่ม** (ต้องมีสถิติเกมจริง ห้ามเดา): GloryValkyrie UX-20, HellsNether UX-21 — ส่วน DranStrike BX-49, HeavensRing BX-50, LusterDragoon BX-52 เพิ่มแล้ว 2026-11-14 (มีน้ำหนักจริง แต่ยังไม่มีสถิติเกม ATK/DEF/STA)
- **ตรวจ/แก้ `parts-db.ts` ให้ตรงข้อเท็จจริงแล้ว (2026-11-14)** — BX 95→36 (dedupe re-release + ย้าย UX/CX), UX 31→29 (ตัด Tyranno Beat/Roar ที่เป็น BX), CX 26→34 (ลบ placeholder `CX-04-2`, เพิ่ม Cerberus Dark/Eva Arc/Eva Brave/Eva Brush/Hells Arc/Phoenix Force/Rhino Reaper/Wolf Flame/Cerberus Reaper), Ratchet 37→38 (+M-65), Bit 54→56 (+Metal Orb, +Metal Taper, Dot → Defense) อ้าง Beyblade X Wiki
- **⚠️ ยังไม่มีข้อมูล (ห้ามเดา):** น้ำหนัก M-65 / Metal Orb (BX-55) / Metal Taper (CX-20) ยังไม่ประกาศบน Wiki (ตั้ง `weight: 0`); `5-50` ไม่มีสถิติ ATK/DEF/STA; เบลดหลายตัวยังเป็น `atk/def/sta = 0`
- **⚠️ สเกลสถิติ Ratchet ไม่สม่ำเสมอ** — ค่าเดิมบางตัวเป็นสเกลแอป 0–100 บางตัวอ้าง BeyBase/Wiki (เช่น 1-50, 9-65, 7-80) การเติมค่าใหม่รอบนี้ยึดตาม Wiki → ควรมีรอบ normalize สเกลให้เป็นระบบเดียวในอนาคต
- **DB migration ไป Supabase** — เตรียมไว้แล้วแต่ยังไม่ active (ดู skill `supabase-migration`)
- **ยังไม่ push ไป `origin` / `ex1kore`** (GitHub) — รอผู้ใช้สั่ง

## 11. Agent Skills ของโปรเจกต์ (`.opencode/skills/`)

| Skill | ใช้ทำอะไร |
| --- | --- |
| `beyblade-knowledge` | ความรู้เบย์เบลดสำหรับสนทนา (กติกา/ชิ้นส่วน/ฟิสิกส์/กลยุทธ์) — ใช้ตอนผู้ใช้พิมพ์ "x" คุยเรื่อง beyblade |
| `beyblade-project-overview` | โครงสร้างระบบ, schema, ชุดข้อมูลชิ้นส่วน, เส้นทาง API — โหลดก่อนแก้สถาปัตยกรรม |
| `parts-data-sync` | เพิ่ม/แก้ชิ้นส่วนใน `parts-db.ts` + กฎจับคู่รูป |
| `wiki-content` | สร้าง/แก้บทความวิกิ และ workflow ข่าวรายเดือน (ตรวจ slug เดิมก่อนสร้าง; ใช้ Admin API) |
| `coolify-deploy` | deploy/redeploy + gotchas + ขั้นตอนตรวจสอบ |
| `supabase-migration` | ย้าย SQLite → Supabase Postgres (ยังไม่ active) |

- วาง skill ใหม่ที่ `.opencode/skills/<skill-id>/SKILL.md` (ID มาจากชื่อโฟลเดอร์, kebab-case, ต้องมี `name` + `description` ใน frontmatter)
- ถ้าจะเพิ่ม MCP ของ Supabase → ใส่ใน `~/.config/opencode/opencode.json` (ไม่ใช่ในโปรเจกต์) แล้ว auth ผ่าน `/mcps` ใน TUI

## 12. รูปแบบรายงานเมื่อทำงานเสร็จ

1. สรุปสิ่งที่เปลี่ยน (ไฟล์ + สิ่งที่ทำ)
2. ผลตรวจสอบจริง (`tsc`, `lint`, migration, seed) — ผ่าน/ไม่ผ่าน
3. ข้อจำกัดหรือสิ่งที่ยังไม่ได้ทำ / ต้องรอผู้ใช้ตัดสินใจ
