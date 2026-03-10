import React, { useState } from "react";
import { Box, Typography, IconButton, Dialog } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function CardSelector({ card, count, onChange }) {

  const [openImage, setOpenImage] = useState(false);

  const increment = () => {
    if (count < card.quantity + card.inPackage && count < 4)
      onChange(card.id, count + 1);
  };

  const decrement = () => {
    if (count > 0) onChange(card.id, count - 1);
  };

  return (
    <>
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
            cursor: "pointer"
          }}
          onClick={() => setOpenImage(true)}
        >
          <img
            src={`/resources/cards/${card.image}`}
            alt={`card-${card.id}`}
            width="100%"
          />
        </Box>

        <Typography variant="body2">
          Copies: {card.quantity + card.inPackage}
        </Typography>

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

      {/* Modal dialog for big picture */}
      <Dialog open={openImage} onClose={() => setOpenImage(false)}>
        <img
          src={`/resources/cards/${card.image}`}
          alt={`card-large-${card.id}`}
          style={{ maxWidth: "400px" }}
        />
      </Dialog>
    </>
  );
}

export default React.memo(CardSelector);