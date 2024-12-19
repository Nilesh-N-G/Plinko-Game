import React, { useState,useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  Typography,
} from "@mui/material";
import Divider from '@mui/material/Divider';

import '../App.css'

const BettingForm = ({button,risk,setRisk,betAmount,setBetAmount,balance ,setSinkPattern,patterns,balls}) => {
  const [ballsLength, setBallsLength] = useState(balls.current.length); // Track the length of balls.current

  // Effect to monitor changes to balls.current.length
  useEffect(() => {
    // Whenever balls.current changes, update the state
    setBallsLength(balls.current.length);
  }, [balls.current.length]); // Runs when balls.current.length changes
  
  return (
    <Box
      sx={{
        width: 'auto',
        height: {
            xs: 'auto', 
            sm: '50vh', 
            md: '70vh', 
          },
        padding: 4,
        backgroundColor: "rgb(51, 65, 85)",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {/* Bet Amount */}
      <Typography variant="body1" sx={{ color: "rgb(203,213,225)",textAlign:'left', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji"',fontSize:15,fontWeight:'normal',marginTop:3}}>
        Bet Amount
      </Typography>
      <Box sx={{ display: "flex", gap:0,backgroundColor:'rgb(71,85,105)',borderRadius:2,}}>
      {/* TextField for Bet Amount */}
      <TextField
      type="number"
      value={betAmount}
      onChange={(e) => setBetAmount(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start" sx={{ color: "#fff", fontSize: "20px" }}>
            $
          </InputAdornment>
          ),
        },
      }}
      inputProps={{ min: 0 }} 
      sx={{
        flex: 3, 
        backgroundColor: "#0F172A",
        border: "2px solid rgb(71,85,105)",
        color: "#fff",
        borderRadius:2,
        height: "40px", 
        "& .MuiInputBase-input": {
          color: "#fff",
          height: "8px", 
        },
      }}
    />

      <Button
        variant="contained"
        onClick={()=>{
          if(betAmount * 0.5> balance || betAmount<0){
            alert('Invalid Bet Amount or Insufficient Balance');
          }
          else{
            setBetAmount(prev => prev * 0.5);
          }
          
        }}
        sx={{
          backgroundColor: "rgb(71,85,105)",
          color: "#fff",
          width: "40px", 
          height: "40px", 
          border:0,
          boxShadow:'none',
          textTransform: "none",
          alignSelf: "center",
          "&:hover": {
            backgroundColor: "#2B374C",
          },
        }}
      >
        ½
      </Button>
      <Divider orientation="vertical" flexItem sx={{ borderColor: "black",height:30 ,alignSelf:'center'}} />

      {/* Button for 2× */}
      <Button
        variant="contained"
        onClick={()=>{
          if(betAmount * 2> balance){
            alert('Invalid Bet Amount or Insufficient Balance');
            return false;
          }
          else{
            setBetAmount(prev => prev * 2);
          }
          
        }}
        sx={{
          backgroundColor: "rgb(71,85,105)",
          color: "#fff",
          width: "40px", 
          height: "40px",
          border:0,
          boxShadow:'none', 
          textTransform: "none",
          alignSelf: "center",
          "&:hover": {
            backgroundColor: "#2B374C",
          },
        }}
      >
        2×
      </Button>
    </Box>

      {/* Risk */}
      <Typography variant="body1" sx={{ color: "rgb(203,213,225)",textAlign:'left', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji"',fontSize:15,fontWeight:'normal'}}>
        Risk
      </Typography>
      <Select
  id="custom-select"
  value={risk}
  onChange={(e) => {
    // Log to verify the change
    const selectedRisk = e.target.value;
    console.log("Selected Risk: ", selectedRisk);

    // Update the risk state
    setRisk(selectedRisk);

    // Update sinkPattern based on selected risk
    const selectedPattern = patterns[selectedRisk];
    console.log("Selected Pattern: ", selectedPattern);
    
    // Set the new sinkPattern
    setSinkPattern(selectedPattern);
  }}
  fullWidth
  disabled={ballsLength > 0} // Disable based on the reactive state `ballsLength`
  sx={{
    backgroundColor: "#0F172A",
    color: "#fff", // Ensure the text color remains white
    height: "40px",
    border: 2,
    borderColor: 'rgba(71,85,105)',
    boxShadow: 'none',
    textTransform: "none",
    alignSelf: "center",
    textAlign: "left",
    borderRadius: 2,
    opacity: ballsLength > 0 ? 0.5 : 1, // Reduce opacity when disabled
    "& .MuiSelect-select": {
      color: "#fff", // Keep text color white even when disabled
    },
    "& .MuiSelect-icon": {
      color: "#fff", // Ensure the icon color remains white
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "none !important",
      },
      "&:hover fieldset": {
        border: "none !important",
      },
      "&.Mui-focused fieldset": {
        border: "none !important",
      },
    },
    "& .MuiInputBase-root.Mui-focused": {
      outline: "none !important",
    },
    "& .MuiSelect-root:focus": {
      border: "none !important",
    },
  }}
  MenuProps={{
    PaperProps: {
      sx: {
        backgroundColor: ballsLength > 0 ? "rgba(0, 0, 0, 0.6)" : "black", // Light black when disabled
        color: "#fff", // Keep text color white in the dropdown
        borderRadius: "8px",
      },
    },
  }}
>
  <MenuItem className="menuitem" sx={{color:'#fff !important'}} value="low" disabled={ballsLength > 0}>Low</MenuItem>
  <MenuItem className="menuitem" value="medium" disabled={ballsLength > 0}>Medium</MenuItem>
  <MenuItem className="menuitem" value="high" disabled={ballsLength > 0}>High</MenuItem>
</Select>



      {/* Drop Ball Button */}
       {React.cloneElement(button)}
    </Box>
  );
};

export default BettingForm;
