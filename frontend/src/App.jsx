import { useEffect, useState } from "react";
import { usePrivy, useCrossAppAccounts } from "@privy-io/react-auth";
import { ethers } from "ethers";
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  CHAIN_ID,
  RPC_URL,
} from "./contract";

const PROVIDER_APP_ID = import.meta.env.VITE_P2P_PROVIDER_APP_ID;

// Pull the p2p.me cross-app wallet address out of the logged-in user.
function getCrossAppAddress(user) {
  const account = user?.linkedAccounts?.find((a) => a.type === "cross_app");
  return account?.embeddedWallets?.[0]?.address ?? null;
}

export default function App() {
  const { ready, authenticated, user, logout } = usePrivy();
  const { loginWithCrossAppAccount, sendTransaction } = useCrossAppAccounts();

  const address = getCrossAppAddress(user);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  // Load the wallet's current on-chain message whenever we have an address.
  useEffect(() => {
    if (!address || !CONTRACT_ADDRESS) return;

    let cancelled = false;
    setLoading(true);
    setStatus("");

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    contract
      .getMessage(address)
      .then((value) => {
        if (!cancelled) setMessage(value);
      })
      .catch(() => {
        if (!cancelled) setStatus("Could not read your message from chain.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [address]);

  async function handleSave() {
    if (!address) return;
    setSaving(true);
    setStatus("Confirm the transaction in the p2p.me popup…");

    try {
      const data = new ethers.Interface(CONTRACT_ABI).encodeFunctionData(
        "setMessage",
        [message]
      );

      const txHash = await sendTransaction(
        { to: CONTRACT_ADDRESS, data, chainId: CHAIN_ID },
        { address }
      );

      setStatus("Saving on-chain… waiting for confirmation.");
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      await provider.waitForTransaction(txHash);
      setStatus("Saved on-chain ✓");
    } catch (err) {
      setStatus(err?.message || "Transaction failed.");
    } finally {
      setSaving(false);
    }
  }

  if (!ready) {
    return (
      <div className="page">
        <div className="card">Loading…</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <h1>On-Chain Message</h1>
        <p className="subtitle">
          Your message, stored on Base Sepolia and tied to your wallet.
        </p>

        {!authenticated ? (
          <button
            className="primary"
            onClick={() =>
              loginWithCrossAppAccount({ providerAppId: PROVIDER_APP_ID })
            }
          >
            Login with p2p.me
          </button>
        ) : (
          <>
            <div className="wallet">
              <span className="label">Wallet</span>
              <span className="address">{address || "—"}</span>
            </div>

            {!CONTRACT_ADDRESS && (
              <p className="status error">
                VITE_CONTRACT_ADDRESS is not set. Deploy the contract and add it
                to frontend/.env.
              </p>
            )}

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={loading ? "Loading your message…" : "Write your message…"}
              disabled={loading || saving}
              rows={4}
            />

            <button
              className="primary"
              onClick={handleSave}
              disabled={loading || saving || !CONTRACT_ADDRESS}
            >
              {saving ? "Saving…" : "Save on-chain"}
            </button>

            {status && <p className="status">{status}</p>}

            <button className="link" onClick={logout}>
              Log out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
