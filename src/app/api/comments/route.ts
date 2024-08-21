import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const documentId = url.searchParams.get("document_id");

  if (!documentId) {
    return NextResponse.json(
      { error: "Missing document_id parameter" },
      { status: 400 }
    );
  }

  // Get all comments
  const comments = db
    .prepare(
      `
          SELECT 
              id, 
              document_id, 
              comment, 
              sender_id, 
              sender_name, 
              (SELECT name FROM users WHERE id = c.sender_id) as original_sender_name,
              date
          FROM comments as c
          WHERE document_id = ?
          ORDER BY id DESC
      `
    )
    .all(documentId);

  return NextResponse.json({
    code: 200,
    message: "",
    data: comments,
  });
}

export async function POST(request: Request) {
  try {
    const { document_id, comment, sender_id, sender_name } =
      await request.json();

    if (!document_id || !comment || !sender_id || !sender_name) {
      return NextResponse.json(
        {
          error: "document_id, comment, sender_id, sender_name can't be empty",
        },
        { status: 400 }
      );
    }

    const date = new Date().toISOString();

    const insertStmt = db.prepare(
      "INSERT INTO comments (document_id, comment, sender_id, sender_name, date) VALUES (?, ?, ?, ?, ?)"
    );
    const result = insertStmt.run(
      document_id,
      comment,
      sender_id,
      sender_name,
      date
    );

    const newProject = {
      id: result.lastInsertRowid,
      document_id,
      comment,
      sender_id,
      sender_name,
      date,
    };

    return NextResponse.json(
      { message: "Comment added", project: newProject },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
