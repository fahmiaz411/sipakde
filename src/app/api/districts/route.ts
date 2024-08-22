import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Get all projects if no ID is provided
  const url = new URL(request.url);

  const role = url.searchParams.get("role");

  if (!role) {
    return NextResponse.json(
      { error: "Missing role parameter" },
      { status: 400 }
    );
  }

  const projects = db
    .prepare(
      `
        SELECT 
            id, 
            name, 
            (SELECT COUNT(*) FROM documents WHERE sender_id = u.id) as documents 
        FROM users as u WHERE role = ?
        ORDER BY id DESC`
    )
    .all(role);
  return NextResponse.json({
    code: 200,
    message: "",
    data: projects,
  });
}
