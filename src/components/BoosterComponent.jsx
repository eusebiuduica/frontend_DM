import { Card, CardContent, CardMedia, Typography, Button } from "@mui/material";

export default function BoosterComponent({ booster, onBuy }) {
    return (
        <Card sx={{ width: 240, textAlign: "center" }}>
            <CardMedia
                component="img"
                height="auto"
                image={`/resources/boosters/booster_dm${String(booster.id).padStart(2, '0')}.webp`}
                alt={booster.boosterName}
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
                    onClick={() => onBuy(booster.id)}
                >
                    Buy
                </Button>
            </CardContent>
        </Card>
    );
}
