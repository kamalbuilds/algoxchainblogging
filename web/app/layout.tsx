"use client";
import './global.css';
import { UiLayout } from '@/components/ui/ui-layout';
import { ClusterProvider } from '@/components/cluster/cluster-data-access';
import { SolanaProvider } from '@/components/solana/solana-provider';
import { ReactQueryProvider } from './react-query-provider';
import { WalletProvider, useInitializeProviders, PROVIDER_ID } from '@txnlab/use-wallet';
import algosdk from 'algosdk';
import { PeraWalletConnect } from '@perawallet/connect';
import { DaffiWalletConnect } from '@daffiwallet/connect';
import { ChakraProvider } from '@chakra-ui/react';

const links: { label: string; path: string }[] = [
  { label: 'Account', path: '/account' },
  { label: 'Clusters', path: '/clusters' },
  { label: 'Solquill Program', path: '/solscribe' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const walletProviders = useInitializeProviders({
    providers: [
      { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
      { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
      { id: PROVIDER_ID.EXODUS },
    ],
    nodeConfig: {
      network: 'testnet',
      nodeServer: 'https://testnet-api.algonode.cloud',
      nodeToken: '',
      nodePort: '443'
    },
    algosdkStatic: algosdk,
    debug: true
  })

  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ChakraProvider>
          <ClusterProvider>
          <WalletProvider value={walletProviders}>
            <SolanaProvider>
              <UiLayout links={links}>
                {children}
                </UiLayout>
            </SolanaProvider>
            </WalletProvider>
          </ClusterProvider>
          </ChakraProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
