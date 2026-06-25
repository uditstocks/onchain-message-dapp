// Deployed MessageStore address (set in frontend/.env after `npm run deploy`).
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Base Sepolia testnet.
export const CHAIN_ID = 84532;
export const RPC_URL = "https://sepolia.base.org";

// Minimal ABI: just the functions and event the frontend uses.
export const CONTRACT_ABI = [
  "function setMessage(string message) external",
  "function getMessage(address user) external view returns (string)",
  "event MessageSet(address indexed user, string message)",
];
