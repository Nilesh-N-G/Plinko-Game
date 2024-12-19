import express from 'express';
const router = express.Router();
import UserInfo from "../models/UserInfo.js";





router.post("/balance", async (req, res) => {
    try{
        console.log("Checking balance");
        const userEmail = req.user.email;
        const user = await UserInfo.findOne({email: userEmail});
        if(user.length===0) return res.status(404).json({error: 'User not found.'});
        return res.status(200).json({success: true, balance: user.balance});
      }catch(err){
        console.error('Error in getting user balance:', err);
        return res.status(500).json({error: 'Internal server error.'});
      }
});

router.post("/addBalance", async (req, res) => {
    try{
        const {amount} = req.body;
        console.log("Adding balance");
        const userEmail = req.user.email;
        const user = await UserInfo.findOne({email: userEmail});
        if(user.length===0) return res.status(404).json({error: 'User not found.'});
        
        // Validate the amount
        if (amount <= 0) {
          return res.status(400).json({ error: 'Invalid amount.' });
        }
    
        // Atomically update the user's balance
        const updatedUser = await UserInfo.findOneAndUpdate(
          { email: userEmail },
          { $inc: { balance: amount } },  // Increment the balance by the amount
          { new: true }  // Return the updated document
        );
    
        // Check if the update was successful
        if (!updatedUser) {
          return res.status(500).json({ error: 'Failed to update balance.' });
        }
    
        // Respond with the updated balance
        return res.status(200).json({ success: true, balance: updatedUser.balance });
      }catch(err){
        console.error('Error in getting user balance:', err);
        return res.status(500).json({error: 'Internal server error.'});
      }
});


export const ballanceRoutes = router;
