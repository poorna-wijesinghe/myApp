const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
app.use(cors({
  origin: ["https://perfect-victory-production.up.railway.app/"], // ← add your real frontend domain
  credentials: true,
}));
app.use(express.json());

// Serve static files from "uploads" directory
const uploadsDir = path.join(__dirname, 'uploads');

// Create "uploads" folder if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error('MongoDB connection error:', err));
