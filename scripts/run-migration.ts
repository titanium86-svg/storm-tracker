/**
 * Chạy: npx tsx scripts/run-migration.ts
 * Cần env: DATABASE_URL=postgresql://postgres:[password]@db.dyugmgzkrvzbtygkgkod.supabase.co:5432/postgres
 */
import postgres from "postgres";
import { readFileSync } from "fs";
import { join } from "path";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ Thiếu DATABASE_URL. Export trước:\n  export DATABASE_URL=postgresql://postgres:[password]@db.dyugmgzkrvzbtygkgkod.supabase.co:5432/postgres");
  process.exit(1);
}

const sql = postgres(DATABASE_URL, { ssl: "require" });

async function main() {
  const migrationPath = join(process.cwd(), "supabase/migrations/0001_init.sql");
  const migration = readFileSync(migrationPath, "utf-8");

  console.log("🚀 Running migration 0001_init.sql...");
  try {
    await sql.unsafe(migration);
    console.log("✅ Migration thành công!");
  } catch (err) {
    if (err instanceof Error && err.message.includes("already exists")) {
      console.log("ℹ️  Tables đã tồn tại — skip.");
    } else {
      console.error("❌ Migration failed:", err);
      process.exit(1);
    }
  } finally {
    await sql.end();
  }
}

main();
