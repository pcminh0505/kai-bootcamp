const hre = require("hardhat");

async function main() {
  const [KEEYOwner, USDTOwner] = await ethers.getSigners();

  console.log("Deploying KEEY with owner address:", KEEYOwner.address);
  console.log(
    "Account KEEY balance:",
    (await KEEYOwner.getBalance()).toString()
  );

  console.log("Deploying USDT with owner address:", USDTOwner.address);
  console.log(
    "Account USDT balance:",
    (await USDTOwner.getBalance()).toString()
  );

  // Rospten Testnet - Deploying Token contract
  const TokenFactory = await hre.ethers.getContractFactory("Token");
  const USDT = await TokenFactory.connect(USDTOwner).deploy(
    100000000000000,
    6,
    "Tether USD",
    "USDT"
  );
  console.log("USDT address:", USDT.address);

  const KEEY = await TokenFactory.connect(KEEYOwner).deploy(
    25000000,
    0,
    "IronSail",
    "KEEY"
  );
  console.log("KEEY address:", KEEY.address);

  // Rospten Testnet - Deploying Sale contract
  const TokenSaleFactory = await hre.ethers.getContractFactory("TokenSale");
  const SaleContract = await TokenSaleFactory.connect(KEEYOwner).deploy(
    KEEY.address,
    USDT.address
  );
  console.log("Sale contract deployed to:", SaleContract.address);

  // Initialize fund (transfer from admin wallet to sale contract address)
  await KEEY.connect(KEEYOwner).approve(SaleContract.address, 2500);
  await SaleContract.connect(KEEYOwner).initializeSale(2500);
  console.log("Initialize Sale successful");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
