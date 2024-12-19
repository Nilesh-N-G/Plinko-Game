import React from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import BettingForm from "./BettingForm";
import CanvasBoard from "./CanvasBoard";

const GameBoard = ({
  button,
  balls,
  sinkPattern,
  risk,
  setRisk,
  betAmount,
  setBetAmount,
  balance,
  setBalance,
  setSinkPattern,
  patterns,
  totalballs,
  setTotalBalls,
}) => {
  return (
    <><Box sx={{
      backgroundColor: "rgb(31, 45, 55)",height:'auto'}} >
      <Box
        sx={{
          flexGrow: 1,
          marginX: {
            xs: 2,
            sm: 10,
            md: 20,
          },
          paddingTop:3,
          paddingX:{
            sm:2,
            md:8
          },
        }}
      >
        <Grid container spacing={0}>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              order: { xs: 2, md: 1 },
              height:'100%',
              
            }}
            
          >
            <Box
              sx={{
                backgroundColor: "rgb(51, 65, 85)",
                padding: 0,
                textAlign: "center",
                borderRadius: 0,
                color: "text.secondary",
                height: "auto",
              }}
            >
              <BettingForm
                button={button}
                betAmount={betAmount}
                setBetAmount={setBetAmount}
                risk={risk}
                setRisk={setRisk}
                balance={balance}
                setSinkPattern={setSinkPattern}
                patterns={patterns}
                balls={balls}
              />
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={8}
            sx={{
              order: { xs: 1, md: 2 },
            }}
          >
            <Box
              sx={{
                backgroundColor: "rgb(17, 24, 39)",
                padding: 0,
                textAlign: "center",
                borderRadius: 0,
                color: "text.secondary",
              }}
            >
              <CanvasBoard
                balls={balls}
                sinkPattern={sinkPattern}
                setBalance={setBalance}
                risk={risk}
                totalballs={totalballs}
                setTotalBalls={setTotalBalls}
              />
            </Box>
          </Grid>
  
        </Grid>

      </Box>
  
      </Box>

    </>
  );
};

export default GameBoard;
