# Micro-Beyblade-x

เว็บประกอบคอมโบ **เบย์เบลด X** (BX / UX / CX) พร้อมจำลองฟิสิกส์การหมุน–การชน–ความเสี่ยง Burst
รวมวิกิความรู้แบบ Markdown, ระบบบันทึกคอมโบ, My Collection และแบนเนอร์ affiliate

> เอกสารสำหรับ Agent/AI ที่ทำงานกับโปรเจกต์นี้อยู่ที่ [`AGENTS.md`](./AGENTS.md)
> และ Agent Skills อยู่ที่ [`.opencode/skills/`](./.opencode/skills/)
>
> ⚠️ **สถานะงาน:** งานยังไม่สมบูรณ์ — ดู [`plan.md`](./plan.md) สำหรับรายละเอียด
> ข้อมูลชิ้นส่วนบนเว็บ **เป็นข้อมูลที่จำลองขึ้น (simulated/mock)** เพื่อให้เว็บทำงานได้เท่านั้น
> ยังไม่ใช่ข้อมูลที่ถูกต้องตามข้อเท็จจริง (factual) — เราจะหาข้อมูลที่ถูกต้องมาปรับปรุงในภายหลัง

---

## 1. ฟีเจอร์หลัก

| ฟีเจอร์ | รายละเอียด |
| --- | --- |
| **Combo Builder** | เลือก Blade / Ratchet / Bit ทีละชิ้น (รองรับ BX / UX / CX และ Sub-Blade ของ CX) |
| **Physics Evaluator** | คำนวณ RPM, ความเร็วเชิงเส้น, มุมปะทะ, พลังงานจลน์รวม, แรงกระแทก, โมเมนตัมเชิงมุม และระดับความเสี่ยง Burst |
| **Deck Builder** | จัดเด็ค 3 ช่อง วิเคราะห์ภาพรวมของทีม |
| **Arena Simulator** | จำลองการปะทะบนสนาม |
| **Parts Explorer** | เรียกดูชิ้นส่วนทั้งหมดพร้อมสเตตัสและคำอธิบาย |
| **My Collection** | หน้าคอลเลกชันส่วนตัว (`/collection`) |
| **Wiki** | บทความความรู้ (กลศาสตร์/ระบบ/กลยุทธ์/อภิธานศัพท์/วิธีเล่น) — จัดการผ่าน admin |
| **Affiliate Banners** | แบนเนอร์ 2 ตำแหน่ง (`top`, `wiki`) พร้อมนับคลิก |
| **Admin** | ล็อกอินด้วย cookie หลังรหัสผ่านใน env — จัดการแบนเนอร์ + วิกิ |

---

## 2. Tech Stack

| ส่วน | เทคโนโลยี |
| --- | --- |
| Framework | **Next.js 16.2.11** (App Router + Turbopack) |
| UI | **React 19.2.4** · **Tailwind CSS v4** (`@import "tailwindcss"` ใน `app/globals.css` — ไม่มีไฟล์ config) |
| ไอคอน | `lucide-react` |
| Markdown | `react-markdown` + `remark-gfm` |
| Database | **SQLite** ผ่าน **Prisma 7.9.1** + `@prisma/adapter-libsql` + `@libsql/client` |
| ภาษา | **TypeScript (strict)** — ไม่ใช้ `any`, exported function มี return type |
| Package manager | **pnpm** (บังคับ) |
| Node | `.nvmrc` = `22` · `engines.node` ≥ 20.19 |
| Deploy | **Coolify** (self-hosted) — ไม่ใช่ Vercel |

---

## 3. ความต้องการของระบบ

- **Node.js ≥ 20.19** (แนะนำ 22 ตาม `.nvmrc`)
- **pnpm** (ใช้ lockfile แบบ pnpm — อย่าใช้ npm/yarn)

---

## 4. เริ่มต้นใช้งาน (Local)

```bash
# 1) ติดตั้ง dependency (postinstall จะรัน `prisma generate` ให้)
pnpm install

# 2) ตั้งค่า environment (ดูหัวข้อ 5)
cp .env.example .env
# แล้วแก้ค่าใน .env ตามต้องการ

# 3) เตรียมฐานข้อมูล SQLite
pnpm prisma migrate dev

# 4) รัน dev server
pnpm dev
# เปิด http://localhost:3000
```

ถ้าต้องการข้อมูลชิ้นส่วน/วิกิลง DB ให้ seed (ต้องล็อกอิน admin):

