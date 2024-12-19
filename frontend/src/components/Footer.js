import React from "react";
import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#2c3e50",
          color: "white",
          py: 1,
          textAlign: "center",
          marginTop:"auto",
          width: "100%",
          position:'fixed',
          bottom:0
        }}
      >
        <Typography variant="body2" sx={{ fontFamily: "Roboto, sans-serif" }}>
          &copy; 2024 PlinkoGame. All rights reserved.
        </Typography>
      </Box>
    </>
  );
}

export default Footer;
