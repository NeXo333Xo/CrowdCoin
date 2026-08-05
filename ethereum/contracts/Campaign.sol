// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

enum Category {
    other, technology, games, art_design, music, film_video, publishing,
    food_drink, community, education, health, environment, sports
}

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum, Category category) public {
        Campaign newCampaign = new Campaign(msg.sender, minimum,  category);
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
    Category public immutable category;
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
    
    constructor(address _creator, uint _minimum, Category _category) {
        manager = _creator;
        minimumContribution = _minimum;
        category = _category;
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

