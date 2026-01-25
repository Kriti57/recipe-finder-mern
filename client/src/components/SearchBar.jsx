import React from 'react';

import { Box, TextField, Button } from '@mui/material';

/**
 * SearchBar component refactored with Material-UI.
 * @param {object} props - The component's props.
 * @param {string} props.query - The current value of the search input.
 * @param {function} props.setQuery - The function to update the search query state.
 * @param {function} props.handleSearch - The function to execute when the form is submitted.
 * @returns {React.ReactElement} A search form built with MUI components.
 */
const SearchBar = ({ query, setQuery, handleSearch }) => {
  return (
    <Box
      component="form"
      onSubmit={handleSearch}
      sx={{
        display: 'flex',      
        alignItems: 'center',  
        gap: 2,                
        marginBottom: 4,       
      }}
    >
      <TextField
        variant="outlined"
        label="Search for a recipe..."
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ height: '56px', padding: '0 30px' }}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
