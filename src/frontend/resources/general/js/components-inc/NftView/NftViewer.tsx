import React from 'react';
import { inject, observer } from 'mobx-react';

import MyNftsStore from '../../../../common/js/stores/MyNftsStore';
import PopupSendAsGiftStore from '../../../../common/js/stores/PopupSendAsGiftStore';
import AppStore from '../../../../common/js/stores/AppStore';
import NftModel from '../../../../common/js/models/NftModel';
import NftCollectionModel from '../../../../common/js/models/NftCollectionModel';

import S from '../../../../common/js/utilities/Main';
import ProjectUtils from '../../../../common/js/ProjectUtils';
import Actions from '../../../../common/js/components-inc/Actions';
import Button from '../../../../common/js/components-inc/Button';

import SvgDownload from '../../../../common/svg/download.svg';
import SvgTwitter from '../../../../common/svg/twitter.svg';
import '../../../css/components-inc/NftView/nft-viewer.css'
import Config from '../../../../../../../builds/dev-generated/Config';

interface Props {
    appStore: AppStore;
    popupSendAsGiftStore: PopupSendAsGiftStore;
    myNftsStore: MyNftsStore;
    nftModel?: NftModel;
    nftCollectionModel?: NftCollectionModel;
    onSendAsGiftSuccess: () => void;
}

interface State {
    nftTxHash: string;
}

class NftViewer extends React.Component<Props, State> {

    static defaultProps: any;

    constructor(props) {
        super(props);

        this.state = {
            nftTxHash: S.Strings.EMPTY,
        }
    }

    async componentDidMount(): Promise<void> {
        try {
            this.setState({
                nftTxHash: await this.props.myNftsStore.getNftTxHash(this.props.nftModel),
            });
        } catch (e) {
        }
    }

    onClickSendAsGift = () => {
        this.props.popupSendAsGiftStore.showSignal(this.props.nftModel, this.props.onSendAsGiftSuccess);
    }

    getCollectionName(): string {
        const { nftModel, nftCollectionModel } = this.props;

        if (nftModel !== null) {
            return nftCollectionModel !== null ? nftCollectionModel.name : 'CUDOS ONE COLLECTION';
        }

        return 'collection';
    }

    getName(): string {
        const { nftModel, nftCollectionModel } = this.props;

        if (nftModel !== null) {
            return nftModel.name;
        }

        if (nftCollectionModel.name !== null) {
            return nftCollectionModel.name;
        }

        return S.Strings.EMPTY;
    }

    getId(): string {
        const { nftModel, nftCollectionModel } = this.props;

        if (nftModel !== null) {
            return nftModel.tokenId;
        }

        if (nftCollectionModel.name !== null) {
            return nftCollectionModel.denomId;
        }

        return S.Strings.EMPTY;
    }

    render() {
        const { nftModel, nftCollectionModel } = this.props;

        return (
            <div className={'NftViewer'} >
                {this.renderPreview()}
                <div className={'NftDataCnt FlexColumn'} >
                    <div className={'NftHeader FlexSplit'} >
                        <div className={'CollectionName'} >{this.getCollectionName()}</div>
                        {/* <div className = { 'StartRight FlexRow Share' } >
                            <div className = { 'SVG IconTwitter' } dangerouslySetInnerHTML = {{ __html: SvgTwitter }} />
                            Share on Twitter
                        </div> */}
                        {nftModel !== null && (
                            <a href={nftModel.url} className={'StartRight FlexRow Share'} target='_blank' rel='noreferrer' >
                                <div className={'SVG IconTwitter'} dangerouslySetInnerHTML={{ __html: SvgDownload }} />
                                Downlaod
                            </a>
                        )}
                    </div>
                    <div className={'NftName FlexRow'} >
                        <span className = { 'Dots' } title = { this.getName() } > {this.getName()} </span>
                    </div>
                    <div className={'TxInfo FlexColumn'} >
                        <div className={'TxInfoRow FlexSplit'} >
                            <label>Transation Hash</label>
                            <a href={`${Config.CUDOS_NETWORK.EXPLORER}/transactions/${this.state.nftTxHash}`} className={'TxInfoBlue StartRight'} target='_blank' rel='noreferrer' > {this.state.nftTxHash} </a>
                        </div>
                        <div className={'TxInfoRow FlexSplit'} >
                            <label>Token Standart</label>
                            <div className={'StartRight'} > CUDOS Network Native Token </div>
                        </div>
                        <div className={'TxInfoRow FlexSplit'} >
                            <label>Collection ID</label>
                            <div className={'StartRight'} > {this.getId()} </div>
                        </div>
                    </div>
                    <Actions
                        height={Actions.HEIGHT_60}
                        layout={Actions.LAYOUT_ROW_RIGHT} >
                        {nftModel !== null && (
                            <Button
                                radius={Button.RADIUS_MAX}
                                padding={Button.PADDING_48}
                                color={Button.COLOR_SCHEME_3}
                                onClick={this.onClickSendAsGift} >
                                Send as a gift
                            </Button>
                        )}
                        <Button
                            radius={Button.RADIUS_MAX}
                            padding={Button.PADDING_48}
                            href={`${Config.CUDOS_NETWORK.EXPLORER}/transactions/${this.state.nftTxHash}`}
                            target={'_blank'}
                        >
                            View details in Explorer
                        </Button>
                    </Actions>
                </div>
            </div >
        )
    }

    renderPreview() {
        const { appStore, myNftsStore, nftModel, nftCollectionModel } = this.props;

        if (nftModel !== null) {
            return (
                <div>
                    <div className={'Img ImgCoverNode'} style={ProjectUtils.makeBgImgStyle(nftModel.getPreviewUrl(appStore.workerQueueHelper))} />
                </div>
            )
        }

        if (nftCollectionModel !== null) {
            return (
                <div>
                    <div className={'Img ImgCoverNode'} style={ProjectUtils.makeBgImgStyle(myNftsStore.getPreviewUrl(nftCollectionModel.denomId, appStore.workerQueueHelper))} />
                </div>
            )
        }

        return null;
    }

}

NftViewer.defaultProps = {
    nftModel: null,
    nftCollectionModel: null,
};

export default inject('appStore', 'myNftsStore', 'popupSendAsGiftStore')(observer(NftViewer));
