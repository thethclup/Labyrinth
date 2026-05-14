# Thread Labyrinth - Labyrinth Vert Orchestrator

**Thread Labyrinth** is a unique puzzle-adventure game powered by Base mainnet, integrating **ERC-8021** (Transaction Attribution) and **ERC-8004** (Trustless Agents). You weave paths, pull glowing threads, and navigate the void maze.

## AI Agent (Labyrinth Vert Orchestrator)

This project includes a fully compliant ERC-8004 Trustless Agent. The agent provides active command execution, labyrinth orchestration, and complex puzzle solving.

The Agent Identity config is located at:
- `/.well-known/agent-card.json`

## Active MCP API

This project also runs an Express-based Node server hosting the following AI endpoints:
- `GET /api/agent`: Provides basic state and version info for the Labyrinth Vert Orchestrator.
- `GET /api/mcp` and `POST /api/mcp`: A Model Context Protocol (MCP) server enabling active reasoning and pathfinding automations.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Web3**: Wagmi, Viem (Base Mainnet Integration)
- **Backend**: Node.js + Express (handling MCP standard interactions)
- **Graphics**: HTML5 Canvas with custom Node/Spring Physics Engine

## Setup & Running Locally

1. Create a `.env` based on `.env.example`. Be sure you **do not** commit private API keys.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server (which spins up the Express server with Vite middleware):
   ```bash
   npm run dev
   ```

*Sensitive data placeholders are used throughout the codebase logic. Adjust environmental variables appropriately for production deployments.*