```bash
curl -X POST http://localhost:3000/api/seed -H 'Cookie: mbx_admin=<token>'
```

---

## 5. Environment Variables

ตั้งใน `.env` (local) หรือในหน้า Environment ของ Coolify (production) — ไฟล์ตัวอย่างอยู่ที่ `.env.example`

| ตัวแปร | จำเป็น | คำอธิบาย |
| --- | --- | --- |
| `DATABASE_URL` | ไม่ | URL ของฐานข้อมูล (เช่น `file:/abs/path/prisma/dev.db`) — ถ้าไม่ตั้ง ระบบจะ fallback ไปที่ `prisma/dev.db` ในโปรเจกต์อัตโนมัติ |
| `ADMIN_PASSWORD` | ใช่ (ถ้าใช้ admin) | รหัสผ่านเข้าหน้า admin — **ถ้าไม่ตั้ง ระบบ admin จะถูกปิดทั้งหมด** |
| `ADMIN_SECRET` | ไม่ | secret สำหรับเซ็น cookie session — ถ้าไม่ตั้งจะใช้ค่า `ADMIN_PASSWORD` แทน |

> ⚠️ ห้าม commit ค่าจริงของ `.env` / token / password ลง Git — อ้างอิงเป็นชื่อตัวแปรเท่านั้น

---

## 6. คำสั่งที่ใช้บ่อย

```bash
pnpm dev                      # next dev
pnpm build                    # next build
pnpm start                    # next start
pnpm lint                     # eslint
pnpm exec tsc --noEmit        # type check (ไม่มี script แยก)

pnpm prisma generate          # สร้าง Prisma Client
pnpm prisma migrate dev       # migration โหมด dev
pnpm prisma migrate deploy    # migration โหมด prod (รันใน start command ของ Coolify)
pnpm prisma studio            # เปิด Prisma Studio

node scripts/extract-beybuilder-parts.mjs              # ดึงข้อมูลอ้างอิงจาก BeyBuilderX
python3 scripts/monthly_beyblade_news.py --dry-run     # ร่างข่าวรายเดือน (ไม่เผยแพร่)
python3 scripts/monthly_beyblade_news.py               # สร้าง/อัปเดตบทความวิกิรายเดือน
```

---

## 7. โครงสร้างโปรเจกต์

```text
Micro-Beyblade-x/
├── app/
│   ├── page.tsx                 # หน้าแรก (Combo Builder + Deck + Physics)
│   ├── layout.tsx  globals.css
│   ├── collection/              # My Collection
│   ├── admin/                   # UI admin: login, banners, wiki
│   ├── api/                     # Route handlers (ดูหัวข้อ 9)
│   ├── components/              # Client components (11 ไฟล์)
│   ├── lib/                     # logic + ชุดข้อมูล (16 ไฟล์)
│   └── wiki/                    # หน้าวิกิ static + [slug] dynamic
├── prisma/
│   ├── schema.prisma            # 6 model (ดูหัวข้อ 8)
│   ├── dev.db                   # SQLite local (gitignored)
│   └── migrations/              # init, add_banner, add_subblade_id, add_wiki_article_fields
├── public/
│   ├── blade/{bx,ux,cx}/        # รูปเบลด
│   ├── products/{BX,UX,CX,BITS,RATCHETS,TYPE}/   # รูปสินค้า/ชิ้นส่วน
│   └── data/beybuilder-parts.json                # ข้อมูลอ้างอิงจาก BeyBuilderX (GPL-2.0)
├── scripts/
│   ├── extract-beybuilder-parts.mjs
│   └── monthly_beyblade_news.py
├── .opencode/skills/            # Agent Skills ของโปรเจกต์ (6 skill)
├── AGENTS.md
├── prisma.config.ts
└── README.md
```

---

## 8. ฐานข้อมูล (Prisma Schema)

Provider = `sqlite` · 6 model:

| Model | เนื้อหา |
| --- | --- |
| `Blade` | id, name, series (BX/UX/CX), weight, atk, def, sta, inertiaFactor, desc, color |
| `Ratchet` | id, name, height (mm), sides, weight, atk, def, sta, bst, desc |
| `Bit` | id, name, type (Attack/Defense/Stamina/Balance), weight, speed, atk, def, sta, bst, burstResist, desc |
| `SavedCombo` | คอมโบที่บันทึก + snapshot ฟิสิกส์ (rpm, linearSpeed, angleDeg, totalKE, impactForce, angularMomentum, burstRiskLevel) + `subBladeId?` (CX) |
| `WikiArticle` | slug (unique), title, content (Markdown), category, status (draft/published), excerpt, coverImage, imageAlt, sortOrder |
| `Banner` | position (top/wiki), title, imageUrl, targetUrl, network, alt, active, sortOrder, startsAt/endsAt, clickCount |

