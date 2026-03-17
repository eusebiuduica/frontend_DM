import { createSlice } from '@reduxjs/toolkit';

// Redux slice for boosters
const boostersSlice = createSlice({
    name: 'boosters',
    initialState: {
        boosters: [],
    },
    reducers: {
        // Set all boosters
        setBoosters: (state, action) => {
            state.boosters = action.payload;
        },

        updateBoosterQuantity: (state, action) => {
            const { id, quantity } = action.payload;

            // check index bounds
            if (id < 0 || id >= state.boosters.length) return;

            const booster = state.boosters[id];

            // ensure non-negative quantity
            const safeQuantity = Math.max(0, quantity);

            booster.quantity = safeQuantity;
        },
    },
});

export const {
    setBoosters,
    updateBoosterQuantity,
} = boostersSlice.actions;

export default boostersSlice.reducer;