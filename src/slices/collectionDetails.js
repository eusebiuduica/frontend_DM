import { createSlice } from '@reduxjs/toolkit';

// Redux slice for collections
const collectionSlice = createSlice({
  name: 'collection',  // slice name
  initialState: {
    cards: [],         // array to hold collection cards
  },
  reducers: {
    // Set the entire collection (replace all cards)
    setCollection: (state, action) => {
      state.cards = action.payload;
    },

    updateCard: (state, action) => {
      if (!action.payload || typeof action.payload.id === 'undefined') return; // safety check

      const index = state.cards.findIndex(c => c.id === Number(action.payload.id));
      if (index !== -1) {
        const currentQuantity = state.cards[index].quantity || 0;
        const delta = action.payload.quantity || 0;

        // Add delta to current quantity, min 0
        state.cards[index].quantity = Math.max(currentQuantity + delta, 0);

        // Optional: you can also update inPackage if needed, same logic
        if (action.payload.inPackage !== undefined) {
          const currentInPackage = state.cards[index].inPackage || 0;
          state.cards[index].inPackage = Math.max(currentInPackage + action.payload.inPackage, 0);
        }
      }
    },

    updateCardQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      const card = state.cards.find(c => c.id === id);
      if (!card) return;

      if (card.inPackage >= quantity) {
        return;
      }

      const difference = quantity - card.inPackage;

      card.quantity -= difference;
      card.inPackage += difference;

      if (card.quantity < 0) {
        card.quantity = 0;
      }
    },

    resetInPackageToQuantity: (state) => {
      state.cards.forEach(card => {
        card.quantity += card.inPackage;
        card.inPackage = 0;
      });
    },

    adjustInPackage: (state, action) => {
      const { id, quantity } = action.payload;

      const card = state.cards.find(c => c.id === id);
      if (!card) return;

      if (quantity < card.inPackage) {
        const difference = card.inPackage - quantity;
        card.inPackage = quantity;
        card.quantity += difference;
      }
    },

    // Remove a card from the collection by id
    removeCollection: (state, action) => {
      state.cards = state.cards.filter(c => c.id !== action.payload);
    },
  },
});

// Export actions to be used in components
export const {
  setCollection,
  updateCard,
  updateCardQuantity,
  resetInPackageToQuantity,
  adjustInPackage,
  removeCollection,
} = collectionSlice.actions;

// Export reducer to be used in store
export default collectionSlice.reducer;