import { useEffect, useState } from 'react';
import { Container, Box, Grid, Fab, Stack, Tooltip } from '@mui/material';
import CollectionSellComponent from '../components/CollectionSellComponent';
import SellBadge from '../components/SellBadge';
import { updateGold } from "../slices/userDetails";
import { useDispatch } from 'react-redux';
import ReplayIcon from '@mui/icons-material/Replay';

function CollectionSellPage() {
    const [sellCards, setSellCards] = useState({});
    const [totalSellGold, setTotalSellGold] = useState(0);

    const dispatch = useDispatch();

    useEffect(() => {
        fetch("http://localhost:8080/collection/cards_for_sell", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Not found!");
                return res.json();
            })
            .then((cards) => {
              
                const cardMap = {};
                cards.forEach(card => { cardMap[card.id] = { ...card, sellQuantity: 0 } });
                setSellCards(cardMap);
            })
            .catch(console.error);
    }, []);

    const handleOnSell = async () => {
        const token = localStorage.getItem("authToken");

        const cardsSold = Object.values(sellCards)
            .filter(c => c.sellQuantity > 0)
            .map(c => ({ cardId: c.id, quantity: c.sellQuantity }));

        try {
            const response = await fetch("http://localhost:8080/collection/sell", {
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
                const newMap = { ...prev };
                Object.values(newMap).forEach(c => {
                    const soldCard = cardsSold.find(s => s.cardId === c.id);
                    if (soldCard) {
                        c.quantity -= soldCard.quantity;     
                        c.sellQuantity = 0;                  
                    }
                });

               
                Object.keys(newMap).forEach(key => {
                    if (newMap[key].quantity <= 0) {
                        delete newMap[key];
                    }
                });

                return newMap;
            });


            dispatch(updateGold(result.gold));
            setTotalSellGold(0);

            console.log("Sell successful:", result);
        } catch (error) {
            console.error("Error selling cards:", error);
        }
    };

   
    const handleQuantityChange = (cardId, quantity) => {
        setSellCards(prev => {
            const oldQuantity = prev[cardId].sellQuantity;
            const cardPrice = prev[cardId].sellGold;

         
            setTotalSellGold(prevTotal => prevTotal - (oldQuantity * cardPrice) + (quantity * cardPrice));

            
            return {
                ...prev,
                [cardId]: { ...prev[cardId], sellQuantity: quantity }
            };
        });
    };

    const handleReset = () => {
        setTotalSellGold(0);
        setSellCards(prev => {
            const newMap = { ...prev };
            Object.values(newMap).forEach(c => c.sellQuantity = 0);
            return newMap;
        });
    };

    return (
        <>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box
                    sx={{
                        height: '79vh',
                        overflowY: 'auto',
                        padding: 1,
                        border: '1px solid #ddd',
                    }}
                >
                    <Grid container spacing={4}>
                        {Object.values(sellCards).filter(c => c.quantity > 0).map(card => (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={card.id}>
                                <CollectionSellComponent
                                    card={card}
                                    onQuantityChange={handleQuantityChange}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
            <Stack spacing={10} sx={{ position: "fixed", top: 80, right: 30, zIndex: 1000 }}>
                <SellBadge gold={totalSellGold} onSell={handleOnSell} />

              
                <Tooltip title="Reset selected cards" arrow placement="left">
                    <Fab sx={{ width: 70, height: 70 }} onClick={handleReset}>
                        <ReplayIcon sx={{ fontSize: 32 }} />
                    </Fab>
                </Tooltip>
            </Stack >
        </>
    );
}

export default CollectionSellPage;
