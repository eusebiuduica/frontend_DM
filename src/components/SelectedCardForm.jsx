import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardMedia,
    TextField,
    Button
} from "@mui/material";
import { removeCardsForSell } from '../slices/sellDetails';
import { useDispatch } from "react-redux";

export default function SelectedCardForm({ card, onSold }) {
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(1);

    const dispatch = useDispatch();

    const handleQuantityChange = (e) => {
        const value = Math.max(1, Math.min(card.quantity, parseInt(e.target.value) || 0));
        setQuantity(value);
    };

    const handlePriceChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value) || 0);
        setPrice(value);
    };

    useEffect(() => {
        setQuantity(1);
        setPrice(1);
    }, [card]);

    if (!card) {
        return (
            <Typography variant="h6" color="text.secondary">
                Select a card to create an order
            </Typography>
        );
    }

    const handleSubmit = async () => {
        const token = localStorage.getItem("authToken");

        await fetch("http://localhost:8080/marketplace/add", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cardId: card.id,
                quantity,
                price
            })
        });

        const cardToRemove = {
            id: card.id,   
            quantity: quantity
        };

        dispatch(removeCardsForSell([cardToRemove]));
        onSold();
        setQuantity(1);
        setPrice("");
    };

    return (
        <Box maxWidth={400}>
            <Typography variant="h6" mb={2}>
                Create marketplace order
            </Typography>

            <Card sx={{ mb: 2, maxWidth: 260 }}>
                <CardMedia
                    component="img"
                    image={`http://localhost:8080/${card.image}`}
                    alt={card.name}
                    sx={{
                        height: "auto",         
                        objectFit: "contain",
                        width: "100%",       
                        backgroundColor: "#f5f5f5"
                    }}
                />
            </Card>

            <TextField
                fullWidth
                type="number"
                label="Copies"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{
                    min: 1,
                    max: card.quantity
                }}
                sx={{ mb: 2 }}
            />

            <TextField
                fullWidth
                type="number"
                label="Price per copy"
                value={price}
                inputProps={{
                    min: 1
                }}
                onChange={handlePriceChange}
                sx={{ mb: 3 }}
            />

            <Button
                variant="contained"
                fullWidth
                disabled={quantity < 1 || quantity > card.quantity || price <= 0}
                onClick={handleSubmit}
            >
                Add to marketplace
            </Button>
        </Box>
    );
}
