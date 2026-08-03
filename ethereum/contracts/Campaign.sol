// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(address(newCampaign));
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public contributors;
    uint public contributorsCount;

    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution,
        "Contribution below minimum.");

        contributors[msg.sender] = true;
        contributorsCount++;
    }

    function createRequest(string memory description, uint value, address recipient) 
        restricted public {

        requests.push();
        Request storage newRequest = requests[requests.length - 1];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
        
        /*
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
        */
    }

    function approveRequest(uint index) public  {
        Request storage request = requests[index];

        require(contributors[msg.sender], 
        "You need to be a contributor to approve.");
        require(!requests[index].approvals[msg.sender],
        "You already submitted your approval.");

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(!request.complete);

        require(request.approvalCount > (contributorsCount / 2));

        (bool success, ) = request.recipient.call{value: request.value}("");
        require(success, "Transfer failed");

        request.complete = true;
    }

    modifier restricted() {
        require(msg.sender == manager,
        "Not allowed. Only manager can access this.");
        _;
    }

    function getSummary() public view returns(uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            contributorsCount,
            manager
        );
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }
}

