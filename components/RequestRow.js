import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { useState } from "react";

function RequestRow({ index, address, request, contributorsCount }) {
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [finalizeLoading, setFinalizeLoading] = useState(false);
  const [error, setError] = useState("");

  const readyToFinalize = request.approvalCount > (contributorsCount / 2)

  const onApprove = async (address) => {
    event.preventDefault();
    setError("");
    setApproveLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(address);
      const approved = await campaign.methods.approveRequest(index).send({
        from: accounts[0],
      });
    } catch (err) {
      setError(err.message);
    }
    setApproveLoading(false);
  };

  const onFinalize = async (address) => {
    event.preventDefault();
    setError("");
    setFinalizeLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(address);
      const finalized = await campaign.methods.finalizeRequest(index).send({
        from: accounts[0],
      });
    } catch (err) {
      setError(err.message);
    }
    setFinalizeLoading(false);
  };

  return (
    <>
      <tr key={index} className={request.complete ? "opacity-30" : "hover:bg-base-300"}>
        <th>{index + 1}</th>
        <td>{request.description}</td>
        <td>{web3.utils.fromWei(request.value, "ether")} ETH</td>
        <td>{request.recipient}</td>
        <td>{request.approvalCount + "/" + contributorsCount}</td>
        <td>
          {request.complete ? null : (
            <button
              className="btn btn-outline  btn-success w-full"
              onClick={() => onApprove(address)}
            >
              {approveLoading ? (
                <span className="loading loading-spinner text-neutral"></span>
              ) : (
                <p>Approve</p>
              )}
            </button>
          )}
        </td>
        <td>
          {!request.complete && readyToFinalize && (
            <button
              className="btn btn-outline btn-error w-full"
              onClick={() => onFinalize(address)}
            >
              {finalizeLoading ? (
                <span className="loading loading-spinner text-neutral"></span>
              ) : (
                <p>Finalize</p>
              )}
            </button>
          )}
        </td>
      </tr>
        
      {error && (
        <td colspan={7}>
        <div role="alert" className="alert alert-error my-3 w-full">
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
        </td>
      )}
      
    </>
  );
}

export default RequestRow;
