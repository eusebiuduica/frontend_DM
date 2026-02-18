import { Modal, Box, Typography, Button, Grid } from "@mui/material";

export default function OpenBoosterModal({ open, boosterId, cards, onClose }) {
    const boosterBackgrounds = {
        1: "/resources/other/DM-01_Background.webp",
        2: "/resources/boosters/bg_water.webp",
        3: "/resources/boosters/bg_dark.webp",
        4: "/resources/boosters/bg_fire.webp",
        5: "/resources/boosters/bg_nature.webp",
    };

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
                    display: "inline-block",
                    borderRadius: 2,
                    overflow: "hidden",
                    width: "auto",
                    height: "auto",
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                    //backgroundImage: `url(${boosterBackgrounds[boosterId]})`,
                    //backgroundSize: "contain",
                    //backgroundRepeat: "no-repeat",
                    //backgroundPosition: "center",
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
                                    bgcolor: "transparent",
                                }}
                            >
                                <img
                                    src={`http://localhost:8080/${card.image}`}
                                    alt={card.name}
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        objectFit: "contain",
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

    );
}
