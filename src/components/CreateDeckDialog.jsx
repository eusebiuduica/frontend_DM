const API_URL = import.meta.env.VITE_API_BASE_URL;

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  TextField,
  Box
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { addDeck, incrementNbDecks } from "../slices/decksDetails";
import { updateCardQuantity } from "../slices/collectionDetails";
import { useSnackbar } from "notistack";

import CardSelector from "../components/CardSelector"

export default function CreateDeckDialog({ open, onClose }) {
  const cards = useSelector((state) => state.collectionDetails.cards);
  const [deckName, setDeckName] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const [selectedCards, setSelectedCards] = useState([]);
  const dispatch = useDispatch();

  const handleCardChange = React.useCallback((id, quantity) => {
    setSelectedCards((prev) => {
      const index = prev.findIndex((c) => c.id === id);

      if (index === -1 && quantity > 0) {
        return [...prev, { id, quantity }];
      }

      if (index !== -1) {
        if (quantity === 0) {
          return prev.filter((c) => c.id !== id);
        }

        return prev.map((c) =>
          c.id === id ? { ...c, quantity } : c
        );
      }

      return prev;
    });
  }, []);

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/deck/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: deckName, cards: selectedCards }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          data.errors.forEach(errMsg =>
            enqueueSnackbar(errMsg, { variant: "error" })
          );
        } else {
          enqueueSnackbar("Something went wrong", { variant: "error" });
        }
        return;
      }

      const newDeck = {
        deckId: data,
        deckName: deckName,
        deckCards: selectedCards.map(sc => {
          const card = cards.find(c => c.id === sc.id);
          return {
            id: sc.id,
            quantity: sc.quantity
          };
        })
      };
      dispatch(addDeck(newDeck));

      selectedCards.forEach(card => {
        dispatch(updateCardQuantity({ id: card.id, quantity: card.quantity }));
      });

      dispatch(incrementNbDecks());

      setSelectedCards([]);
      setDeckName("");
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (open) {
      setSelectedCards([]);
      setDeckName("");
    }
  }, [open]);

  const totalCards = selectedCards.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Create Deck
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 1,
            position: "sticky",
            top: 0,
            zIndex: 1,
            pb: 1,
          }}
        >
          <TextField
            size="small"
            label="Deck name"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            inputProps={{ maxLength: 30 }}
            sx={{ flex: 1 }}
          />

          {/* (aici va veni filtrul mai târziu) */}

          <Typography
            variant="body2"
            fontWeight="bold"
            color={totalCards === 40 ? "success.main" : "error"}
            whiteSpace="nowrap"
          >
            {totalCards}/40
          </Typography>
        </Box>
        <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
          <Grid container spacing={2}>
            {cards.filter(c => c.quantity + c.inPackage > 0).map((card) => {
              const selected = selectedCards.find(
                (c) => c.id === card.id
              );

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={card.id}>
                  <CardSelector
                    card={card}
                    count={selected ? selected.quantity : 0}
                    onChange={handleCardChange}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={
            totalCards !== 40 ||
            deckName.trim().length === 0
          }
        >
          Create
        </Button>

      </DialogActions>
    </Dialog>
  );
}
