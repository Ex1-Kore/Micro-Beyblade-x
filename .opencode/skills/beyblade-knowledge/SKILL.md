---
name: beyblade-knowledge
description: ความรู้ Beyblade X สำหรับสนทนากับผู้ใช้ — ระบบเกมและกติกาคะแนน, สายการเล่น 4 แบบ, ซีรีส์ BX/UX/CX, ชิ้นส่วนเด่นจาก parts-db, โมเดลฟิสิกส์จำลองของเว็บ, อภิธานศัพท์. ใช้เมื่อผู้ใช้พิมพ์ "x" เพื่อคุยเรื่องเบย์เบลด, ถามเรื่องคอมโบ/ชิ้นส่วน/กลยุทธ์/กติกา หรืออยากให้อธิบายฟิสิกส์ของเบย์เบลด — ไม่ใช่คำสั่งแก้โค้ด.
compatibility: ความรู้อ้างอิงจากข้อมูลในโปรเจกต์ Micro-Beyblade-x (parts-db, physics, wiki)
metadata:
  project: micro-beyblade-x
  scope: project
---

# Beyblade Knowledge — ความรู้สำหรับคุยเรื่องเบย์เบลด

สคิปต์นี้เป็น **research knowledge** สำหรับสนทนาเบย์เบลดกับผู้ใช้ (ผู้ใช้พิมพ์ **"x"** = เรียกคุยเรื่อง Beyblade ไม่ใช่คำสั่งโค้ด) เนื้อหาทั้งหมดดึงจากข้อมูลจริงในโปรเจกต์นี้ — ถ้าต้องการรายละเอียดระดับชิ้นส่วน ให้เปิดดูแหล่งข้อมูลจริงตามหัวข้อท้าย

## 1. ระบบเกม Beyblade X (Generations)

- Beyblade X คือเบย์เบลดรุ่นที่ 4 จาก Takara Tomy (ต่อจาก Original 1999 · Metal Fight 2008 · Burst 2015) เปิดตัว 15 ก.ค. 2023
- จุดเด่นคือ **X-Celerator Rail** — รางฟันเฟืองรอบขอบสนาม เมื่อ Bit (ที่มีฟันเฟือง) จับรางจะเร่งความเร็ว 2–3 เท่า → เกิด **X-Treme Dash**
- องค์ประกอบ: **Blade** (ชั้นบน จุดปะทะ) + **Ratchet** (ชั้นกลาง ล็อก+ความสูง) + **Bit** (แกนล่าง สัมผัสพื้น)
- ใช้สนาม **Xtreme Stadium เท่านั้น** — ห้ามใช้สนาม Burst/Metal Fight · Launcher เป็น String หรือ Winder

### วิธีชนะและคะแนน (กติกาที่เว็บนี้ใช้)

| Finish | คะแนน | เงื่อนไข |
| --- | --- | --- |
| X-Treme Finish | 2 | คู่แข่งหลุดออกทาง X-Celerator Rail |
| Over Finish | 1 | คู่แข่งกระเด็นออกนอกขอบสนาม |
| Spin Finish | 1 | คู่แข่งหมุนหยุดก่อน |
| Draw | 0 | หยุด/ออกพร้อมกัน → รีแมตช์ |

- ใครถึง **4 คะแนนก่อน ชนะแมตช์**
- **3on3 (Deck)**: เตรียม 3 เบย์ ปิดบังคู่แข่ง ใช้ตามลำดับ 1→2→3 · Blade/Ratchet/Bit ห้ามซ้ำกันใน 3 ลูก · ใคร 4 คะแนนก่อน หรือคะแนนมากกว่าเมื่อใช้เบย์ครบ 3 ลูก = ชนะ

## 2. สายการเล่น 4 แบบ (Types)

| สาย | เป้าหมาย | สูตรคอมโบ | ตัวอย่าง Meta ในโปรเจกต์ |
| --- | --- | --- | --- |
| ⚔ Attack | X-Treme/Over Finish ตั้งแต่ต้น | Blade ATK สูงหนัก + Ratchet แฉกน้อย (1–3) + Bit แรง (LF, GF, A) | Phoenix Wing 1-60 LF |
| 🌀 Stamina | ชนะด้วย Spin Finish | Blade k สูง (UX) + Ratchet แฉกมาก/ทรงกลม (9-60, 0-70) + Bit (B, O, FB) | Wizard Rod 9-60 B |
| 🛡 Defense | ดูดซับแรงให้คู่แข่ง Over เอง | Blade DEF สูง + Ratchet สูง (5-80) + Bit ปักหลัก (N, HN, UN) | Leon Crest 5-80 UN |
| ⚡ Balance | ยืดหยุ่นรับมือทุกสถานการณ์ (3on3) | Blade สมดุล + Ratchet กลาง (4-60, 5-60) + Bit (T, GP, TP) | Hells Scythe 4-60 GP |

