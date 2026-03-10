import { createSlice } from "@reduxjs/toolkit"

const userDetailsSlice = createSlice({
    name: 'userDetails',
    initialState: {
        gold: 0,
        username: "",
        loginToken: localStorage.getItem("authToken"),
    },
    reducers: {
        updateGold(state, action) {
            state.gold = action.payload;
        },

        setUsername(state, action) {
            state.username = action.payload;
        },

        setLoginToken(state, action) {
            state.loginToken = action.payload;
        },
        resetAllUser: (state) => {
            state.gold = 0;
            state.username = "";
        }
    }
});

export const { updateGold, setUsername, setLoginToken, resetAllUser } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;