import { useEffect, useState } from "react";
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

import { useDispatch, useSelector } from "react-redux";
import { editDeck } from "../slices/decksDetails";

import CardSelector from "../components/CardSelector";

export default function EditDeckDialog({
    open,
    onClose,
    deckId
}) {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deckName, setDeckName] = useState("");
    const [selectedCards, setSelectedCards] = useState([]);

    const dispatch = useDispatch();

    const deck = useSelector(
        (state) => state.decksDetails.decks.find(d => d.deckId === deckId)
    );


    const initialCards = deck?.deckCards || [];

    useEffect(() => {
        if (!open || !deck) return;

        setDeckName(deck.deckName);
        setSelectedCards(initialCards);

        const fetchCards = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("authToken");
                const res = await fetch(
                    "http://localhost:8080/collection/all_detailed_cards",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (!res.ok) throw new Error("Failed to fetch cards");

                setCards(await res.json());
                setError(null);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCards();
    }, [open, deck]);

    const handleCardChange = (cardId, quantity, cardImage) => {
        setSelectedCards((prev) => {
            const copy = [...prev];
            const index = copy.findIndex((c) => c.cardId === cardId);

            if (index === -1 && quantity > 0) {
                copy.push({ cardId, quantity, cardImage });
            } else if (index !== -1) {
                if (quantity === 0) {
                    copy.splice(index, 1);
                } else {
                    copy[index] = { ...copy[index], quantity };
                }
            }
            return copy;
        });
    };

    const totalCards = selectedCards.reduce((s, c) => s + c.quantity, 0);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch("http://localhost:8080/deck/edit", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    deckId: deckId,
                    name: deckName,
                    cards: selectedCards,
                }),
            });

            if (!res.ok) throw new Error("Failed to update deck");

            dispatch(editDeck({
                deckId: deckId,
                name: deckName,
                deckCards: selectedCards
            }));

            onClose();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Deck</DialogTitle>

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

                            <Typography
                                variant="body2"
                                fontWeight="bold"
                                color={totalCards === 40 ? "success.main" : "error"}
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
                                    <Grid
                                        item
                                        xs={6}
                                        sm={4}
                                        md={3}
                                        lg={2}
                                        key={card.cardId}
                                    >
                                        <CardSelector
                                            card={card}
                                            count={selected ? selected.quantity : 0}
                                            onChange={(q) =>
                                                handleCardChange(card.cardId, q, card.cardImage)
                                            }
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
                    onClick={handleSave}
                    disabled={
                        deckName.trim().length === 0 || totalCards !== 40
                    }
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
