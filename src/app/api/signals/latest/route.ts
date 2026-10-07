import type { NextRequest } from "next/server";
import { boot, json, num } from "@/server/api";
import { latestSignals, toPublic } from "@/server/repo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const err = await boot();
  if (err) return err;
  const limit = num(req.nextUrl.searchParams.get("limit"), 15, 1, 100);
  try {
    const rows = await latestSignals(limit);
    return json({ items: rows.map(toPublic) });
  } catch {
    return json({ error: "database_unavailable" }, 503);
  }
}
