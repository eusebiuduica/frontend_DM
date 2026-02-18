import { Modal, Box, Typography, Button } from "@mui/material";

export default function DailyRewardModal({ open, gold, onClose }) {
  const handleClose = (event, reason) => {
    if (reason === "backdropClick") {
      return;
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#ffffff",
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h6">Daily Reward 🎁</Typography>
        <Typography sx={{ mt: 2 }}>
          You received <b>{gold}</b> gold!
        </Typography>
        <Button sx={{ mt: 3 }} variant="contained" onClick={onClose}>
          OK
        </Button>
      </Box>
    </Modal>
  );
}
