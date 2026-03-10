import { Box, TextField, Dialog } from '@mui/material';
import { useState } from 'react';
import React from 'react';

function CollectionSellComponent({ card, onQuantityChange }) {
  const [openImage, setOpenImage] = useState(false);
  const handleChange = (e) => {
    const value = Math.max(0, Math.min(card.quantity, parseInt(e.target.value) || 0));
    onQuantityChange(card.id, value);
  };

  return (
    <Box sx={{ border: '1px solid #ddd', p: 2, textAlign: 'center' }}>
      <img
        src={`/resources/cards/${card.image}`}
        alt={card.id}
        style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', cursor: "pointer" }}
        onClick={() =>
          setOpenImage(true)
        }
      />
      <Box sx={{ mt: 1 }}>
        <strong>Available:</strong> {card.quantity}
      </Box>
      <TextField
        label="Quantity"
        type="number"
        size="small"
        value={card.sellQuantity}
        onChange={handleChange}
        inputProps={{ min: 0, max: card.quantity }}
        sx={{ mt: 2 }}
        fullWidth
      />
      {/* Modal dialog for big picture */}
      <Dialog open={openImage} onClose={() => setOpenImage(false)}>
        <img
          src={`/resources/cards/${card.image}`}
          alt={`card-large-${card.id}`}
          style={{ maxWidth: "400px" }}
        />
      </Dialog>
    </Box>
  );
}

export default React.memo(CollectionSellComponent);
