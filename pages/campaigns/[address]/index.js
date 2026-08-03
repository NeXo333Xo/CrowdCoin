import Campaign from "../../../ethereum/campaign";
import { react, useState } from "react"
import Contribute from "../../../components/Contribute";
import web3 from "../../../ethereum/web3";
import { useRouter} from "next/router";
import Link from "next/link";


function CampaignShow({ 
  address, minimumContribution, balance, requestsCount, contributorsCount, manager 
}) {

    const details = [
    { title: "Address of Manager", 
      description: "The manager created this campaign and can create requests to withdraw money", value: manager },
    { title: "Minimum Contribution (ETH)", 
      description: "You must contribute at least this much eth to become an approver", 
      value: minimumContribution },
    { title: "Campaign Balance (ETH)", 
      description: "The balance is how much money this campaign has left to spend", 
      value: balance },
    { title: "Requests", 
      description: "A request tries to withdraw money from the contract. Requests must be approved by contributers", 
      value: requestsCount },
    { title: "Contributors", 
      description: "Number of people who already donated to this campaign",
      value: contributorsCount },
  ];

  const router = useRouter();
  const refresh = () => router.replace(router.asPath, undefined, { scroll: false });

  return (
    <>
      <h1 className="text-3xl">Campaign Details</h1>
      <div className="flex">
      <h2 className="text-xl mb-4">Contract Address: {address}</h2>
      <Link href={`/campaigns/${address}/requests`}>
          <a className="btn btn-info mb-3 ml-auto">Show Requests</a>
        </Link>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-3">

      <div className="p-3 border rounded-xl">
        <Contribute address={address} onSuccess={refresh} />
      </div>
      
      {details.map((item) => (
        <CampaignDetails key={item.title} title={item.title} description={item.description} value={item.value} />
      ))}
      <div className="col-start-1 lg:col-end-3 h-full">
       
      </div>

    </div>    
    </>
  );
}

CampaignShow.getInitialProps = async (props) => {
  const address = props.query.address;
  const campaign = Campaign(address);
  const summary = await campaign.methods.getSummary().call();
  summary[0] = web3.utils.fromWei(summary[0].toString(), "ether")
  summary[1] = web3.utils.fromWei(summary[1].toString(), "ether");

  return {
    address,
    minimumContribution: summary[0], // removed .toString() because of prior mod.
    balance: summary[1],
    requestsCount: summary[2].toString(),
    contributorsCount: summary[3].toString(),
    manager: summary[4],
  };
};

function CampaignDetails({ title, description, value }) {
  return (
      <div className="card card-border bg-neutral w-full">
        <div className="card-body">
          <h4 className="text-lg font-bold break-all">{value}</h4>
          <p className="card-title text-gray-400">{title}</p>
          <p className="text-sm">{description}</p>
          
        </div>
      </div>
  );
}

export default CampaignShow;
