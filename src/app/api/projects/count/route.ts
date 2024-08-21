import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Get all projects if no ID is provided
  const project = db.prepare("SELECT COUNT(id) as count FROM projects").get();
  return NextResponse.json({
    code: 200,
    message: "",
    data: project,
  });
}
