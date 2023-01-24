import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  query,
  collection,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { UserAuth } from "./context/AuthContext";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const Account = () => {

  const { user } = UserAuth();
  const [post, setPost] = useState([]);
  const [ setVisible] = useState(false);
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
  });
  useEffect(() => {
    console.log(collection(db, "books"));
  });

  const DeleteItem = async (ID, Title) => {
    await deleteDoc(doc(db, "books", `${ID}`))
      .then(() => {
        setVisible(false);
        alert(`Book with title ${Title} deleted successfully`);
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong please try later");
      });
  };
  

  return (
    <>
      <div className="w-[300px] m-auto">
        <h1 className="text-center text-2xl font-bold pt-12">Account</h1>
      </div>
      <p>Welcome, {user.displayName}</p>
      {user.email && (
        <p>
          <b>Email</b> {user.email}
        </p>
      )}
      {user.photoURL && (
        <>
          <img src={user.photoURL} width="100" height="100" alt={user.email} />
        </>
      )}
      <h2>Your Posts</h2>
      <div className="card-items">
        {post.length ? (
          post.map((item) => (
            <Card sx={{ maxWidth: 345 }} key={`${item.id}`}>
              <CardMedia
                component="img"
                height="194"
                image={item.data.cover}
                alt={item.data.title.replace(" ", "_")}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  <CardHeader
                    title={`Title: ${item.data.title}`}
                    subheader={`By ${item.data.author} - ${item.data.yop}`}
                  />
                </Typography>

                <Button
                  variant="contained"
                  margin="normal"
                  component="label"
                  onClick={() => DeleteItem(item.id, item.data.title)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>You have not donate any book</p>
        )}
        {/* <p>Welcome, {user.displayName}</p> */}
      </div>
    </>
  );
};

export default Account;
