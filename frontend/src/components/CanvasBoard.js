import React from 'react'
import { Box } from '@mui/material';
import PlinkoGame from './PlinkoGame';

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
        md: 8,
      },
      backgroundColor: "rgb(17, 24, 39)",
      borderRadius: 2,
    }}
  >

    <PlinkoGame balls={balls} sinkPattern={sinkPattern} setBalance={setBalance} risk={risk} totalballs={totalballs} setTotalBalls={setTotalBalls} />

  </Box>
  )
}

export default CanvasBoard
