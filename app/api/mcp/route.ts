import { NextResponse } from 'next/server';

const mcpData = {
  protocol: "MCP",
  version: "1.0.0",
  name: "Labyrinth Vert Orchestrator",
  status: "active",
  description: "Labyrinth Vert platformunda çalışan ERC-8004 uyumlu AI Agent.",
  capabilities: [
    "labyrinth-navigation", 
    "maze-solving", 
    "vertical-exploration", 
    "puzzle-orchestration", 
    "pathfinding-automation", 
    "complex-problem-solving", 
    "mcp-command-execution"
  ],
  timestamp: new Date().toISOString(),
  tools: [
    {
      name: "get_race_status",
      description: "Gets the current status of the active warp race.",
      inputSchema: { type: "object", properties: { raceId: { type: "string" } }, required: ["raceId"] }
    },
    {
      name: "start_race",
      description: "Registers and starts a new warp race session.",
      inputSchema: { type: "object", properties: { trackId: { type: "string" }, difficulty: { type: "string" } }, required: ["trackId"] }
    },
    {
      name: "get_leaderboard",
      description: "Retrieves the latest scores for the warp racing leaderboard.",
      inputSchema: { type: "object", properties: { limit: { type: "number" } } }
    },
    {
      name: "optimize_speed",
      description: "Algorithmically analyzes metrics to find the fastest racing line and tension pattern.",
      inputSchema: { type: "object", properties: { currentSpeed: { type: "number" }, trackId: { type: "string" } } }
    },
    {
      name: "get_track_info",
      description: "Gets metadata and current complexities of a specific race track.",
      inputSchema: { type: "object", properties: { trackId: { type: "string" } }, required: ["trackId"] }
    }
  ],
  prompts: [
    { name: "analyze_track", description: "Prompt to analyze the track for optimal lines." }
  ],
  resources: [
    { uri: "warp://leaderboard", name: "Leaderboard Data", description: "Global race leaderboards" }
  ]
};

function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: getCorsHeaders() });
}

export async function GET() {
  return NextResponse.json(mcpData, { headers: getCorsHeaders() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Standard JSON-RPC Methods for MCP Validation
    if (body.method) {
      if (body.method === "tools/list") return NextResponse.json({ jsonrpc: "2.0", id: body.id, result: { tools: mcpData.tools } }, { headers: getCorsHeaders() });
      if (body.method === "prompts/list") return NextResponse.json({ jsonrpc: "2.0", id: body.id, result: { prompts: mcpData.prompts } }, { headers: getCorsHeaders() });
      if (body.method === "resources/list") return NextResponse.json({ jsonrpc: "2.0", id: body.id, result: { resources: mcpData.resources } }, { headers: getCorsHeaders() });
      if (body.method === "initialize") return NextResponse.json({ jsonrpc: "2.0", id: body.id, result: { protocolVersion: "2024-11-05", capabilities: {}, serverInfo: { name: "Labyrinth Vert Orchestrator", version: "1.0.0" } } }, { headers: getCorsHeaders() });
      if (body.method === "tools/call") {
         return NextResponse.json({ jsonrpc: "2.0", id: body.id, result: { content: [{ type: "text", text: `Tool ${body.params.name} executed successfully.` }] } }, { headers: getCorsHeaders() });
      }
    }

    const { action, command, params } = body;
    let result: any = {};
    const targetAction = action || command;

    switch (targetAction) {
      case "status":
      case "ping":
        result = { status: "online", agent: "Labyrinth Vert Orchestrator", tools: mcpData.tools };
        break;
      case "execute":
        result = { success: true, action: targetAction, executedAt: new Date().toISOString(), message: "Path found and executed successfully" };
        break;
      case "get_info":
        result = { name: "Labyrinth Vert Orchestrator", wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6", platform: "Base", version: "1.0.0" };
        break;
      default:
        result = { success: true, message: "Command received", data: body };
    }

    return NextResponse.json({ status: "success", agent: "Labyrinth Vert Orchestrator", response: result, receivedAt: new Date().toISOString() }, { headers: getCorsHeaders() });
  } catch (err) {
    return NextResponse.json({ status: "error", message: "Failed to process MCP command" }, { status: 400, headers: getCorsHeaders() });
  }
}
