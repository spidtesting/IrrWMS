#!/usr/bin/env node
/**
 * Validates DATABASE_URL and DIRECT_URL for IrrWMS / Supabase / Prisma.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadDotEnv() {
  const path = join(root, ".env");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadDotEnv();

const urls = [
  { name: "DATABASE_URL", value: process.env.DATABASE_URL },
  { name: "DIRECT_URL", value: process.env.DIRECT_URL },
];

let failed = false;

function check(name, raw) {
  if (!raw) {
    if (name === "DIRECT_URL") {
      console.log(`ℹ️  ${name} not set — migrations/seed will use DATABASE_URL`);
      return;
    }
    console.error(`❌ ${name} is not set`);
    failed = true;
    return;
  }

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    console.error(`❌ ${name}: invalid URL — ${parseUrlHint(raw)}`);
    failed = true;
    return;
  }

  if (parsed.protocol !== "postgresql:") {
    console.error(`❌ ${name}: protocol must be postgresql:// (got ${parsed.protocol})`);
    failed = true;
    return;
  }

  const port = parsed.port ? Number(parsed.port) : 5432;
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error(
      `❌ ${name}: invalid port "${parsed.port}" — often caused by unescaped @ or : in the password.`,
    );
    console.error("   URL-encode special characters (e.g. @ → %40, # → %23).");
    failed = true;
    return;
  }

  if (!parsed.hostname) {
    console.error(`❌ ${name}: missing hostname`);
    failed = true;
    return;
  }

  if (!parsed.pathname || parsed.pathname === "/") {
    console.warn(`⚠️  ${name}: no database name in path (use /postgres for Supabase)`);
  }

  const isPooler =
    port === 6543 ||
    raw.includes("pgbouncer=true") ||
    parsed.hostname.includes("pooler");

  console.log(`✅ ${name}`);
  console.log(`   host: ${parsed.hostname}:${port}`);
  console.log(`   database: ${parsed.pathname.replace(/^\//, "") || "(default)"}`);

  if (name === "DATABASE_URL" && isPooler) {
    console.warn(
      "⚠️  DATABASE_URL looks like a Supabase pooler URL (6543/pgbouncer).",
    );
    console.warn("   OK for serverless (Vercel). For migrate/seed, set DIRECT_URL to session mode (5432).");
  }

  if (name === "DIRECT_URL" && isPooler) {
    console.warn(
      "⚠️  DIRECT_URL should use Supabase session/direct mode (port 5432), not the transaction pooler (6543).",
    );
  }
}

function parseUrlHint(raw) {
  if (raw.includes("[") || raw.includes("]") || raw.includes("<")) {
    return "remove placeholder brackets from .env";
  }
  if ((raw.match(/@/g) || []).length > 1) {
    return "password may contain @ — encode as %40";
  }
  return "check quoting and special characters in password";
}

console.log("IrrWMS database URL check\n");
for (const { name, value } of urls) {
  check(name, value);
}

if (failed) {
  console.error("\nFix .env (see .env.example) then re-run: npm run db:check-url");
  process.exit(1);
}

console.log("\nAll checks passed.");
process.exit(0);
