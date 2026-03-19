const API_URL = import.meta.env.VITE_API_BASE_URL;

import { Box, Typography, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { resetAllUser, setLoginToken } from "../slices/userDetails";
import { resetAllDecks } from "../slices/decksDetails";
import { resetAllMarketPlace } from "../slices/marketplaceDetails";
import { resetAllSell } from "../slices/sellDetails";
import { useSnackbar } from "notistack";
import { useState } from "react";

export default function UserDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const username = localStorage.getItem("username");
  const gold = useSelector((state) => state.userDetails.gold);
  const token = useSelector((state) => state.userDetails.loginToken);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(resetAllDecks());
    dispatch(resetAllMarketPlace());
    dispatch(resetAllSell());
    dispatch(resetAllUser());
    dispatch(setLoginToken(null));
    navigate("/login", { replace: true });
  };

  const handleDeleteClose = (event, reason) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        enqueueSnackbar("Delete failed!", { variant: "error" });
        return;
      }

      localStorage.removeItem("authToken");
      localStorage.clear();
      dispatch(resetAllDecks());
      dispatch(resetAllMarketPlace());
      dispatch(resetAllSell());
      dispatch(resetAllUser());
      dispatch(setLoginToken(null));
      navigate("/login", { replace: true });

    } catch (err) {
      enqueueSnackbar("Delete failed!", { variant: "error" });
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Paper elevation={4} sx={{ p: 4, minWidth: 300, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          User Details
        </Typography>

        <Typography sx={{ mt: 2 }}>
          <strong>Username:</strong> {username}
        </Typography>

        <Typography sx={{ mt: 1 }}>
          <strong>Gold:</strong> {gold}
        </Typography>

        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>

          <Button variant="contained" color="error" onClick={() => setIsDeleteModalOpen(true)}>
            Delete Account
          </Button>
        </Box>
      </Paper>
      <Dialog
        open={isDeleteModalOpen}
        onClose={handleDeleteClose}
      >
        <DialogTitle>Delete account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <Typography component="span" fontWeight="bold" color="error">
              your account
            </Typography>
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
