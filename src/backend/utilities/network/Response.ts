export default class Response {

    static S_STATUS_OK: number;
    static S_STATUS_ERROR: number;
    static S_STATUS_DO_NOT_HANDLE: number;
    static S_STATUS_RUNTIME_ERROR: number;
    static S_STATUS_CUDOS_NETWORK_ERROR: number;
    static S_STATUS_INVALID_NFT_ERROR: number;
    static S_STATUS_IPFS_ERROR: number;
    static S_STATUS_WRONG_URL: number;

    status: number;
    obj: any;
    msg: string;

    constructor() {
        this.status = Response.S_STATUS_OK;
        this.obj = null;
        this.msg = '';
    }

    set(obj: any) {
        this.obj = obj;
    }

    setStatus(status: number) {
        this.status = status;
    }

}

Response.S_STATUS_OK = 0;
Response.S_STATUS_ERROR = 1;
Response.S_STATUS_DO_NOT_HANDLE = 2;
Response.S_STATUS_RUNTIME_ERROR = 3;
Response.S_STATUS_CUDOS_NETWORK_ERROR = 4;
Response.S_STATUS_INVALID_NFT_ERROR = 5;
Response.S_STATUS_IPFS_ERROR = 6;
Response.S_STATUS_WRONG_URL = 7;
