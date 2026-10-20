---
name: coolify-deploy
description: วิธี deploy/redeploy โปรเจกต์ Micro-Beyblade-x บน Coolify ที่เครื่อง server — endpoint ของ API, uuid ของ app/project, ค่าคอนฟิก nixpacks, volume ของฐานข้อมูล, gotchas ที่เคยทำให้ build หรือ 502 และขั้นตอนตรวจสอบหลัง deploy. ใช้เมื่อผู้ใช้สั่ง deploy, redeploy, ดูสถานะแอป, หรือแก้ปัญหาเว็บขึ้นไม่ได้บนเซิร์ฟเวอร์.
compatibility: ต้องอยู่บนเครื่อง server (hostname server, user devg) ที่รัน Coolify + Gitea
metadata:
  project: micro-beyblade-x
  scope: project
  owner: sv
---

# Coolify Deploy — Micro-Beyblade-x

การ deploy โปรเจกต์นี้ทำบน **Coolify บนเครื่อง `server`** (ไม่ใช่ Vercel) โดยดึงซอร์สจาก **Gitea**

## 1. ข้อมูลจริงของระบบ (ยืนยันจากเครื่อง 2026-10-20)

| รายการ | ค่า |
| --- | --- |
| Coolify dashboard | `http://192.168.1.200:8000` (container ฟัง 8080) |
| Coolify API base | `http://192.168.1.200:8000/api/v1` · health (ไม่ต้อง token): `/api/health` |
| Reverse proxy | Traefik (`coolify-proxy`) 80/443/8080 |
| Gitea | `http://192.168.1.200:3000` (จากใน Docker network ใช้ `http://10.0.0.1:3000`) |
| Application uuid | `4620e0iufu33l7rf9kvm8f8x` (ชื่อ `micro-beyblade-x`, project `Micro-Beyblade-x`, env `production`) |
| URL สาธารณะ | `http://micro-beyblade-x.192.168.1.200.sslip.io` |
| Build pack | `nixpacks` · `dockerfile = NULL` |
| Git repository | `http://10.0.0.1:3000/Ex1-Kore/Micro-Beyblade-x.git` · branch `main` |
| Port / base dir | `ports_exposes = 3000` · `base_directory = /` |
| Start command | `sh -c "pnpm exec prisma migrate deploy && pnpm start"` |
| Env ที่ตั้งไว้ | `DATABASE_URL` (→ volume `/app/data/dev.db`), `ADMIN_PASSWORD`, `ADMIN_SECRET` |
| Volume | `/app/data` (docker volume ของแอป) — เก็บ SQLite ให้รอด redeploy |

## 2. กติกาก่อน deploy

1. **commit + push ไป Gitea ก่อนเสมอ** — Coolify ดึงจาก Gitea ไม่ได้ดึงจากเครื่อง workspace
   ```bash
   git push gitea main
   ```
2. กฎ push: remote `origin` (GitHub `Insurgent-Dev`) เป็นของทีม — **ให้พี่ตัดสินใจ push เอง** ไม่ push ให้โดยพลการ
3. ห้ามแก้ schema/โค้ดใน container ที่รันอยู่ — ทุกอย่างต้องมาจาก git
4. ถ้ามีการเปลี่ยน `prisma/schema.prisma` → `prisma migrate deploy` ใน start command จะรันให้อัตโนมัติ

## 3. ขั้นตอน deploy

```bash
# 1) ตรวจว่า commit ล่าสุดตรงกับ Gitea
git log --oneline -1
git ls-remote gitea refs/heads/main

# 2) push
git push gitea main

# 3) สั่ง deploy (วิธี API) — ต้องมี Bearer token
curl -X POST "http://192.168.1.200:8000/api/v1/applications/4620e0iufu33l7rf9kvm8f8x/start" \
  -H "Authorization: Bearer $COOLIFY_TOKEN" -H "Content-Type: application/json"

# 4) ดูสถานะ
curl "http://192.168.1.200:8000/api/v1/applications/4620e0iufu33l7rf9kvm8f8x" \
  -H "Authorization: Bearer $COOLIFY_TOKEN"
```

**วิธีทางเลือก (ไม่ต้องใช้ API):** เปิด `http://192.168.1.200:8000` → Projects → Micro-Beyblade-x → `micro-beyblade-x` → ปุ่ม **Deploy**

