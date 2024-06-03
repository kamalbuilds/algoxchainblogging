'use client';

import { SolscribeIDL, getSolscribeProgramId } from '@solscribe/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useSolscribeProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getSolscribeProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = new Program(SolscribeIDL, programId, provider);

  const accounts = useQuery({
    queryKey: ['solscribe', 'all', { cluster }],
    queryFn: () => program.account.solscribe.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['solscribe', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ solscribe: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useSolscribeProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useSolscribeProgram();

  const accountQuery = useQuery({
    queryKey: ['solscribe', 'fetch', { cluster, account }],
    queryFn: () => program.account.solscribe.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['solscribe', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ solscribe: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['solscribe', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ solscribe: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['solscribe', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ solscribe: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['solscribe', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ solscribe: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
