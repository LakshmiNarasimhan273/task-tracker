import React from 'react';
import { Button as MuiButton } from '@mui/material';

const Button = ({ children, onClick, bgColor, type }) => {
  return (
    <MuiButton
      onClick={onClick}
      type={type || "button"} // Default to "button" but allow overriding
      variant="contained"
      style={{
        backgroundColor: bgColor || '#1976d2', // Default blue color
        color: 'white',
      }}
    >
      {children}
    </MuiButton>
  );
};


export default Button;
