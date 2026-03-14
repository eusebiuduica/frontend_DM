const API_URL = import.meta.env.VITE_API_BASE_URL;

import React, { useEffect, useState, useMemo } from 'react';
import { Box, Fab, Stack, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';
import CollectionSellComponent from '../components/CollectionSellComponent';
import SellBadge from '../components/SellBadge';
import { updateGold } from "../slices/userDetails";
import { useDispatch, useSelector } from 'react-redux';
import ReplayIcon from '@mui/icons-material/Replay';
import { updateCard } from "../slices/collectionDetails";
import { VirtuosoGrid } from 'react-virtuoso';

const CARD_WIDTH = 150;

const gridComponents = {
    List: React.forwardRef(({ style, children }, ref) => (
        <div
            ref={ref}
            style={{
                ...style,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center', // centrat
                gap: 16,                  // spațiu între cărți
            }}
        >
            {children}
        </div>
    )),
    Item: ({ children, ...props }) => <div {...props}>{children}</div>,
};

function CollectionSellPage() {
    const cards = useSelector((state) => state.collectionDetails.cards);
    const [isConfirmSellOpen, setIsConfirmSellOpen] = useState(false);
    const [sellCards, setSellCards] = useState({});

    const handleConfirmSellClose = (event, reason) => {
        if (reason === "backdropClick") {
            return;
        }
        setIsConfirmSellOpen(false);
    };

    const totalSellGold = useMemo(() => {
        return Object.values(sellCards).reduce((acc, card) => {
            return acc + card.sellQuantity * card.sellGold;
        }, 0);
    }, [sellCards]);

    const dispatch = useDispatch();

    useEffect(() => {
        if (cards) {
            const cardMap = {};
            cards.forEach(card => {
                cardMap[card.id] = { ...card, sellQuantity: 0 };
            });
            setSellCards(cardMap);
        }
    }, [cards]);

    const handleOnSell = async () => {
        const token = localStorage.getItem("authToken");

        const cardsSold = Object.entries(sellCards)
            .filter(([key, c]) => c.sellQuantity > 0)
            .map(([key, c]) => ({ id: key, quantity: c.sellQuantity }));

        try {
            const response = await fetch(`${API_URL}/collection/sell`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(cardsSold)
            });

            if (!response.ok) throw new Error("Sell failed!");

            const result = await response.json();


            setSellCards(prev => {
                let hasChange = false;

                const newMap = { ...prev }; // nou pentru React

                cardsSold.forEach(soldCard => {
                    const oldCard = prev[soldCard.id];
                    if (!oldCard) return;

                    const newQuantity = oldCard.quantity - soldCard.quantity;
                    if (newQuantity !== oldCard.quantity) hasChange = true;

                    if (newQuantity <= 0) {
                        delete newMap[soldCard.id];
                        hasChange = true;
                    } else {
                        newMap[soldCard.id] = {
                            ...oldCard,
                            quantity: newQuantity,
                            sellQuantity: 0
                        };
                    }
                });

                return hasChange ? newMap : prev; // dacă nu s-a schimbat nimic, return prev
            });

            dispatch(updateGold(result.gold));

            cardsSold.forEach(card => {
                dispatch(updateCard({ id: card.id, quantity: -card.quantity }));
            });

            console.log("Sell successful:", result);
        } catch (error) {
            console.error("Error selling cards:", error);
        }

        setIsConfirmSellOpen(false);
    };


    const handleQuantityChange = React.useCallback((cardId, quantity) => {
        setSellCards(prev => ({
            ...prev,
            [cardId]: {
                ...prev[cardId],
                sellQuantity: quantity
            }
        }));
    }, []);

    const handleReset = () => {

        const cardsForSell = Object.values(sellCards)
            .filter(c => c.sellQuantity > 0)
            .map(c => ({ cardId: c.id, quantity: c.sellQuantity }));

        setSellCards(prev => {
            const newMap = { ...prev };

            cardsForSell.forEach(card => {
                const oldCard = prev[card.cardId];
                if (!oldCard) return;
                newMap[card.cardId] = {
                    ...oldCard,
                    sellQuantity: 0
                };
            });

            return newMap;
        });
    };

    const cardsFiltered = Object.values(sellCards).filter(c => c.quantity > 0);

    return (
        <>

            <Box
                sx={{

                    overflowY: 'auto',
                    padding: 1,
                    border: '1px solid #ddd',
                }}
            >

                <VirtuosoGrid
                    totalCount={cardsFiltered.length}
                    components={gridComponents}
                    itemContent={(index) => {
                        const card = cardsFiltered[index];
                        return (
                            <Box key={card.id} width={CARD_WIDTH}>
                                <CollectionSellComponent
                                    card={card}
                                    onQuantityChange={handleQuantityChange}
                                />
                            </Box>
                        );
                    }}
                    style={{ height: '600px' }} // height scroll
                />
            </Box>

            <Stack spacing={10} sx={{ position: "fixed", top: 80, right: 30, zIndex: 1000 }}>
                <SellBadge gold={totalSellGold} onSell={() => setIsConfirmSellOpen(true)} />

                <Tooltip title="Reset selected cards" arrow placement="left">
                    <Fab sx={{ width: 70, height: 70 }} onClick={handleReset} disabled={totalSellGold === 0}>
                        <ReplayIcon sx={{ fontSize: 32 }} />
                    </Fab>
                </Tooltip>
            </Stack >

            <Dialog
                open={isConfirmSellOpen}
                onClose={handleConfirmSellClose}
            >
                <DialogTitle>Sell Cards</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to sell the selected cards?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsConfirmSellOpen(false)}>No</Button>
                    <Button color="error" onClick={handleOnSell}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CollectionSellPage;
