import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Get all projects if no ID is provided
  db.pragma("cache_size = 0");

  const dashboard = db
    .prepare(
      `SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'user') as districts,
        (SELECT COUNT(*) FROM projects) as projects, 
        (SELECT COUNT(*) FROM documents) as documents,
        (SELECT COUNT(*) FROM documents WHERE status = 'pending') as documents_pending
    `
    )
    .get();
  return NextResponse.json({
    code: 200,
    message: "",
    data: dashboard,
  });
}
