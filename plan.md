# Plan — Micro-Beyblade-x

> **สถานะ: งานยังไม่สมบูรณ์ (Incomplete)** — อัปเดตล่าสุด: 2026-11-14
>
> ⚠️ **ข้อความสำคัญ:** ข้อมูลชิ้นส่วน (stats, น้ำหนัก, สถิติเกม ฯลฯ) บนเว็บ **เป็นข้อมูลที่จำลองขึ้น (simulated/mock)** เพื่อให้เว็บทำงานได้เท่านั้น ไม่ใช่ข้อมูลที่ถูกต้องตามข้อเท็จจริง (factual) ทั้งหมด — เราจะหาข้อมูลที่ถูกต้องมาปรับปรุงในภายหลัง

---

## เป้าหมาย (Goal)

ทำให้ข้อมูลบนเว็บ **ถูกต้องตามข้อเท็จจริงที่พิสูจน์ได้** (factual & verifiable) และ **เป็นมิตรกับ AI** (structured, accurate) เพื่อให้ AI search engine ค้นหาและอ้างอิงเว็บได้ง่ายขึ้น

**หลักการ:**
- ห้ามใช้ข้อมูลที่มโนขึ้น / เมคขึ้นโดยไม่มีข้อเท็จจริง
- ทุกค่าต้องมีแหล่งอ้างอิง (กล่องสินค้า, Beyblade X Wiki, ชั่งจริง)
- ถ้าไม่มีแหล่งอ้างอิง → แสดงเป็น "—" หรือ "ไม่ทราบ" แทนที่จะใช้ค่าเดา

---

## สิ่งที่ทำแล้ว (Completed)

- [x] จัดรูปสินค้า UX/CX เป็น name-centric (`public/products/{UX,CX}/<TTid>/`)
- [x] แก้ `parts-db.ts` ให้ตรงข้อเท็จจริง (BX 95→36, UX 31→29, CX 26→34, Ratchet 37→38, Bit 54→56)
- [x] ลบ `bst` (Burst) ที่ไม่มีข้อเท็จจริงออกทั้งหมด (schema, types, parts-db, seed, UI)
- [x] เพิ่ม `BLADE_ID_ALIASES` สำหรับ remap `SavedCombo` ก่อน prune
- [x] อัปเดต docs (AGENTS.md, README.md, skills) ให้ตรงกับโค้ด

---

## สิ่งที่ยังไม่สมบูรณ์ (Incomplete / Data Gaps)

### 🔴 สำคัญ (กระทบความน่าเชื่อถือ)

1. **atk/def/sta ของ Blade ทุกตัว** — ค่าที่มีอยู่เป็นค่าที่เราตั้งเอง (invented) ต้องตรวจสอบกับกล่อง
2. **atk/def/sta ของ Ratchet** — บางตัวมีค่าจาก BeyBase/Wiki บางตัวยังเป็น 0 (เช่น `5-50`)
3. **atk/def/sta ของ Bit** — ค่าที่มีอยู่เป็นค่าที่เราตั้งเอง ต้องตรวจสอบกับกล่อง/Wiki
4. **burstResist (0-100)** — ค่าปัจจุบันเป็น 1-3 (สเกลของเรา) ต้อง normalize เป็น 0-100 ตาม Wiki (`BurstResistanceStat`)

### 🟡 สำคัญปานกลาง

5. **น้ำหนัก** ของ CX blades 7 ตัว + M-65 + MO + MT (ยังเป็น 0)
6. **speed (X-Dash)** ของ Bit 18 ตัว (ยังเป็น 0)
7. **atk/def/sta** ของ CX blades 29 ตัว (ส่วนใหญ่เป็น 0)
8. **atk/def/sta** ของ UX blades 8 ตัว (HellsNether, GloryValkyrie, SeizeJaguar, CutterShinobi, RampartAegis, ValorBison, StunMedusa, HackViking)
9. **atk/def/sta** ของ BX blades 8 ตัว (KeelShark, TyrannoBeat, SavageBear, GoatTackle, DranStrike, RingAether, SuppressSuperion, PhoenixFeather)

