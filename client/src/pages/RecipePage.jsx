import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeById } from '../services/recipeService';
import { useAuth } from '../context/AuthContext.js';
import { addFavorite } from '../services/favoriteService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorComponent from '../components/ErrorComponent';
import { Container, Grid, Box, Typography, Button, Stack, Alert } from '@mui/material';

const RecipePage = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(recipeId);
        setRecipe(data);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [recipeId]);

  const handleSaveToFavorites = async () => {
    try {
      await addFavorite(recipe.idMeal);
      setFeedback({ message: 'Saved to favorites!', type: 'success' });
    } catch {
      setFeedback({ message: 'Failed to save recipe.', type: 'error' });
    }
  };

  const getIngredients = () => {
    if (!recipe) return [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient) ingredients.push(`${ingredient} - ${measure || ''}`);
    }
    return ingredients;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Container sx={{ py: 4 }}><ErrorComponent message={error} /></Container>;
  if (!recipe) return <Typography>Recipe not found.</Typography>;

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            component="img"
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={2}>
            <Typography variant="h3">{recipe.strMeal}</Typography>
            <Typography color="text.secondary">
              Category: {recipe.strCategory} | Area: {recipe.strArea}
            </Typography>
            {user && (
              <Button variant="contained" onClick={handleSaveToFavorites} sx={{ alignSelf: 'flex-start' }}>
                Save to Favorites
              </Button>
            )}
            {feedback.message && <Alert severity={feedback.type}>{feedback.message}</Alert>}
            <Box>
              <Typography variant="h5">Ingredients</Typography>
              {getIngredients().map((ing, index) => (
                <Typography key={index}>- {ing}</Typography>
              ))}
            </Box>
            <Box>
              <Typography variant="h5">Instructions</Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{recipe.strInstructions}</Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecipePage;