import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const url = new URL(request.url);

  const status = url.searchParams.get("status");
  const document_id = url.searchParams.get("document_id");

  if (!status || !document_id) {
    return NextResponse.json(
      { error: "Missing status or document_id parameter" },
      { status: 400 }
    );
  }

  // Get all documents if no ID is provided
  const documents = db
    .prepare(
      `
         UPDATE documents SET status = ? WHERE id = ?
      `
    )
    .run(status, document_id);

  return NextResponse.json({
    code: 200,
    message: "",
    data: documents,
  });
}
