import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function CardSelector({ card, count, onChange }) {
  const increment = () => {
    if (count < card.cardQuantity && count < 4) onChange(count + 1);
  };

  const decrement = () => {
    if (count > 0) onChange(count - 1);
  };

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: 1,
        p: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 120,
          overflow: "hidden",
          mb: 1,
        }}
      >
        <img src={`http://localhost:8080/${card.cardImage}`} alt={`card-${card.cardId}`} width="100%" />
      </Box>
      <Typography variant="body2">Copies: {card.cardQuantity}</Typography>
      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <IconButton size="small" onClick={decrement}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ mx: 1 }}>{count}</Typography>
        <IconButton size="small" onClick={increment}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