### 🟢 ไม่เร่งด่วน

10. **inertiaFactor** ของ Blade — ไม่มีแหล่งอ้างอิงที่ชัดเจน
11. **color** (gradient) — UI only ไม่กระทบข้อมูล
12. **desc** (คำอธิบาย) — ควรตรวจสอบความถูกต้อง
13. **รูปเบลด 404** — `img: null` 40 รายการ (BX 1 · UX 10 · CX 29) ยังไม่ต่อสายเข้า `/products/<SERIES>/<id>/`

---

## สิ่งที่ต้องหาข้อมูล (Data Sources)

| ข้อมูล | แหล่งที่หาได้ |
| --- | --- |
| atk/def/sta (Blade/Ratchet/Bit) | กล่องสินค้า Beyblade X (มี ATK/DEF/STA บนกล่อง) |
| burstResist (0-100) | Beyblade X Wiki → `BurstResistanceStat` ของแต่ละ bit |
| speed (X-Dash) | กล่องสินค้า (ความเร็ว X-Dash) / Wiki (`DashStat`) |
| น้ำหนัก (กรัม) | กล่องสินค้า / Wiki (`Weight`) / ชั่งจริง |
| atk/def/sta (Ratchet) | กล่องสินค้า (บางตัวมี) / Wiki (`AttackStat/DefenseStat/StaminaStat`) |
| atk/def/sta (Bit) | กล่องสินค้า (ATK/DEF/STA) / Wiki (`AttackStat/DefenseStat/StaminaStat`) |

---

## วิธีที่พี่ฆังสามารถหาข้อมูลได้

1. **กล่องสินค้า (Beyblade X)** — ทุกกล่องมี ATK/DEF/STA บนกล่อง
2. **Beyblade X Wiki (fandom)** — `https://beyblade.fandom.com/wiki/` → ค้นหาชื่อชิ้นส่วน
3. **รีวิว YouTube/บล็อก** — บางรีวิวมีข้อมูลน้ำหนัก/สถิติ
4. **ชั่งจริง** — ใช้ตาชั่งดิจิทัล (0.01g)

---

## หลักการสำหรับข้อมูล (Data Principles)

1. **ห้ามใช้ข้อมูลที่มโนขึ้น / เมคขึ้น** — ทุกค่าต้องมีแหล่งอ้างอิง
2. **ถ้าไม่มีแหล่งอ้างอิง** → แสดงเป็น "—" หรือ "ไม่ทราบ" แทนที่จะใช้ค่าเดา
3. **ข้อมูลบนเว็บปัจจุบันเป็นข้อมูลที่จำลองขึ้น** เพื่อให้เว็บทำงานได้เท่านั้น
4. **เป้าหมาย:** ให้ข้อมูลถูกต้องตามข้อเท็จจริงที่พิสูจน์ได้ และเป็นมิตรกับ AI search engine
5. **สถิติเกม (atk/def/sta/bst/speed/burstResist/inertiaFactor/color)** เป็นสเกล 0-100 ที่ตั้งใจไว้ — ห้ามเดาค่าใหม่
6. **ค่าจริง (น้ำหนักกรัม, ความสูง mm, ชนิดของ bit)** แก้ได้เมื่อมีแหล่งอ้างอิง

---

## หมายเหตุ

- งานนี้ **ยังไม่สมบูรณ์** — ข้อมูลบนเว็บเป็นข้อมูลที่จำลองขึ้น (simulated/mock) เพื่อให้เว็บทำงานได้เท่านั้น
- เราจะหาข้อมูลที่ถูกต้องมาปรับปรุงในภายหลัง
- เมื่อพี่ฆังหามาให้ ฌอนจะอัปเดตข้อมูลและ seed DB ใหม่ทันที
- ไม่ควร push ไป `origin` / `ex1kore` / `gitea` จนกว่างานจะสมบูรณ์ (รอผู้ใช้สั่ง)