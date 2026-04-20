import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "approvedLeaves.json");

// GET
export async function GET() {
  const data = fs.readFileSync(filePath, "utf-8");
  return Response.json(JSON.parse(data));
}

// POST
export async function POST(req) {
  const leave = await req.json();

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  data.push(leave);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return Response.json({ message: "Saved" });
}