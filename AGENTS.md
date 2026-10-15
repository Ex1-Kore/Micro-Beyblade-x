<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Micro-Beyblade-x — Project AGENTS.md

## Project Identity
- **Name:** Micro-Beyblade-x
- **Type:** Next.js 16 (App Router) + React 19 web app for Beyblade X combo building & physics simulation
- **Path:** `/home/devg/Ex1-Kore/Micro-Beyblade-x` (actual; older docs referenced `/home/neon13/workspace/services/next/03-GAMES/Micro-Beyblade-x`)
- **Package Manager:** pnpm (required)

## Tech Stack
- **Framework:** Next.js 16.2.11 with React 19 (App Router only)
- **Styling:** Tailwind CSS v4
- **Database:** SQLite (`prisma/dev.db`) via Prisma ORM 7.9.1 + `@prisma/adapter-libsql` + `@libsql/client`
- **Language:** TypeScript (strict)
- **Deployment:** Vercel (target)

## Directory Structure
```
Micro-Beyblade-x/
├── app/
│   ├── api/              # API routes (Server Actions preferred)
│   │   ├── combos/       # Saved combos endpoint
│   │   └── seed/         # DB seeding endpoint
│   ├── components/       # Reusable UI components
│   │   ├── AppHeader.tsx
│   │   ├── ArenaSimulator.tsx
│   │   ├── BeyCard.tsx
│   │   ├── ComboBuilder.tsx
│   │   ├── DeckBuilder.tsx
│   │   ├── PartsExplorer.tsx
│   │   └── PhysicsEvaluator.tsx
│   ├── lib/
│   │   ├── types.ts        # Core type definitions
│   │   ├── parts-db.ts     # Parts database (fallback; synced from repo 2026-10-16)
│   │   ├── physics.ts      # Physics evaluation logic
│   │   ├── prisma.ts       # Prisma client (libSQL adapter)
│   │   └── products.ts     # Product catalog refs
│   └── wiki/             # Wiki/knowledge base pages (RSC)
│       ├── bits/ blades/ ratchets/ cx-parts/ products/   # part knowledge
│       ├── glossary/ how-to-play/ mechanics/ strategy/ system/
│       └── components.tsx
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── dev.db            # Local SQLite database
├── public/               # Static assets (images for BX/UX/CX series)
│   ├── blade/{bx,ux,cx}/ # Blade images by series
│   └── data/beybuilder-parts.json  # Reference data (275 items)
├── scripts/              # Utility scripts
│   └── extract-beybuilder-parts.mjs
├── .agents/skills/beyblade-project-overview/  # Project skill
└── AGENTS.md             # This file
```

## Parts DB Counts (`app/lib/parts-db.ts`, as of 2026-10-16)
| Array | Count |
|-------|-------|
| `BX_BLADES` | 39 |
| `UX_BLADES` | 23 |
| `CX_BLADES` | 3 |
| `CX_SUBBLADES` | 3 |
| `RATCHETS` | 37 |
| `BITS` | 54 (Attack 18 / Stamina 11 / Defense 10 / Balance 15) |
| **Total** | **159** |

## Database Schema (prisma/schema.prisma)
| Model | Purpose |
|-------|---------|
| `Blade` | Base blade parts with stats: weight, atk, def, sta, bst |
| `Ratchet` | Ratchet parts with same stats |
| `Bit` | Bit parts with same stats |
| `SavedCombo` | User-saved combos (Blade+Ratchet+Bit) with physics snapshots (rpm, linearSpeed, impactForce, burstRiskLevel) |
| `WikiArticle` | Markdown articles for game mechanics, part knowledge, strategy |

## Core Features
1. **Combo Builder** — Build Beyblade X combinations from BX/UX/CX series parts
2. **Deck Builder** — Assemble 3-combo decks for tournament formats
3. **Physics Evaluator** — Calculate angular momentum, RPM, impact force, burst risk
4. **Wiki Knowledge Base** — Read articles on game mechanics and lore

## Development Commands
```bash
# Install deps
pnpm install

# Dev server
pnpm dev

# Build
pnpm build

# Type check (no `typecheck` script — run tsc directly)
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Prisma
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma studio
```

## Key Conventions
- **Server Components by default** — Use `'use client'` only when needed (interactivity, browser APIs)
- **Server Actions** for mutations — Prefer over API routes
- **Tailwind v4** — Use `@import "tailwindcss"` in globals.css, no config file needed
- **Prisma 7** — Use `@prisma/adapter-libsql` for libSQL/Turso compatibility
- **TypeScript strict** — No `any`, explicit return types for exported functions

## Environment Variables
- `DATABASE_URL` — `file:./dev.db` (local SQLite)
- No external services required for local dev

## Git / Remote (updated 2026-10-16)
- **Remote:** `origin` → `https://github.com/Insurgent-Dev/Micro-Beyblade-x.git`
- **Branch:** `main` tracks `origin/main`
- **Status:** split into feature iterations; HEAD `7a302ae` ("Update AGENTS.md"), working tree has uncommitted `app/lib/parts-db.ts` data sync
- **Note:** This is NOT a BACKUP FAMILY repo — global AGENTS.md rule #4 does not apply; `Insurgent-Dev` remote is the project's own remote

## Important Notes
- **No Python/Flask in this repo** (per global AGENTS.md rule #6)
- **Vercel deployment** — Ensure `output: 'standalone'` not used (App Router default)
- **Images** — Use `next/image` with local assets in `public/`
- **Wiki content** — Markdown files in `app/wiki/` or `WikiArticle` DB model

## Parts Data (updated 2026-10-16)
- `app/lib/parts-db.ts` synced against reference repo `/home/devg/docs-work/beyblade-x-repo` (commit `f45a760`, 10 ต.ค. 2026)
- Changed: 34 blade weights (BX 19 / UX 12 / CX 3), 16 ratchet weights, 10 bit type corrections + 54 bit weights; `BITS` regrouped Attack/Stamina/Defense/Balance; header comment 36→54
- Game-balance stats (atk/def/sta/speed/bst/burstResist, colors, desc, inertiaFactor) intentionally kept on the existing 0-100 scale — only real-world values (weight, bit type) were corrected
- Not yet added (need game stats, not guessed): DranStrike BX-49, HeavensRing BX-50, LusterDragoon BX-52, GloryValkyrie UX-20, HellsNether UX-21 + more CX

## Known Issues (deferred — 2026-10-08)
- **Blade images 404 (31/50):** code requests `/blade/<series>/<ShortName>.png` but files are named like `BL-PRD-*.png`; products.ts refs 6/11 missing; bits/ratchets OK; images live under `public/blade/{bx,ux,cx}/` plus loose files
- **Plan:** build admin/backend later for editing images + adding content (per พี่ฆัง)
- **Domains:** short `https://micro-beyblade-x.vercel.app` (200, public) vs team URL `...-insurgent-devs-projects.vercel.app` (302 SSO wall for anonymous)

## Related Skills
- `beyblade-project-overview` — Full project context (loaded)
- `nextjs` — Next.js App Router expert guidance
- `next-best-practices` — Upstream Next.js conventions
- `prisma-orm-v7-skills` — Prisma 7 breaking changes