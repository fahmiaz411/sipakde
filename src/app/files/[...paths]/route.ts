import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import mime from "mime-types";

type Params = {
  paths: string[];
};

export async function GET(request: Request, context: { params: Params }) {
  const paths = context.params.paths; // '1'
  // Construct the file path based on the request
  const filePath = path.join(process.cwd(), "public/storage", ...paths);

  const mimeType = mime.lookup(filePath);

  try {
    // Check if the file exists
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
      const fileContent = fs.readFileSync(filePath);
      return new NextResponse(fileContent, {
        status: 200,
        headers: { "Content-Type": mimeType as string },
      });
    } else {
      return new NextResponse("File not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Define params type according to your route parameters (see table below)
