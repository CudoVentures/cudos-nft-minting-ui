import Api from '../Api';

const Config = require('../../../../../config/config');

export default class NftApiH extends Api {

    static URL: string;
    static Actions: any;

}

NftApiH.URL = `${Config.URL.API}/nft`;
NftApiH.Actions = {
    MINT: 'a',
    IMAGE_UPLOAD: 'b',
};