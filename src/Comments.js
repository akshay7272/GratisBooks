import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { UserAuth } from "./context/AuthContext";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Button from "@mui/material/Button";
import AddCommentRoundedIcon from "@mui/icons-material/AddCommentRounded";
import { db } from "./firebase";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { Container } from "@mui/material";
import "./index.css";

export default function Comments() {
  let location = useLocation();
  const { user } = UserAuth();
  const [liked, setLiked] = useState({});

  // Inserting likes in firebase database
  const likePost = async (Id) => {
    updateDoc(
      doc(db, `books/${Id}`),
      {
        likes: arrayUnion({ userName: user.uid, email: user.email }),
      },
      { merge: true }
    )
      .then(() => {
        setLiked({ ...liked, [Id]: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Removing likes from firebase database
  const unlikePost = async (Id) => {
    updateDoc(
      doc(db, `books/${Id}`),
      {
        likes: arrayRemove({ userName: user.uid, email: user.email }),
      },
      {
        merge: true,
      }
    )
      .then(() => {
        setLiked({ ...liked, [Id]: false });
      })
      .catch((err) => console.log(err));
  };

  //Displaying Comments in Comment page for each different Posts.
  return (
    <>
      <Container>
        <div
          className="comment"
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "2rem",
          }}
        >
          <div>
            <Card sx={{ maxWidth: 395 }} key={`${location.state.item.id}`}>
              <CardMedia
                component="img"
                height="250"
                image={location.state.item.cover}
                alt={location.state.item.title.replace(" ", "_")}
              />

              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  <CardHeader
                    avatar={
                      <Avatar aria-label="recipe">
                        {location.state.item.photo ? (
                      <Avatar
                        alt={user.email ? user.email.charAt(0).toUpperCase() : ""}
                        src={location.state.item.photo}
                        sx={{ width: "40px", height: "40px", objectFit:"contain"}}
                      />
                    ) : (
                      <Avatar
                        alt={user.email ? user.email.charAt(0).toUpperCase() : ""}
                        src={location.state.item.photo ? location.state.item.photo : "/alttext"}
                        sx={{
                          width: "40px",
                          height: "40px",
                        }}
                      />
                    )}
                      </Avatar>
                    }
                    title={`Title: ${location.state.item.title}`}
                    subheader={`By ${location.state.item.title} - ${location.state.item.yop}`}
                  />
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                {location.state.item.likes.length &&
                location.state.item.likes.filter(
                  (e) => e.userName === `${user.uid}`
                ).length > 0 &&
                liked[`${location.state.item.id}`] !== false ? (
                  <IconButton
                    aria-label="add to favorites"
                    onClick={() => unlikePost(location.state.item.id)}
                  >
                    <FavoriteIcon style={{ color: "red" }} />
                  </IconButton>
                ) : (
                  <IconButton
                    aria-label="add to favorites"
                    onClick={() => likePost(location.state.item.id)}
                  >
                    <FavoriteIcon style={{ color: "gray" }} />
                  </IconButton>
                )}
                {location.state.item.likes.length ? (
                  <p>{location.state.item.likes.length} Likes</p>
                ) : (
                  <p>0 likes</p>
                )}

                <IconButton aria-label="share">
                  <AddCommentRoundedIcon />
                </IconButton>

                {location.state.item.comments.length ? (
                  <span>{location.state.item.comments.length} Comments</span>
                ) : (
                  <span>No Comments</span>
                )}
              </CardActions>

              <CardActions>
                {location.state.item.isBooked ? (
                  <Button disabled>Already Shared</Button>
                ) : (
                  <Button>Contact Seller {location.state.item.phone}</Button>
                )}
              </CardActions>
            </Card>
          </div>
          <div
            className="comment-bd"
            style={{
              overflow: "scroll",
              maxHeight: "500px",
              maxWidth: "500px",
              overflowX: "hidden",
              marginTop: "2rem",
              width: "30%",
            }}
          >
            <h2>Comments</h2>
            {location.state.item.comments.length ? (
              location.state.item.comments.map((item) => (
                <List
                  key={`${item.id}`}
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                >
                  <ListItem>
                    <ListItemAvatar>
                    {item.photo ? (
                              <Avatar
                                alt={
                                  item.email
                                    ? item.email.charAt(0).toUpperCase()
                                    : ""
                                }
                                src={item.photo}
                                sx={{
                                  width: 20,
                                  height: 20,
                                }}
                              />
                            ) : (
                              <Avatar
                                alt={
                                  item.email
                                    ? item.email.charAt(0).toUpperCase()
                                    : ""
                                }
                                src={item.photo ? item.photo : "/alttext"}
                                sx={{
                                  width: 20,
                                  height: 20,
                                }}
                              />
                            )}
                    </ListItemAvatar>
                    <ListItemText secondary={item.comment} />
                  </ListItem>
                  <Divider variant="Filled" component="p" />
                </List>
              ))
            ) : (
              <p>No Comments on this Post</p>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
