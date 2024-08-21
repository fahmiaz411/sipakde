import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id"); // Extract the id from the query parameters

  if (!id) {
    return NextResponse.json(
      { error: "Missing id parameter" },
      { status: 400 }
    );
  }

  // Get all projects if no ID is provided
  const dashboard = db
    .prepare(
      `SELECT 
        (SELECT COUNT(id) FROM projects) as projects, 
        (SELECT COUNT(id) FROM documents WHERE sender_id = ?) as documents,
        (SELECT COUNT(id) FROM documents WHERE sender_id = ? AND status = 'pending') as documents_pending
    `
    )
    .get(id, id);
  return NextResponse.json({
    code: 200,
    message: "",
    data: dashboard,
  });
}
