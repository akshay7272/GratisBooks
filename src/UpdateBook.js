import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import MuiPhoneNumber from "material-ui-phone-number-2";
import { db } from "./firebase";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { storage } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

const UpdateBook = () => {
  let location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState(location.state.item.data.title);
  const [author, setAuthor] = useState(location.state.item.data.author);
  const [yop, setYop] = useState(location.state.item.data.yop);
  const [phone, setPhone] = useState(location.state.item.data.phone);
  const [cover, setCover] = useState(location.state.item.data.cover);
  const theme = createTheme();
  // Updating Cover Image
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

  // Handling Phone value
  const handleOnChange = (value) => {
    setPhone(value);
  };
  // Updating Fields in Firebase Database
  const postData = async () => {
    if (!title || !author || !yop || !phone || !cover) {
      alert("please fill all fields");
      return;
    }

    try {
      await updateDoc(doc(db, "books", `${location.state.item.id}`), {
        title,
        author,
        yop,
        phone,
        cover,
        isBooked: false,
      })
        .then((res) => alert("updated successfully"))
        .catch((err) => alert("error"));
      navigate("/");
    } catch (err) {
      alert("someThing went wrong. try again");
    }
  };
  useEffect(() => {
    console.log(location.state.item.data.title);
  });

  return (
    <>
     <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box sx={{display: "flex", flexDirection: "column", alignItems:"center", paddingTop:"2rem"}}>
            <Typography variant="h4" component="h2" >Welcome to update page</Typography>
            {title}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Book title"
              name="book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoComplete=""
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={author}
              onChange={(text) => setAuthor(text.target.value)}
              label="Author"
              name="author"
              autoComplete=""
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={yop}
              onChange={(text) => setYop(text.target.value)}
              label="Year of Publication"
              name="email"
              autoComplete=""
              autoFocus
            />
            <MuiPhoneNumber
              margin="normal"
              defaultCountry={"in"}
              value={phone}
              onChange={handleOnChange}
              fullWidth
              variant="outlined"
              label="Phone Number"
            />
            <Box sx={{display:"flex" , alignItems:"center", justifyContent:"center"}}>
              <Button variant="contained" margin="normal"  component="label" sx={{marginTop:"16px", marginBottom:"8px", width:"80%"}}>
                <input
                  id="photo"
                  accept="image/*"
                  type="file"
                  onChange={uploadImage}
                />
              </Button>
            </Box>
            <Box sx={{display:"flex" , alignItems:"center",width:"70%", justifyContent:"space-between"}}>
              <Button variant="contained" onClick={postData} sx={{marginTop:"16px", marginBottom:"8px"}}>
                Update
              </Button>
              <Button variant="contained" margin="normal" sx={{marginTop:"16px", marginBottom:"8px"}}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};
export default UpdateBook;
