const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Loads variables from .env file

const app = express();
app.use(cors());              // Allow frontend to connect
app.use(express.json());      // Parse incoming JSON

// Import routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");   // NEW: import task routes

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);   // NEW: use task routes

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB Connected");
  app.listen(process.env.PORT || 5003, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`)
  );
})
.catch((err) => console.error("DB connection error:", err));

