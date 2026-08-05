import react, { useState } from "react";
import web3 from "../../../../ethereum/web3";
import Campaign from "../../../../ethereum/campaign";
import Link from "next/link";
import RequestRow from "../../../../components/RequestRow";

function RequestsIndex({ address, requests, requestCount, contributorsCount }) {
  return (
    <>
      <div className="flex mb-5">
        <h1 className="text-3xl">Request-List</h1>
        <Link
          className="btn btn-info ml-auto"
          href={`/campaigns/${address}/requests/new`}
        >
          Create a Request
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>

              <th>Description</th>
              <th>Amount</th>
              <th>Recipient</th>
              <th>Approval Count</th>
              <th>Approve</th>
              <th>Finalize</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request, index) => (
              <RequestRow
                key={index}
                index={index}
                address={address}
                request={request}
                contributorsCount={contributorsCount}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

RequestsIndex.getInitialProps = async (props) => {
  const address = props.query.address;
  const campaign = Campaign(address);
  const requestCount = await campaign.methods.getRequestCount().call();
  const contributorsCount = await campaign.methods.contributorsCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      }),
  );

  const serializedRequests = requests.map((request) => ({
    description: request.description,
    value: request.value.toString(),
    recipient: request.recipient,
    complete: request.complete,
    approvalCount: request.approvalCount.toString(),
  }));

  return {
    address,
    requests: serializedRequests,
    requestCount: requestCount.toString(),
    contributorsCount: contributorsCount.toString(),
  };
};

export default RequestsIndex;
