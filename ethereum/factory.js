import web3 from "./web3"
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    "0xfb5ECC61633D93BC3A5cc1Eeb47D8D0516c1EeEc"
);

export default instance;