import { NextResponse } from 'next/server';

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
  return NextResponse.json({
    name: "Labyrinth Vert Orchestrator",
    status: "active",
    wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
    platform: "Labyrinth Vert",
    version: "1.0.0"
  }, { headers: getCorsHeaders() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      name: "Labyrinth Vert Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Labyrinth Vert",
      version: "1.0.0",
      received: typeof body !== "undefined",
    }, { headers: getCorsHeaders() });
  } catch (e) {
    return NextResponse.json({
      name: "Labyrinth Vert Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Labyrinth Vert",
      version: "1.0.0",
      error: "Could not parse body"
    }, { headers: getCorsHeaders() });
  }
}
