import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Get all projects if no ID is provided
  const projects = db
    .prepare(
      `
        SELECT 
            id, 
            name, 
            (SELECT COUNT(*) FROM documents WHERE sender_id = u.id) as documents 
        FROM users as u WHERE role = 'user'
        ORDER BY id DESC`
    )
    .all();
  return NextResponse.json({
    code: 200,
    message: "",
    data: projects,
  });
}
