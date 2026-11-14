---
name: beyblade-project-overview
description: >-
  Provides a comprehensive overview of the Micro-Beyblade-x Next.js project, including tech stack, directory structure, schema, and core features.
---

# Micro-Beyblade-x Project Overview

This skill contains the foundational knowledge of the `Micro-Beyblade-x` project. Refer to this skill to understand the system structure before making architectural changes or interacting with the database.

## Tech Stack
- **Framework:** Next.js 16.2.11 with React 19 (App Router)
- **Styling:** Tailwind CSS v4
- **Database:** SQLite (`dev.db`) managed via Prisma ORM (`@prisma/client` 7.9.1) and queried with `@libsql/client` / `@prisma/adapter-libsql`.
- **Language:** TypeScript

## Directory Structure
- `app/`: Next.js App Router root.
  - `app/api/`: Backend API routes.
  - `app/components/`: Reusable UI components (e.g., `ComboBuilder`, `DeckBuilder`, `PhysicsEvaluator`, `BeyCard`).
  - `app/lib/`: Types (`types.ts`) and mock database logic (`parts-db.ts`).
  - `app/wiki/`: Wiki/knowledge base pages.
- `prisma/`: Prisma schema (`schema.prisma`) and local SQLite database.
- `public/`: Static assets (product images, ratchet icons, stadiums for BX/UX/CX series).
- `scripts/`: Utilities like data extraction scripts (`extract-beybuilder-parts.mjs`).

## Database Schema Highlights
The database schema (`schema.prisma`) is focused on Beyblade X parts and combinations:
- `Blade`, `Ratchet`, `Bit`: Base parts with stats like weight, atk, def, sta, bst.
- `SavedCombo`: User-saved combinations linking a Blade, Ratchet, and Bit. Contains physics snapshots (rpm, linearSpeed, impactForce, burstRiskLevel).
- `WikiArticle`: Markdown-based articles for game mechanics, part knowledge, and strategy.

## Core Features
1. **Combo Builder:** Build a Beyblade X combination using available parts (BX/UX/CX).
2. **Deck Builder:** Assemble a 3-combo deck for tournament formats.
3. **Physics Evaluator:** Calculates angular momentum, RPM, impact force, and burst risk for any given combo.
4. **Wiki Knowledge Base:** Read articles about game mechanics and lore.
