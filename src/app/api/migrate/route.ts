import { execMigrations } from "@/lib/migrations";
import { NextResponse } from "next/server";

export async function GET() {
  execMigrations();
  return NextResponse.json({ code: 200, status: "OK" });
}
