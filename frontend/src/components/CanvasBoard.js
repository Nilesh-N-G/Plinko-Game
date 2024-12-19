import React from 'react'
import { Box } from '@mui/material';
import Canvas from './Canvas';
import PlinkoGame from './PlinkoGame';
import Simulate from './Simulate';
import Sim2 from './Sim2';

function CanvasBoard({balls,sinkPattern,setBalance,risk,totalballs,setTotalBalls}) {
  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      width: 'auto',
      height: {
        xs: 'auto', 
        sm: '50vh', 
        md: '79vh', 
      },
      padding: 0,
      paddingX:{
        xs: 0,
        sm: 2,
        md: 12,
      },
      backgroundColor: "rgb(17, 24, 39)",
      borderRadius: 2,
    }}
  >
    {/* <Box sx={{width:50}}></Box> */}
    <PlinkoGame balls={balls} sinkPattern={sinkPattern} setBalance={setBalance} risk={risk} totalballs={totalballs} setTotalBalls={setTotalBalls} />
    {/* <Simulate/> */}
    {/* <Sim2/> */}
  </Box>
  )
}

export default CanvasBoard
