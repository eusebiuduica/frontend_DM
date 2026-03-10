import {configureStore} from "@reduxjs/toolkit";
import userDetailsReducer from '../slices/userDetails'
import sellDetailsReducer from '../slices/sellDetails'
import decksDetailsReducer from "../slices/decksDetails"
import marketplaceDetailsReducer from "../slices/marketplaceDetails"
import collectionDetailsReducer from "../slices/collectionDetails"

const store = configureStore({
    reducer: {
        userDetails: userDetailsReducer,
        sellDetails: sellDetailsReducer,
        decksDetails: decksDetailsReducer,
        marketplaceDetails: marketplaceDetailsReducer,
        collectionDetails: collectionDetailsReducer
    }
});

export default store;