// Import the Express library, necessary to create a router
const express = require('express');

// This 'router' object will be used to define our user-specific routes
const router = express.Router();

// Import the registerUser function from our controller
const { registerUser, loginUser } = require('../controllers/userController');

// When a POST request is made to '/register', the registerUser controller function will be executed.
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;