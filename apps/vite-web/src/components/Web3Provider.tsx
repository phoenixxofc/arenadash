"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, WagmiProvider } from "wagmi";
import { polygon } from "wagmi/chains";
import { http } from "viem";

const queryClient = new QueryClient();

// Wagmi config for Polygon chain
const config = createConfig({
	chains: [polygon],
	transports: {
		[polygon.id]: http(),
	},
});

import { PrivyProvider } from "@privy-io/react-auth";

// Toggle Web3 / Privy for local development
// Set VITE_ENABLE_PRIVY=false to skip Privy
const ENABLE_PRIVY = import.meta.env.VITE_ENABLE_PRIVY === "true";

interface Web3ProviderProps {
	children: React.ReactNode;
}

// Optional mock Privy wrapper for local dev
const PrivyWrapper = ({ children }: { children: React.ReactNode }) => {
	if (!ENABLE_PRIVY) return <>{children}</>; // skip Privy in dev
	// Only include Privy when enabled with a valid app ID
	return (
		<PrivyProvider
			appId={import.meta.env.VITE_PRIVY_APP_ID!} // use a valid ID in production
			config={{ appearance: { theme: "dark", accentColor: "#00F2FF" } }}
		>
			{children}
		</PrivyProvider>
	);
};

export default function Web3Provider({ children }: Web3ProviderProps) {
	return (
		<PrivyWrapper>
			<WagmiProvider config={config}>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</WagmiProvider>
		</PrivyWrapper>
	);
}
