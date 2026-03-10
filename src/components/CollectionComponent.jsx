import { Box } from "@mui/material";
import { useTheme } from '@mui/material/styles';
export default function CollectionComponent({ card }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: `2px solid ${theme.palette.divider}`,
        p: 2,
        textAlign: 'center',
        borderRadius: '2%',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary
      }}
    >
      <img
        src={`/resources/cards/${card.image}`}
        alt={card.name}
        width="100%"
        height="auto"
        loading="lazy"
        style={{
          aspectRatio: '403 / 560',
          maxHeight: 200,
          objectFit: 'contain'
        }}
      />
      <Box>In Collection: {card.quantity} + {card.inPackage}</Box>
      <Box>In Package: {card.inPackage}</Box>
    </Box>
  );
}
