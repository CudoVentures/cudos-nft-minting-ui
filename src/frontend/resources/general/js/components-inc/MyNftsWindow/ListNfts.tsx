import React from 'react';
import { inject, observer } from 'mobx-react';

import MyNftsStore from '../../../../common/js/stores/MyNftsStore';

import Actions from '../../../../common/js/components-inc/Actions';
import Button from '../../../../common/js/components-inc/Button';
import Input from '../../../../common/js/components-inc/Input';

import SvgSearch from '../../../../common/svg/search.svg';
import '../../../css/components-inc/MyNftsWindow/list-nfts.css'
import NftCollectionsViewer from '../NftView/NftCollectionsViewer';
import NftModelsViewer from '../NftView/NftModelsViewer';
import NftCollectionViewer from '../NftView/NftCollectionViewer';
import NftModelViewer from '../NftView/NftModelViewer';

interface Props {
    myNftsStore: MyNftsStore;
}

class ListNfts extends React.Component < Props > {

    onChangeFilterString = (value) => {
        const myNftsStore = this.props.myNftsStore;
        myNftsStore.filterString = value;
    }

    render() {
        const myNftsStore = this.props.myNftsStore;

        return (
            <div className = { 'ListNfts' } >
                { myNftsStore.hasViewNft() === false && myNftsStore.hasViewCollection() === false && (
                    <div className = { 'NftListFilter FlexSplit' } >
                        <Actions
                            height = { Actions.HEIGHT_42 }
                            layout = { Actions.LAYOUT_ROW_LEFT } >

                            <Button
                                type = { myNftsStore.isViewSingleNfts() === true ? Button.TYPE_ROUNDED : Button.TYPE_TEXT_INLINE }
                                color = { myNftsStore.isViewSingleNfts() === true ? Button.COLOR_SCHEME_3 : Button.COLOR_SCHEME_2 }
                                onClick = { myNftsStore.markViewSingleNfts } >
                            Single NFTs ({myNftsStore.nftModels.length})
                            </Button>

                            <Button
                                type = { myNftsStore.isViewNftCollections() === true ? Button.TYPE_ROUNDED : Button.TYPE_TEXT_INLINE }
                                color = { myNftsStore.isViewNftCollections() === true ? Button.COLOR_SCHEME_3 : Button.COLOR_SCHEME_2 }
                                onClick = { myNftsStore.markViewNftCollections } >
                            Collections ({myNftsStore.nftCollectionModels.length})
                            </Button>

                        </Actions>
                        <Input
                            className = { 'FilterString StartRight' }
                            value = { myNftsStore.filterString }
                            placeholder = { 'Search for NFTs' }
                            gray = { true }
                            InputProps = { {
                                startAdornment: (
                                    <div className = { 'SVG IconSearch' } dangerouslySetInnerHTML = {{ __html: SvgSearch }} />
                                ),
                            } }
                            onChange = { this.onChangeFilterString } />
                    </div>
                ) }
                { myNftsStore.hasViewNft() === true && <NftModelViewer nftModel = { myNftsStore.viewNftModel } /> }
                { myNftsStore.hasViewNft() === false && myNftsStore.hasViewCollection() === true && <NftCollectionViewer nftCollectionModel = { myNftsStore.viewNftCollectionModel } /> }
                { myNftsStore.hasViewNft() === false && myNftsStore.hasViewCollection() === false && myNftsStore.isViewSingleNfts() === true && <NftModelsViewer nftModels = { myNftsStore.nftModels } /> }
                { myNftsStore.hasViewNft() === false && myNftsStore.hasViewCollection() === false && myNftsStore.isViewNftCollections() === true && <NftCollectionsViewer nftCollectionModels = { myNftsStore.nftCollectionModels } /> }
            </div>
        )
    }

}

export default inject('myNftsStore')(observer(ListNfts));
