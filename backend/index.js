import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import admin from "firebase-admin";
import UserInfo from "./models/UserInfo.js";
import { sinks } from "./sinks.js"; // Replace with valid sink data

const app = express();
app.use(cors());
app.use(express.json());

// ================= Firebase Setup ================= //
const serviceAccount = {
  "type": "service_account",
  "project_id": "plinkogame-3471c",
  "private_key_id": "77793376fb4a7df12c72b5e23a0a7c706e6ad8d2",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzvuc1acx1Acl2\nqmr4I3eAswwKZL3RokvbjPExsU06J7u4dDd6A8xHjIQAtoKENZe6RIZQeQnDd+Ef\nvdpmgS7d0fUZUYkro7O4NyvFCdJdCCaTAWPvE7uHv5Dr1GnLOF4LlV7XvuQIgGJP\nITldIcZNxYYO9GOECohbcEqMjcf1lH8DYurlTpbL2/uA6wphBOEDR9fxAFx9Brz0\nbsY9SkuviVkJt0bDc+9gSFMb1t7eEP5pHU2WHk0/MyrH30dUANeod86oxq63V+1m\n0JdwqPgTuIMz7N39k0B8O9H+Q+St8/1bBeJC0zDhyPP9jsZklXTykeSueDS9gZD5\nBK1H68vdAgMBAAECggEACs/RxwH4k9TaGi/z3r39Zx79+1W7dZO6VeK4swlBRgf+\npUCiV03JWMgVkZho1IyHtk3UZByfuc5TxY3CiGtpVwY/z2MllIZ/MzZoWiy2JrVB\n4rz7lqAnJdTKohDaaz2rqdff3FYwZRLZ4adz30upNWOLUIoik/Ob5594cH4VGCBZ\nd4vszCWHAe/MUpIJOxPG7LZWwSwMFDXK82P2GOk0eW7gAQG1pxbCeO4vol7oV4BY\nyctoHfd9FLJuYkrVdphcuis3nLA/LzXoO5kvM1BQpu7l0IelZX7nQtEdQGpXa9uJ\nG/DvQJblTABMJjntgYl47/vFExSC8a34U/c24ONsEQKBgQD8UDN5Vw03CTAYfXP3\n4RHTfWb9CTtIRmJGbLFyIWoLMJByWI2YfHZUBZVhwKzQ0Fkkzl07ysvrWsSVqY+4\nGZUXSoc4apaXqvj1yYCFNaHQVrfG8UQekf+htvtjGrvY2sseMREm7jyDwOxlEOGN\nQKh7SBRi0hxl6xc6f+0XAmE3jQKBgQC2X0HMoTlRHmVdztLwEvfipZcH7g4Lci9M\n4Bi2DXNPrXlQVf6Tvv1gJh04AegT+BSvW2j2mQ579vBs4ltUXUy83RMnnixgAvF5\n5+89+TA15TglVUL/G0p92QSTTrsgfW+VQgkAkOcwHp7SolClhcU7xGjdAkBIUBMy\nwS8Vd3zpkQKBgQC2qv3JMFvx52X5pQHLiRfVzKk+MmvH9KT7pX+GSGi0tzEsh63j\nouAsDmrK/apf9ydCvWDEhBrERs+iJsNVHrhQx3VEQ+7I2VAq6fpw9pYy9kVQ86VE\nmKDBHG+9nUI4SpbZQd7QF5SaMpcyyFjzYcdYkaOos8M5ik0j3i/xA5kMlQKBgAiD\n4hqf3IFBHhKHOaoj+JcIjEi+gMFgD31TaVP2xM+Plf5+RWi4njQDE5It5JwqFS0q\n43fAJcD8ArXSy9jgklivKdnLtN62xHegsLcAD5Q0o656kKpAp/XAUEpgfrRBpxgd\nATaZjXHdvCSxl3pjCJaF0S+gj0fRFVRlWMFz1s1BAoGAXdReMybGWryu9trvG7Mp\nIz7FC5OA4RTpMxvdxWTh2YqIY71Ieo75Td/8O+B1sW2JBFeoRwaYo4pB/VTtyAGt\nLGnxp5+ktONm4teMUw3PTK8iBX0FzbIA6SiBk6mzN81eYOw9ewioyweBc8Rn3laI\nx2PAg0NH6X4WH5gkirxwT3s=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-48da9@plinkogame-3471c.iam.gserviceaccount.com",
  "client_id": "109089840723489770609",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-48da9%40plinkogame-3471c.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// ================= Middleware ================= //
// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Token required");

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user info to request
    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
    return res.status(401).send("Unauthorized: Invalid token");
  }
};

// ================= MongoDB Connection ================= //
mongoose
  .connect("mongodb+srv://Nilesh:abc%40123@scan2printcluster.ddvpt.mongodb.net/Scan2PrintDB?retryWrites=true&w=majority&appName=Scan2PrintCluster")
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ================= Constants ================= //
const MAX_SINK_NUMBER = 15;
const DEFAULT_PROBABILITY = 0.5;

// Risk multipliers
const riskMultipliers = {
  low: [4, 1, 1, 1, 1, 1, 0.8, 0.5, 0.8, 1, 1, 1, 1, 1, 4],
  medium: [9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9],
  high: [15, 5, 2, 2, 1.6, 1.3, 1, 0.3, 1, 1.3, 1.6, 2, 2, 5, 15],
};

// ================= Utility Functions ================= //
// Function to calculate the return
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

  return { sinkNumber, returnAmount, multiplier };
}

// ================= Routes ================= //
// Ball Position Calculation Route
app.post("/api/getBallPosition", verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { betAmount, risk,currentBalance } = req.body;

    if (!betAmount || !risk) return res.status(400).json({ error: "Missing required parameters." });
    if (!["low", "medium", "high"].includes(risk)) return res.status(400).json({ error: "Invalid risk level." });

    // Calculate result
    const result = calculateReturn(betAmount, risk);
    const sinkPositions = sinks[result.sinkNumber];

    if (!sinkPositions) return res.status(404).json({ error: "No sink positions found for the outcome." });

    // Fetch user and update balance atomically
    const user = await UserInfo.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ error: "User not found." });

    const newBalance = user.balance - betAmount + Number(result.returnAmount.toFixed(2));
    if (newBalance < 0) return res.status(400).json({ error: "Insufficient balance." });

    user.balance = newBalance;
    await user.save();

    const randomIndex = Math.floor(Math.random() * sinkPositions.length);
    const xValue = parseFloat(sinkPositions[randomIndex]);

    console.log("Return amount: " + result.returnAmount.toFixed(2))

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

// User Login Route
app.post("/login", verifyToken, async (req, res) => {
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

app.post('/api/balance', verifyToken, async (req, res) => {
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


app.post('/api/addBalance', verifyToken, async (req, res) => {
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
// Health Check Route
app.get("/health", (req, res) => {
  console.log("Health check passed.");
  res.status(200).send("OK");
});

// ================= Start Server ================= //
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
