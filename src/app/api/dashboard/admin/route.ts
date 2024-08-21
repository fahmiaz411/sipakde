import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Get all projects if no ID is provided
  const dashboard = db
    .prepare(
      `SELECT 
        (SELECT COUNT(id) FROM users WHERE role = 'user') as districts,
        (SELECT COUNT(id) FROM projects) as projects, 
        (SELECT COUNT(id) FROM documents) as documents,
        (SELECT COUNT(id) FROM documents WHERE status = 'pending') as documents_pending
    `
    )
    .get();
  return NextResponse.json({
    code: 200,
    message: "",
    data: dashboard,
  });
}
