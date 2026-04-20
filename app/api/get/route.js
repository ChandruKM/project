import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "db.json");

export async function GET() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ users: [], leaves: [] }));
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  return Response.json(data);
}