import { createSlice } from '@reduxjs/toolkit';

const decksDetailsSlice = createSlice({
    name: 'decksDetails',
    initialState: {
        decks: [],
        previewDeck: {}
    },
    reducers: {
        setDecks: (state, action) => {
            state.decks = action.payload;
        },
        addDeck: (state, action) => {
            state.decks.push(action.payload);
        },
        editDeck: (state, action) => {
            const { deckId, name, deckCards } = action.payload;
            const deck = state.decks.find(d => d.deckId === deckId);
            if (deck) {
                if (name !== undefined) deck.deckName = name;
                if (deckCards !== undefined) deck.deckCards = deckCards;
            }
        },
        removeDeck: (state, action) => {
            const deckIdToRemove = action.payload;
            state.decks = state.decks.filter(deck => deck.deckId !== deckIdToRemove);
        },
        removeAllDecks: (state) => {
            state.decks = [];
        },
        setPreviewDeck: (state, action) => {
            state.previewDeck = action.payload;
        },
    }
});

export const { setDecks, addDeck, editDeck, removeDeck, removeAllDecks, setPreviewDeck } = decksDetailsSlice.actions;
export default decksDetailsSlice.reducer;