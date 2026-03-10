import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  Typography
} from "@mui/material";
import SelectedCardForm from "../components/SelectedCardForm";
import { useSelector } from 'react-redux';

export default function AddMarketplaceOrder() {
  const allCards = useSelector((state) => state.collectionDetails.cards);
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <Box display="flex" height="calc(100vh - 64px)">

      <Box width="70%" borderRight="1px solid #ddd" p={2}>

        <Box
          sx={{
            height: "85vh",
            overflowY: "auto"
          }}
        >
          <Grid container spacing={2} padding={2}>
            {Object.values(allCards).
              filter(card => card.quantity > 0).
              map(card => {
                const selected = selectedCard?.id === card.id;

                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={card.id}>
                    <Card
                      onClick={() => setSelectedCard(card)}
                      sx={{
                        cursor: "pointer",
                        border: selected
                          ? "2px solid #1976d2"
                          : "1px solid #ccc",
                        boxShadow: selected ? 6 : 1
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={`/resources/cards/${card.image}`}
                        alt={card.name}
                      />

                      <Box textAlign="center" py={1}>
                        <Typography variant="caption">
                          Copies: {card.quantity}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      </Box>

      <Box width="30%" p={3}>
        <SelectedCardForm card={selectedCard} onSold={() => setSelectedCard(null)} ></SelectedCardForm>
      </Box>
    </Box>
  );
}
