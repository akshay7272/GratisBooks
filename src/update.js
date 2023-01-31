import React, {useState, useEffect} from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

function Update() {
    function Copyright(props) {
        return (
          <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        );
    }
    const theme = createTheme();
    const auth = getAuth();
    const [name, setName] = useState('');
    const [photo, setPhoto]= useState('');
    const handleUpdate = async (e) => {
        e.preventDefault();
        updateProfile(auth.currentUser, {
            displayName: {name}, photoURL: {photo}
          }).then(() => {
            // Profile updated!
            // ...
          }).catch((error) => {
            // An error occurred
            // ...
          });
    }
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xl">
            <Typography component="h1" variant="h5">
            Update Profile
          </Typography>
          <Box component="form" onSubmit={handleUpdate} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update
            </Button>
          </Box>
            </Container>
        </ThemeProvider>
    )
};

export default Update