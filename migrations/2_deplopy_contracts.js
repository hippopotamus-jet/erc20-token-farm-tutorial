const JetToken = artifacts.require("JetToken")
const DaiToken = artifacts.require("DaiToken")
const TokenFarm = artifacts.require("TokenFarm")

module.exports = async function(deployer, network, accounts) {
  //Deploy mock Dai
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  //Deploy Jet Token
  await deployer.deploy(JetToken)
  const jetToken = await JetToken.deployed()

  //Deploy TokenFarm
  await deployer.deploy(TokenFarm, jetToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()

  //Transfer all tokens to TokenFarm (1 million)
  await jetToken.transfer(tokenFarm.address, '1000000000000000000000000')

  //Transfer 100 mock Dai tokens to investor
  await daiToken.transfer(accounts[1], '100000000000000000000')

  
}