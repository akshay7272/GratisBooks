import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import Box from "@mui/material/Box";
import MuiPhoneNumber from "material-ui-phone-number-2";
import { db } from "./firebase";
import { UserAuth } from "./context/AuthContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

function DonateBook() {
  const { user } = UserAuth();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [yop, setYop] = useState("");
  const [phone, setPhone] = useState("");
  const [cover, setCover] = useState();
  const navigate = useNavigate();
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
    }
  };
  // Setting phone no. value
  const handleOnChange = (value) => {
    setPhone(value);
  };
  return (
    <>
      <Box sx={{display: "flex", flexDirection: "column", alignItems:"center", paddingTop:"2rem"}}>
        <Typography variant="h4" component="h2" >Donate Book</Typography>
        <TextField
          margin="normal"
          required
          label="Book title"
          name="book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoComplete=""
          autoFocus
          sx={{width:"80%"}}
        />
        <TextField
          margin="normal"
          required
          value={author}
          onChange={(text) => setAuthor(text.target.value)}
          label="Author"
          name="author"
          autoComplete=""
          autoFocus
          sx={{width:"80%"}}
        />
        <TextField
          margin="normal"
          required
          value={yop}
          onChange={(text) => setYop(text.target.value)}
          label="Year of Publication"
          name="email"
          autoComplete=""
          autoFocus
          sx={{width:"80%"}}
        />
        <MuiPhoneNumber
          margin="normal"
          required
          defaultCountry={"in"}
          value={phone}
          onChange={handleOnChange}
          variant="outlined"
          label="Phone Number"
          sx={{width:"80%"}}
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
          sx={{marginTop:"16px", marginBottom:"8px",width:"20%"}}
        >
          Submit
        </Button>
      </Box>
    </>
  );
}

export default DonateBook;
