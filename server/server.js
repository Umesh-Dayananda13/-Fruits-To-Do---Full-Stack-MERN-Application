 require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// MongoDB connection using environment variable
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("connected to mongodb");
}).catch((err) => {
    console.log(err);
});

const Fruits = mongoose.model('Fruits', { name: String }, "fruits");

// Routes
app.get('/login', (req, res) => {
    Fruits.find().then((data) => {
        res.send({ fruits: data });
        console.log(data);
    }).catch((err) => {
        console.log(err);
        
    });
});

app.post('/add', async (req, res) => {
    const { fruit } = req.body;
    try {
        const newFruit = new Fruits({ name: fruit });
        await newFruit.save();
        const allFruits = await Fruits.find();
        res.send({ fruits: allFruits });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding fruit");
    }
});

// Server start using environment variable
app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});