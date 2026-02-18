import { createSlice } from "@reduxjs/toolkit";

const marketplaceDetailsSlice = createSlice({
  name: "marketplaceDetails",

  initialState: {
    orders: []
  },

  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },

    addOrder: (state, action) => {
      const order = action.payload;

      const exists = state.orders.some(o => o.id === order.id);
      if (!exists) {
        state.orders.push(order);
      }
    },

    removeOrder: (state, action) => {
      const { orderId } = action.payload;
      state.orders = state.orders.filter(o => o.id !== orderId);
    },

    updateOrder: (state, action) => {
      const updated = action.payload;

      const index = state.orders.findIndex(o => o.id === updated.id);
      if (index !== -1) {
        state.orders[index] = {
          ...state.orders[index],
          ...updated
        };
      }
    }
  }
});

export const {
  setOrders,
  addOrder,
  removeOrder,
  updateOrder
} = marketplaceDetailsSlice.actions;

export default marketplaceDetailsSlice.reducer;
