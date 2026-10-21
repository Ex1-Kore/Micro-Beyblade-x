---
name: beyblade-project-overview
description: โครงสร้างและสถาปัตยกรรมของโปรเจกต์ Micro-Beyblade-x (Next.js 16 + React 19 + Prisma 7/SQLite) — โครงสร้างโฟลเดอร์, schema ฐานข้อมูล, ชุดข้อมูลชิ้นส่วน, เส้นทาง API, ระบบ admin และกฎการ deploy. ใช้เมื่อต้องเข้าใจระบบก่อนแก้สถาปัตยกรรม, เพิ่มฟีเจอร์, แก้ schema, หรือทำงานที่กระทบหลายโฟลเดอร์. (ถ้าผู้ใช้มาคุยเรื่องเบย์เบลด/กติกา/คอมโบ ไม่ใช่แก้โค้ด → ใช้ skill beyblade-knowledge แทน)
compatibility: Next.js 16 App Router, pnpm, Node 22, Prisma 7 + libSQL
metadata:
  project: micro-beyblade-x
  scope: project
---

# Micro-Beyblade-x — Project Overview

ความรู้พื้นฐานของโปรเจกต์ **Micro-Beyblade-x** — เว็บ Next.js สำหรับประกอบคอมโบเบย์เบลด X และจำลองฟิสิกส์การหมุน/การชน/ความเสี่ยง Burst

> โปรเจกต์นี้เป็น **โปรเจกต์ของทีมเอง** (ไม่ใช่ repo สำรอง family) — กฎ global ข้อ #4 ใช้ไม่ได้กับ remote `Insurgent-Dev`

## Tech Stack

| รายการ | ค่า |
| --- | --- |
| Framework | Next.js **16.2.11** (App Router เท่านั้น) + React **19.2.4** |
| Styling | Tailwind CSS **v4** (`@import "tailwindcss"` ใน `app/globals.css` — ไม่มีไฟล์ config) |
| DB | SQLite ผ่าน **Prisma 7.9.1** + `@prisma/adapter-libsql` + `@libsql/client` |
| ภาษา | TypeScript strict — ห้าม `any`, exported function ต้องมี return type |
| Package manager | **pnpm** (มี `pnpm-workspace.yaml` ที่ root) |
| Node | `.nvmrc` = **22** · `engines.node` ≥ 20.19 (Prisma 7 บังคับ) |
| Markdown | `react-markdown` + `remark-gfm` (ตัว render เองที่ `app/wiki/markdown.tsx`) |
| Deploy | Coolify (self-hosted) — ดู skill `coolify-deploy` |

## โครงสร้างโฟลเดอร์ (ปัจจุบัน)

