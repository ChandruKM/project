import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "leaves.json");

// ✅ GET ALL LEAVES
export async function GET() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return Response.json(JSON.parse(data));
  } catch (err) {
    return Response.json([]);
  }
}

// ✅ SAVE NEW LEAVE
export async function POST(req) {
  const leave = await req.json();

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  data.push(leave);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return Response.json({ message: "Saved" });
}