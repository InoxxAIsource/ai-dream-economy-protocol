const { ethers } = require('hardhat');

async function main() {
  console.log('Deploying contracts to BSC Testnet...');
  
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);
  
  // Deploy DREAM Token
  const DreamToken = await ethers.getContractFactory('DreamToken');
  const dreamToken = await DreamToken.deploy();
  await dreamToken.deployed();
  console.log('DREAM Token deployed to:', dreamToken.address);
  
  // Deploy Dream NFT
  const DreamNFT = await ethers.getContractFactory('DreamNFT');
  const dreamNFT = await DreamNFT.deploy();
  await dreamNFT.deployed();
  console.log('Dream NFT deployed to:', dreamNFT.address);
  
  // Deploy Staking
  const DreamStaking = await ethers.getContractFactory('DreamStaking');
  const staking = await DreamStaking.deploy(dreamToken.address);
  await staking.deployed();
  console.log('Dream Staking deployed to:', staking.address);
  
  // Deploy Marketplace
  const DreamMarketplace = await ethers.getContractFactory('DreamMarketplace');
  const marketplace = await DreamMarketplace.deploy(dreamNFT.address, dreamToken.address);
  await marketplace.deployed();
  console.log('Dream Marketplace deployed to:', marketplace.address);
  
  // Deploy Governance
  const DreamGovernance = await ethers.getContractFactory('DreamGovernance');
  const governance = await DreamGovernance.deploy(dreamToken.address);
  await governance.deployed();
  console.log('Dream Governance deployed to:', governance.address);
  
  console.log('\n=== BSC Testnet Deployment Complete ===');
  console.log('DREAM Token:', dreamToken.address);
  console.log('Dream NFT:', dreamNFT.address);
  console.log('Dream Staking:', staking.address);
  console.log('Dream Marketplace:', marketplace.address);
  console.log('Dream Governance:', governance.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });