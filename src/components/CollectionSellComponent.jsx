import { Box, TextField } from '@mui/material';
import React from 'react';

function CollectionSellComponent({ card, onQuantityChange }) {
  const handleChange = (e) => {
    const value = Math.max(0, Math.min(card.quantity, parseInt(e.target.value) || 0));
    onQuantityChange(card.id, value);
  };

  return (
    <Box sx={{ border: '1px solid #ddd', p: 2, textAlign: 'center' }}>
      <img
        src={`http://localhost:8080/${card.image}`}
        alt={card.id}
        style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
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
    </Box>
  );
}

export default React.memo(CollectionSellComponent);
