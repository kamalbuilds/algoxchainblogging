import { PROVIDER_ID, WalletClient, useWallet } from '@txnlab/use-wallet';
import React from 'react';

const WalletsModal = () => {
    const { providers, clients } = useWallet();

    const getClient = (id?: PROVIDER_ID): WalletClient => {
        if (!id) throw new Error('Provider ID is missing.');

        const walletClient = clients?.[id];
        if (!walletClient) throw new Error(`Client not found for ID: ${id}`);

        return walletClient;
    };

    return (
        <div className='px-2.5'>
            {providers?.map((provider) => {
                return (
                    <div
                        className='p-3.5 rounded-lg cursor-pointer hover:bg-gray-800'
                        onClick={provider.connect}
                        key={'provider-' + provider.metadata.id}
                    >
                        <div className='flex gap-4 items-center'>
                            <img className='rounded-lg' width={50} height={50} src={provider.metadata.icon} alt={provider.metadata.name} />
                            <div className='text-lg text-white'>
                                {provider.metadata.name} {provider.isActive && '[active]'}{' '}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default WalletsModal;
