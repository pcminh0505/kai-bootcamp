require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// Go to https://infura.io/, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const INFURA_API_KEY = process.env.INFURA_API_KEY;

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const ROPSTEN_PRIVATE_KEY_KEEY = process.env.ROPSTEN_PRIVATE_KEY_KEEY;
const ROPSTEN_PRIVATE_KEY_USDT = process.env.ROPSTEN_PRIVATE_KEY_USDT;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
https: module.exports = {
  solidity: "0.8.3",
  networks: {
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`${ROPSTEN_PRIVATE_KEY_KEEY}`, `${ROPSTEN_PRIVATE_KEY_USDT}`],
    },
  },
};
