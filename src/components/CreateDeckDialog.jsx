import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Grid,
  TextField,
  Box
} from "@mui/material";

import { useDispatch } from "react-redux";
import { addDeck } from "../slices/decksDetails";

import CardSelector from "../components/CardSelector"

export default function CreateDeckDialog({ open, onClose, onSave }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deckName, setDeckName] = useState("");

  const [selectedCards, setSelectedCards] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!open) return;

    const fetchCards = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const res = await fetch("http://localhost:8080/collection/all_detailed_cards", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch cards");
        const data = await res.json();
        setCards(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [open]);

  const handleCardChange = (cardId, quantity) => {
    setSelectedCards((prev) => {
      // clone list
      const copy = [...prev];
      const index = copy.findIndex((c) => c.cardId === cardId);

      if (index === -1 && quantity > 0) {
        copy.push({ cardId, quantity });
      } else if (index !== -1) {
        if (quantity === 0) {
          copy.splice(index, 1); // remove if 0
        } else {
          copy[index].quantity = quantity;
        }
      }
      return copy;
    });
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:8080/deck/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: deckName, cards: selectedCards }),
      });

      if (!res.ok) throw new Error("Failed to create deck");
      const newDeckId = await res.json();

      const newDeck = {
        deckId: newDeckId,
        deckName: deckName,
        deckCards: selectedCards.map(sc => {
          const card = cards.find(c => c.cardId === sc.cardId);
          return {
            cardId: sc.cardId,
            quantity: sc.quantity,
            cardImage: card?.cardImage ?? null
          };
        })
      };
      dispatch(addDeck(newDeck));
      onClose();
      setSelectedCards([]);
    } catch (err) {
      alert(err.message);
    }
  };

  const totalCards = selectedCards.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Create Deck
      </DialogTitle>

      <DialogContent dividers>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && !error && (
          <>
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
                {cards.map((card) => {
                  const selected = selectedCards.find(
                    (c) => c.cardId === card.cardId
                  );

                  return (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={card.cardId}>
                      <CardSelector
                        card={card}
                        count={selected ? selected.quantity : 0}
                        onChange={(q) => handleCardChange(card.cardId, q)}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </>
        )}
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
