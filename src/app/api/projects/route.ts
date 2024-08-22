import db from "@/lib/db";
import fs from "fs";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const user_id = parseInt(form.get("user_id") as string);
    const name = form.get("name");
    const pdf = form.get("pdf") as File;

    if (!user_id || !name || !pdf) {
      return NextResponse.json(
        { error: "user_id, name, and pdf can't be empty" },
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

    const date = new Date().toISOString();

    const insertStmt = db.prepare(
      "INSERT INTO projects (user_id, name, date, pdf) VALUES (?, ?, ?, ?)"
    );
    const result = insertStmt.run(user_id, name, date, pdfLink);

    const newProject = {
      id: result.lastInsertRowid,
      user_id,
      name,
      date,
      pdfLink,
    };

    return NextResponse.json(
      { message: "Project added", project: newProject },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add project" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Get all projects if no ID is provided
  const projects = db.prepare("SELECT * FROM projects ORDER BY id DESC").all();
  return NextResponse.json({
    code: 200,
    message: "",
    data: projects,
  });
}
