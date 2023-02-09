import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import Alert from "@mui/material/Alert";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "./context/AuthContext";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "./Home.css";
import bookopen from "./assets/bookopen.gif";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import AddCommentRoundedIcon from "@mui/icons-material/AddCommentRounded";

export default function Home() {
  const navigate = useNavigate();
  const { user } = UserAuth();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetching Posts from firebase database
  const fetchPost = async () => {
    await getDocs(collection(db, "books")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setPost(newData);
      setLoading(false);
      console.log(post, newData);
    });
  };

  const [liked, setLiked] = useState({});
  const [comment, setComment] = useState({});
  // useEffect(() => {
  //   console.log(comment, "commentsss");
  // });

  // Inserting Comments in firebase database

  const PostComment = async (ID) => {
    updateDoc(
      doc(db, `books/${ID}`),
      {
        comments: arrayUnion({
          userName: user.uid,
          photo: user.photoURL || null,
          email: user.email,
          comment: comment[`t-${ID}`],
        }),
      },
      { merge: true }
    )
      .then(() => {
        alert("Comment Posted");
        setComment({});
      })
      .catch((err) => console.log(err));
  };
  const handleChange = (e) => {
    setComment({ ...comment, [e.target.id]: e.target.value });
  };
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
  useEffect(() => {
    fetchPost();
  }, [liked, comment]);
  return (
    <>
      {!loading ? (
        <div className="card-items">
          {post.length ? (
            post.map((item) => (
              <div className="post-data">
                <Card
                  className="card"
                  sx={{
                    maxHeight: "480px",
                    boxShadow: "1px 3px 20px rgb(0 0 0 / 0.3)",
                    borderRadius: "10px",
                    margin: "1rem",
                  }}
                  key={`${item.id}`}
                >
                  <CardMedia
                    component="img"
                    height="194"
                    image={item.cover}
                    alt={item.title.replace(" ", "_")}
                    sx={{
                      objectFit: "contain",
                      maxWidth: "100%",
                      width: "350px",
                      backgroundColor: "#efefef",
                    }}
                  />

                  <CardContent style={{ padding: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <CardHeader
                        avatar={
                          <>
                            {item.photo ? (
                              <Avatar
                                alt={
                                  item.email
                                    ? item.email.charAt(0).toUpperCase()
                                    : item.photo
                                }
                                src={item.photo}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  alignItems: "center",
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
                                  width: 40,
                                  height: 40,
                                  marginTop: "0.5rem",
                                }}
                              />
                            )}
                          </>
                        }
                        title={`${item.title}`}
                        subheader={`${item.author} - ${item.yop}`}
                      />
                    </Typography>
                  </CardContent>
                  <CardActions style={{ padding: "0px 22px" }}>
                    {item.likes.length &&
                    item.likes.filter((e) => e.userName === `${user.uid}`)
                      .length > 0 &&
                    liked[`${item.id}`] !== false ? (
                      // <button onClick={unlikePost} name={item.id}>
                      //   unlike
                      // </button>
                      <IconButton
                        aria-label="add to favorites"
                        onClick={() => unlikePost(item.id)}
                      >
                        <FavoriteIcon style={{ color: "red" }} />
                      </IconButton>
                    ) : (
                      <IconButton
                        aria-label="add to favorites"
                        onClick={() => likePost(item.id)}
                      >
                        <FavoriteIcon style={{ color: "gray" }} />
                      </IconButton>
                    )}
                    {item.likes.length ? (
                      <p>{item.likes.length} Likes</p>
                    ) : (
                      <p>0 likes</p>
                    )}

                    <IconButton
                      aria-label="share"
                      onClick={() =>
                        navigate(`/comments/${item.id}`, { state: { item } })
                      }
                    >
                      <AddCommentRoundedIcon />
                    </IconButton>
                    <div></div>
                    {item.comments.length ? (
                      <span>{item.comments.length} Comments</span>
                    ) : (
                      <span>No Comments</span>
                    )}
                  </CardActions>
                  <CardActions style={{ padding: "8px 17px" }}>
                    <Avatar aria-label="recipe">
                      {user.photoURL ? (
                        <Avatar
                          alt={
                            user.email ? user.email.charAt(0).toUpperCase() : ""
                          }
                          src={user.photoURL}
                          sx={{
                            width: "40px",
                            height: "40px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <Avatar
                          alt={
                            user.email ? user.email.charAt(0).toUpperCase() : ""
                          }
                          src={user.photoURL ? user.photoURL : "/alttext"}
                          sx={{
                            width: "40px",
                            height: "40px",
                          }}
                        />
                      )}
                    </Avatar>

                    <TextField
                      id={`t-${item.id}`}
                      label="Comment"
                      variant="standard"
                      value={
                        `${comment[`t-${item.id}`]}` === "undefined"
                          ? ""
                          : `${comment[`t-${item.id}`]}`
                      }
                      onChange={handleChange}
                    />
                    {/* {comment} */}
                    <Button>
                      <SendIcon
                        color="primary"
                        onClick={() => PostComment(item.id)}
                        name={item.id}
                      />
                    </Button>
                  </CardActions>
                  <CardActions sx={{ padding: "2px 64px" }}>
                    {item.isBooked ? (
                      <Button disabled>Already Shared</Button>
                    ) : (
                      <Button>Contact {item.phone}</Button>
                    )}
                  </CardActions>
                </Card>
              </div>
            ))
          ) : (
            <Typography variant="h4" gutterBottom>
              Everyone deserves a chance to read. So why not go ahead and share
              the best books of our time with someone who needs them most?
            </Typography>
          )}
        </div>
      ) : (
        <Box sx={{ width: "100%", marginTo: "0px" }}>
          <LinearProgress />
          <Box
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={bookopen}
              alt="React Logo"
              width="20%"
              style={{ borderRadius: "12px", marginTop: "0", paddingTop: "0" }}
            />
          </Box>
        </Box>
      )}
    </>
  );
}
