import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "db.json");

export async function POST(req) {
  try {
    const body = await req.json();

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify({ users: [], leaves: [] }));
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // ✅ USER
    if (body.type === "user") {
      const exists = data.users.find(
        (u) => u.username === body.payload.username
      );

      if (exists) {
        return Response.json(
          { message: "User already exists" },
          { status: 400 }
        );
      }

      data.users.push(body.payload);
    }

    // ✅ LEAVE (ADD / UPDATE / DELETE)
    if (body.type === "leave") {

      // 🔹 DELETE
      if (body.action === "delete") {
        data.leaves = data.leaves.filter(
          (l) => l.id !== body.payload.id
        );
      }

      // 🔹 UPDATE
      else if (body.action === "update") {
        data.leaves = data.leaves.map((l) =>
          l.id === body.payload.id ? body.payload : l
        );
      }

      // 🔹 ADD
      else {
        data.leaves.push(body.payload);
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return Response.json({ message: "Saved successfully" });

  } catch (error) {
    return Response.json({ error: "Error" }, { status: 500 });
  }
}