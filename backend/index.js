import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import admin from "firebase-admin";
import dotenv from 'dotenv';
import { verifyToken } from "./middlewares/authMiddleware.js";
import { ballRoutes } from './routes/ballRoutes.js'
import { authRoutes } from './routes/authRoutes.js'
import { ballanceRoutes } from './routes/ballanceRoutes.js'
const app = express();






// Middleware
app.use(cors({
  origin: '*', 
  credentials: true 
}));
app.use(express.json());
dotenv.config();



const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};




if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}


// ================= MongoDB Connection ================= //
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Routes
app.use('/api/getBallPosition', verifyToken, ballRoutes);
app.use('/login', verifyToken, authRoutes);
app.use('/api', verifyToken, ballanceRoutes);





// Health Check Route
app.get("/health", (req, res) => {
  console.log("Health check passed.");
  res.status(200).send("OK");
});

// ================= Start Server ================= //
// const PORT = process.env.PORT || 4000;
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
;