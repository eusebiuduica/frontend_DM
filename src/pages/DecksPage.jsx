import React, { useState, useEffect } from "react";
import { Box, Button, Stack, CircularProgress, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import DeckComponent from "../components/DeckComponent";
import DeckPreviewComponent from "../components/DeckPreviewComponent";
import CreateDeckDialog from "../components/CreateDeckDialog";
import { useDispatch } from "react-redux";
import { setDecks } from "../slices/decksDetails";
import { useSelector } from "react-redux";


export default function DecksPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const decks = useSelector((state) => state.decksDetails.decks);
  const hasDecks = decks && decks.length > 0;

  const handleDeleteAllDecks = () => {
    setIsDeleteAllDialogOpen(true);
  };

  const confirmDeleteAllDecks = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:8080/deck/delete_all`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      if (!res.ok) throw new Error("Failed to delete the decks");

      dispatch(setDecks([]));

      setIsDeleteAllDialogOpen(false);
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

  useEffect(() => {
    setLoading(true);

    const token = localStorage.getItem("authToken"); // sau de unde îl iei tu

    fetch("http://localhost:8080/deck/get_all", {
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
        <Stack direction="row" spacing={1} mb={2}>
          <Button variant="contained" onClick={() => setIsCreateDialogOpen(true)}>Create Deck</Button>
          <Button
            variant="outlined"
            color="error"
            disabled={!hasDecks}
            onClick={handleDeleteAllDecks}
          >
            Delete All
          </Button>

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
    </Box>
  );
}
