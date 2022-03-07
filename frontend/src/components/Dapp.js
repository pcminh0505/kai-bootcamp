import React, { useEffect, useState } from "react";
import { Grid, Typography, Button, Box } from "@mui/material";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";
import SaleForm from "./SaleForm";

import TokenArtifact from "../contracts/Token.json";
import TokenSaleArtifact from "../contracts/TokenSale.json";
import contractAddress from "../contracts/contract-address.json";
import NoWalletDetected from "./NoWalletDetected";

function Dapp(props) {
  // Wallet/Address checking variables
  const [defaultAccount, setDefaultAccount] = useState("");
  const [errorMessage, setErrorMessage] = useState(
    "Please connect to Ropsten Testnet to continue"
  );
  const [isConnected, setIsConnected] = useState(false);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const [USDTContract, setUSDTContract] = useState(undefined);
  const [KEEYContract, setKEEYContract] = useState(undefined);
  const [SaleContract, setSaleContract] = useState(undefined);

  const [KEEYBalance, setKEEYBalance] = useState(0);

  // Check whether Metamask has been installed
  useEffect(() => {
    const setContract = () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // console.log(signer);
      const USDTContractData = new ethers.Contract(
        contractAddress.USDT,
        TokenArtifact.abi,
        signer
      );
      setUSDTContract(USDTContractData);
      const KEEYContractData = new ethers.Contract(
        contractAddress.KEEY,
        TokenArtifact.abi,
        signer
      );
      setKEEYContract(KEEYContractData);

      const SaleContractData = new ethers.Contract(
        contractAddress.SaleContract,
        TokenSaleArtifact.abi,
        signer
      );
      setSaleContract(SaleContractData);
      console.log("Signer neeeeeeee: ", signer);
    };

    if (window.ethereum === undefined) {
      setErrorMessage(
        "Please install MetaMask browser extension to interact with the app"
      );
    } else {
      setIsConnected(true);
      setContract();
    }
  }, [isConnected]);

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
  };

  const updateBalance = async (account) => {
    try {
      let KEEYBalance = await KEEYContract.balanceOf(account);
      console.log("Fetching KEEY balance...");
      setKEEYBalance(KEEYBalance.toString());

      console.log("Done fetching balance!");
    } catch (err) {
      console.log("error: ", err);
    }
  };

  useEffect(() => {
    // Listen on change
    const chainChangedHandler = () => {
      // reload the page to avoid any errors with chain change mid use of application
      window.location.reload();
    };

    if (window.ethereum !== undefined) {
      window.ethereum.on("chainChanged", chainChangedHandler);
      window.ethereum.on("accountsChanged", accountChangedHandler);

      console.log("Updating account balance...");
      console.log("Current wallet address: ", defaultAccount[0]);
    }

    updateBalance(defaultAccount[0]);
  }, [defaultAccount[0]]);

  if (window.ethereum === undefined) {
    return <NoWalletDetected />;
  }
  const connectWalletHandler = () => {
    if (window.ethereum !== undefined) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result);
          // Should check Ropsten network here, assumption for short
          setConnButtonText("Wallet Connected");
          setErrorMessage("");
          updateBalance(result[0]);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
    }
  };

  return (
    <div>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        {/* Connect wallet address  */}
        <Grid container justifyContent="center">
          <Button onClick={connectWalletHandler}>{connButtonText}</Button>
        </Grid>

        {/* Wallet info  */}

        <Grid container justifyContent="center">
          <Typography>Wallet address: {defaultAccount}</Typography>
        </Grid>

        <Grid container justifyContent="center">
          <Typography>KEEY Balance: {KEEYBalance} KEEY</Typography>
        </Grid>

        <SaleForm
          defaultAccount={defaultAccount}
          USDTContract={USDTContract}
          SaleContract={SaleContract}
        />

        <Grid container justifyContent="center">
          <Typography
            variant="subtitle2"
            color="red"
            marginTop={"10px"}
            textAlign={"center"}
          >
            {errorMessage}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dapp;
