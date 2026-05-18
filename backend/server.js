require('dotenv').config();

const express = require('express');
const colors = require('colors');
const cors = require('cors');

const connectDB = require('./config/db');
connectDB();

const { notFound, errorHandler } = require('./middleware/errorMiddleware'); 

const userRoutes = require('./routes/userRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

const app = express();

app.use(cors());

app.use(express.json());

// create a basic route to test the server
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Server running");
});

// define a port for the server to listen on for incoming network traffic
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`.yellow.bold));





