import react, { useState } from "react";
import web3 from "../../../../ethereum/web3";
import Campaign from "../../../../ethereum/campaign";
import Link from "next/link";

function RequestNew({ address }) {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      const wei = web3.utils.toWei(value, "ether");

      const campaign = new Campaign(address);
      await campaign.methods.createRequest(description, wei, recipient).send({
        from: accounts[0]
      });

      setDescription("");
      setValue("");
      setRecipient("");
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
          <h2 className="card-title text-2xl">Create a Request</h2>

          <label className="label flex flex-col items-start gap-1 w-full">
            <span className="label-text">
              Desciption: What will the money be used for
            </span>
            <div className="w-full">
              <input
                className="input w-full"
                placeholder="E.g. Marketing Campaign on Meta"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </label>

          <label className="label flex flex-col items-start gap-1 w-full">
            <span className="label-text">Request Value</span>
            <div className="join w-full">
              <input
                className="input w-full"
                placeholder="E.g. 1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <span className="btn no-animation pointer-events-none">ETH</span>
            </div>
          </label>

          <label className="label flex flex-col items-start gap-1 w-full">
            <span className="label-text">Recipient Address</span>
            <div className="join w-full">
              <input
                className="input w-full"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
          </label>

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
}

RequestNew.getInitialProps = async (props) => {
  const address = props.query.address;
  return { address };
}

export default RequestNew;
