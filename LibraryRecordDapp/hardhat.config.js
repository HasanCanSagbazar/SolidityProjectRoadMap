require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const LINEA_SEPOLIA_PRIVATE_KEY = process.env.LINEA_SEPOLIA_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.27",
  networks: {
    linea_sepolia: {
      url:`https://linea-sepolia.infura.io/v3/${process.env.LINEA_SEPOLIA_API_KEY}`,
      accounts: [LINEA_SEPOLIA_PRIVATE_KEY]
    }
  }
};
