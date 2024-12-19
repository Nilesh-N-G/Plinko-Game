import express from 'express';
const router = express.Router();
import { sinks } from "../sinks.js"; 
import UserInfo from "../models/UserInfo.js";
const MAX_SINK_NUMBER = 15;
const DEFAULT_PROBABILITY = 0.5;

// Risk multipliers
const riskMultipliers = {
  low: [4, 1, 1, 1, 1, 1, 0.8, 0.5, 0.8, 1, 1, 1, 1, 1, 4],
  medium: [9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9],
  high: [15, 5, 2, 2, 1.6, 1.3, 1, 0.3, 1, 1.3, 1.6, 2, 2, 5, 15],
};



function calculateReturn(betAmount, risk) {
    if (betAmount <= 0) throw new Error("Bet amount must be greater than zero.");
    if (!riskMultipliers[risk]) throw new Error("Invalid risk level.");
  
    let sinkNumber = 1;
    for (let i = 1; i < MAX_SINK_NUMBER; i++) {
      if (Math.random() > DEFAULT_PROBABILITY) sinkNumber++;
    }
  
    sinkNumber = Math.min(sinkNumber, MAX_SINK_NUMBER);
    const multiplier = riskMultipliers[risk][sinkNumber - 1];
    const returnAmount = betAmount * multiplier;
    console.log(multiplier);
  
    return { sinkNumber, returnAmount, multiplier };
  }



router.post("/", async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { betAmount, risk, currentBalance } = req.body;

    if (!betAmount || !risk)
      return res.status(400).json({ error: "Missing required parameters." });
    if (!["low", "medium", "high"].includes(risk))
      return res.status(400).json({ error: "Invalid risk level." });

    // Calculate result
    const result = calculateReturn(betAmount, risk);
    const sinkPositions = sinks[result.sinkNumber];

    if (!sinkPositions)
      return res
        .status(404)
        .json({ error: "No sink positions found for the outcome." });

    // Fetch user and update balance atomically
    const user = await UserInfo.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ error: "User not found." });

    const newBalance =
      user.balance - betAmount + Number(result.returnAmount.toFixed(2));
    if (newBalance < 0)
      return res.status(400).json({ error: "Insufficient balance." });

    user.balance = newBalance;
    await user.save();

    const randomIndex = Math.floor(Math.random() * sinkPositions.length);
    const xValue = parseFloat(sinkPositions[randomIndex]);

    console.log("Return amount: " + result.returnAmount.toFixed(2));

    console.log(`User: ${userEmail}, New Balance: ${newBalance}`);
    res.json({
      sinkNumber: result.sinkNumber,
      x: xValue,
      multiplier: result.multiplier,
      returnAmount: result.returnAmount.toFixed(2),
      betAmt: betAmount,
      currentBalance: currentBalance.toFixed(2),
      newBalance: newBalance,
    });
  } catch (error) {
    console.error("Error in getBallPosition:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export const ballRoutes = router;
