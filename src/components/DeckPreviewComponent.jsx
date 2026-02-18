import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useSelector } from "react-redux";

function DeckPreviewComponent() {

  const deck = useSelector(
    (state) =>
      state.decksDetails.decks.find(d => d.deckId === state.decksDetails.previewDeck)
  );

  if (!deck || !deck.deckCards) {
    return <Typography>Select a deck</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        {deck.deckName}
      </Typography>

      <Grid container spacing={2}>
        {deck.deckCards.flatMap((card) =>
          Array.from({ length: card.quantity }).map((_, index) => (
            <Grid item xs="auto" sm="auto" md="auto" lg="auto" key={`${card.cardId}-${index}`}>
              <img
                src={`http://localhost:8080/${card.cardImage}`}
                alt={`card-${card.cardId}`}
                width='80px'
              />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

export default DeckPreviewComponent;
