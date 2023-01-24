import React, { useState} from 'react';
import { UserAuth } from "./context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { isValidEmail } from "./utility";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db} from './firebase';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from './assets/logo.png';

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

export default function Signup() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [password, setPassword] = useState("");
    const [setErrorMsg] = useState("");

    const { user, signUp } = UserAuth();

    if (user) navigate("/");

    const showError = (error) => {
      setErrorMsg(error);
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    };
 
    const onSubmit = async (e) => {
      e.preventDefault()
      if (!isValidEmail(email)) showError("Invalid email address");
      else if (password.length < 6)
        showError("Password must be at least 6 characters");
      if (isValidEmail(email) && password.length > 6) {
        const userQuery = query(
          collection(db, "user"),
          where("username", "==", email)
        );

        const users = await getDocs(userQuery);
        if (!users.empty) {
          setErrorMsg("User with this user already exists");
          navigate("/login");
        }
        if (users.empty) {
          const user = await signUp(email, password, fullname);
          if (user) {
            setEmail("");
            setFullname("");
            setPassword("");
            navigate("/");
          }

          if (!user)
            showError(
              "Sorry, your password was incorrect. Please double-check your password."
            );
        }
      }
    }
  
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            sx={{ height: 120 }}
            alt="Logo"
            src={logo}
          />
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="fullname"
                  label="Full Name"
                  name="fullname"
                  autoComplete="fullname"
                  onChange={(e) => setFullname(e.target.value)} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  )
}
