import { createSlice } from '@reduxjs/toolkit';

const sellDetailsSlice = createSlice({
    name: 'sellDetails',
    initialState: {
        totalGold: 0,
        cardQuantities: {},
        cardsForSell: {}
    },
    reducers: {
        updateCardQuantity: (state, action) => {
            const { cardId, oldQuantity, newQuantity, pricePerCard } = action.payload;

            const difference = newQuantity - oldQuantity;
            const goldChange = difference * pricePerCard;


            state.cardQuantities[cardId] = newQuantity;


            state.totalGold += goldChange;
        },
        setTotalGold: (state, action) => {
            state.totalGold = action.payload;
        },
        resetSell: (state) => {
            state.totalGold = 0;
            state.cardQuantities = {};
        },
        setCardsForSell: (state, action) => {
            state.cardsForSell = Object.fromEntries(
                action.payload.map(card => [card.id, card])
            );
        },
        addCardsForSell: (state, action) => {
            const cards = action.payload;

            cards.forEach(card => {
                const existing = state.cardsForSell[card.id];

                if (!existing) {

                    state.cardsForSell[card.id] = { ...card };
                } else {

                    existing.quantity += card.quantity;
                }
            });
        },
        removeCardsForSell: (state, action) => {
            const cards = action.payload;

            cards.forEach(card => {
                const existing = state.cardsForSell[card.id];
                if (!existing) return;

                existing.quantity -= card.quantity;

                if (existing.quantity < 0) {
                    existing.quantity = 0;
                }
            });
        },
        resetAllSell: (state) => {
            state.totalGold = 0;
            state.cardQuantities = {};
            state.cardsForSell = {};
        }
    }
});

export const { updateCardQuantity, setTotalGold, resetSell, setCardsForSell, addCardsForSell, removeCardsForSell, resetAllSell } = sellDetailsSlice.actions;
export default sellDetailsSlice.reducer;