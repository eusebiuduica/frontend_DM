import { useEffect } from "react";
import { Grid, Box } from "@mui/material";
import Order from "../components/Order";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setOrders, addOrder, updateOrder, removeOrder } from "../slices/marketplaceDetails";

export default function MarketPlace() {
    const orders = useSelector(state => state.marketplaceDetails.orders);
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        fetch("http://localhost:8080/marketplace/getAll", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => {
                dispatch(setOrders(data)); 
            })
            .catch(err => console.error("Fetch error:", err));
    }, [dispatch]);

    return (
        <Box
            sx={{
                height: "90vh",
                overflowY: "auto"
            }}
        >
            <Grid container spacing={3} padding={2}>
                {orders.map(order => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={order.id}>
                        <Order order={order} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
