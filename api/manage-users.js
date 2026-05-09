import crypto from "crypto";

const _REPO_RAW = process.env.GITHUB_REPO || "emerilansel-jpg/tenderstore-chatbot-demo";
const [OWNER, REPO] = _REPO_RAW.includes("/") ? _REPO_RAW.split("/") : [process.env.GITHUB_OWNER || "emerilansel-jpg", _REPO_RAW];
const TOKEN = process.env.GITHUB_TOKEN;
const FILE_PATH = "data/users.json";

// All fetches get an 8-second timeout so the function never hangs
async function fetchWithTimeout(url, opts = {}, ms = 8000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

// Read via authenticated GitHub API — avoids raw CDN IP blocks
async function readUsers() {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
  const res = await fetchWithTimeout(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github.v3+json"
    }
  });
  const data = await res.json();
  if (!data.content) {
    throw new Error("GitHub read failed (" + res.status + "): " + JSON.stringify(data).substring(0, 200));
  }
  return JSON.parse(Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8"));
}

// Get SHA (needed for PUT) — reuses readUsers call structure
async function getFileSha() {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
  const res = await fetchWithTimeout(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github.v3+json"
    }
  });
  const data = await res.json();
  if (!data.sha) throw new Error("Could not get SHA (" + res.status + "): " + JSON.stringify(data).substring(0, 200));
  return data.sha;
}

async function writeUsers(newContent) {
  const sha = await getFileSha();
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
  const res = await fetchWithTimeout(url, {
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

    // LIST
    if (action === "list") {
      const users = await readUsers();
      const sanitized = users.map(u => ({
        username: u.username,
        name: u.name,
        wa: u.wa,
        active: u.active,
        createdAt: u.createdAt
      }));
      return res.status(200).json(sanitized);
    }

    // AUTH
    if (action === "auth") {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ success: false, error: "Missing credentials" });
      const users = await readUsers();
      const hash = crypto.createHash("sha256").update(password).digest("hex");
      const user = users.find(u => u.username === username && u.password === hash && u.active);
      return res.status(200).json({ success: !!user, name: user ? user.name : null });
    }

    // ADD
    if (action === "add") {
      const { username, password, name, wa } = req.body;
      if (!username || !password || !name) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const users = await readUsers();
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
      await writeUsers(users);
      return res.status(200).json({ success: true });
    }

    // DEACTIVATE
    if (action === "deactivate") {
      const { username } = req.body;
      const users = await readUsers();
      const user = users.find(u => u.username === username);
      if (!user) return res.status(404).json({ error: "User not found" });
      user.active = false;
      await writeUsers(users);
      return res.status(200).json({ success: true });
    }

    // ACTIVATE
    if (action === "activate") {
      const { username } = req.body;
      const users = await readUsers();
      const user = users.find(u => u.username === username);
      if (!user) return res.status(404).json({ error: "User not found" });
      user.active = true;
      await writeUsers(users);
      return res.status(200).json({ success: true });
    }

    // DELETE
    if (action === "delete") {
      const { username } = req.body;
      const users = await readUsers();
      const idx = users.findIndex(u => u.username === username);
      if (idx === -1) return res.status(404).json({ error: "User not found" });
      users.splice(idx, 1);
      await writeUsers(users);
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: "Invalid action. Use: list, add, deactivate, activate, auth, delete" });

  } catch (err) {
    console.error("manage-users error:", err);
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
