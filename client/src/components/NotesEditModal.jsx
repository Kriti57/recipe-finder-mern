import React, {useState, useEffect} from 'react';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography
} from '@mui/material';

/**
 * A modal dialog for editing the notes of a favorite recipe.
 * @param {object} props - The component's props.
 * @param {boolean} props.open - Controls if the modal is open or closed.
 * @param {function} props.onClose - Function to call when the modal should be closed.
 * @param {object} props.recipe - The recipe object being edited.
 * @param {function} props.onSave - Function to call when the user clicks 'Save'.
 * @returns {React.ReactElement} A dialog component.
 */

const NotesEditModal = ({open, onClose, recipe, onSave}) => {
    const [notesText, setNotesText] = useState('');

    useEffect(() => {
        if (recipe) {
            setNotesText(recipe.notes);
        }
    }, [recipe]);

    const handleSave = () => {
        onSave(recipe.idMeal, notesText);
    };

    if (!recipe) {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Notes for {recipe.strMeal}</DialogTitle>
            <DialogContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Add or Update your personal notes for this recipe.
                </Typography>
                <TextField 
                    autoFocus
                    margin="dense"
                    id="notes"
                    label="Your Personal Notes"
                    type="text"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    /> 
            </DialogContent>
            <DialogActions sx={{p:'0 24px 24px'}}>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NotesEditModal;