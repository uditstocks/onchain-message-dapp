# On-Chain Message DApp

A minimal decentralized app: log in with your **p2p.me wallet** (via Privy's
cross-app / global-wallet flow) and save a personal message **on-chain**, tied to
your wallet address. Returning users see their saved message and can edit it.

- **Network:** Base Sepolia testnet (chainId `84532`)
- **Contract:** `MessageStore.sol` — one message per wallet, overwritten on edit
- **Frontend:** React (Vite) + `@privy-io/react-auth` + `ethers`

```
DApp/
├── contracts/MessageStore.sol   the smart contract
├── scripts/deploy.js            Hardhat deploy script
├── hardhat.config.js            Base Sepolia config
└── frontend/                    the React app
```

---

## 1. Deploy the contract

From the project root:

```bash
npm install
cp .env.example .env        # then fill in PRIVATE_KEY
npm run compile
npm run deploy
```

`.env` values:
- `PRIVATE_KEY` — a throwaway deployer key, funded with Base Sepolia ETH
  (faucet: https://www.alchemy.com/faucets/base-sepolia)
- `BASE_SEPOLIA_RPC_URL` — optional; defaults to `https://sepolia.base.org`

The deploy script prints the contract address. Copy it for the next step, and
optionally verify it at `https://sepolia.basescan.org/address/<address>`.

## 2. Run the frontend

```bash
cd frontend
npm install
cp .env.example .env        # then fill in the three values below
npm run dev
```

`frontend/.env` values:
- `VITE_PRIVY_APP_ID` — your own Privy app ID (free: https://dashboard.privy.io)
- `VITE_P2P_PROVIDER_APP_ID` — p2p.me's Privy provider app ID (their global /
  cross-app wallet). Obtain this from p2p.me / the Privy ecosystem listing; the
  "Login with p2p.me" button targets it.
- `VITE_CONTRACT_ADDRESS` — the address printed by `npm run deploy`

Open the local URL Vite prints.

## 3. Use it

1. Click **Login with p2p.me** and complete the Privy popup.
2. Type a message and click **Save on-chain**, then approve the p2p.me
   transaction popup. (The p2p.me wallet needs a little Base Sepolia ETH for gas.)
3. Reload and log in again — your message loads back from the chain.

You can also confirm it's on-chain via Basescan's **Read Contract** →
`getMessage(yourAddress)`.

---

### How the on-chain auth works

This app is a Privy **requester**: it doesn't host its own wallets. The
`loginWithCrossAppAccount({ providerAppId })` call authenticates the user's
existing **p2p.me** wallet, and `sendTransaction(...)` routes the contract write
through that wallet (p2p.me shows its own confirmation popup). The message is
stored against `msg.sender`, so a user can only ever change their own message.