- หมายเหตุ: เบย์ 1 ลูกอาจเป็นได้หลายสาย และ label ทางการอาจไม่ตรงประสิทธิภาพจริงเสมอ

## 3. ซีรีส์ BX / UX / CX

| ซีรีส์ | ชื่อเต็ม | Inertia Factor k | จุดเด่น | ข้อด้อย |
| --- | --- | --- | --- | --- |
| BX | Basic Line | 0.90–1.18 | หาง่าย ราคาถูก หลากหลาย | L ต่ำกว่า UX/CX |
| UX | Unique Line | 0.90–1.25 | มวลขอบนอกสูง → หมุนนานกว่า | หายากกว่า |
| CX | Custom Line | 1.20–1.28 | ถอดสลับ Sub-Blade ปรับ I ละเอียดสุด | ราคาสูง ชิ้นส่วนน้อย |

- **CX มี 2 ยุค**: Original 3-Piece (2025: Lock Chip + Main Blade + Assist Blade — เช่น Dran Brave, Wizard Arc) และ Expand 4-Piece (2026: + Metal Blade + Over Blade — เช่น Bahamut Blitz CX-13, Knight Fortress CX-14) เบลดเปล่าบางรุ่น ~40–43g
- ทำไม UX/CX หมุนนานกว่า: มวลกระจายออกขอบนอก → r² ใน I = ½·m·r²·k ใหญ่ขึ้น → L มากขึ้น (เหมือนล้อจักรยาน vs ลูกบอล)

## 4. ชิ้นส่วนเด่น (อ้างอิง parts-db ณ ปัจจุบัน)

⚠️ **สถิติ atk/def/sta/bst/speed เป็นสเกล 0–100 ที่โปรเจกต์ตั้งใจไว้ ไม่ใช่ค่าทางการ** — น้ำหนัก (กรัม) และชนิด bit เป็นค่าจริง เมื่อคุยให้แยกให้ชัด

**Blade สายโจมตี:** Dran Buster (UX, atk 98, One-Hit KO) · Phoenix Wing (BX, 38.5g, atk 92) · Impact Drake (UX, 38.2g, atk 92) · Tyranno Beat (UX, atk 90) · Dran Sword (BX, atk 85) · Cobalt Dragoon (BX, Left Spin, atk 90)

**Blade หมุนนาน:** Wizard Rod (UX, sta 98, k 1.22) · Silver Wolf (UX, sta 85, k 1.25 ขอบวงนอกหมุนอิสระ) · Wizard Arrow (BX, sta 85) · Whale Wave (BX, sta 82)

**Blade ป้องกัน:** Leon Crest (UX, def 95, 38.2g) · Knight Mail (UX, def 90) · Knight Shield (BX, def 85) · Golem Rock (UX, def 85)

**หนักสุดในชุด:** Clock Mirage 44.1g (หมุนสวนทาง) · Bullet Griffon 40.0g · Scorpio Spear 39.7g · Phoenix Wing 38.5g

**Bit เด่น:** GF (Gear Flat, speed 100 เร็วสุด) · LF (Low Flat, 95) · MN (Metal Needle, def 38) · UN (Under Needle, def 35) · B/O/FB (Stamina ยอดนิยม) · GP (Gear Point, burstResist 3)

**Ratchet เด่น:** 3-60 (ยอดนิยม ทน Burst สมดุลทุกสาย) · 5-80 (Defense+Stamina) · 9-60/9-80 (Stamina Meta) · 0-70/0-80 (ทรงกลม ไม่มีแฉก Stamina+ทน Burst สูงสุด) · 1-60/1-80 (Attack เสี่ยง Burst สูง)

**Sub-Blade CX:** S60 (Slash +atk) · R55 (Round +def) · B80 (Balanced สมดุล)

## 5. โมเดลฟิสิกส์ของเว็บ (`app/lib/physics.ts`)

หน่วย SI ทั้งหมด · ค่าคงที่: `EFFECTIVE_RADIUS_M = 0.024` · `GRAVITY = 9.81` · `CONTACT_TIME_S = 0.01`

| ปริมาณ | สูตร |
| --- | --- |
| ความเร็วเชิงมุม | ω = 2π·RPM/60 |
| โมเมนต์ความเฉื่อย | I = ½·m·r²·k |
| โมเมนตัมเชิงมุม | L = I·ω |
| Spin-down Torque | τ = μ·m·g·r_bit |
| Decay RPM | α = τ/I → RPM/s = α·60/2π |
| แรงกระแทก | J = (m·v + L/r)·sin θ → F = J/Δt |
| เวลาหมุนโดยประมาณ | t = RPM / DecayRate |
| ความเสถียร | S = (m·r)/h × 1000 |
| Burst Risk | R = (sides×1.1) + ((h_mm×10 − 60)×0.05) − (burstResist×0.8) · หนัก >65g ลด 0.5 |

