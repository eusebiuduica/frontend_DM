import { VirtuosoGrid } from 'react-virtuoso';
import { Card, CardMedia, CardContent, Typography, Box, Dialog } from '@mui/material';
import { useState } from "react";
import React from 'react';

const CARD_WIDTH = 150;
const CARD_HEIGHT = 300;

const gridComponents = {
  List: React.forwardRef(({ style, children }, ref) => (
    <div
      ref={ref}
      style={{
        ...style,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center', // centrat
        gap: 16,                  // spațiu între cărți
      }}
    >
      {children}
    </div>
  )),
  Item: ({ children, ...props }) => <div {...props}>{children}</div>,
};

export default function CollectionGrid({ cards }) {
  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  return (
    <>
      <VirtuosoGrid
        totalCount={cards.length}
        components={gridComponents}
        itemContent={(index) => {
          const card = cards[index];
          return (
            <Box key={card.id} width={CARD_WIDTH}>
              <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  image={`/resources/cards/${card.image}`}
                  alt={card.name}
                  sx={{ width: '100%', height: 'auto', aspectRatio: '403 / 560' }}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedImage(`/resources/cards/${card.image}`);
                    setOpenImage(true);
                  }}
                />
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="body2">
                    Quantity: {card.quantity + card.inPackage}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Package: {card.inPackage}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          );
        }}
        style={{ height: '600px' }} // height scroll
      />
      {/* Modal dialog for big picture */}
      <Dialog open={openImage} onClose={() => setOpenImage(false)}>
        <img
          src={selectedImage}
          alt="card-large"
          style={{ maxWidth: "400px" }}
        />
      </Dialog>
    </>
  );
}