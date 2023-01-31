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
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";  
import "./Home.css";
import Button from "@mui/material/Button";
import AddCommentRoundedIcon from "@mui/icons-material/AddCommentRounded";

export default function Home() {
  const navigate = useNavigate();
  const { user } = UserAuth();
  const [post, setPost] = useState([]);
  // Fetching Posts from firebase database
  const fetchPost = async () => {
    await getDocs(collection(db, "books")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setPost(newData);
      console.log(post, newData);
    });
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const [liked, setLiked] = useState({});
  const [comment, setComment] = useState({});

  // Inserting Comments in firebase database

  const PostComment = async (event) => {
    updateDoc(
      doc(db, `books/${event.target.name}`),
      {
        comments: arrayUnion({
          userName: user.uid,
          photo: user.photoURL,
          email: user.email,
          comment: comment[`t-${event.target.name}`],
        }),
      },
      { merge: true }
    )
      .then(() => {
        alert("comment added");
        setComment({});
      })
      .catch((err) => console.log(err));
  };
  const handleChange = (e) => {
    setComment({ ...comment, [e.target.id]: e.target.value });
  };
  // Inserting likes in firebase database
  const likePost = async (event) => {
    updateDoc(
      doc(db, `books/${event.target.name}`),
      {
        likes: arrayUnion({ userName: user.uid, email: user.email }),
      },
      { merge: true }
    )
      .then(() => setLiked({ ...liked, [event.target.name]: true }))
      .catch((err) => {
        console.log(err);
      });
  };
  // Removing likes from firebase database
  const unlikePost = async (event) => {
    updateDoc(
      doc(db, `books/${event.target.name}`),
      {
        likes: arrayRemove({ userName: user.uid, email: user.email }),
      },
      {
        merge: true,
      }
    )
      .then(() => setLiked({ ...liked, [event.target.name]: false }))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    console.log(comment, "running");
  });
  return (
    <>
      <div className="card-items">
        {post.length ? (
          post.map((item) => (
            <Card sx={{ maxWidth: 345 }} key={`${item.id}`}>
              <CardMedia
                component="img"
                height="194"
                image={item.cover}
                alt={item.title.replace(" ", "_")}
              />

              {item.likes.length &&
              item.likes.filter((e) => e.userName === `${user.uid}`).length >
                0 &&
              liked[`${item.id}`] !== false ? (
                <button onClick={unlikePost} name={item.id}>
                  unlike
                </button>
              ) : (
                <button onClick={likePost} name={item.id}>
                  like
                </button>
              )}
              {item.likes.length ? (
                <p>{item.likes.length} Likes</p>
              ) : (
                <p>0 likes</p>
              )}

              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        <>
                          <img
                            src={item.photo}
                            width="40"
                            height="40"
                            alt={user.email}
                          />
                        </>
                      </Avatar>
                    }
                    title={`Title: ${item.title}`}
                    subheader={`By ${item.title} - ${item.yop}`}
                  />
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
                <IconButton
                  aria-label="share"
                  onClick={() =>
                    navigate(`/comments/${item.id}`, { state: { item } })
                  }
                >
                  <AddCommentRoundedIcon />
                </IconButton>
                {item.comments.length ? (
                  <span>{item.comments.length} Comments</span>
                ) : (
                  <span>No Comments</span>
                )}
              </CardActions>
              <CardActions>
                <Avatar aria-label="recipe">
                  {user.photoURL && (
                    <>
                      <img
                        src={user.photoURL}
                        width="40"
                        height="40"
                        alt={user.email}
                      />
                    </>
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
                <Button onClick={PostComment} name={item.id}>
                  Post
                </Button>
              </CardActions>
              <CardActions>
                {item.isBooked ? (
                  <Button disabled>Already Shared</Button>
                ) : (
                  <Button>Contact Seller {item.phone}</Button>
                )}
              </CardActions>
            </Card>
          ))
        ) : (
          <p>
            Everyone deserves a chance to read. So why not go ahead and share
            the best books of our time with someone who needs them most?
          </p>
        )}
      </div>
    </>
  );
}
