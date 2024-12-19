import express from 'express';
const router = express.Router();
import UserInfo from "../models/UserInfo.js";





router.post("/", async (req, res) => {
    try {
        const userEmail = req.user.email;
    
        let user = await UserInfo.findOne({ email: userEmail });
        if (!user) {
          user = new UserInfo({ email: userEmail, balance: 0 });
          await user.save();
          console.log("New user created:", userEmail);
          return res.status(200).json({ success: true, message: "User created.", user });
        }
    
        res.status(200).json({ success: true, message: "User logged in successfully.", user });
      } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Error during login.");
      }
});

export const authRoutes = router;
