import './global.css';
import { UiLayout } from '@/components/ui/ui-layout';
import { ClusterProvider } from '@/components/cluster/cluster-data-access';
import { SolanaProvider } from '@/components/solana/solana-provider';
import { ReactQueryProvider } from './react-query-provider';

export const metadata = {
  title: 'SolQuill',
  description: 'Decentralised Blog Publishing platform on Solana',
};

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


  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ClusterProvider>
            <SolanaProvider>
              <UiLayout links={links}>
                {children}
                </UiLayout>
            </SolanaProvider>
          </ClusterProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
