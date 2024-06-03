'use client';

import { WalletButton } from '../solana/solana-provider';
import * as React from 'react';
import { ReactNode, Suspense, useEffect, useRef } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AccountChecker } from '../account/account-ui';
import {
  ClusterChecker,
  ClusterUiSelect,
  ExplorerLink,
} from '../cluster/cluster-ui';
import toast, { Toaster } from 'react-hot-toast';
import { useUserData } from '@/lib/hooks';
import { UserContext } from '@/lib/context';
import Navbar from '../Navbar';


export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();
  const userData = useUserData();

  return (
    <>
      <UserContext.Provider value={userData}>
        <div className="h-full flex flex-col">
          <div className="navbar bg-base-300 text-neutral-content flex-col md:flex-row space-y-2 md:space-y-0">
            <div className="flex-1">
              <Link className="btn normal-case text-xl" href="/">
                <img
                  className="h-8 md:h-12"
                  alt="Solquill Logo"
                  src="/solquill.png"
                />
              </Link>
              <ul className="flex flex-1 flex-row gap-8 items-center p-0 space-x-2">
                {/* Dev Related Functions */}
                {/* <div className='flex flex-1 flex-row items-center '>
                  {links.map(({ label, path }) => (
                    <li key={path} className='flex-1 text-center justify-center hover:bg-gray-700 rounded-lg px-2 py-1'>
                      <Link
                        className={pathname.startsWith(path) ? 'active' : ''}
                        href={path}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </div> */}

                <Navbar />
              </ul>
            </div>
            <div className="flex-none space-x-2">
              <WalletButton />
              <ClusterUiSelect />
            </div>
          </div>
          <ClusterChecker>
            <AccountChecker />
          </ClusterChecker>
          <div className="flex-grow mx-4 lg:mx-auto">
            <Suspense
              fallback={
                <div className="text-center my-32">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              }
            >
              {children}
            </Suspense>
            <Toaster position="bottom-right" />
          </div>
        </div>
      </UserContext.Provider>
    </>
  );
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show, dialogRef]);

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button
                className="btn btn-xs lg:btn-md btn-primary"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? (
            <h1 className="text-5xl font-bold">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === 'string' ? (
            <p className="py-6">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return (
      str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
    );
  }
  return str;
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={'text-center'}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label={'View Transaction'}
          className="btn btn-xs btn-primary"
        />
      </div>
    );
  };
}
