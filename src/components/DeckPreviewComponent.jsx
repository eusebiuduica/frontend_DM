import React from "react";
import { Box, Typography, Grid, Dialog } from "@mui/material";
import { useSelector } from "react-redux";

function DeckPreviewComponent() {
  const [openImage, setOpenImage] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);

  const deck = useSelector(
    (state) =>
      state.decksDetails.decks.find(d => d.deckId === state.decksDetails.previewDeck)
  );

  const handleOpenImage = (src) => {
    setSelectedImage(src);
    setOpenImage(true);
  };

  console.log("Current deck:", deck?.deckId);
  console.log("Deck cards:", deck?.deckCards);  // 👈 AICI


  if (!deck || !deck.deckCards) {
    return <Typography>Select a deck</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        {deck.deckName}
      </Typography>

      <Grid container spacing={2}>
        {deck.deckCards
          .slice() // să nu modifici array original
          .sort((a, b) => a.id - b.id)
          .flatMap(card =>
            Array.from({ length: card.quantity }).map((_, index) => (
              <Grid
                item
                size={{ xs: 12, sm: 6, md: 4, lg: "auto" }}
                key={`${deck.deckId}-${card.id}-${index}`}
              >
                <img
                  src={`/resources/cards/images/${String(card.id).padStart(4, "0")}.webp`}
                  alt={`card-${card.id}`}
                  width="80px"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    handleOpenImage(`/resources/cards/images/${String(card.id).padStart(4, "0")}.webp`)
                  }
                />
              </Grid>
            ))
          )}
      </Grid>
      <Dialog open={openImage} onClose={() => setOpenImage(false)}>
        <img src={selectedImage} alt="card-large" style={{ maxWidth: "400px" }} />
      </Dialog>
    </Box>
  );
}

export default DeckPreviewComponent;
