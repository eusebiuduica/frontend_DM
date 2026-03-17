const API_URL = import.meta.env.VITE_API_BASE_URL;

import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import BoosterComponent from "../components/BoosterComponent";
import OpenBoosterModal from "../components/OpenBoosterModal";
import { useDispatch } from "react-redux";
import { updateGold } from "../slices/userDetails";
import { updateCard } from "../slices/collectionDetails";

import { useSnackbar } from "notistack";

import { useSelector } from 'react-redux';

export default function BoosterShopPage() {
    const boosters = useSelector((state) => state.boostersDetails.boosters);
    const [boosterCards, setBoosterCards] = useState([]);
    const [openBooster, setOpenBooster] = useState(false);
    const [boosterId, setBoosterId] = useState();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const handleBuy = async (boosterId) => {
        try {
            const res = await fetch(`${API_URL}/booster/buy`, {
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


            // success
            setBoosterCards(data.cards);
            setOpenBooster(true);
            setBoosterId(boosterId);
            dispatch(updateGold(data.goldLeft));
            
            data.cards.forEach(card => {
                dispatch(updateCard({ id: card.id, quantity: 1 }));
            });

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
                    {boosters.filter((booster) => booster.quantity > 0).map((booster) => (
                        <Grid key={booster.id}>
                            <BoosterComponent booster={booster} onBuy={handleBuy} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
}
