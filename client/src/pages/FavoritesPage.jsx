import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { getFavorites, removeFavorite, updateFavoriteNote } from '../services/favoriteService';
import { getRecipeById } from '../services/recipeService';
import RecipeCard from '../components/RecipeCard';
import './FavoritesPage.css';
import LoadingSpinner from '../components/LoadingSpinner';

import ErrorComponent from '../components/ErrorComponent';
import {Box, Container, Grid, Typography, Button, Paper} from '@mui/material';

import NotesEditModal from '../components/NotesEditModal';

const FavoritesPage = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
  if (authLoading || !user) return;

  const fetchAndProcessFavorites = async () => {
    try {
      setError(null);
      setLoading(true);

      const favoriteObjects = await getFavorites();

      if (favoriteObjects.length === 0) {
        setFavoriteRecipes([]);
        return;
      }

      const recipeIds = favoriteObjects.map(fav => fav.recipeId);
      const fetchedRecipeDetails = await Promise.all(
        recipeIds.map(id => getRecipeById(id))
      );

      const combinedFavorites = fetchedRecipeDetails.map(recipe => {
        const userFavoriteData = favoriteObjects.find(
          fav => fav.recipeId === recipe.idMeal
        );

        return {
          ...recipe,
          notes: userFavoriteData ? userFavoriteData.notes : '',
        };
      });

      setFavoriteRecipes(combinedFavorites);

    } catch (err) {
      setError(err.message || 'An error occurred while fetching your favorites.');
    } finally {
      setLoading(false);
    }
  };

  fetchAndProcessFavorites();
}, [user, authLoading]);


  /**
   * @param {string} recipeId - The ID of the recipe to remove.
   */
  const handleRemoveFavorite = async (recipeId) => {
    try {
        await removeFavorite(recipeId);
        setFavoriteRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.idMeal !== recipeId)
    );
    } catch (err) {
        console.error('Failed to remove favorites:', err);
        alert(err.message || 'Could not remove favorite recipe. Please try again.');
    }
  };

  const handleOpenModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleSaveNotes = async (recipeId, newNotes) => {
    try {
      await updateFavoriteNote(recipeId, newNotes);
      setFavoriteRecipes(prevRecipes =>
        prevRecipes.map(recipe => {
          if (recipe.idMeal === recipeId) {
            return {...recipe, notes: newNotes};
          }
          return recipe;
        })
      );
      handleCloseModal();

    } catch (err) {
      console.error('Failed to saved notes:', err);
      alert(err.message || 'Could not save notes. Please try again.');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <Container sx={{py:4}}>
        <ErrorComponent message={error} />
      </Container>
    );
  }

  return (
    <>
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        My Favorite Recipes
      </Typography>
      
      {favoriteRecipes.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
          You haven't saved any favorite recipes yet. Start exploring!
        </Typography>
      ) : (
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {favoriteRecipes.map(recipe => (
            <Grid item key={recipe.idMeal} xs={12} sm={6} md={4} lg={3}>
              <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
              <Box>
                <RecipeCard recipe={recipe} />
              </Box>  
              <Paper
                variant= "outlined"
                sx={{
                  p:2,
                  mt:-1,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  bgcolor: 'background.default'
                }}
              >
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb:1,
                }}>
                
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb:1}}>
                  My Notes:
                </Typography>

                <Button 
                  variant="outlined"
                  size="small"
                  onClick={() => handleOpenModal(recipe)}
                >
                  Edit
                </Button>

                </Box>

                {recipe.notes ? (
                  <Typography variant="body2" sx={{fontStyle: 'italic', whiteSpace: 'pre-wrap'}}>
                    {recipe.notes}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      No notes yet. Add one!
                  </Typography>
                )}

              </Paper>

              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleRemoveFavorite(recipe.idMeal)}
                sx={{ mt: 1 }}
              >
                Remove
              </Button>
              </Box> 
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
    
    {selectedRecipe && (
      <NotesEditModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        recipe={selectedRecipe}
        onSave={handleSaveNotes}
      />
    )}
    </>
  );
};

export default FavoritesPage;