> การย้ายไป Postgres/Supabase ต้องเปลี่ยน provider + adapter และสร้าง migration ใหม่ — ดู skill `supabase-migration` (ยังไม่เปิดใช้งาน)

---

## 9. API Endpoints

| Method | Path | สิทธิ์ | หน้าที่ |
| --- | --- | --- | --- |
| `GET` | `/api/combos` | สาธารณะ | ดึงคอมโบที่บันทึก |
| `POST` | `/api/combos` | สาธารณะ | บันทึกคอมโบ (ผู้ใช้ทั่วไปกดบันทึกได้) |
| `DELETE` | `/api/combos/[id]` | admin | ลบคอมโบ |
| `GET` | `/api/wiki` | สาธารณะ | ดึงบทความวิกิที่เผยแพร่ |
| `GET` | `/api/banners?position=` | สาธารณะ | ดึงแบนเนอร์ที่ active |
| `POST` | `/api/banners/click` | สาธารณะ | นับคลิกแบนเนอร์ |
| `POST` | `/api/seed` | admin | seed ชิ้นส่วนลง DB (upsert) |
| `POST` | `/api/admin/login` | — | ล็อกอิน (ตั้ง cookie `mbx_admin`) |
| `POST` | `/api/admin/logout` | — | ออกจากระบบ |
| `GET` `POST` | `/api/admin/banners` | admin | ดู/สร้างแบนเนอร์ |
| `PATCH` `DELETE` | `/api/admin/banners/[id]` | admin | แก้ไข/ลบแบนเนอร์ |
| `GET` `POST` | `/api/admin/wiki` | admin | ดู/สร้างบทความวิกิ |
| `PATCH` `DELETE` | `/api/admin/wiki/[id]` | admin | แก้ไข/ลบบทความวิกิ |

**ระบบล็อกอิน admin:** cookie `mbx_admin` เก็บ token รูปแบบ `<exp>.<hmac-sha256>` อายุ 12 ชั่วโมง
เซ็นด้วย `ADMIN_SECRET` (fallback = `ADMIN_PASSWORD`) — ตรวจด้วย `isAdmin()` ใน `app/lib/admin-auth.ts`

---

## 10. ชุดข้อมูลชิ้นส่วน

ไฟล์หลัก: **`app/lib/parts-db.ts`** (static TypeScript — ไม่ได้อยู่ใน DB โดยตรง)
สำหรับ BX ใช้ข้อมูลจาก **`app/lib/bx-catalog.ts`** (95 = 1 entry ต่อไฟล์สินค้า) แล้วยุบเหลือ 1 entry ต่อเบลดจริงใน `BX_BLADES`
export: `PARTS_DB` + `BLADE_ID_ALIASES` (map id ที่ถูกยุบ/ย้าย — `POST /api/seed` ใช้ remap `SavedCombo.bladeId` ก่อน prune)

จำนวนปัจจุบัน (2026-11-14): **BX 36 · UX 29 · CX 34 · CX_SUB 3 · Ratchet 38 · Bit 56 = 196 ชิ้น**
(Bit แยกเป็น Attack 18 / Stamina 11 / Defense 11 / Balance 16)

**แหล่งอ้างอิงหลัก:** Beyblade X Wiki (fandom) API `https://beyblade.fandom.com/api.php` — `List of Basic Line parts`, `List of Unique Line parts`, `List of Custom Line parts`, `Category:Ratchets`, `Category:RBT-Ratchets`

**กฎการแก้ข้อมูล:**
- **ค่าจริง** (น้ำหนักกรัม, ความสูง mm, `sides`, `type` ของ bit, `name`, `desc`) — แก้ได้เมื่อมีแหล่งอ้างอิง
- **สถิติเกม** (`atk`, `def`, `sta`, `bst`, `speed`, `burstResist`, `inertiaFactor`, `color`) เป็นสเกล 0–100 ที่ตั้งใจไว้ — **ห้ามเดาค่าใหม่**
- `id` ต้องไม่ซ้ำทั้งระบบ · ชิ้นส่วนที่ยังไม่มีรูปให้ใช้ `img: null`
- หลังแก้ `parts-db.ts` ให้ seed DB ใหม่ผ่าน `POST /api/seed` (ต้องเป็น admin)
- รายละเอียดครบถ้วนอยู่ใน skill [`parts-data-sync`](./.opencode/skills/parts-data-sync/SKILL.md)

