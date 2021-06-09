const DaiToken = artifacts.require('DaiToken')
const JetToken = artifacts.require('JetToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
	.use(require('chai-as-promised'))
	.should()

function tokens(n){
	return web3.utils.toWei(n,'ether');
}

 contract('TokenFarm', ([owner, investor])=>{
 	//Write tests here
 	let daiToken, jetToken, tokenFarm

 	before(async () =>{
 		//Load Contracts
 		daiToken = await DaiToken.new()
 		jetToken = await JetToken.new()
 		tokenFarm = await TokenFarm.new(jetToken.address, daiToken.address)

 		//Transfer all Jet Token to Farm
 		await jetToken.transfer(tokenFarm.address, tokens('1000000'))

 		//send tokens to investor
 		await daiToken.transfer(investor, tokens("100"), {from:owner})
 	})

 	describe('Mock Dai deployment', async()=>{
 		it('has a name', async ()=>{
 			const name = await daiToken.name()
 			assert.equal(name, 'Mock DAI Token')
 		})
 	})

 	describe('Jet Token deployment', async()=>{
 		it('has a name', async ()=>{
 			const name = await jetToken.name()
 			assert.equal(name, 'Jet Token')
 		})
 	})

 	describe('Token Farm deployment', async()=>{
 		it('has a name', async ()=>{
 			const name = await tokenFarm.name()
 			assert.equal(name, 'Jet Token Farm')
 		});
 		it('contract has tokens', async()=>{
 			let balance = await jetToken.balanceOf(tokenFarm.address)
 			assert.equal(balance.toString(),tokens('1000000'), 'contract has 1M jet tokens')
 		});

 	})

 	describe('Farming tokens', async () => {
 		it('rewards investor for staking mDai tokens', async () =>{
 			let result 
 			// check investor balance before staking
 			result = await daiToken.balanceOf(investor)
 			assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')

 			// stake Mock DAI Tokens
 			await daiToken.approve(tokenFarm.address, tokens('100'), {from: investor})
 			await tokenFarm.stakeTokens(tokens('100'), {from: investor})

 			//check staking result
 			result = await daiToken.balanceOf(investor)
 			assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct before staking')

 			//check staking balance
 			result = await tokenFarm.stakingBalance(investor)
 			assert.equal(result.toString(), tokens('100'), 'investor staking balance correct before staking')

 			//check staking hasStaked status
 			result = await tokenFarm.hasStaked(investor)
 			assert.equal(result.toString(), 'true', 'investor staking status correct before staking')

 			//check staking isStaking status
 			result = await tokenFarm.isStaking(investor)
 			assert.equal(result.toString(), 'true', 'investor staking status correct before staking')

 			await tokenFarm.issueTokens({from:owner})

 			result = await jetToken.balanceOf(investor)
 			assert.equal(result.toString(), tokens('100'), 'investor Jet token wallet balance correct after issuing')

 			//Ensure only owner can issue tokens
 			await tokenFarm.issueTokens({from: investor}).should.be.rejected; 

 			//unstake tokens
 			await tokenFarm.unstakeTokens({from: investor})

 			//check result after unstaking
 			result = await daiToken.balanceOf(investor)
 			assert.equal(result.toString(),tokens('100'), 'investor mock dai balance correct after staking')

 			//check farm mock dai balance after staking
 			result = await daiToken.balanceOf(tokenFarm.address)
 			assert.equal(result.toString(),tokens('0'), 'farm mock dai token correct after unstaking')

 			//check investor farm balance after staking
 			result = await tokenFarm.stakingBalance(investor)
 			assert.equal(result.toString(),tokens('0'), 'investor farm balance correct after unstaking')
 		})
 	})

 })