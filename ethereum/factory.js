import web3 from "./web3"
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    "0x1e22fA07f40221A96ffd251E67553d12066C8144"
);

export default instance;