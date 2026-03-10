import { Modal, Box, Typography, Button, Grid, Dialog } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

export default function OpenBoosterModal({ open, boosterId, cards, onClose }) {
    const theme = useTheme();

    const [openImage, setOpenImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleClose = (event, reason) => {
        if (reason === "backdropClick") {
            return;
        }
        onClose();
    };

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        p: 4,
                        border: "2px solid white",
                        borderRadius: 2,
                        textAlign: "center",
                        backgroundColor: theme.palette.background.paper
                    }}
                >

                    <Typography
                        variant="h6"
                        sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}
                    >
                        Cards
                    </Typography>

                    <Grid container spacing={2} justifyContent="center">
                        {cards.map((card) => (
                            <Grid item xs={6} sm={4} md={3} lg={2} key={card.id}>
                                <Box
                                    sx={{
                                        border: "1px solid #e0e0e0",
                                        borderRadius: 1,
                                        p: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: 180,
                                    }}
                                >
                                    <img
                                        src={`/resources/cards/images/${String(card.id).padStart(4, '0')}.webp`}
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "100%",
                                            objectFit: "contain",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => {
                                            setSelectedImage(`/resources/cards/images/${String(card.id).padStart(4, '0')}.webp`);
                                            setOpenImage(true);
                                        }}
                                    />

                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ textAlign: "center", mt: 3 }}>
                        <Button variant="contained" onClick={onClose}>
                            OK
                        </Button>
                    </Box>
                </Box>

            </Modal>
            {/* Modal dialog for big picture */}
            <Dialog open={openImage} onClose={() => setOpenImage(false)}>
                <img
                    src={selectedImage}
                    alt="card-large"
                    style={{ maxWidth: "400px" }}
                />
            </Dialog>
        </>
    );
}
