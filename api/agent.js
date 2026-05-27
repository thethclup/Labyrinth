export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const agentData = {
    name: "Labyrinth Vert Orchestrator",
    status: "active",
    wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
    platform: "Labyrinth Vert",
    version: "1.0.0"
  };

  if (req.method === "GET") {
    return res.status(200).json(agentData);
  }

  if (req.method === "POST") {
    return res.status(200).json({ ...agentData, received: true });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
