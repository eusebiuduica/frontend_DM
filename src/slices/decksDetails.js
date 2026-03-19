import { createSlice } from '@reduxjs/toolkit';

const decksDetailsSlice = createSlice({
    name: 'decksDetails',
    initialState: {
        currentNbDecks: 0,
        maxNbDecks: 0,
        deckSlotPrice: 0,
        decks: [],
        previewDeck: {}
    },
    reducers: {
        setCurrentNbDecks: (state, action) => {
            state.currentNbDecks = action.payload;
        },
        incrementNbDecks: (state) => {
            if (state.currentNbDecks === state.maxNbDecks)
                return;
            state.currentNbDecks += 1;
        },
        decrementNbDecks: (state) => {
            if (state.currentNbDecks == 0)
                return;
            state.currentNbDecks -= 1;
        },
        setMaxNbDecks: (state, action) => {
            state.maxNbDecks = action.payload;
        },
        incrementMaxNbDecks: (state) => {
            state.maxNbDecks += 1;
        },
        setDeckSlotPrice: (state, action) => {
            state.deckSlotPrice = action;
        },
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
        resetAllDecks: (state) => {
            state.previewDeck = {};
            state.decks = [];
        }
    }
});

export const { setCurrentNbDecks, incrementNbDecks, decrementNbDecks, setMaxNbDecks, incrementMaxNbDecks, setDecks, addDeck, editDeck, removeDeck, removeAllDecks, setPreviewDeck, resetAllDecks } = decksDetailsSlice.actions;
export default decksDetailsSlice.reducer;