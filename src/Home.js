import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection,  getDocs } from "firebase/firestore";
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
import ShareIcon from "@mui/icons-material/Share";
import "./Home.css";

export default function Home() {
  const [post, setPost] = useState([]);
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

  return (
    <>
      <div className="card-items">
        {post.length ? (
          post.map((item, index) => (
            <Card
              sx={{ maxWidth: 345 }}
              key={`${item.title.replace(" ", "_")}-${Date.now()}-${index}`}
            >
              <CardMedia
                component="img"
                height="194"
                image={item.cover}
                alt={item.title.replace(" ", "_")}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        R
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
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))
        ) : (
          <p>
            Everyone deserves a chance to read. So why not go ahead and share
            the best books of our time with someone who needs them most?
          </p>
        )}
        {/* <p>Welcome, {user.displayName}</p> */}
      </div>
    </>
  );
}
