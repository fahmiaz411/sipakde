import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Get all projects if no ID is provided
  const url = new URL(request.url);

  const role = url.searchParams.get("role");
  const status = url.searchParams.get("status");

  if (!role || !status) {
    return NextResponse.json(
      { error: "Missing role or status parameter" },
      { status: 400 }
    );
  }

  const dashboard = db
    .prepare(
      `SELECT 
        (SELECT COUNT(*) FROM users WHERE role = ?) as districts,
        (SELECT COUNT(*) FROM projects) as projects, 
        (SELECT COUNT(*) FROM documents) as documents,
        (SELECT COUNT(*) FROM documents WHERE status = ?) as documents_pending
    `
    )
    .get(role, status);
  return NextResponse.json({
    code: 200,
    message: "",
    data: dashboard,
  });
}
