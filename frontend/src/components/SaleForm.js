import React, { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Divider,
  Button,
  InputAdornment,
} from "@mui/material";

function SaleForm(props) {
  const { defaultAccount, USDTContract, KEEYContract, SaleContract } = props;
  // Sale (buying) variables
  const [approveText, setApproveText] = useState("(Need approval)");

  const [amount, setAmount] = useState("0");
  const [fixedBuyPrice] = useState(100000);
  const [totalUSDT, setTotalUSDT] = useState(amount * fixedBuyPrice);
  const [remainingKEEY, setRemainingKEEY] = useState(0);

  console.log("Call account from buyform", defaultAccount);

  // First render buy form
  useEffect(() => {
    // Get available KEEY to buy
    const getRemainingKEEY = async () => {
      let remainingKEEY = await SaleContract.getRemainingKEEYInPool();
      setRemainingKEEY(remainingKEEY);
    };

    // Check USDT spending approval
    const checkUSDTApproval = async () => {
      try {
        const allowance = await USDTContract.allowance(
          defaultAccount[0],
          SaleContract.address
        );
        console.log("USDT allowance: ", allowance);
        if (allowance !== 0) {
          setApproveText("");
        }
      } catch (err) {
        console.log(err);
      }
    };

    getRemainingKEEY();
    checkUSDTApproval();
  }, [defaultAccount[0]]);

  const onChangeAmount = (event) => {
    const value = event.target.value;
    if (!value.includes(".") && Number.parseInt(value) >= 0) {
      if (value > 2500) {
        setAmount(2500);
        setTotalUSDT(2500 * fixedBuyPrice);
      } else {
        setAmount(value);
        setTotalUSDT(value * fixedBuyPrice);
      }
    } else {
      setAmount();
      setTotalUSDT(0);
    }
  };

  const buyHandler = async () => {
    console.log(USDTContract.address);
    console.log(SaleContract.address);

    if (approveText === "") {
      // Start buying
      console.log("Start buying...");
      try {
        const response = await SaleContract.buyKEEY(totalUSDT * 100000);
        console.log(response);
      } catch (err) {
        console.log("error: ", err);
      }
    } else {
      try {
        const response = await USDTContract.approve(
          SaleContract.address,
          USDTContract.balanceOf(defaultAccount[0])
        );
        setApproveText("");
      } catch (err) {
        console.log("error: ", err);
        return;
      }
    }
  };

  return (
    <div>
      <Box
        sx={{
          bgcolor: "#e0e0e0",
          p: 5,
          borderRadius: "12px",
          boxShadow: 1,
          fontWeight: "bold",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={4} sm={4} md={4} lg={4}>
            <Typography marginBottom="0.5rem">Size</Typography>
            <TextField
              type="number"
              placeholder="0"
              value={amount}
              onChange={onChangeAmount}
              helperText={`Remain tokens: ${remainingKEEY}`}
              error={Number(amount) > Number(2500)}
              fullWidth
            />
          </Grid>
          <Grid item xs={8} sm={8} md={8} lg={8} marginBottom="2rem">
            <Typography marginBottom="0.5rem">Price</Typography>
            <TextField
              disabled
              value={fixedBuyPrice}
              type="text"
              placeholder="0"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    {/* {paymentToken.symbol} */}
                    USDT
                  </InputAdornment>
                ),
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={12} marginBottom="2rem">
            <Divider variant="fullWidth" />
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            display="flex"
            justifyContent="space-between"
            marginBottom="2rem"
          >
            <Typography fontWeight="bold">Total</Typography>
            <Typography fontSize="20px" fontWeight="bold" color="#6e50fa">
              {totalUSDT} USDT
            </Typography>
          </Grid>
          <Grid item xs={12} md={12} marginBottom="2rem">
            <Divider variant="fullWidth" />
          </Grid>
          <Grid container justifyContent="center" marginBottom="2rem">
            <Button
              sx={{
                color: "white",
                backgroundColor: "#7054fc",
                backgroundImage:
                  "linear-gradient(to right, #555ffa, #7153fc, #884bfe)",
                "&:hover": {
                  backgroundImage:
                    "linear-gradient(90deg, #7E8BFF 0%, rgba(154, 91, 255, 0.86) 100%)",
                },
                "&:disabled": {
                  backgroundImage: "none",
                  backgroundColor: "#b0a8fb",
                  color: "white",
                },
                paddingLeft: "50px",
                paddingRight: "50px",
                height: "4rem",
                width: "100%",
                fontWeight: "bolder",
                fontSize: "1rem",
                borderRadius: "0.5rem",
              }}
              onClick={() => buyHandler()}
            >
              Buy Now {approveText}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default SaleForm;
