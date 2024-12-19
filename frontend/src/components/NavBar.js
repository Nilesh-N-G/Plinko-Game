import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Popover, Menu, MenuItem, IconButton } from "@mui/material";
import { getAuth } from "firebase/auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import axios from "axios";
const NavBar = ({ balance, setBalance, userInfo }) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [menuAnchor, setMenuAnchor] = useState(null); // Renamed anchorEl to menuAnchor

  // Open the dropdown menu
  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  // Close the dropdown menu
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const openMenu = Boolean(menuAnchor); // Boolean to check if menu is open

  const handleButtonClick = async (value) => {
    // alert(`You clicked ${value}`);
    const user = getAuth().currentUser;
    const token = await user.getIdToken(true);
    // console.log(token);
    const response = await axios.post(
      "http://localhost:3000/api/addBalance",
      { amount: value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      // console.log(typeof value);
      setBalance(Number(balance) + Number(value));
    }
    handleClose();
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // console.log("User logged out");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };
  return (
    <AppBar
      position="sticky" // Makes the navbar sticky
      sx={{ backgroundColor: "#2c3e50", top: 0, zIndex: 1100 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Section */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontFamily: "'Pacifico', cursive",
            color: "#fff",
            fontSize: "24px",
          }}
        >
          Plinko
        </Typography>

        {/* Center Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            backgroundColor: "#34495e",
            padding: "4px 8px",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="body1"
            component="div"
            sx={{ color: "#fff", fontSize: {
              xs: "12px",
              sm: "12px",
              md: "16px",
              lg: "18px",
            } }}
          >
            $ {balance.toFixed(2)}
          </Typography>
          <div>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#3b82f6",
                color: "#fff",
                textTransform: "none",
                "&:hover": { backgroundColor: "#2563eb" },
              }}
              onClick={handleClick}
            >
              Add
            </Button>

            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              sx={{
                padding: 1,
                bgcolor: "transparent", // Make sure background stays transparent
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <Box sx={{ display: "flex", gap: 2, padding: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#388E3C" },
                  }}
                  onClick={() => handleButtonClick("+100")}
                >
                  +$100
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#388E3C" },
                  }}
                  onClick={() => handleButtonClick("+500")}
                >
                  +$500
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#388E3C" },
                  }}
                  onClick={() => handleButtonClick("+1000")}
                >
                  +$1000
                </Button>
              </Box>
            </Popover>
          </div>
        </Box>

        <Box>
          {/* Profile Button */}
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
            onClick={handleMenuClick}
          >
            <Typography>{userInfo.displayName}</Typography>
            <IconButton sx={{paddingX:{
              xs: 0,
              sm: 0,
              md: 1,
              lg: 1,
            }}}>
              {userInfo.photoURL ? (
                <Box
                  component="img"
                  src={userInfo.photoURL}
                  alt={userInfo.displayName || "User"}
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <AccountCircleIcon sx={{ fontSize: 40, color: "#aaa" }} />
              )}
            </IconButton>
          </Box>
          {/* {console.log(userInfo)} */}

          {/* Dropdown Menu */}
          <Menu
            anchorEl={menuAnchor} // Updated variable name here
            open={openMenu}
            onClose={handleMenuClose}
            MenuListProps={{ sx: { padding: 1, minWidth: 150 } }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem disabled>
              <Typography variant="body1" fontWeight="bold">
              {userInfo.displayName || "User"}
              </Typography>
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{
                "&:hover": {
                  backgroundColor: "#f87171",
                  color: "#fff",
                },
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
