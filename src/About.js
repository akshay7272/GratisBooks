import React from 'react';
import { Container, Toolbar } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function About() {
  return (
    <Container>
        <Typography 
        variant="h4"
        component="h2"
        sx={{ textAlign: "center" }}>
            This is About page.
            Please Read Carefully.
        </Typography>
    </Container>
  )
}
