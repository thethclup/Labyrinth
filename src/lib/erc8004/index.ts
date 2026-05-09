/**
 * ERC-8004 Trustless Agents Utilities
 * Facilitates interaction with trustless agent contracts.
 */

import { Address } from 'viem';

export interface AgentConfig {
  agentAddress: Address;
  capabilities: string[];
}

export const AGENT_REGISTRY: Address = '0x0000000000000000000000000000000000000000'; // Placeholder

export function getAgentStatus(agentAddress: Address) {
  // Mock function to check agent status on-chain
  return {
    isActive: true,
    lastAction: Date.now(),
  };
}
