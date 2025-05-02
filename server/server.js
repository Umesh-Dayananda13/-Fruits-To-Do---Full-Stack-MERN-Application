require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : process.env.FRONTEND_URL
}));

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};
connectDB();

// Schema and Model
const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Fruit name is required'],
    minlength: [2, 'Fruit name must be at least 2 characters'],
    trim: true
  }
});

const Fruits = mongoose.model('Fruits', fruitSchema, "fruits");

// Routes
app.get('/login', async (req, res) => {
  try {
    const fruits = await Fruits.find().lean();
    res.json({ fruits });
  } catch (err) {
    console.error('GET error:', err);
    res.status(500).json({ error: "Failed to retrieve fruits" });
  }
});

app.post('/add', async (req, res) => {
  try {
    const { fruit } = req.body;
    
    if (!fruit || typeof fruit !== 'string') {
      return res.status(400).json({ error: "Invalid fruit name" });
    }

    const newFruit = new Fruits({ name: fruit.trim() });
    await newFruit.save();
    
    const updatedFruits = await Fruits.find().lean();
    res.status(201).json({ fruits: updatedFruits });
    
  } catch (err) {
    console.error('POST error:', err);
    res.status(500).json({ 
      error: err.name === 'ValidationError' 
        ? err.message 
        : "Server error" 
    });
  }
});

// Delete Route
app.delete('/delete/:id', async (req, res) => {
  try {
    const deletedFruit = await Fruits.findByIdAndDelete(req.params.id);
    
    if (!deletedFruit) {
      return res.status(404).json({ error: "Fruit not found" });
    }
    
    const updatedFruits = await Fruits.find().lean();
    res.json({ fruits: updatedFruits });
    
  } catch (err) {
    console.error('DELETE error:', err);
    res.status(500).json({ error: "Failed to delete fruit" });
  }
});

// Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});