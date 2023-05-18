import React from "react";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function About() {
  return (
    <Container>
      <Typography
        variant="h3"
        component="h2"
        sx={{
          textAlign: "center",
          color: "rgba(0, 0, 0, 0.6)",
          margin: "15px 0 15px 0",
        }}
      >
        About Gratis Book
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          textAlign: "center",
          fontWeight: "600",
          fontSize: "20px",
          margin: "15px 0 15px 0",
        }}
      >
        Gratis Books is an initiative to bridge the gap between book owners and
        the needy.
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          textAlign: "center",
          fontWeight: "600",
          fontSize: "20px",
          margin: "15px 0 15px 0",
        }}
      >
        In the digital age, there is a dire need for physical books. It could be
        School textbooks that are really costly to buy at the start of the year
        or just books for pleasure.
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          textAlign: "center",
          fontWeight: "600",
          fontSize: "20px",
          margin: "15px 0 15px 0",
        }}
      >
        We believe that access to books should be universal. Money should not be
        a constraint to deprive a child of books.
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          textAlign: "center",
          fontWeight: "600",
          fontSize: "20px",
          margin: "15px 0 15px 0",
        }}
      >
        Physical books are required for thorough understanding and comprehension
        of concepts. Promoting love of these books as a means to learning is a
        core motive of this initiative.
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          textAlign: "center",
          fontWeight: "600",
          fontSize: "20px",
          margin: "15px 0 15px 0",
        }}
      >
        We encourage book owners to list their books here. The service is free
        for both owners and the needy.
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          textAlign: "center",
          fontWeight: "600",
          fontSize: "20px",
          margin: "15px 0 15px 0",
        }}
      >
        Spread the love for books.
      </Typography>
    </Container>
  );
}
