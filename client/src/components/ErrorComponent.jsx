import React from 'react';
import {Box, Typography, Alert, AlertTitle} from '@mui/material';

import ReportProblemIcon from '@mui/icons-material/ReportProblem';

/** 
 * @param {object} props - The component's props.
 * @param {string} props.message - The error message to display. Defaults to a generic message.
 * @returns {React.ReactElement} An error display component.
 */
const ErrorComponent = ({ 
    message= 'An unexpected error occured. Please try again later.',
}) => {
    return (
        <Alert 
            severity="error"
            icon={<ReportProblemIcon fontSize="inherit" />}
            sx={{
                mt:4,
                mx:'auto',
                maxWidth:'600px',
            }}
        >
            <AlertTitle>Error</AlertTitle>
            <Typography variant="body1">
                {message}
            </Typography>
        </Alert>
    );
};

export default ErrorComponent;