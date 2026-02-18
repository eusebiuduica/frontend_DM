import {configureStore} from "@reduxjs/toolkit";
import userDetailsReducer from '../slices/userDetails'
import sellDetailsReducer from '../slices/sellDetails'
import decksDetailsReducer from "../slices/decksDetails"
import marketplaceDetailsReducer from "../slices/marketplaceDetails"

const store = configureStore({
    reducer: {
        userDetails: userDetailsReducer,
        sellDetails: sellDetailsReducer,
        decksDetails: decksDetailsReducer,
        marketplaceDetails: marketplaceDetailsReducer
    }
});

export default store;