## 4. การหา/สร้าง API token

- สร้างที่ `http://192.168.1.200:8000` → **Keys & Tokens → API Tokens** → ตั้งชื่อ (เช่น `opencode-deploy`) → copy ค่า **ครั้งเดียว**
- ใช้เป็น `Authorization: Bearer <token>` — **ห้ามเขียน token ลงในไฟล์ใน repo หรือ AGENTS.md**
- เก็บ token ไว้ใน `~/.config/opencode/server.env` (นอก repo) หรือ environment variable ของเซสชัน

## 5. Gotchas ที่เคยเจอ (ต้องตรวจก่อน deploy)

| อาการ | สาเหตุ | วิธีแก้ |
| --- | --- | --- |
| build ล้ม `packages field missing or empty` | `pnpm-workspace.yaml` ขาด `packages:` | ต้องมี `packages: ['.']` + `allowBuilds` เป็น boolean |
| build ล้มเพราะ Prisma | nixpacks เลือก Node 18 | ต้องมี `.nvmrc` = `22` และ `engines.node >= 20.19` |
| 502 Bad Gateway | Traefik label ฝัง port 80 ทั้งที่แอปฟัง 3000 | ตั้ง `traefik.http.routers.<app>.loadbalancer.server.port=3000` + `caddy_0 {{upstreams 3000}}` |
| DB หายหลัง deploy | ไม่มี persistent volume | ต้อง mount `/app/data` และตั้ง `DATABASE_URL=file:/app/data/dev.db` |
| เข้า admin ไม่ได้ | cookie `secure` ตั้งตาม https แต่เสิร์ฟผ่าน http | ใช้ `x-forwarded-proto` (แก้แล้วใน `app/api/admin/login/route.ts`) |
| API ตอบ 403 | self-hosted Coolify ปิด API access | Settings → Advanced → API and MCP → **API access = Enabled** (+ Allowed API IPs ถ้าตั้ง) |
| API ตอบ 401 | ไม่มี/หมดอายุ token | สร้าง token ใหม่ที่ Keys & Tokens |

## 6. ตรวจสอบหลัง deploy (ต้องทำทุกครั้ง)

```bash
# 1) เว็บตอบกลับ
curl -s -o /dev/null -w "%{http_code}\n" http://micro-beyblade-x.192.168.1.200.sslip.io/

# 2) container ของแอปกำลังรันอยู่
docker ps -a --format '{{.Names}}\t{{.Status}}' | grep -i beyblade

# 3) ถ้าไม่ขึ้น — ดูสถานะในฐานข้อมูล Coolify
docker exec coolify-db psql -U coolify -d coolify -At -c \
  "select uuid||' | '||name||' | '||coalesce(fqdn,'-')||' | '||coalesce(git_branch,'-')||' | '||coalesce(build_pack,'-')||' | port='||coalesce(ports_exposes,'-')||' | start='||coalesce(start_command,'-') from applications where name ilike '%beyblade%';"

# 4) log ของ container
docker logs <container-name> --tail 100
```

> **สถานะ ณ 2026-10-20:** app row ยังอยู่ใน Coolify แต่ **container ไม่ได้รันอยู่** และ URL ตอบ `404` → ต้องสั่ง deploy ใหม่ (ขั้นตอนข้อ 3) แล้วตรวจซ้ำ

## 7. ถ้าต้องแก้ค่า app ใน Coolify

```bash
# ดูค่าปัจจุบัน (อ่านอย่างเดียว)
docker exec coolify-db psql -U coolify -d coolify -At -c \
  "select key||' = '||case when value is null or value='' then '(ว่าง)' else '(มีค่า)' end from environment_variables where resourceable_type='App\Models\Application' and resourceable_id=5 order by key;"
```

> ห้ามแก้ฐานข้อมูล Coolify ด้วย SQL โดยตรง เว้นแต่จำเป็นจริง — ให้แก้ผ่าน UI/API เพื่อให้ state สอดคล้อง

## 8. ขอบเขตที่ต้องถามผู้ใช้ก่อน

- push ไป GitHub `origin` → ถามก่อนเสมอ
- ลบ/สร้าง application, project, volume ใหม่ → ถามก่อน (เป็นการกระทบระบบร่วม)
- แก้ไฟล์อื่นนอกโปรเจกต์นี้บนเครื่อง server → ถามก่อน
