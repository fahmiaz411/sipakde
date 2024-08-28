import db from "@/lib/db";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { writeFile } from "fs/promises";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const filter = url.searchParams.get("filter");
  const type = url.searchParams.get("type");
  const user = url.searchParams.get("user");

  let queryWhere = "";
  let queries: string[] = [];
  let values: string[] = [];

  if (filter || type || user) {
    queryWhere += "WHERE ";
  }

  if (filter) {
    queries.push(`status = ?`);
    values.push(filter);
  }
  if (type) {
    queries.push(`type = ?`);
    values.push(type);
  }

  if (user) {
    queries.push(`sender_id = ?`);
    values.push(user);
  }

  if (queries.length > 0) {
    queryWhere += queries.join(" AND ");
  }

  // Get all documents if no ID is provided
  const documents = db
    .prepare(
      `
        SELECT 
            id, 
            status, 
            name, 
            description, 
            type, 
            project_id, 
            (SELECT name FROM projects WHERE id = d.project_id) as project_name,
            date,
            sender_id,
            (SELECT name FROM users WHERE id = d.sender_id) as sender,
            pdf
        FROM documents as d
        ${queryWhere}
        ORDER BY id DESC
    `
    )
    .all(...values);

  return NextResponse.json({
    code: 200,
    message: "",
    data: documents,
  });
}

export async function POST(req: Request, res: Response) {
  try {
    const form = await req.formData();

    const name = form.get("name");
    const description = form.get("description");
    const type = form.get("type");
    const project_id = parseInt(form.get("project_id") as string);
    const sender_id = parseInt(form.get("sender_id") as string);
    const pdf = form.get("pdf") as File;

    if (!name || !type || !project_id || !sender_id || !pdf) {
      return NextResponse.json(
        {
          error:
            "Field status, name, type, project_id, date, sender_id, pdf can't be empty",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await pdf.arrayBuffer());
    const filename = `${uuidv4()}${path.extname(pdf.name)}`;

    const filePath = path.join(process.cwd(), "public/storage");

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    await writeFile(path.join(filePath, filename), buffer);

    // Create the link to the uploaded file
    const pdfLink = `/files/${filename}`;

    const insertStmt = db.prepare(`
        INSERT INTO documents (
            status,
            name,
            description,
            type,
            project_id,
            date,
            sender_id,
            pdf
        ) VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )
    `);

    const status = "pending";
    const date = new Date().toISOString();

    const result = insertStmt.run(
      status,
      name,
      description || "",
      type,
      project_id,
      date,
      sender_id,
      pdfLink
    );

    const newDocument = {
      id: result.lastInsertRowid,
      status,
      name,
      description: description || "",
      type,
      project_id,
      date,
      sender_id,
      pdfLink,
    };

    return NextResponse.json(
      { message: "Document added", document: newDocument },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add document" },
      { status: 500 }
    );
  }
}
