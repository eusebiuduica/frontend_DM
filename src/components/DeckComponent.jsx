const API_URL = import.meta.env.VITE_API_BASE_URL;

import React, { useState } from "react";
import {
    Button, Stack, Typography, Card, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { removeDeck, setPreviewDeck, decrementNbDecks } from "../slices/decksDetails";
import { adjustInPackage } from "../slices/collectionDetails";

import EditDeckDialog from "./EditDeckDialog";

function DeckComponent({ deckId }) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const dispatch = useDispatch();

    const confirmDeleteDeck = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${API_URL}/deck/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(deckId),
            });

            const data = await res.json();

            if (!res.ok) throw new Error("Failed to delete deck");

            dispatch(removeDeck(deckId));
            dispatch(decrementNbDecks());

            data.forEach(card => {
                dispatch(adjustInPackage({ id: card.id, quantity: card.quantity }));
            });

            setIsDeleteDialogOpen(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteClose = (event, reason) => {
        if (reason === "backdropClick") {
            return;
        }
        setIsDeleteDialogOpen(false);
    };

    const handleEditClose = (event, reason) => {
        if (reason === "backdropClick") {
            return;
        }
        setIsEditDialogOpen(false);
    };

    const deckName = useSelector(state =>
        state.decksDetails.decks.find(d => d.deckId === deckId)?.deckName || ""
    );


    return (
        <>
            <Card variant="outlined" sx={{ p: 1 }}>
                <Typography
                    fontWeight="bold"
                    sx={{ cursor: "pointer" }}
                    onClick={() => dispatch(setPreviewDeck(deckId))}
                >
                    {deckName}
                </Typography>

                <Stack direction="row" spacing={1} mt={1}>
                    <Button size="small" variant="outlined" onClick={() => setIsEditDialogOpen(true)}>Edit</Button>
                    <Button size="small" color="error" variant="outlined" onClick={() => setIsDeleteDialogOpen(true)}>Delete</Button>
                </Stack>
            </Card>

            <EditDeckDialog
                open={isEditDialogOpen}
                onClose={handleEditClose}
                deckId={deckId}
            />

            <Dialog
                open={isDeleteDialogOpen}
                onClose={handleDeleteClose}
            >
                <DialogTitle>Delete Deck</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete deck "{deckName}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                    <Button color="error" onClick={confirmDeleteDeck}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default DeckComponent;