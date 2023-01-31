import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
export default function Comments() {
  let location = useLocation();
  useEffect(() => {
    console.log(location.state.item.comments);
  });
  //Displaying Comments in Comment page for each different Posts.
  return (
    <>
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
                <Avatar>
                  <img
                    src={item.photo}
                    width="40"
                    height="40"
                    alt={item.email}
                  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.comment} />
            </ListItem>
            <Divider variant="inset" component="li" />
          </List>
        ))
      ) : (
        <p>No Comments on this Post</p>
      )}
    </>
  );
}
