import express from "express";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

const mcpData = {
  protocol: "MCP",
  version: "1.0.0",
  name: "Labyrinth Vert MCP Endpoint",
  status: "active",
  description: "Active MCP server for Labyrinth Vert Orchestrator Agent",
  capabilities: ["labyrinth-navigation", "maze-solving"],
  timestamp: new Date().toISOString(),
  tools: [
    {
      name: "calculate_path",
      description: "Calculates the best resonance path through the labyrinth.",
      inputSchema: { type: "object", properties: { level: { type: "number" } } }
    },
    {
      name: "pull_thread",
      description: "Pulls a thread and checks stability.",
      inputSchema: { type: "object", properties: { tension: { type: "number" } } }
    }
  ],
  prompts: [
    { name: "solve_maze", description: "Prompt to solve the current maze level." }
  ],
  resources: [
    { uri: "labyrinth://state", name: "Labyrinth State", description: "Current tensions" }
  ]
};

app.get('/api/agent', (req, res) => {
  res.json({
    name: "Labyrinth Vert Orchestrator",
    status: "active",
    wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
    platform: "Labyrinth Vert",
    version: "1.0.0"
  });
});

app.get('/api/mcp', (req, res) => {
  res.json(mcpData);
});

app.post('/api/mcp', (req, res) => {
  try {
    const body = req.body;
    
    if (body.method) {
      if (body.method === "tools/list") return res.json({ jsonrpc: "2.0", id: body.id, result: { tools: mcpData.tools } });
      if (body.method === "prompts/list") return res.json({ jsonrpc: "2.0", id: body.id, result: { prompts: mcpData.prompts } });
      if (body.method === "resources/list") return res.json({ jsonrpc: "2.0", id: body.id, result: { resources: mcpData.resources } });
      if (body.method === "initialize") return res.json({ jsonrpc: "2.0", id: body.id, result: { protocolVersion: "2024-11-05", capabilities: {}, serverInfo: { name: "Labyrinth", version: "1.0" } } });
    }

    const { action, command, params } = body;
    let result: {} = {};
    const targetAction = action || command;

    switch (targetAction) {
      case "status":
      case "ping":
        result = { status: "online", agent: "Labyrinth Vert Orchestrator", tools: mcpData.tools };
        break;
      case "execute":
        result = { success: true, action: targetAction, executedAt: new Date().toISOString() };
        break;
      case "get_info":
        result = { name: "Labyrinth", wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6" };
        break;
      default:
        result = { success: true, data: body };
    }

    res.json({ status: "success", agent: "Labyrinth Vert Orchestrator", response: result });
  } catch (err) {
    res.status(400).json({ status: "error", message: "Failed to process MCP command" });
  }
});

export default app;
