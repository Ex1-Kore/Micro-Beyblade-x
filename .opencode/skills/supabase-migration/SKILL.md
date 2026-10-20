---
name: supabase-migration
description: ขั้นตอนย้ายฐานข้อมูลของ Micro-Beyblade-x จาก SQLite ไป Supabase Postgres — เตรียมโปรเจกต์, เปลี่ยน provider และ driver adapter, วิธีแปลง migration จาก SQLite เป็น Postgres, ตั้งค่า pooler/direct URL บน Coolify และการย้อนกลับ. ใช้เมื่อผู้ใช้สั่งย้าย DB ไป Supabase หรือออกแบบหลังการย้าย.
compatibility: ต้องอยู่ในโปรเจกต์ Micro-Beyblade-x; ต้องมีโปรเจกต์ Supabase ที่เตรียมไว้
metadata:
  project: micro-beyblade-x
  scope: project
  status: prepared-not-active
---

# Supabase Migration — SQLite → Postgres

> ⚠️ **สถานะ: เตรียมไว้ แต่ยังไม่ได้ทำ (prepared, not active)**
> ระบบที่รันอยู่จริงยังเป็น **SQLite** บน volume `/app/data` ของ Coolify — อย่าเปลี่ยนจนกว่าจะได้รับคำสั่งชัดเจน

## 1. ข้อมูลที่เตรียมไว้

| รายการ | ค่า |
| --- | --- |
| Supabase project ref | `vdfkrzmrnrixadrjnxka` |
| Host (direct) | `db.vdfkrzmrnrixadrjnxka.supabase.co:5432` |
| Pooler (transaction) | `aws-0-ap-south-1.pooler.supabase.com:6543` + `?pgbouncer=true` |
| Pooler (session) | `aws-0-ap-south-1.pooler.supabase.com:5432` |
| ไฟล์ env | `.env.local` — ค่า `DATABASE_URL` / `DIRECT_URL` ถูก **comment ไว้** พร้อมคอมเมนต์ `[Supabase — disabled until DB migration]` |
| deps ที่ติดตั้งไว้แล้ว | `@supabase/ssr`, `@supabase/supabase-js` (ยังไม่ถูก import ในโค้ดแอป) |
| MCP (ถ้าจะใช้) | `https://mcp.supabase.com/mcp?project_ref=vdfkrzmrnrixadrjnxka&features=docs,account,database,debugging,development,functions,branching` — เพิ่มใน `~/.config/opencode/opencode.json` แล้ว auth ด้วย `/mcps` |

> 🔒 **ห้ามเขียนค่า password / connection string ลงในไฟล์ใน repo, AGENTS.md หรือ skill** — ให้อ้างอิงจาก `.env.local` และ env ของ Coolify เท่านั้น

## 2. ตัดสินใจก่อนเริ่ม

- ย้ายแล้ว **SQLite volume `/app/data` จะไม่ถูกใช้อีก** — ต้องตัดสินใจว่าจะเก็บไว้เป็น backup หรือลบ
- **ข้อมูลใน DB ปัจจุบันมีจริง** (คอมโบที่บันทึก, บทความวิกิ, banner) → ต้อง export/import ไม่ใช่แค่ migrate
- การย้าย provider จะทำให้ **migration เดิม (SQLite) ใช้ไม่ได้** → ต้องสร้าง migration ชุดใหม่สำหรับ Postgres

## 3. ขั้นตอน

### 3.1 เปลี่ยน schema และ driver adapter

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
}
```

```bash
pnpm add @prisma/adapter-pg pg
```

แก้ `app/lib/prisma.ts` ให้ใช้ adapter แบบ Postgres (แทน `PrismaLibSQL`):

```ts
import { PrismaPg } from '@prisma/adapter-pg';
// ...
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
```

### 3.2 แยก URL ของ CLI กับ runtime

```ts
// prisma.config.ts
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: env('DIRECT_URL'), // migrate ใช้ direct connection
  },
});
```

- runtime (แอป) → `DATABASE_URL` = pooler `:6543?pgbouncer=true`
- CLI (`migrate`) → `DIRECT_URL` = pooler session `:5432` หรือ direct host
- อย่าใช้ transaction pooler กับ `migrate` (Prisma ต้องการ session/DDL)

### 3.3 แปลง migration จาก SQLite เป็น Postgres

migration เดิมเป็น SQL ของ SQLite (`PRAGMA defer_foreign_keys`, `REAL`, `DATETIME`) — ใช้กับ Postgres ไม่ได้

```bash
# ดึง schema ปัจจุบันจาก SQLite เป็น SQL สำหรับ Postgres
pnpm prisma migrate diff \
  --from-url "file:$(pwd)/prisma/dev.db" \
  --to-schema-datamodel prisma/schema.prisma \
  --script > /tmp/postgres_baseline.sql

