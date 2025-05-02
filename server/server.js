// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Mongoose model
const Fruit = mongoose.model('Fruit', { name: String }, 'fruits');

// Routes

// Get all fruits
app.get('/login', async (req, res) => {
  try {
    const fruits = await Fruit.find();
    res.json({ fruits });
  } catch (err) {
    console.error("Error fetching fruits:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new fruit
app.post('/add', async (req, res) => {
  const { fruit } = req.body;
  try {
    const newFruit = new Fruit({ name: fruit });
    await newFruit.save();
    const fruits = await Fruit.find();
    res.json({ fruits });
  } catch (err) {
    console.error("Error adding fruit:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a fruit by ID
// Add this to your backend (Node.js/Express)
app.delete('/delete/:id', async (req, res) => {
    try {
      await Fruit.findByIdAndDelete(req.params.id);
      const allFruits = await Fruit.find();
      res.send({ fruits: allFruits });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting fruit");
    }
  });
  

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
