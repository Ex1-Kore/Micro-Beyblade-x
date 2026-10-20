---
name: wiki-content
description: วิธีสร้างและแก้ไขบทความวิกิของ Micro-Beyblade-x — โมเดล WikiArticle, หมวดหมู่/สถานะที่อนุญาต, กฎ slug และ slug ที่สงวน, API ของ admin, การ render Markdown และข้อจำกัดของฟิลด์. ใช้เมื่อผู้ใช้ขอเพิ่มหรือแก้เนื้อหาในหน้าวิกิของเว็บ.
compatibility: ต้องอยู่ในโปรเจกต์ Micro-Beyblade-x
metadata:
  project: micro-beyblade-x
  scope: project
---

# Wiki Content — เขียนบทความวิกิ

เนื้อหาวิกิเก็บในฐานข้อมูล (ตาราง `WikiArticle`) ไม่ใช่ไฟล์ markdown ใน repo

## 1. โมเดลข้อมูล

| ฟิลด์ | ชนิด | ข้อจำกัด |
| --- | --- | --- |
| `slug` | string | unique · regex `^[a-z0-9]+(?:-[a-z0-9]+)*$` · ห้ามซ้ำกับ slug ที่สงวน |
| `title` | string | 1–120 ตัวอักษร |
| `content` | string (Markdown) | ≤ 50,000 ตัวอักษร |
| `category` | enum | `mechanics` · `system` · `strategy` · `glossary` · `how-to-play` · `parts` · `products` |
| `status` | enum | `draft` · `published` (มี default = `draft`) |
| `excerpt` | string | ≤ 300 ตัวอักษร |
| `coverImage` | string | ต้องผ่าน `asSafeUrl()` — http(s) หรือ path สัมพัทธ์ `/...` เท่านั้น |
| `imageAlt` | string | ≤ 160 ตัวอักษร |
| `sortOrder` | int | ค่าเริ่ม 0 — ยิ่งน้อยยิ่งขึ้น |

ค่าจริงทั้งหมดถูก validate ที่ `app/lib/wiki-input.ts` → `normalizeWikiInput(body, partial)` — **ต้องใช้ฟังก์ชันนี้ทุกครั้ง** ไม่ต้องเขียน validation ซ้ำ

## 2. slug ที่สงวนไว้

`system`, `mechanics`, `strategy`, `glossary`, `how-to-play`, `parts`, `products`, `blades`, `ratchets`, `bits`, `cx-parts`

เหตุผล: เป็นหน้า static ใน `app/wiki/` — static ชนะ dynamic → บทความที่ slug ชนจะถูกบังและเข้าไม่ถึง

## 3. API ของ admin

| เมธอด | path | หมายเหตุ |
| --- | --- | --- |
| GET | `/api/admin/wiki` | รายการทั้งหมด (รวม draft) |
| POST | `/api/admin/wiki` | สร้างบทความใหม่ · 201 · 409 ถ้า slug ซ้ำ · 400 ถ้า validation ไม่ผ่าน |
| PATCH | `/api/admin/wiki/{id}` | แก้ไข (partial) |
| DELETE | `/api/admin/wiki/{id}` | ลบ |

ทุก handler ต้องเรียก `isAdmin()` ก่อน (cookie `mbx_admin`) และคืน 401 ถ้าไม่ผ่าน

## 4. UI ฝั่ง admin

- หน้า: `app/admin/wiki/page.tsx` (RSC → redirect ไป `/admin/login` ถ้าไม่ได้ login) + `app/components/AdminWikiManager.tsx` (client)
- flow ของ client: `GET /api/admin/wiki` → แสดงรายการ · `POST`/`PATCH` ตามโหมด · `DELETE` เมื่อกดลบ · `PATCH` เปลี่ยน `status` เป็น published/draft
- login: `POST /api/admin/login` (รหัสผ่าน `ADMIN_PASSWORD`) → ตั้ง cookie `mbx_admin` (อายุ 12 ชม.)
- logout: `POST /api/admin/logout`

## 5. การแสดงผลฝั่ง public

- หน้า category (`app/wiki/blades/page.tsx` ฯลฯ) = หน้า static ที่อ่างข้อมูลจาก `app/lib/wiki.ts`
- บทความเดี่ยว: `app/wiki/[slug]/page.tsx` → `getPublishedArticleBySlug(slug)` → ถ้าไม่พบหรือยังไม่ published → `notFound()`
- หน้า category ด้านบน + รายการบทความเผยแพร่แล้วใช้ `listPublishedArticles()`
- Markdown render: `app/wiki/markdown.tsx` — ใช้ `react-markdown` + `remark-gfm` พร้อม component map ธีมมืด (h1–h4, p, a, ul/ol/li, blockquote, pre/code, table, hr, strong, img)
  - รูปในบทความใช้ `<img>` ธรรมดา (มี eslint-disable) — ถ้าต้องการ `next/image` ให้แก้ที่ markdown.tsx
- `export const dynamic = 'force-dynamic'` อยู่ในหน้าที่อ่าน DB — อย่าลบ

## 6. ขั้นตอนเพิ่มบทความ

1. ตัดสินใจ: เนื้อหาเป็นบทความ (dynamic, มี slug) หรือเป็นหน้าหมวดถาวร (static)
   - ถ้าเป็นหมวดถาวร → เพิ่มไฟล์ใน `app/wiki/<หมวด>/page.tsx` + ลงทะเบียนใน `app/lib/wiki-categories.ts`
2. เขียน slug ตาม regex และเช็คไม่ชนกับรายการสงวน
3. เลือก `category` จาก enum, `status` = `draft` ก่อน (ตรวจเนื้อหาแล้วค่อย published)
4. สร้างผ่าน admin UI หรือ `POST /api/admin/wiki` พร้อม payload ที่ผ่าน `normalizeWikiInput`
5. เขียนเนื้อหา Markdown: หัวข้อใช้ `##`/`###` (h1 มีอยู่แล้วในหน้า) · ตารางใช้ syntax GFM · ลิงก์ภายนอกได้
6. ตรวจสอบ: เปิด `/wiki/<slug>` ต้องเห็นบทความ, ลิงก์/รูปต้องโหลดได้, `/wiki` แสดงบทความในหมวดถูกต้อง

## 7. ข้อควรระวัง

- หน้า category ที่เป็น static จะไม่แสดงบทความใหม่จนกว่าจะเพิ่ม logic ดึงจาก DB ในหน้านั้น
- `coverImage` ที่เป็น URL ภายนอกจะถูก validate ด้วย `asSafeUrl()` — ถ้าเป็น `javascript:` หรือ `//host` จะถูกปฏิเสธ
- เนื้อหาต้องเป็นภาษาไทย/อังกฤษที่ถูกต้อง ไม่มีการตรวจสอบความจริงอัตโนมัติ — ผู้ใช้เป็นผู้รับผิดชอบเนื้อหา
