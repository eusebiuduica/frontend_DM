import { Card, CardContent, CardMedia, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function BoosterComponent({ booster, onBuy }) {
    const [isConfirmBuyOpen, setIsConfirmBuyOpen] = useState(false);
    const gold = useSelector((state) => state.userDetails.gold);

    const handleConfirmBuyClose = (event, reason) => {
        if (reason === "backdropClick") {
            return;
        }
        setIsConfirmBuyOpen(false);
    };

    return (
        <>
            <Card sx={{ width: 240, textAlign: "center" }}>
                <CardMedia
                    component="img"
                    height="auto"
                    image={`/resources/boosters/booster_dm${String(booster.id).padStart(2, '0')}.webp`}
                    alt={booster.name}
                />

                <CardContent>
                    <Typography variant="h6">{booster.name}</Typography>
                    <Typography sx={{ mt: 1 }}>
                        Price: <b>{booster.price}</b> gold
                    </Typography>

                    <Button
                        sx={{ mt: 2 }}
                        variant="contained"
                        fullWidth
                        onClick={() => setIsConfirmBuyOpen(true)}
                        disabled={!gold || gold < booster.price}
                    >
                        Buy
                    </Button>
                </CardContent>
            </Card>

            <Dialog
                open={isConfirmBuyOpen}
                onClose={handleConfirmBuyClose}
            >
                <DialogTitle>Buy Booster</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to buy <b>{booster.name}</b> booster for {booster.price} gold?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsConfirmBuyOpen(false)}>No</Button>
                    <Button color="success" onClick={() => {onBuy(booster.id); setIsConfirmBuyOpen(false)}}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
