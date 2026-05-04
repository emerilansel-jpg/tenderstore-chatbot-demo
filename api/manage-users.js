import crypto from "crypto";

const OWNER = process.env.GITHUB_OWNER;
const REPO  = process.env.GITHUB_REPO;
const TOKEN = process.env.GITHUB_TOKEN;
const FILE_PATH = "data/users.json";

async function getFile() {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github.v3+json"
    }
  });
  const data = await res.json();
  const content = JSON.parse(Buffer.from(data.content, "base64").toString("utf-8"));
  return { sha: data.sha, content };
}

async function updateFile(newContent, sha) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Update users list",
      content: Buffer.from(JSON.stringify(newContent, null, 2)).toString("base64"),
      sha
    })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(JSON.stringify(err));
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { action } = req.body;
    const { sha, content: users } = await getFile();

    // LIST
    if (action === "list") {
      const sanitized = users.map(u => ({
        username: u.username,
        name: u.name,
        wa: u.wa,
        active: u.active,
        createdAt: u.createdAt
      }));
      return res.status(200).json(sanitized);
    }

    // ADD
    if (action === "add") {
      const { username, password, name, wa } = req.body;
      if (!username || !password || !name) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: "Username already exists" });
      }
      const hash = crypto.createHash("sha256").update(password).digest("hex");
      users.push({
        username,
        password: hash,
        name,
        wa: wa || "",
        active: true,
        createdAt: new Date().toISOString().split("T")[0]
      });
      await updateFile(users, sha);
      return res.status(200).json({ success: true });
    }

    // DEACTIVATE
    if (action === "deactivate") {
      const { username } = req.body;
      const user = users.find(u => u.username === username);
      if (!user) return res.status(404).json({ error: "User not found" });
      user.active = false;
      await updateFile(users, sha);
      return res.status(200).json({ success: true });
    }

    // ACTIVATE
    if (action === "activate") {
      const { username } = req.body;
      const user = users.find(u => u.username === username);
      if (!user) return res.status(404).json({ error: "User not found" });
      user.active = true;
      await updateFile(users, sha);
      return res.status(200).json({ success: true });
    }

    // AUTH
    if (action === "auth") {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ success: false, error: "Missing credentials" });
      const hash = crypto.createHash("sha256").update(password).digest("hex");
      const user = users.find(u => u.username === username && u.password === hash && u.active);
      return res.status(200).json({ success: !!user, name: user ? user.name : null });
    }

    // DELETE
    if (action === "delete") {
      const { username } = req.body;
      const idx = users.findIndex(u => u.username === username);
      if (idx === -1) return res.status(404).json({ error: "User not found" });
      users.splice(idx, 1);
      await updateFile(users, sha);
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: "Invalid action. Use: list, add, deactivate, activate, auth, delete" });

  } catch (err) {
    console.error("manage-users error:", err);
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
