import React from "react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout.js"
import Link from "next/link";

function CampaignIndex({ campaigns }) {
  return (
    <>
      <h1 className="text-3xl">Campaigns Index</h1>
      <p className="mb-3">Create projects that people can donate ETH to!</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 w-full">
        <Link href="/campaigns/new">
          <a className="col-start-1 btn btn-dash h-100 text-xl">Create Campaign</a>
        </Link>

        {campaigns.map(address => (
        <div key={address} className="card bg-base-100 shadow-sm border">
            <Link href={`/campaigns/${address}`}>
            <a>
              <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes"
              />
            </a>
            </Link>
          
          <div className="card-body">
            <h2 className="card-title text-xl">Campaign title</h2>
            <p>{address.description} </p>
            <p>{address.minimumContribution} </p>
            <p>{address.contributionCount} </p>
            
            <Link href={`/campaigns/${address}`}>
              <a className="btn btn-primary">Join</a>
            </Link>
          </div>
        </div>
        ))}
        
      </div>
    </>
  );
}

CampaignIndex.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  

  return { campaigns };
};

export default CampaignIndex;
