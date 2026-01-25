import React from 'react';
import {Link} from 'react-router-dom';

import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from '@mui/material';

/**
 * @param {object} props - The component's props.
 * @param {object} props.recipe - The recipe object to display.
 * @returns {React.ReactElement} An interactive recipe card built with MUI.
 */

const RecipeCard = ({ recipe }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <CardActionArea
        component={Link}
        to={`/recipe/${recipe.idMeal}`}
        sx={{ flexGrow: 1 }}
      >

        <CardMedia
          component="img"
          height="200"
          image={recipe.strMealThumb}
          alt={recipe.strMeal}
        />

        <CardContent>

          <Typography gutterBottom variant="h6" component="div">
            {recipe.strMeal}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RecipeCard;