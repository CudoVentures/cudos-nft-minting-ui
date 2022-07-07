import React from 'react';
import { inject, observer } from 'mobx-react';

import MyNftsStore from '../../../../common/js/stores/MyNftsStore';

import NftModel from '../../../../common/js/models/NftModel';
import ProjectUtils from '../../../../common/js/ProjectUtils';

import '../../../css/components-inc/NftView/nft-models-viewer.css'

interface Props {
    myNftsStore: MyNftsStore;
    nftModels: NftModel[];
}

class NftModelsViewer extends React.Component < Props > {

    onClickNft(nftModel: NftModel) {
        this.props.myNftsStore.markNft(nftModel);
    }

    render() {
        return (
            <div className = { 'NftModelsViewer' } >
                { this.props.nftModels.map((nftModel: NftModel) => {
                    return (
                        <div
                            key = { nftModel.tokenId }
                            className = { 'NftModel' }
                            onClick = { this.onClickNft.bind(this, nftModel) } >
                            <div className = { 'NftImg ImgCoverNode Transition' } style = { ProjectUtils.makeBgImgStyle(nftModel.uri) } />
                            <div className = { 'NftName' } > { nftModel.name } </div>
                        </div>
                    )
                }) }
            </div>
        )
    }

}

export default inject('myNftsStore')(observer(NftModelsViewer));
