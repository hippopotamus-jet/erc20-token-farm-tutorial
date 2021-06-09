pragma solidity ^0.5.0;
import "./JetToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
	//All code here
	string public name = "Jet Token Farm";
	address public owner; 	
	JetToken public jetToken;
	DaiToken public daiToken;

	address[] public stakers;
	mapping(address => uint) public stakingBalance;
	mapping(address => bool) public hasStaked;
	mapping(address => bool) public isStaking;

	constructor(JetToken _jetToken, DaiToken _daiToken) public{
		jetToken = _jetToken;
		daiToken = _daiToken;
		owner = msg.sender;
	}

	//1. Stakes token (Deposit)
	function stakeTokens(uint _amount)public{
		//REQUIRE AMOUNT GREATER THAN 0
		require(_amount > 0, "amount cannt be 0");

		// transfer mock dai to this contract
		daiToken.transferFrom(msg.sender, address(this), _amount);
		// update staking balance
		stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
		//add user to stakers array *only* if they haven't staked already
		if(!hasStaked[msg.sender]){
			stakers.push(msg.sender);
		}

		//update staking status
		isStaking[msg.sender] = true;
		hasStaked[msg.sender] = true;
	}
	//Issuing Tokens
	function issueTokens()public{
		//only owner can call this function
		require(msg.sender == owner, "caller must be the owner");

		//issue tokens
		for(uint i=0; i<stakers.length; i++){
			address recipient = stakers[i];
			uint balance = stakingBalance[recipient];
			if(balance > 0){
				jetToken.transfer(recipient, balance);
			}
		}
	}

	//Unstakeing Tokens (Withdraw)
	function unstakeTokens()public{
		//fetch staking balance
		uint balance = stakingBalance[msg.sender];

		require(balance>0, "staking balance must be higher than 0");

		daiToken.transfer(msg.sender, balance);

		//reset staking balance
		stakingBalance[msg.sender] = 0;
		//update stating
		isStaking[msg.sender] = false;
	}
	
}