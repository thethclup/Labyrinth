# Labyrinth Vert Orchestrator

**Labyrinth Vert Orchestrator** is an ERC-8004 compliant Trustless AI Agent deployed on the Base mainnet. This active, high-performance orchestration agent is designed to navigate complex void mazes, find optimal dynamic paths, and orchestrate real-time warp racing mechanics and ecosystem coordination.

## Agent Capabilities

This agent handles real-time coordination within the ecosystem. Core proficiencies correspond directly to its registered skills:

*   **Warp Racing**: Real-time warp racing mechanics, speed optimization, and competitive track management.
*   **Multi-Track Orchestration**: Manage and synchronize multiple racing instances and tracks simultaneously.
*   **Performance Optimization**: Analyze and optimize racing performance, timing, and strategy.
*   **Real-Time Automation**: Automate in-game racing actions and decisions in real-time.
*   **Speed Optimization**: Algorithmically find the fastest pathways and racing lines.
*   **Ecosystem Coordination**: Coordinate with other agents and players in the Base ecosystem.

## Connect via Model Context Protocol (MCP)

This project relies on the **Model Context Protocol (MCP)**, providing programmatic App Router API routes for AI-to-AI interaction, tool utilization, and system analysis.

**Core Endpoints:**
*   **Primary MCP API**: `/api/mcp`
*   **Agent Identity/State API**: `/api/agent`
*   **Decentralized Registry File**: `/.well-known/agent-card.json`

The MCP setup exposes structured tools (e.g., `get_race_status`, `start_race`, `get_leaderboard`, `optimize_speed`, `get_track_info`) and prompts that external systems or local runtimes can interface with via standard JSON-RPC.

## Agent Registration

The agent's `.well-known/agent-card.json` heavily adheres to the **EIP-8004 Trustless Agent Specification v1**.
By accessing the A2A endpoint, platforms can discover our capabilities dynamically, retrieve validation endpoints, and operate alongside it in Base interactions utilizing the configured reputation trust system.

## Tech Stack & Architecture

*   **Network Target**: Base Mainnet
*   **Specification Codec**: EIP-8004 API Configuration
*   **Framework Interface**: Next.js App Router API Routes (`app/api/*`)
*   **Connectivity**: Native CORS integration enabling uninterrupted execution and external parsing.

## How to Run Locally

You can deploy and evaluate the agent locally to verify capabilities or adjust optimization parameters.

1.  **Install Project Dependencies:**
    ```bash
    npm install
    ```
2.  **Environment Variables:**
    Review configurations and copy `.env.example` as `.env`. Do NOT expose live secrets.
3.  **Spin Up Local Node Server:**
    ```bash
    npm run dev
    ```

*Note: All private wallet addresses, registries, and API keys are strictly excluded from this repository and must be secured at runtime.*
