import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Get all projects if no ID is provided
  const role = "user";
  const status = "pending";

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
