// backend/server.js

console.log("--- SERVER.JS FILE IS EXECUTING (VERSION: LATEST) ---");

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs'; // <-- NEW: Import the File System module

// --- Import your API routes ---
import heroRoutes from './routes/hero.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import infoRoutes from './routes/info.routes.js';
import orderRoutes from './routes/order.routes.js';
import userRoutes from './routes/user.routes.js';
import footerRoutes from './routes/footer.routes.js';
import deliveryCostRoutes from './routes/deliveryCost.routes.js';
import logoRoutes from './routes/logo.routes.js';
import messageRoutes from './routes/message.routes.js';
import pixelRoutes from './routes/pixel.routes.js';
import convertRoutes from './routes/convert.routes.js';

// --- Essential Setup ---
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// --- NEW: Ensure the 'uploads' directory exists ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir);
    console.log(`Created directory: ${uploadsDir}`);
  } catch (error) {
    console.error(`Error creating directory ${uploadsDir}:`, error);
  }
}
// --- END NEW SECTION ---


// --- CORRECTED: Static File Serving ---
// This now correctly serves files from the 'uploads' folder.
app.use('/uploads', express.static(uploadsDir));

// --- API Route Registration ---
app.use('/api/hero', heroRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/delivery-costs', deliveryCostRoutes);
app.use('/api/logo', logoRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/pixels', pixelRoutes);
app.use('/api/convert', convertRoutes);

// --- Database Connection & Server Start ---
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in the .env file.");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully. The creative core is online.");
    app.listen(PORT, () => {
      console.log(`Server is orchestrating on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });