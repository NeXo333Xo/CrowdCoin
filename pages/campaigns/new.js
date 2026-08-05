import React, { Component, useState } from "react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { useRouter } from "next/router";
import { CATEGORIES } from "../../lib/categories"

const CampaignNew = () => {
  const router = useRouter();
  const [minimumContribution, setMinimumContribution] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("0");

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    console.log("This is category: ", category);

    try {
      const accounts = await web3.eth.getAccounts();
      const wei = web3.utils.toWei(minimumContribution, "ether");
      await factory.methods.createCampaign(wei, category).send({
        from: accounts[0],
      });
      setMinimumContribution("");
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="p-5 border rounded-xl">
        <div className="card bg-base-100 max-w">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-3">Create a Campaign</h2>

            <label className="label flex flex-col items-start gap-1 w-full cursor-pointer">
              <span className="label-text">
                Campaign Category
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select w-full"
              >
                <option disabled={true}>Campaign Category</option>
                {CATEGORIES.map((name, id) => (
                  <option key={name} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <label className="label">
              <span className="label-text">
                Mimimum contribution for investors
              </span>
            </label>

            <div className="join w-full">
              <input
                className="input join-item w-full"
                placeholder="0.1"
                value={minimumContribution}
                onChange={(e) => setMinimumContribution(e.target.value)}
              />
              <span className="btn join-item no-animation pointer-events-none">
                ETH
              </span>
            </div>

            <button className="btn btn-primary w-full mt-4" onClick={onSubmit}>
              {loading ? (
                <span className="loading loading-spinner text-neutral"></span>
              ) : (
                <p>Create</p>
              )}
            </button>

            {error && (
              <div role="alert" className="alert alert-error my-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignNew;
