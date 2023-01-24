import React, { useState} from "react";
import { collection, addDoc} from "firebase/firestore";
import Box from "@mui/material/Box";
import MuiPhoneNumber from "material-ui-phone-number-2";
import { db } from "./firebase";
import { UserAuth } from "./context/AuthContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { storage } from "./firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { useNavigate } from "react-router-dom";

function DonateBook() {
  const { user } = UserAuth();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [yop, setYop] = useState("");
  const [phone, setPhone] = useState("");
  const [cover, setCover] = useState();
  const navigate = useNavigate();

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
        cover,
        isBooked: false,
      });
      alert("posted successfully");
      navigate("/");
    } catch (err) {
      alert("someThing went wrong. try again");
    }
  };

  const handleOnChange = (value) => {
    setPhone(value);
  };
  return (
    <>
      <div>DonateBook Page Data</div>

      <Box>
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
        <Button variant="contained" margin="normal" component="label">
          Upload Image
          <input
            id="photo"
            hidden
            accept="image/*"
            multiple
            type="file"
            onChange={uploadImage}
          />
        </Button>
        {cover && (
          <>
            <img
              src={cover}
              alt="gasa"
              height="50"
              width="50"
              style={{ objectFit: "contain" }}
            />
            <Button
              variant="contained"
              onClick={() => {
                setCover("");
              }}
            >
              Delete
            </Button>
          </>
        )}
        <br />
        <Button
          variant="contained"
          margin="normal"
          type="submit"
          onClick={postData}
        >
          Submit
        </Button>
      </Box>
    </>
  );
}

export default DonateBook;
