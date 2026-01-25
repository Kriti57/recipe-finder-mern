const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get all favorite recipes for a user
 * @route   GET /api/favorites
 * @access  Private
 */
const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user.favorites);
});

/**
 * @desc    Add a recipe to user's favorites
 * @route   POST /api/favorites
 * @access  Private
 */
const addFavorite = asyncHandler(async (req, res) => {
  const { recipeId } = req.body;

  if (!recipeId) {
    res.status(400);
    throw new Error('Recipe ID is required');
  }

  const user = await User.findById(req.user._id).select('+favorites');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isAlreadyFavorite = user.favorites.some(
    (fav) => fav.recipeId === recipeId
  );

  if (isAlreadyFavorite) {
    res.status(400);
    throw new Error('Recipe is already in favorites');
  }

  user.favorites.push({ recipeId });
  await user.save();

  res.status(201).json({
    message: 'Recipe added to favorites successfully',
    favorites: user.favorites,
  });
});

/**
 * @desc    Update the notes for a favorite recipe
 * @route   PUT /api/favorites/:recipeId
 * @access  Private
 */
router.put('/:recipeId', protect, async (req, res) => {
  try {
    const {recipeId} = req.params;
    const {notes} = req.body;

    if(notes === undefined) {
      return res.status(400).json({message: 'Notes field is required'});
    }

    const updatedUser = await User.findOneAndUpdate(
      {_id: req.user.id, 'favorites.recipeId': recipeId},
      {$set: {'favorites.$.notes': notes}},
      {new: true}
    );

    if (!updatedUser) {
      return res.status(404).json({message: 'Favorite recipe not found for this user.'});
    }

    res.status(200).json({
      message: 'Notes updated successfully',
      favorites: updatedUser.favorites,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Server Error'});
  }
});

/**
 * @desc    Remove a recipe from user's favorites
 * @route   DELETE /api/favorites/:recipeId
 * @access  Private
 */
const removeFavorite = asyncHandler(async (req, res) => {
  const { recipeId } = req.params;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { favorites: { recipeId } },
    },
    { new: true }
  );

  if (!updatedUser) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    message: 'Recipe removed from favorites successfully',
    favorites: updatedUser.favorites,
  });
});

router
  .route('/')
  .get(protect, getFavorites)
  .post(protect, addFavorite);

router
  .route('/:recipeId')
  .delete(protect, removeFavorite);

module.exports = router;
