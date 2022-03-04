import React from "react";

import { Typography } from "@mui/material";

const NoWalletDetected = () => {
  return (
    <Typography>
      No Ethereum wallet was detected. <br />
      Please install{" "}
      <a href="http://metamask.io" target="_blank" rel="noopener noreferrer">
        MetaMask
      </a>
      .
    </Typography>
  );
};

export default NoWalletDetected;