---

## 11. วิกิ

- หมวดหมู่ (`WIKI_CATEGORIES`): `mechanics` · `system` · `strategy` · `glossary` · `how-to-play` · `parts` · `products`
- สถานะ: `draft` · `published`
- เนื้อหาเก็บเป็น **Markdown** ในฟิลด์ `WikiArticle.content`
- จัดการผ่าน `/admin/wiki` หรือ Admin API
- หน้าวิกิแบบ static อยู่ที่ `app/wiki/*` และแบบ dynamic ที่ `app/wiki/[slug]`
- รายละเอียดอยู่ใน skill [`wiki-content`](./.opencode/skills/wiki-content/SKILL.md)

---

## 12. การ Deploy (Coolify)

- Coolify ดึงโค้ดจาก remote **`gitea`** (`http://192.168.1.200:3000/Ex1-Kore/Micro-Beyblade-x.git`) — **auto-deploy ไม่ทำงาน (ไม่มี Gitea webhook) ต้องสั่ง deploy เอง**
- `prisma migrate deploy` ถูกรันอัตโนมัติใน start command
- ข้อมูลวิกิ/แบนเนอร์ผูกกับ volume `/app/data` — ระวังหายเมื่อสร้าง container/volume ใหม่
- อย่าตั้ง `output: 'standalone'` ใน `next.config.ts`
- ขั้นตอน + gotchas อยู่ใน skill [`coolify-deploy`](./.opencode/skills/coolify-deploy/SKILL.md)

### Git remotes

| remote | URL | หมายเหตุ |
| --- | --- | --- |
| `ex1kore` | `https://github.com/Ex1-Kore/Micro-Beyblade-x.git` | upstream ของ `main` |
| `gitea` | `http://192.168.1.200:3000/Ex1-Kore/Micro-Beyblade-x.git` | **Coolify deploy ดึงจากนี้** |
| `origin` | `https://github.com/Insurgent-Dev/Micro-Beyblade-x.git` | repo ของทีม — push เอง |

---

## 13. สถานะ / ปัญหาที่ทราบ

- **รูปเบลด 404 บางส่วน** — โค้ดประกอบ path จาก `img` ใน `parts-db.ts` (เช่น `/blade/ux/<img>.png`) แต่ไฟล์จริงใน `public/blade/ux|cx/` ตั้งชื่อเป็น `<รหัสสินค้า> <ชื่อ> <combo>.png` (เช่น `UX-03 Wizard Rod 5-70DB.png`) → ชื่อไม่ตรงกัน
- **`DATABASE_URL` ใน `.env`** อาจชี้ path เก่า (เช่น `/mnt/backup/GIT/Ex1-Kore/...`) ที่ไม่มีอยู่แล้ว → `/api/wiki` และ `/api/banners` ตอบ 500 ให้แก้ให้ชี้ `prisma/dev.db` ปัจจุบัน
- **ชิ้นส่วนที่ยังไม่มีสถิติเกมจริง** (ห้ามเดา): DranStrike BX-49, HeavensRing BX-50, LusterDragoon BX-52, GloryValkyrie UX-20, HellsNether UX-21
- **การย้าย DB ไป Supabase** เตรียมไว้แล้วแต่ยังไม่ active
- `git status` อาจขึ้นไฟล์ "M" จำนวนมากจาก **file mode** (644→755) — ไม่ใช่เนื้อหาเปลี่ยน

---

## 14. แหล่งอ้างอิง / Attribution

- ข้อมูลชิ้นส่วนอ้างอิงจาก **BeyBuilderX** (`public/data/beybuilder-parts.json`, สัญญาอนุญาต **GPL-2.0**) ผ่าน `scripts/extract-beybuilder-parts.mjs`
- รูปภาพสินค้า/ชิ้นส่วนอยู่ใน `public/products/*` และ `public/blade/*`
- ลิงก์ affiliate อ้างอิงร้าน [beysandbricks.com](https://beysandbricks.com/)
- ข้อมูลตัวเลขเกม (Takara Tomy Beyblade X) ใช้เพื่อการอ้างอิง/จำลองเท่านั้น
