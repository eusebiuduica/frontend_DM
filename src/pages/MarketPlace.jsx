import { Grid, Box } from "@mui/material";
import Order from "../components/Order";
import { useSelector } from "react-redux";

export default function MarketPlace() {
    const orders = useSelector(state => state.marketplaceDetails.orders);

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
