import { inject, observer } from 'mobx-react';
import React from 'react';
import Input from '../../../../common/js/components-inc/Input';
import LayoutBlock from '../../../../common/js/components-inc/LayoutBlock';
import NftMintStore from '../../../../common/js/stores/NftMintStore';
import '../../../css/components-inc/NftMint/collection-premint-preview.css';

import NftSidePreview from '../NftSidePreview';
import Actions from '../../../../common/js/components-inc/Actions';
import Button from '../../../../common/js/components-inc/Button';
import NftStepWrapper from './NftStepWrapper';

import S from '../../../../common/js/utilities/Main';
import ProjectUtils from '../../../../common/js/ProjectUtils';
import Config from '../../../../../../../builds/dev-generated/Config';
import MyNftsStore from '../../../../common/js/stores/MyNftsStore';
import AppStore from '../../../../common/js/stores/AppStore';
import NftApi from '../../../../common/js/api/NftApi';

interface Props {
    nftMintStore: NftMintStore;
    myNftsStore: MyNftsStore;
    appStore: AppStore;
}

interface State {
    txHash: string;
    nftCount: number;
}

class CollectionPremintPreview extends React.Component<Props, State> {
    nftApi: NftApi;

    constructor(props) {
        super(props);
        this.nftApi = new NftApi();

        this.state = {
            txHash: S.Strings.EMPTY,
            nftCount: S.NOT_EXISTS,
        }
    }

    async componentDidMount(): Promise<void> {
        const collection = this.props.nftMintStore.nftCollection;
        const nftApi = this.props.myNftsStore.nftApi;
        try {
            nftApi.getCollectionTxHash(collection.denomId)
                .then((txHash: string) => {
                    this.setState({
                        txHash,
                    })
                });

            nftApi.getNumberOfNftsInCollection(collection.denomId)
                .then((nftCount: number) => {
                    this.setState({
                        nftCount,
                    })
                });
        } catch (e) {
        }
    }

    render() {
        const nftMintStore = this.props.nftMintStore;
        const navMintStore = nftMintStore.navMintStore;
        const appStore = this.props.appStore;
        const nftCollectionModel = nftMintStore.nftCollection;
        return (
            <NftStepWrapper
                className={'CollectionPremintPreview'}
                stepNumber={`Step ${navMintStore.getMintStepShowNumber()}`}
                stepName={'Check Collection Details'} >
                <div className={'NftCollectionPreview FlexRow'} >
                    <div>
                        <div className={'Img ImgCoverNode'} style={ProjectUtils.makeBgImgStyle(this.props.myNftsStore.getPreviewUrl(nftCollectionModel.denomId, appStore.workerQueueHelper))} />
                    </div>
                    <div className={'CollectionDataCnt FlexColumn'} >
                        <div className={'CollectionHeader'} >COLLECTION</div>
                        <div className={'CollectionName FlexRow'} >
                            <span className={'Dots'} title={nftCollectionModel.name} > {nftCollectionModel.name} </span>
                        </div>
                        <div className={'CollectionInfo FlexColumn'} >
                            <div className={'InfoRow FlexSplit'} >
                                <label>Transation Hash</label>
                                <a href={`${Config.CUDOS_NETWORK.EXPLORER}/transactions/${this.state.txHash}`} className={'TxInfoBlue StartRight'} target='_blank' rel='noreferrer' > {this.state.txHash} </a>
                            </div>
                            <div className={'InfoRow FlexSplit'} >
                                <label>Token Standart</label>
                                <div className={'StartRight'} > CUDOS Network Native Token </div>
                            </div>
                            <div className={'InfoRow FlexSplit'} >
                                <label>Collection ID</label>
                                <div className={'StartRight'} > {nftCollectionModel.denomId} </div>
                            </div>
                            <div className={'InfoRow FlexSplit'} >
                                <label>Items in this Collection</label>
                                <div className={'StartRight'} > {this.state.nftCount === S.NOT_EXISTS ? 'fetching...' : this.state.nftCount} </div>
                            </div>
                        </div>
                    </div>
                </div >
            </NftStepWrapper >
        )
    }
}

export default inject('appStore', 'myNftsStore', 'nftMintStore')((observer(CollectionPremintPreview)));
