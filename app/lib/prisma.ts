/**
 * Prisma Client singleton — ป้องกัน hot-reload สร้าง connection ใหม่ซ้ำซ้อน
 *
 * DB URL: ใช้ `DATABASE_URL` ถ้าตั้งไว้ (เช่น บน Coolify ชี้ไป volume ถาวร)
 * ถ้าไม่ตั้ง จะ fallback เป็น SQLite ในโฟลเดอร์โปรเจกต์ (โหมด dev)
 */
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql as PrismaLibSQL } from '@prisma/adapter-libsql';
import * as path from 'node:path';

const databaseUrl =
    process.env.DATABASE_URL ?? `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`;

const g = globalThis as unknown as { __prisma?: PrismaClient };

export const prisma: PrismaClient =
    g.__prisma ??
    new PrismaClient({
        adapter: new PrismaLibSQL({ url: databaseUrl }),
    } as ConstructorParameters<typeof PrismaClient>[0]);

if (process.env.NODE_ENV !== 'production') g.__prisma = prisma;

export default prisma;