- **μ ตามสาย Bit**: Attack 0.18 · Balance 0.12 · Defense 0.08 · Stamina 0.05 → Ball หมุนนานกว่า Flat ~3.6 เท่า
- **รัศมี Bit (r_bit)**: Attack 3.5mm · Balance 2.5mm · Defense 2.0mm · Stamina 1.5mm
- **RPM Band**: ต่ำ <4,000 (แกว่งง่าย) · เหมาะสม 4,000–6,500 (สมดุลที่สุด) · extreme >6,500 (แรงมหาศาลแต่ decay เร็ว)
- **Burst Risk**: R ≤ 3.0 = Low · 3.0–6.0 = Moderate · > 6.0 = High — แฉกเยอะ = เสี่ยงขึ้น, burstResist สูง = ปลอดภัยขึ้น
- ตัวอย่างจาก wiki: Phoenix Wing 38.5g ที่ 5,500 RPM → L ≈ 0.0139 kg·m²/s · คอมโบ 46g มุม 45° → F ≈ 22.9 N · Wizard Rod 9-60 B → t ≈ 26 วิ (ประมาณการ)

## 6. กลยุทธ์และเทคนิค

- **มุมปะทะ θ**: 90° แรงเต็ม 100% แต่ Burst มาก · 45° ≈ 70.7% สมดุลที่สุด · 15° ≈ 25.9% เหมาะสวนสาย Stamina
- Attack: ดึง String แรง+เร็ว, ฝึกมุมชู๊ตให้ลงราง X-Celerator → X-Treme Finish
- Stamina: ปักหลักกลางสนาม (bit รัศมีแคบ → τ ต่ำ → L อยู่นาน)
- 3on3: ควรมีครบทั้ง 3 สาย, ลำดับการใช้เบย์สำคัญ (Attack ก่อนถ้าต้องการ 2 คะแนนเร็ว)
- มือใหม่: เริ่มจาก BX-01 Dran Sword 3-60F (Starter มาตรฐาน)

## 7. อภิธานศัพท์ (Glossary)

Angular Momentum (L) = ความ "ดื้อ" ในการหมุน · Moment of Inertia (I) = การกระจายมวลรอบแกน · Spin-down Torque (τ) = ทอร์กเบรกจากแรงเสียดทาน Bit-พื้น · X-Celerator Rail = รางเร่งความเร็ว · Over Finish = กระเด็นออกขอบ · X-Treme Finish = ออกทางราง ได้ 2 แต้ม · Inertia Factor (k) = ค่าปรับ I ตามดีไซน์เบลด · Burst Risk Score (R) = คะแนนเสี่ยงหลุดล็อก

## 8. แหล่งข้อมูลจริงในโปรเจกต์ (เปิดดูเมื่อต้องการรายละเอียด)

| แหล่ง | มีอะไร |
| --- | --- |
| `app/lib/parts-db.ts` | ชิ้นส่วนครบ 196 รายการ (BX 36 · UX 29 · CX 34 · Sub 3 · Ratchet 38 · Bit 56) พร้อมน้ำหนัก/สถิติ/desc — อ้าง Beyblade X Wiki |
| `app/lib/physics.ts` | สูตรฟิสิกส์ฉบับเต็ม + ค่าคงที่ |
| `app/wiki/mechanics/page.tsx` | ตารางสูตร + ตัวอย่างคำนวณ + burst risk |
| `app/wiki/system/page.tsx` | ระบบเกม + ตาราง BX/UX/CX |
| `app/wiki/strategy/page.tsx` | 4 สาย + meta combos |
| `app/wiki/how-to-play/page.tsx` | กติกาเต็ม 1v1/3on3 + เทคนิค |
| `app/wiki/glossary/page.tsx` | ศัพท์ |
| `public/data/beybuilder-parts.json` | ข้อมูลอ้างอิง 275 รายการ (BeyBuilderX, GPL-2.0) |

## 9. ข้อควรระวังเมื่อสนทนา

- **ห้ามเดาสถิติ** — ชิ้นส่วนบางรายการมีเครื่องหมาย ⚠️ "ยังไม่มีสถิติตรวจสอบ" ใน desc (เช่น 1-70, 4-50, FF, GR) อย่าอ้างค่า 0 เป็นค่าจริง และอย่าเติมตัวเลขเอง
- สถิติเกม 0–100 = ของโปรเจกต์นี้ ไม่ใช่ค่าทางการของ Takara Tomy — ให้บอกผู้ใช้แบบนี้เมื่อถูกถาม
- ถ้าผู้ใช้ถามเรื่องชิ้นส่วนที่ไม่มีใน parts-db (เช่น DranStrike BX-49 ที่ยังไม่เพิ่ม) → บอกว่ายังไม่มีข้อมูลในระบบ อย่าเดา
- คุยเรื่องแก้โค้ด/เพิ่มชิ้นส่วน → ส่งต่อ skill `parts-data-sync` · เรื่องบทความวิกิ → `wiki-content`
