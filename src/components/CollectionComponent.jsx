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
        backgroundColor: theme.palette.background.paper, // sau .default
        color: theme.palette.text.primary
      }}
    >
      <img
        src={`http://localhost:8080/${card.image}`}
        alt={card.name}
        style={{
          maxWidth: '100%',
          maxHeight: 200,
          objectFit: 'contain'
        }}
      />
      <Box>In Collection: {card.quantity}</Box>
      <Box>In Package: {card.inPackage}</Box>
    </Box>
  );
}
