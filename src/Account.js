import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  query,
  collection,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { UserAuth } from "./context/AuthContext";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Container, Toolbar } from "@mui/material";

const Account = () => {
  const navigate = useNavigate();
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const { user } = UserAuth();
  const [post, setPost] = useState([]);
  const [setVisible] = useState(false);
  // Fetching account details for perticular user posts
  const fetchPost = async () => {
    const qSnap = query(
      collection(db, "books"),
      where("uid", "==", `${user.uid}`)
    );
    const data = await getDocs(qSnap);
    const result = data.docs.map((el) => ({ id: el.id, data: el.data() }));
    setPost(result);
  };

  useEffect(() => {
    fetchPost();
  }, []);
  useEffect(() => {
    console.log(collection(db, "books"));
  });
  // Checking book is shared or not
  const Given = (ID, Booked) => {
    let newBooked = (params) => {
      if (params === true) {
        return false;
      } else {
        return true;
      }
    };
    console.log(Booked, newBooked(Booked), "check");
    updateDoc(doc(db, "books", `${ID}`), {
      isBooked: newBooked(Booked),
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  // Deleting Perticular Posts
  const DeleteItem = async (ID, Title) => {
    await deleteDoc(doc(db, "books", `${ID}`))
      .then(() => {
        alert(`Book ${Title} deleted successfully`);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong please try later");
      });
  };

  return (
    <>
      <Container className="main-container">
        <Container>
          <Toolbar
            sx={{ flexDirection: "column" }}
            style={{ paddingTop: "20px" }}
          >
            {user.photoURL ? (
              <Avatar
                alt={user.email ? user.email.charAt(0).toUpperCase() : ""}
                src={user.photoURL}
                sx={{ width: 100, height: 100, alignItems: "center" }}
              />
            ) : (
              <Avatar
                alt={user.email ? user.email.charAt(0).toUpperCase() : ""}
                src={user.photoURL ? user.photoURL : "/alttext"}
                sx={{
                  width: 70,
                  height: 70,
                  fontSize: "3.5rem",
                  marginTop: "0.5rem",
                }}
              />
            )}
          </Toolbar>
          {user.displayName ? (
            <Typography
              variant="h4"
              component="h2"
              sx={{ textAlign: "center" }}
            >
              Welcome, {user.displayName}
            </Typography>
          ) : (
            <Typography
              variant="h4"
              component="h2"
              sx={{ textAlign: "center" }}
            >
              Welcome
            </Typography>
          )}
          <Typography
            variant="body2"
            component="span"
            sx={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {user.email && (
              <Typography variant="h5" component="h2">
                {" "}
                {user.email}
              </Typography>
            )}
            {user.phoneNumber && (
              <Typography variant="h5" component="h2">
                <b>Phone Number : </b> {user.phoneNumber}
              </Typography>
            )}
          </Typography>
          {/* <Box sx={{textAlign: "center"}}>
          <Button onSubmit={"/update"} variant="contained" > Update</Button>
          </Box> */}
        </Container>
        <br />
        <br />
        <Container className="account-card"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            maxWidth: "100%",
          }}
        >
          {post.length ? (
            post.map((item) => (
              <Card className="cards"
                sx={{ maxWidth: 345, flex: "0 0 33%", margin: "2rem auto" }}
                key={`${item.id}`}
              >
                <CardMedia
                  component="img"
                  height="194"
                  image={item.data.cover}
                  alt={item.data.title.replace(" ", "_")}
                  sx={{ objectFit: "fill" }}
                />
                <CardHeader
                      title={`Title: ${item.data.title}`}
                      subheader={`By ${item.data.author} - ${item.data.yop}`}
                      sx={{ display: "grid"}}
                      style={{textOverflow:"ellipsis"}}
                    />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            {...label}
                            variant="body1"
                            value={item.data.isBooked}
                            defaultChecked={item.data.isBooked}
                            onChange={() => Given(item.id, item.data.isBooked)}
                          />
                        }
                        label="share book"
                      />
                    </FormGroup>
                  </Typography>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      variant="contained"
                      margin="normal"
                      component="label"
                      onClick={() => DeleteItem(item.id, item.data.title)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      margin="normal"
                      component="label"
                      onClick={() =>
                        navigate(`/account/update/${item.id}`, {
                          state: { item },
                        })
                      }
                    >
                      Edit
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography
              variant="h5"
              component="span"
              style={{ color: "white", margin: "auto" }}
            >
              You have not donated any book. Please Donate
            </Typography>
          )}
        </Container>
      </Container>
    </>
  );
};

export default Account;
