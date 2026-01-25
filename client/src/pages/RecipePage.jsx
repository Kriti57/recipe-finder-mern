import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeById } from '../services/recipeService';
import { AuthContext } from '../context/AuthContext';
import { addFavorite } from '../services/favoriteService';
import LoadingSpinner from '../components/LoadingSpinner';

import ErrorComponent from '../components/ErrorComponent';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Stack,
  Alert,
} from '@mui/material';

const RecipePage = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(recipeId);
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
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

  if (loading) return <LoadingSpinner />;
  if (!recipe) return <Typography>Recipe not found.</Typography>;

  const getIngredients = () => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (recipe[`strIngredient${i}`]) {
        ingredients.push(
          `${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}`
        );
      }
    }
    return ingredients;

    if (error) {
      return (
        <Container sx={{ py: 4 }}>
          <ErrorComponent message={error} />
        </Container>
      );
    }

  };

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md:5}}>
          <Box
            component="img"
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
          />
        </Grid>

        <Grid size={{ xs: 12, md:5}}>
          <Stack spacing={2}>
            <Typography variant="h3">{recipe.strMeal}</Typography>

            <Typography color="text.secondary">
              Category: {recipe.strCategory} | Area: {recipe.strArea}
            </Typography>

            {user && (
              <Button
                variant="contained"
                onClick={handleSaveToFavorites}
                sx={{ alignSelf: 'flex-start' }}
              >
                Save to Favorites
              </Button>
            )}

            {feedback.message && (
              <Alert severity={feedback.type}>{feedback.message}</Alert>
            )}

            <Box>
              <Typography variant="h5">Ingredients</Typography>
              {getIngredients().map((ing, index) => (
                <Typography key={index}>- {ing}</Typography>
              ))}
            </Box>

            <Box>
              <Typography variant="h5">Instructions</Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {recipe.strInstructions}
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecipePage;