```text
Micro-Beyblade-x/
├── app/
│   ├── page.tsx                 # หน้าแรก (RSC)
│   ├── layout.tsx  globals.css
│   ├── api/
│   │   ├── combos/route.ts  combos/[id]/route.ts   # CRUD คอมโบที่บันทึกไว้
│   │   ├── seed/route.ts                          # seed ข้อมูลเข้า DB
│   │   ├── banners/route.ts  banners/click/route.ts  # banner สาธารณะ + นับคลิก
│   │   └── admin/
│   │       ├── login/route.ts  logout/route.ts     # cookie auth
│   │       ├── banners/route.ts  banners/[id]/route.ts
│   │       └── wiki/route.ts  wiki/[id]/route.ts    # CRUD บทความวิกิ
│   ├── admin/                   # UI admin (cookie-gated)
│   │   ├── login/page.tsx  page.tsx  banners/page.tsx  wiki/page.tsx
│   ├── components/              # React client components
│   │   ├── AppHeader.tsx  ArenaSimulator.tsx  BeyCard.tsx
│   │   ├── ComboBuilder.tsx  DeckBuilder.tsx  PartsExplorer.tsx
│   │   ├── PhysicsEvaluator.tsx
│   │   ├── BannerSlot.tsx  AdminBannerManager.tsx  AdminWikiManager.tsx
│   ├── lib/
│   │   ├── types.ts             # BladePart / RatchetPart / BitPart / Combo / PhysicsResult
│   │   ├── parts-db.ts          # ชุดข้อมูลชิ้นส่วน (const ภายใน → export เป็น PARTS_DB)
│   │   ├── physics.ts           # สูตรจำลองฟิสิกส์ + calcPhysics()
│   │   ├── prisma.ts            # Prisma singleton (libSQL adapter, อ่าน DATABASE_URL)
│   │   ├── products.ts          # แคตตาล็อกสินค้า + แมป path รูป
│   │   ├── banners.ts  banner-input.ts
│   │   ├── admin-auth.ts        # cookie HMAC session (12 ชม.)
│   │   ├── wiki.ts  wiki-categories.ts  wiki-input.ts
│   │   └── safe-url.ts          # กรอง URL ที่ปลอดภัย (http(s) + path สัมพัทธ์)
│   └── wiki/                    # หน้าวิกิ (RSC) + ตาราง category
│       ├── page.tsx  components.tsx  markdown.tsx
│       ├── [slug]/page.tsx       # หน้าบทความจาก DB
│       └── blades/ ratchets/ bits/ cx-parts/ products/ glossary/
│           how-to-play/ mechanics/ strategy/ system/
├── prisma/
│   ├── schema.prisma
│   ├── dev.db                   # SQLite local
│   └── migrations/              # init + add_banner + add_subblade_id + add_wiki_article_fields
├── public/
│   ├── blade/{bx,ux,cx}/         # รูปเบลด (ชื่อไฟล์ไม่ตรงกับ img ใน parts-db — ดู Known issues)
│   ├── bit/  ratchet/  mainblade/  overblade/  metalblade/  assistblade/  lockchip/
│   ├── products/{bx,ux,cx}/      # รูปสินค้า (products.ts map ใช้โฟลเดอร์นี้)
│   └── data/beybuilder-parts.json  # ข้อมูลอ้างอิงจาก BeyBuilderX (GPL-2.0)
├── scripts/extract-beybuilder-parts.mjs
├── .opencode/skills/             # Agent Skills ของโปรเจกต์ (V2 มาตรฐาน)
│   ├── beyblade-knowledge/SKILL.md        ← ความรู้เบย์เบลดสำหรับสนทนา
│   ├── beyblade-project-overview/SKILL.md   ← ไฟล์นี้
│   ├── parts-data-sync/SKILL.md
│   ├── wiki-content/SKILL.md
│   ├── coolify-deploy/SKILL.md
│   └── supabase-migration/SKILL.md
├── info/                        # ไฟล์อ้างอิง/ข้อมูลดิบ (ยังไม่ commit บางส่วน)
├── AGENTS.md                    # กฎถาวรของโปรเจกต์
└── prisma.config.ts
```

## Schema ฐานข้อมูล (`prisma/schema.prisma`)

| Model | จุดประสงค์ |
| --- | --- |
| `Blade` | id, name, series (BX/UX/CX), weight, atk, def, sta, inertiaFactor, desc, color |
| `Ratchet` | id, name, height (mm), sides, weight, atk, def, sta, bst, desc |
| `Bit` | id, name, type (Attack/Defense/Stamina/Balance), weight, speed, atk, def, sta, bst, burstResist, desc |
| `SavedCombo` | คอมโบที่ผู้ใช้บันทึก + snapshot ฟิสิกส์ (rpm, linearSpeed, angleDeg, totalKE, impactForce, angularMomentum, burstRiskLevel) + `subBladeId?` (CX) |
| `WikiArticle` | slug (unique), title, content (Markdown), category, status (draft/published), excerpt, coverImage, imageAlt, sortOrder |
| `Banner` | position (top/wiki), title, imageUrl, targetUrl, network (shopee/lazada/tiktok/generic), alt, active, sortOrder, startsAt/endsAt, clickCount |

> provider = `sqlite` · ต้องเปลี่ยนเป็น `postgresql` ก่อนย้ายไป Supabase (ดู skill `supabase-migration`)

## ชุดข้อมูลชิ้นส่วน (`app/lib/parts-db.ts`)

- const ภายในไฟล์: `BX_BLADES`, `UX_BLADES`, `CX_BLADES`, `CX_SUBBLADES`, `RATCHETS`, `BITS` (ไม่ได้ export)
- export เดียวคือ `PARTS_DB` = `{ BX:{blades}, UX:{blades}, CX:{blades, subblades}, ratchets, bits }`
- จำนวนปัจจุบัน: BX 39 · UX 23 · CX 3 · CX_SUB 3 · Ratchet 37 · Bit 54 (Attack 18 / Stamina 11 / Defense 10 / Balance 15) = **159 ชิ้น**
- สถิติเกม (atk/def/sta/bst/burstResist/speed) เป็นสเกล 0–100 ที่ตั้งใจไว้ — **ห้ามเดาค่าใหม่**
- น้ำหนัก (กรัม) และชนิด bit เป็นค่าจริงจากเครื่อง — แก้ได้เมื่อมีแหล่งอ้างอิง
- กฎการแก้ไขชิ้นส่วน → skill `parts-data-sync`

## ฟิสิกส์ (`app/lib/physics.ts`)

- ค่าคงที่: `EFFECTIVE_RADIUS_M = 0.024`, `GRAVITY = 9.81`, `CONTACT_TIME_S = 0.01`, `MU_BY_TYPE`, `BIT_RADIUS_M`
- ฟังก์ชันหลัก: `calcPhysics(input): PhysicsOutput` → omega, momentOfInertia, rotationalKE, linearKE, totalKE, impactForce, rpmBand (low/optimal/extreme), burstRiskScore, burstRiskLevel (low/moderate/high), trajectoryType/Desc
- `fmt(value, decimals = 2)` สำหรับแสดงผลตัวเลข

## เส้นทางหน้าเว็บ

| เส้นทาง | โหมด | หมายเหตุ |
| --- | --- | --- |
| `/` | RSC | หน้าหลัก + Combo Builder |
| `/wiki` และหมวดย่อย | RSC | หน้าคงที่ตามหมวด + บทความจาก DB ที่ `status=published` |
| `/wiki/[slug]` | RSC (`force-dynamic`) | บทความเดี่ยว อ่านผ่าน `getPublishedArticleBySlug()` |
| `/admin` | RSC → redirect | ต้องผ่าน `isAdmin()` |
| `/admin/login`, `/admin/banners`, `/admin/wiki` | RSC + client | UI จัดการ banner / บทความ |
| `/api/*` | Route handlers | ฝั่ง admin ต้องเช็ค `isAdmin()` ทุก handler |

## ระบบ admin (`app/lib/admin-auth.ts`)

- cookie ชื่อ `mbx_admin` · อายุ 12 ชั่วโมง
- ค่า token = `<exp epoch ms>.<HMAC-SHA256>` โดย HMAC key = `ADMIN_SECRET` (fallback `ADMIN_PASSWORD`) เทียบแบบ `timingSafeEqual`
- ถ้าไม่ตั้ง `ADMIN_PASSWORD` → ระบบ admin ปิดโดยอัตโนมัติ
- เมื่อเสิร์ฟผ่าน HTTP ต้องดู `x-forwarded-proto` (ไม่ใช่ `request.secure`) — เคยเป็นบั๊ก cookie ที่ทำให้ล็อกอินไม่ได้

## คำสั่งที่ใช้จริง

```bash
pnpm install                 # postinstall = prisma generate
pnpm dev                     # next dev
pnpm build                   # next build
pnpm start                   # next start
pnpm lint                    # eslint (ไม่มีสคริปต์ typecheck)
pnpm exec tsc --noEmit       # type check
pnpm prisma generate
pnpm prisma migrate dev      # dev
pnpm prisma migrate deploy   # prod (รันใน start_command ของ Coolify)
pnpm prisma studio
node scripts/extract-beybuilder-parts.mjs   # สร้าง public/data/beybuilder-parts.json
```

## Known issues (ยังไม่แก้)

- **รูปเบลด 404 บางส่วน** — โค้ดเรียก `/blade/<series>/<img>.png` (`app/components/BeyCard.tsx`) แต่ไฟล์จริงชื่อแบบ `BL-PRD-*.png` → 15 รายการใน parts-db มี `img: null` และชื่อไฟล์ไม่ตรงกัน
- **`app/lib/products.ts`** อ้าง path รูปที่ไม่มีจริงบางส่วน (รวม `.jpeg` ที่ไม่มีใน `public/blade/bx/`)
- แผนเดิม: สร้าง admin/backend สำหรับจัดการรูปและเพิ่มเนื้อหา

## Skill ที่เกี่ยวข้อง

| Skill | ใช้ทำอะไร |
| --- | --- |
| `beyblade-knowledge` | ความรู้เบย์เบลดสำหรับสนทนา (กติกา, ชิ้นส่วนเด่น, ฟิสิกส์, กลยุทธ์) — ใช้ตอนผู้ใช้คุยเรื่อง beyblade |
| `parts-data-sync` | เพิ่ม/แก้ชิ้นส่วนใน `parts-db.ts` + จับคู่รูป |
| `wiki-content` | สร้าง/แก้บทความวิกิ + admin UI + slug/category rules |
| `coolify-deploy` | deploy/redeploy บน Coolify (uuid, nixpacks, volume, gotchas) |
| `supabase-migration` | ย้าย DB SQLite → Supabase Postgres (ยังไม่ active) |
