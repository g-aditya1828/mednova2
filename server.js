const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI (Use your MongoDB URI here. This example uses MongoDB Atlas)
const mongoURI = "mongodb://localhost:27017/";

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define Visitor Schema
const visitorSchema = new mongoose.Schema({
  visitCount: {
    type: Number,
    default: 0,
  },
});

const Visitor = mongoose.model("Visitor", visitorSchema);

// Endpoint to track the number of visits
app.get("/track-visit", async (req, res) => {
  try {
    // Find the first document (assumes only one document for visit count)
    const visitor = await Visitor.findOne();

    if (!visitor) {
      // If no visitor record exists, create one
      const newVisitor = new Visitor({ visitCount: 1 });
      await newVisitor.save();
      return res.json({ message: "Visitor count initialized", count: 1 });
    } else {
      // Increment the visit count
      visitor.visitCount += 1;
      await visitor.save();
      return res.json({ message: "Visitor count updated", count: visitor.visitCount });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint to get the current visitor count
app.get('/visitor-count', async (req, res) => {
  try {
    const visitor = await Visitor.findOne({});
    res.json({ visitCount: visitor ? visitor.visitCount : 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching visitor count' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
