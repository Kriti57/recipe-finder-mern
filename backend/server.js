require('dotenv').config();

const express = require('express');
const colors = require('colors');
const cors = require('cors');

const connectDB = require('./config/db');
connectDB();

const { notFound, errorHandler } = require('./middleware/errorMiddleware'); 

const userRoutes = require('./routes/userRoutes');

console.log("USER ROUTES LOADED");

const favoriteRoutes = require('./routes/favoriteRoutes');

const app = express();

const corsOptions = {
  origin: "https://recipe-finder-with-favs.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.yellow.bold)
);