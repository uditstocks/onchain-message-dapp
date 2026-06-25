import React from "react";
import ReactDOM from "react-dom/client";
import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";
import App from "./App.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);
