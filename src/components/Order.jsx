const API_URL = import.meta.env.VITE_API_BASE_URL;

import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeOrder, updateOrder } from "../slices/marketplaceDetails";
import { updateGold } from "../slices/userDetails";
import { Button, TextField, Card, CardMedia, CardContent, Typography, Box, Dialog } from "@mui/material";
import { useSnackbar } from "notistack";
import { updateCard } from '../slices/collectionDetails';

export default function Order({ order }) {
    const username = localStorage.getItem("username");
    const [count, setCount] = useState(0);
    const [openImage, setOpenImage] = useState(false);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const handleBuy = async () => {
        const token = localStorage.getItem("authToken");

        try {
            const res = await fetch(`${API_URL}/marketplace/buy`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderId: order.id,
                    quantity: count
                })
            });

            if (!res.ok) {
                const data = await res.json();

                if (data.errors) {
                    data.errors.forEach(errMsg =>
                        enqueueSnackbar(errMsg, { variant: "error" })
                    );
                } else {
                    enqueueSnackbar("Something went wrong", { variant: "error" });
                }
                return;
            }

            if (count === order.quantity) {
                dispatch(removeOrder({ orderId: order.id }));
            } else {
                dispatch(updateOrder({
                    id: order.id,
                    quantity: order.quantity - count
                }));
            }

            dispatch(updateCard({ id: order.cardId, quantity: count }));
            const newGold = await res.json();

            dispatch(updateGold(newGold));
            enqueueSnackbar("Purchase done!", { variant: "success" });
            setCount(0);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleRemove = async () => {
        try {

            const res = await fetch(`${API_URL}/marketplace/remove`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify(order.id),
            });

            if (!res.ok) {
                throw new Error("Failed to remove order");
            }


            const cardToAdd = {
                id: order.cardId,
                quantity: order.quantity,
            };
            dispatch(updateCard({ id: order.cardId, quantity: order.quantity }));


            console.log("Order removed successfully!");
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <Card sx={{ p: 2, mb: 2 }}>
            <CardMedia
                component="img"
                image={`/resources/cards/images/${String(order.cardId).padStart(4, '0')}.webp`}
                alt={`Card ${order.cardId}`}
                sx={{ objectFit: 'cover', borderRadius: 1 }}
                style={{ cursor: "pointer" }}
                onClick={() =>
                    setOpenImage(true)
                }
            />

            <CardContent>
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" fontWeight="bold">
                        Seller:
                    </Typography>
                    <Typography variant="body2">
                        {order.seller} {order.seller === username && "(you)"}
                    </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" fontWeight="bold">
                        Quantity:
                    </Typography>
                    <Typography variant="body2">{order.quantity}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" fontWeight="bold">
                        Price:
                    </Typography>
                    <Typography variant="body2">{order.price}</Typography>
                </Box>

                <TextField
                    type="number"
                    value={count}
                    onChange={e => {
                        const val = Math.max(0, Math.min(order.quantity, Number(e.target.value)));
                        setCount(val);
                    }}
                    inputProps={{ min: 0, max: order.quantity }}
                    size="small"
                    sx={{ width: 80 }}
                    disabled={order.seller === username}
                />
                <Box mt={1}>
                    {order.seller === username ? (
                        <Button
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            onClick={handleRemove}
                        >
                            Remove
                        </Button>
                    ) : (
                        <Button
                            fullWidth
                            variant="contained"
                            disabled={count === 0}
                            onClick={handleBuy}
                        >
                            Buy {count > 0 && `(${count})`}
                        </Button>
                    )}
                </Box>
            </CardContent>
            {/* Modal dialog for big picture */}
            <Dialog open={openImage} onClose={() => setOpenImage(false)}>
                <img
                    src={`/resources/cards/images/${String(order.cardId).padStart(4, '0')}.webp`}
                    alt={`Card ${order.cardId}`}
                    style={{ maxWidth: "400px" }}
                />
            </Dialog>
        </Card>
    );
}
