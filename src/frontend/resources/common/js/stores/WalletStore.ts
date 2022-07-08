import { makeAutoObservable, makeObservable, observable } from 'mobx';
import { KeplrWallet } from 'cudosjs';
import Config from '../../../../../../builds/dev-generated/Config';

export default class WalletStore {

    keplrWallet: KeplrWallet;

    constructor() {
        this.keplrWallet = new KeplrWallet({
            CHAIN_ID: Config.CUDOS_NETWORK.CHAIN_ID,
            CHAIN_NAME: Config.CUDOS_NETWORK.CHAIN_NAME,
            RPC: Config.CUDOS_NETWORK.RPC,
            API: Config.CUDOS_NETWORK.API,
            STAKING: Config.CUDOS_NETWORK.STAKING,
            GAS_PRICE: Config.CUDOS_NETWORK.GAS_PRICE,
        });

        makeAutoObservable(this);
        makeObservable(this.keplrWallet, {
            'connected': observable,
            'accountAddress': observable,
        });
    }

    async connectKeplr(): Promise < void > {
        await this.keplrWallet.connect();
    }

    async disconnectKeplr(): Promise < void > {
        await this.keplrWallet.disconnect();
    }

    isKeplrConnected(): boolean {
        return this.keplrWallet.isConnected();
    }

    onClickToggleKeplr = async () => {
        if (this.isKeplrConnected() === true) {
            await this.disconnectKeplr();
        } else {
            await this.connectKeplr();
        }
    }

}