# ใช้กับฐานข้อมูลเปล่า
psql "$DIRECT_URL" -f /tmp/postgres_baseline.sql

# ทำให้ migration history ของ Postgres เชื่อว่า baseline ถูก apply แล้ว
pnpm prisma migrate resolve --applied 0_init
```

จากนั้น migration ถัดไปให้สร้างแบบปกติ (`pnpm prisma migrate dev --name <ชื่อ>`) แล้วค่อย commit ทั้งโฟลเดอร์ `prisma/migrations/` ชุดใหม่

### 3.4 ย้ายข้อมูลเดิม

ตารางที่มีข้อมูล: `SavedCombo`, `WikiArticle`, `Banner` (parts tables เป็นข้อมูลจาก `parts-db.ts` → seed ใหม่ได้)

```bash
# 1) export จาก SQLite
sqlite3 prisma/dev.db ".dump SavedCombo WikiArticle Banner" > /tmp/data.sql

# 2) import เข้า Postgres (ปรับชื่อตาราง/quote ให้เข้ากับ Postgres)
psql "$DIRECT_URL" -f /tmp/data.sql
```

หรือเขียนสคริปต์ Node อ่านจาก libSQL แล้ว `createMany` เข้า Postgres (ปลอดภัยกว่าเรื่อง quoting)

### 3.5 Seed ชิ้นส่วนใหม่

```bash
# หลัง migrate + login admin แล้ว
curl -X POST http://localhost:3000/api/seed -H "Cookie: mbx_admin=<token>"
```

### 3.6 ตั้งค่า Coolify

| Env | ค่า |
| --- | --- |
| `DATABASE_URL` | pooler `:6543?pgbouncer=true` (runtime) |
| `DIRECT_URL` | pooler session `:5432` (migrate) |
| `ADMIN_PASSWORD` / `ADMIN_SECRET` | คงเดิม |

- start command เดิม `sh -c "pnpm exec prisma migrate deploy && pnpm start"` ใช้ต่อได้
- volume `/app/data` เลิกใช้ — **อย่าลบจนกว่าจะ backup เสร็จ**
- ตรวจหลัง deploy: `/api/combos`, `/wiki/<slug>`, `/api/banners` ต้องตอบข้อมูลเดิม

## 4. ตรวจสอบหลังย้าย

```bash
pnpm exec tsc --noEmit
pnpm build
pnpm prisma migrate status
psql "$DIRECT_URL" -c '\dt'          # ต้องมี 6 ตาราง
psql "$DIRECT_URL" -c 'select count(*) from "SavedCombo";'
```

## 5. ย้อนกลับ (rollback)

1. ตั้ง `DATABASE_URL` บน Coolify กลับเป็น `file:/app/data/dev.db` + เอา `DIRECT_URL` ออก
2. revert commit ที่เปลี่ยน provider และ `app/lib/prisma.ts`
3. `pnpm install && pnpm prisma generate`
4. deploy ใหม่ — SQLite เดิมยังอยู่ใน volume (ถ้าไม่ได้ลบ)

## 6. หมายเหตุด้านชนิดข้อมูล (SQLite → Postgres)

| Prisma | SQLite | Postgres |
|---|---|---|
| `String` | TEXT | `text` |
| `Int` | INTEGER | `integer` |
| `Float` | REAL | `double precision` |
| `Boolean` | INTEGER | `boolean` |
| `DateTime` | DATETIME | `timestamp(3)` |
| `@default(cuid())` | text | `text` + default ใน client (ต้องใส่ค่าเองตอน insert จาก SQL ดิบ) |

- `cuid()` ถูกสร้างฝั่ง Prisma Client → ถ้า import ข้อมูลด้วย SQL ดิบต้องใส่ id เอง
- `@@index` และ `@@unique` เหมือนกัน แต่ Postgres เรียง NULL ต่างจาก SQLite เล็กน้อย
