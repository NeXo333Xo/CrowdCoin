import React, { Component, useState } from "react";
import Campaign  from "../ethereum/campaign";
import web3 from "../ethereum/web3";

function Contribute({ address, onSuccess }) {
  const [contribution, setContribution] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      const wei = web3.utils.toWei(contribution, "ether")

      const campaign = Campaign(address);
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: wei
      });

      setContribution("");
      onSuccess?.();

    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
    
      <div className="card bg-base-100 max-w">
        <div className="card-body">
          <h2 className="card-title text-2xl">Contribute to Campaign</h2>

          <label className="label">
            <span className="label-text">Amount to Contribute</span>
          </label>

          <div className="join w-full">
            <input
              className="input join-item w-full"
              placeholder="1"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
            />
            <span className="btn join-item no-animation pointer-events-none">
              ETH
            </span>
          </div>
          <button className="btn btn-primary w-full mt-4" onClick={onSubmit}>
            {loading ? (
              <span className="loading loading-spinner text-neutral"></span>
            ) : (
              <p>Contribute</p>
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
    </>
  );
}

export default Contribute;
