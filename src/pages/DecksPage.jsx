const API_URL = import.meta.env.VITE_API_BASE_URL;

import React, { useState, useEffect } from "react";
import { Box, Button, Stack, CircularProgress, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import DeckComponent from "../components/DeckComponent";
import DeckPreviewComponent from "../components/DeckPreviewComponent";
import CreateDeckDialog from "../components/CreateDeckDialog";
import { useDispatch } from "react-redux";
import { setDecks, setCurrentNbDecks, incrementMaxNbDecks } from "../slices/decksDetails";
import { useSelector } from "react-redux";
import { resetInPackageToQuantity } from "../slices/collectionDetails";
import { updateGold } from "../slices/userDetails";


export default function DecksPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isConfirmBuyDeckSlotOpen, setIsConfirmBuyDeckSlotOpen] = useState(false);
  const dispatch = useDispatch();
  const decks = useSelector((state) => state.decksDetails.decks);
  const hasDecks = decks && decks.length > 0;

  const currentNbDecks = useSelector((state) => state.decksDetails.currentNbDecks);
  const maxNbDecks = useSelector((state) => state.decksDetails.maxNbDecks);
  const gold = useSelector((state) => state.userDetails.gold);

  const handleDeleteAllDecks = () => {
    setIsDeleteAllDialogOpen(true);
  };

  const confirmDeleteAllDecks = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/deck/delete_all`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      if (!res.ok) throw new Error("Failed to delete the decks");

      dispatch(setDecks([]));
      dispatch(setCurrentNbDecks(0));
      dispatch(resetInPackageToQuantity());
      setIsDeleteAllDialogOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const confirmBuyDeckSlot = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/user/buyDeckSlot`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      if (!res.ok) throw new Error("Failed to delete the decks");

      const data = await res.json();

      dispatch(incrementMaxNbDecks());
      dispatch(updateGold(data));
      setIsConfirmBuyDeckSlotOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateClose = (event, reason) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsCreateDialogOpen(false);
  };


  const handleDeleteAllClose = (event, reason) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsDeleteAllDialogOpen(false);
  };

  const handleBuyDeckSlotClose = (event, reason) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsConfirmBuyDeckSlotOpen(false);
  };

  useEffect(() => {
    setLoading(true);

    const token = localStorage.getItem("authToken"); // sau de unde îl iei tu

    fetch(`${API_URL}/deck/get_all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch decks");
        }
        return res.json();
      })
      .then((data) => {
        dispatch(setDecks(data));
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  if (loading) {
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" height="calc(100vh - 64px)">
      {/* Left panel */}
      <Box width="35%" borderRight="1px solid #ddd" p={2}>
        <Stack
          direction="row"
          spacing={2}
          mb={2}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* LEFT SIDE */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="contained"
              disabled={currentNbDecks >= maxNbDecks}
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Create Deck
            </Button>
            <Button
              variant="outlined"
              disabled={gold < 10}
              onClick={() => setIsConfirmBuyDeckSlotOpen(true)}
              sx={{ display: 'flex', alignItems: 'center', gap: 0 }}
            >
              Buy Slot - 10
              <img
                src="/resources/other/iconGold.webp"
                alt="gold"
                style={{ width: 20, height: 20 }}
              />
            </Button>

            <Button
              variant="outlined"
              color="error"
              disabled={!hasDecks}
              onClick={handleDeleteAllDecks}
            >
              Delete All
            </Button>
          </Stack>

          {/* RIGHT SIDE */}
          <Typography fontWeight="bold">
            {currentNbDecks} / {maxNbDecks}
          </Typography>
        </Stack>
        <Box
          sx={{
            height: '75vh',      // sau cât vrei să ocupe
            overflowY: 'auto',   // scroll vertical
            padding: 1,
            border: '1px solid #ddd',
          }}
        >
          <Stack spacing={1}>
            {decks.map((deck) => (
              <DeckComponent
                key={deck.deckId}
                deckId={deck.deckId}
              />
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Right panel */}
      <Box width="65%" p={2}>
        <DeckPreviewComponent />
      </Box>

      <CreateDeckDialog
        open={isCreateDialogOpen}
        onClose={handleCreateClose}
      />

      <Dialog
        open={isDeleteAllDialogOpen}
        onClose={handleDeleteAllClose}
      >
        <DialogTitle>Delete Deck</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <Typography component="span" fontWeight="bold" color="error">
              all decks
            </Typography>
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteAllDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDeleteAllDecks}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isConfirmBuyDeckSlotOpen}
        onClose={handleBuyDeckSlotClose}
      >
        <DialogTitle>Buy Deck Slot</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want buy a deck slot ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmBuyDeckSlotOpen(false)}>Cancel</Button>
          <Button color="success" onClick={confirmBuyDeckSlot}>
            Buy
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
