import React from "react";
import { useRef, useState, useEffect } from "react";
import GameBoard from "./components/GameBoard";
import { Box } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/firebaseConfig";
import Button from "@mui/material/Button";
import SignIn from "./components/HomePage";
import Layout from "./components/Layout";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { getAuth } from 'firebase/auth';
const DECIMAL_MULTIPLIER = 10000;
const ballRadius = 7;

function App() {
  const pad = (n) => n * DECIMAL_MULTIPLIER;

  const balls = useRef([]);
  const [totalballs, setTotalBalls] = useState([]);

  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState({
    email: "",
    photoURL: "",
    displayName: "",
  });

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserInfo({
          email: currentUser.email || "No Email",
          photoURL: currentUser.photoURL || "",
          displayName: currentUser.displayName || "User", // Add displayName fallback
        });
      } else {
        setUser(null);
        setUserInfo({ email: "", photoURL: "", displayName: "" });
      }
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const fetchBalance = async () => {
      try {
        console.log("Fetching balance")
        const user = getAuth().currentUser;
        if (user) {
          const token = await user.getIdToken(true);
          console.log(token);
          const response = await axios.post('http://localhost:3000/api/balance', {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setBalance(response.data.balance);
          console.log(response.data.balance);
        } else {
          console.log('No user signed in');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchBalance();
  }, [user]);

  const [betAmount, setBetAmount] = useState(1);
  const [risk, setRisk] = useState("low");

  // Store patterns as a mapping object
  const patterns = {
    low: [4, 1, 1, 1, 1, 1, 0.8, 0.5, 0.8, 1, 1, 1, 1, 1, 4],
    medium: [9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9],
    high: [15, 5, 2, 2, 1.6, 1.3, 1, 0.3, 1, 1.3, 1.6, 2, 2, 5, 15],
  };
  const [sinkPattern, setSinkPattern] = useState(patterns["low"]);
  const [balance, setBalance] = useState(0);

  const addBall = async () => {
    try {
      const user = getAuth().currentUser;
      const token = await user.getIdToken(true);
      console.log(token);
      
      const payload = {
        betAmount: betAmount, // Replace with actual bet amount
        risk: risk, // Replace with "low", "medium", or "high" based on your UI
        currentBalance: balance, 
      };
      console.log(payload);
      setBalance((prevBalance) => Math.max((prevBalance - betAmount),0));
      // Make a request to the backend to send x and multiplier
      const response = await axios.post(
        "http://localhost:3000/api/getBallPosition",
        payload, 
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Authorization header
          },
        }
      );
      const { 
        sinkNumber, 
        x: newX, 
        multiplier: newMultiplier, 
        returnAmount, 
        betAmt,
        currentBalance ,
        newBalance,

      } = response.data;


      const newBall = {
        x: pad(newX),
        y: pad(50),
        initialX: pad(newX),
        initialY: 50,
        radius: ballRadius,
        color: "red",
        vx: 0,
        vy: 0,
        multiplier: newMultiplier,
        returnAmount:returnAmount,
        betAmt:betAmt,
        currentBalance : currentBalance ,
        newBalance : newBalance,
      
      };

      balls.current.push(newBall);
      setTotalBalls([...balls.current]);
      console.log("Ball added:", newBall);
    } catch (error) {
      console.error("Error adding ball:", error);
    }
  };
  // Define the onClick handler
  const handleDropClick = () => {
    console.log("Button clicked!");

    if(balance<=0 || balance<betAmount){
      alert("Insufficient funds. Please top up your balance.");
      return;
    }else{
      addBall();
    }
    
   
  };

  // Store the button in a variable with the onClick handler
  const buttonElement = (
    <Button
      variant="contained"
      fullWidth
      sx={{
        backgroundColor: "#22C55E",
        color: "black",
        fontWeight: "bold",
        textTransform: "none",
        marginTop: 3,
        height: "50px",
        borderRadius: "8px",
        boxShadow: "none",
        fontSize: 15,
        "&:hover": {
          backgroundColor: "#16A34A",
        },
      }}
      onClick={handleDropClick}
    >
      Drop Ball
    </Button>
  );

  return (
    <>
      <Router>
      <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/game" /> : <SignIn />}
            />
            <Route element={<Layout userInfo={userInfo} balance={balance} user={user} setBalance={setBalance}/>}>
              {" "}
              {/* Wrap these routes with Layout */}
              <Route
                path="/game"
                element={
                  user ? (
                    <Box sx={{ background: "rgb(31,45,55)", height: "auto" }}>
                    <GameBoard
                      button={buttonElement}
                      balls={balls}
                      sinkPattern={sinkPattern}
                      betAmount={betAmount}
                      setBetAmount={setBetAmount}
                      risk={risk}
                      setRisk={setRisk}
                      balance={balance}
                      setBalance={setBalance}
                      setSinkPattern={setSinkPattern}
                      patterns={patterns}
                      totalballs={totalballs}
                      setTotalBalls={setTotalBalls}

                    />
                  </Box>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              {/* <Route
                path="/qr-code"
                element={
                  user ? (
                    <ManageQRCode userInfo={userInfo} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              /> */}
              {/* <Route path="/account-settings" element={user ? <AccountSettings /> : <Navigate to="/" />} /> */}
            </Route>
          </Routes>
      </Router>
    </>
  );
}

export default App;
