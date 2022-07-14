import { makeObservable, observable } from 'mobx';
import Config from '../../../../../../builds/dev-generated/Config';
import NftApi from '../api/NftApi';
import InputStateHelper from '../helpers/InputStateHelper';
import NftModel from '../models/NftModel';
import S from '../utilities/Main';
import PopupStore from './PopupStore';
import WalletStore from './WalletStore';
import BigNumber from 'bignumber.js';

export default class PopupSendAsGiftStore extends PopupStore {

    static FIELDS: string[] = ['recipientAddress'];

    static STATUS_INIT: number = 1;
    static STATUS_PROCESSING: number = 2;
    static STATUS_DONE_SUCCESS: number = 3;
    static STATUS_DONE_ERROR: number = 4;

    @observable nftModel: NftModel;
    @observable recipientAddress: string;
    @observable status: number;
    @observable gasFee: number;
    @observable feeInUsd: number;
    @observable txHash: string;

    inputStateHelper: InputStateHelper;
    calculateFeeTimeout: NodeJS.Timeout;

    nftApi: NftApi;
    walletStore: WalletStore;

    constructor(walletStore: WalletStore, nftApi: NftApi) {
        super();
        this.nftModel = null;
        this.recipientAddress = S.Strings.EMPTY;
        this.status = PopupSendAsGiftStore.STATUS_INIT;
        this.gasFee = S.NOT_EXISTS;
        this.txHash = S.Strings.EMPTY;
        this.calculateFeeTimeout = null;

        this.nftApi = new NftApi();
        this.walletStore = walletStore;

        makeObservable(this);
    }

    isStatusInit(): boolean {
        return this.status === PopupSendAsGiftStore.STATUS_INIT;
    }

    isStatusProcessing(): boolean {
        return this.status === PopupSendAsGiftStore.STATUS_PROCESSING;
    }

    isStatusDoneSuccess(): boolean {
        return this.status === PopupSendAsGiftStore.STATUS_DONE_SUCCESS;
    }

    isStatusDoneError(): boolean {
        return this.status === PopupSendAsGiftStore.STATUS_DONE_ERROR;
    }

    isGasFeeCalculated(): boolean {
        return this.gasFee !== S.NOT_EXISTS;
    }

    markStatusInit() {
        this.status = PopupSendAsGiftStore.STATUS_INIT;
    }

    markStatusProcessing() {
        this.status = PopupSendAsGiftStore.STATUS_PROCESSING;
    }

    markStatusDoneSuccess() {
        this.status = PopupSendAsGiftStore.STATUS_DONE_SUCCESS;
    }

    markStatusDoneError() {
        this.status = PopupSendAsGiftStore.STATUS_DONE_ERROR;
    }

    showSignal(nftModel: NftModel) {
        this.nftModel = nftModel;
        this.recipientAddress = S.Strings.EMPTY;
        this.status = PopupSendAsGiftStore.STATUS_INIT;
        this.gasFee = S.NOT_EXISTS;
        this.inputStateHelper = new InputStateHelper(PopupSendAsGiftStore.FIELDS, (key, value) => {
            switch (key) {
                case PopupSendAsGiftStore.FIELDS[0]:
                    this.recipientAddress = value;
                    break;
                default:
            }
        });
        clearTimeout(this.calculateFeeTimeout);
        this.calculateFeeTimeout = setTimeout(() => {
            this.estimateFee();
        }, 2000);

        this.show();
    }

    hide = () => {
        super.hide();
        this.nftModel = null;
        this.recipientAddress = S.Strings.EMPTY;
        this.status = PopupSendAsGiftStore.STATUS_INIT;
        clearTimeout(this.calculateFeeTimeout);
    }

    async sendNft() {
        const { signer, sender, client } = await this.walletStore.getSignerData();

        this.txHash = await this.nftApi.sendNft(
            this.nftModel,
            this.recipientAddress,
            sender,
            client,
        );
    }

    async estimateFee() {
        try {
            const { signer, sender, client } = await this.walletStore.getSignerData();

            console.log(sender);
            const fee = await this.nftApi.estimateFeeSendNft(
                this.nftModel,
                sender,
                sender,
                client,
            );

            this.gasFee = Number((new BigNumber(fee.amount)).div(Config.CUDOS_NETWORK.DECIMAL_DIVIDER).toFixed(2));
        } catch (e) {
            console.log(e);
            this.gasFee = S.NOT_EXISTS;
        }
        try {
            const cudosPrice = await this.nftApi.getCudosPriceInUsd();
            this.feeInUsd = this.gasFee * cudosPrice;
        } catch (e) {
            this.feeInUsd = S.NOT_EXISTS
        }

    }

}
