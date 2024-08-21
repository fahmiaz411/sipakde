import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

const apiPassword =
  "$2a$10$l6KXCkYI3Ff1oBBmrQIxt.osY2BWMSoyC9mBcqEKlfg5XS47zQxaq";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const username_email = url.searchParams.get("username_email"); // Extract the id from the query parameters

  if (username_email) {
    // Find a single user by ID
    const user = db
      .prepare("SELECT * FROM users WHERE username = ? OR email = ?")
      .get(username_email, username_email);
    if (user) {
      return NextResponse.json({
        code: 200,
        message: "",
        data: user,
      });
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } else {
    // Get all users if no ID is provided
    const users = db.prepare("SELECT * FROM users").all();
    return NextResponse.json({
      code: 200,
      message: "",
      data: users,
    });
  }
}

// POST /api/users - Insert a new user
export async function POST(request: Request) {
  try {
    const api_pass = request.headers.get("password");
    if (!api_pass) {
      return NextResponse.json(
        { error: "Header password is required" },
        { status: 401 }
      );
    }

    const matched = await bcrypt.compare(api_pass, apiPassword);

    if (!matched) {
      return NextResponse.json(
        { error: "Invalid API password" },
        { status: 401 }
      );
    }

    const { username, email, name, role, password } = await request.json();

    if (!username || !email || !name || !role || !password) {
      return NextResponse.json(
        { error: "username, email, role, and password can't be empty" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertStmt = db.prepare(
      "INSERT INTO users (username, email, name, role, password) VALUES (?, ?, ?, ?, ?)"
    );
    const result = insertStmt.run(username, email, name, role, hashedPassword);

    const newUser = {
      id: result.lastInsertRowid,
      username,
      email,
      name,
      role,
    };

    return NextResponse.json(
      { message: "User added", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const password = request.headers.get("password");
  if (!password) {
    return NextResponse.json(
      { error: "Header password is required" },
      { status: 401 }
    );
  }

  const matched = await bcrypt.compare(password, apiPassword);

  if (!matched) {
    return NextResponse.json(
      { error: "Invalid API password" },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id"); // Extract the id from the query parameters

  if (id) {
    // Find a single user by ID
    const user = db.prepare("DELETE FROM users WHERE id = ?").run(id);
    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } else {
    // Get all users if no ID is provided
    const users = db.prepare("DELETE FROM users WHERE id > 0").run();
    return NextResponse.json(users);
  }
}
