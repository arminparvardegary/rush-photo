import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(filename: string) {
  const migrationPath = path.join(
    process.cwd(),
    "supabase",
    "migrations",
    filename
  );

  if (!fs.existsSync(migrationPath)) {
    console.error(`Migration file not found: ${migrationPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, "utf-8");

  console.log(`Running migration: ${filename}`);
  console.log("SQL:", sql.substring(0, 200) + "...");

  try {
    const { error } = await supabase.rpc("exec_sql", { sql_query: sql });

    if (error) {
      console.error("Migration failed:", error);
      process.exit(1);
    }

    console.log("Migration completed successfully!");
  } catch (err: any) {
    console.error("Error running migration:", err.message);
    process.exit(1);
  }
}

const migrationFile = process.argv[2] || "20250203_payment_transactions.sql";
runMigration(migrationFile);
