// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );
module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("HealthOcupational", {
    from: deployer,
    log: true,
    waitConfirmations: 5,
  });
};
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("ContratoEmpleado", {
    from: deployer,
    log: true,
    waitConfirmations: 5,
  });
};
module.exports.tags = ["HealthOcupational", "ContratoEmpleado"];
