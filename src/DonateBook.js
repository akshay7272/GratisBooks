import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import Box from "@mui/material/Box";
import MuiPhoneNumber from "material-ui-phone-number-2";
import { db } from "./firebase";
import CssBaseline from '@mui/material/CssBaseline';
import { UserAuth } from "./context/AuthContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { storage } from "./firebase";
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from "dayjs";

function DonateBook() {
  const { user } = UserAuth();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [yop, setYop] = useState(dayjs(''));
  const [phone, setPhone] = useState("");
  const [cover, setCover] = useState();
  const navigate = useNavigate();
  const theme = createTheme();
  // Getting book Image Upload from Local computer
  const uploadImage = (e) => {
    const imageRef = ref(storage, `items/${Date.now()}`);
    uploadBytes(imageRef, e.target.files[0]).then((snapshot) => {
      console.log(snapshot, "snapshot");
      getDownloadURL(snapshot.ref).then(
        (url = URL.createObjectURL(e.target.files[0])) => {
          setCover(url);
          console.log(url, "cover");
        }
      );
    });
  };
  // Adding book data to Firebase Firestore
  const postData = async () => {
    if (!title || !author || !yop || !phone || !cover) {
      alert("please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "books"), {
        title,
        author,
        yop,
        phone,
        uid: user.uid,
        photo: user.photoURL,
        cover,
        likes: 0,
        comments: [],
        isBooked: false,
      });
      alert("posted successfully");
      navigate("/");
    } catch (err) {
      alert("someThing went wrong. try again");
      console.log(err);
    }
  };
  // Setting phone no. value
  const handleOnChange = (value) => {
    setPhone(value);
  };
  // Setting Year of Publication
  const handleChange = (date) => {
    setYop(date.$y);
    console.log(date.$y);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box sx={{display: "flex", flexDirection: "column", alignItems:"center", paddingTop:"2rem"}}>
            <Typography variant="h4" component="h2" >Donate Book</Typography>
            <TextField
              margin="normal"
              required
              label="Book title"
              name="book title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoComplete=""
              autoFocus
            />
            <TextField
              margin="normal"
              required
              value={author}
              fullWidth
              onChange={(text) => setAuthor(text.target.value)}
              label="Author"
              name="author"
              autoComplete=""
              autoFocus
            />
            <>
              <div className="date">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={3}>
                    <DatePicker
                      className="date"
                      views={['year']}
                      fullWidth
                      label="Year of Publication"
                      value={yop}
                      onChange={handleChange}
                      name="yop"
                      autoComplete=""
                      renderInput={(e) => <TextField {...e}/>}
                    />
                  </Stack>
                </LocalizationProvider>
              </div>
            </>
            
            <MuiPhoneNumber
              margin="normal"
              required
              defaultCountry={"in"}
              fullWidth
              value={phone}
              onChange={handleOnChange}
              variant="outlined"
              label="Phone Number"
            />
            <Box sx={{display:"flex" , flexDirection:"column-reverse", alignItems:"center", justifyContent:"center"}}>
              <Button variant="contained" margin="normal"  component="label" sx={{marginTop:"16px", marginBottom:"8px", width:"80%"}}>
                <input
                  id="photo"
                  accept="image/*"
                  type="file"
                  onChange={uploadImage}
                />
              </Button>
            </Box>
            <Button
              variant="contained"
              margin="normal"
              type="submit"
              onClick={postData}
              sx={{marginTop:"16px", marginBottom:"8px"}}
            >
              Submit
            </Button>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default DonateBook;
