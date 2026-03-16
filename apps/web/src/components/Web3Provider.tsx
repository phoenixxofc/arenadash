'use client';
import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, WagmiProvider } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { http } from 'viem';
const config = createConfig({ chains: [polygon], transports: { [polygon.id]: http() } });
const queryClient = new QueryClient();
export default function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider appId="test-app-id" config={{ appearance: { theme: 'dark', accentColor: '#00F2FF' } }}>
      <WagmiProvider config={config}><QueryClientProvider client={queryClient}>{children}</QueryClientProvider></WagmiProvider>
    </PrivyProvider>
  );
}
