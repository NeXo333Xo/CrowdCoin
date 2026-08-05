import React from "react";
import factory from "../ethereum/factory";
import Campaign from "../ethereum/campaign";
import Layout from "../components/Layout.js";
import Link from "next/link";
import { CATEGORIES } from "../lib/categories";

function CampaignIndex({ campaigns }) {
  return (
    <>
      <h1 className="text-3xl">Campaigns Index</h1>
      <p className="mb-3">Create projects that people can donate ETH to!</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 w-full">
        <Link
          className="col-start-1 btn btn-dash h-full text-xl"
          href="/campaigns/new"
        >
          Create Campaign
        </Link>

        {campaigns.map((campaign) => (
          <div
            key={campaign.address}
            className="card bg-base-100 shadow-sm border"
          >
            <Link href={`/campaigns/${campaign.address}`}>
              <img
                src={`/categories/${campaign.category}.svg`}
                alt={CATEGORIES[campaign.category]}
              />
            </Link>

            <div className="card-body">
              <p className="break-all">{campaign.address} </p>
              <p>Contributors: {campaign.contributorsCount} </p>
              <Link
                className="btn btn-primary"
                href={`/campaigns/${campaign.address}`}
              >
                Join
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

CampaignIndex.getInitialProps = async () => {
  const addresses = await factory.methods.getDeployedCampaigns().call();

  const campaigns = await Promise.all(
    addresses.map(async (address) => {
      const campaign = Campaign(address);

      const [category, contributorsCount] = await Promise.all([
        campaign.methods.category().call(),
        campaign.methods.contributorsCount().call(),
      ]);

      return {
        address,
        category: Number(category),
        contributorsCount: Number(contributorsCount),
      };
    }),
  );

  return { campaigns };
};

export default CampaignIndex;
