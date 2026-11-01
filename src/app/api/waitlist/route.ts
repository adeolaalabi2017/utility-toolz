import { NextResponse } from "next/server";

/**
 * The Pro waitlist is parked for a future update (see agent-ctx/future/pro-waitlist.md
 * for the full implementation). This endpoint is switched off until then; the
 * whole file can be deleted.
 */
export function POST() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
