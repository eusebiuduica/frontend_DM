import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import BoosterComponent from "../components/BoosterComponent";
import OpenBoosterModal from "../components/OpenBoosterModal";
import { useDispatch } from "react-redux";
import { updateGold } from "../slices/userDetails";
import { useSnackbar } from "notistack";

export default function BoosterShopPage() {
    const [boosters, setBoosters] = useState([]);
    const [boosterCards, setBoosterCards] = useState([]);
    const [openBooster, setOpenBooster] = useState(false);
    const [boosterId, setBoosterId] = useState();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetch("http://localhost:8080/booster/all", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Unauthorized");
                return res.json();
            })
            .then(setBoosters)
            .catch(console.error);
    }, []);


    const handleBuy = async (boosterId) => {
        try {
            const res = await fetch("http://localhost:8080/booster/buy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify({ boosterId }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.errors) {
                    data.errors.forEach(errMsg =>
                        enqueueSnackbar(errMsg, { variant: "error" })
                    );
                } else {
                    enqueueSnackbar("Something went wrong", { variant: "error" });
                }
                return;
            }


            // succes
            setBoosterCards(data.cards);
            setOpenBooster(true);
            setBoosterId(boosterId);
            dispatch(updateGold(data.goldLeft));

        } catch (err) {
            console.error("Buy failed", err);
            enqueueSnackbar("Network error or server unreachable", { variant: "error" });
        }
    };


    return (
        <>
            <OpenBoosterModal open={openBooster} boosterId={boosterId} cards={boosterCards} onClose={() => setOpenBooster(false)} />
            <Box sx={{ p: 4 }}>

                <Grid container spacing={3}>
                    {boosters.map((booster) => (
                        <Grid item key={booster.id}>
                            <BoosterComponent booster={booster} onBuy={handleBuy} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
}
