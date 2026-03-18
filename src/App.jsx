import AuthPage from "./pages/AuthPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import CollectionPage from "./pages/CollectionPage.jsx";
import BoosterShopPage from "./pages/BoosterShopPage.jsx";
import CollectionSellPage from "./pages/CollectionSellPage.jsx";
import MarketPlace from "./pages/MarketPlace.jsx";
import AddMarketplaceOrder from "./pages/AddMarketplaceOrder.jsx"
import UserDetails from "./pages/UserDetails.jsx"
import { Routes, Route } from "react-router";
import DecksPage from "./pages/DecksPage.jsx";
import Navbar from "./components/NavBar";
import { Box, Toolbar } from "@mui/material";
import { useLocation } from "react-router";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { updateGold } from "./slices/userDetails";
import { setCollection } from "./slices/collectionDetails.js"
import { setOrders, addOrder, updateOrder, removeOrder } from "./slices/marketplaceDetails";
import { setBoosters, updateBoosterQuantity } from "./slices/boostersDetails.js";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function useSSE() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const loginToken = useSelector(state => state.userDetails.loginToken);

  useEffect(() => {
    if (!loginToken) return;

    async function fetchCollections() {
      const res = await fetch(`${API_URL}/collection/cards`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginToken}` // token în header
        }
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const data = await res.json(); // parse JSON
      dispatch(setCollection(data));
    }

    fetchCollections();
  }, [dispatch, loginToken]);

  useEffect(() => {
    if (!loginToken) return;

    fetch(`${API_URL}/marketplace/getAll`, {
      headers: {
        "Authorization": `Bearer ${loginToken}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        dispatch(setOrders(data));
      })
      .catch(err => console.error("Fetch error:", err));
  }, [loginToken]);

  useEffect(() => {
    if (!loginToken) return;
    fetch(`${API_URL}/booster/all`, {
      headers: {
        "Authorization": `Bearer ${loginToken}`,
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => {
        dispatch(setBoosters(data));
      })
      .catch(err => console.error("Fetch error:", err));
  }, [loginToken]);

  useEffect(() => {

    if (!loginToken) return;
    const es = new EventSource(
      `${API_URL}/marketplace/stream?token=${loginToken}`
    );

    es.addEventListener("PRODUCT_ADDED", e => {
      const item = JSON.parse(e.data);
      dispatch(addOrder(item));
    });

    es.addEventListener("ORDER_UPDATED", e => {
      const updatedOrder = JSON.parse(e.data);
      dispatch(updateOrder(updatedOrder));
    });

    es.addEventListener("ORDER_DELETED", e => {
      const orderId = JSON.parse(e.data);
      dispatch(removeOrder({ orderId }));
    });

    es.addEventListener("SALE_COMPLETED", e => {
      const sale = JSON.parse(e.data);
      enqueueSnackbar(sale.info, {
        variant: "success",
        autoHideDuration: 5000
      });
      dispatch(updateGold(sale.totalGold));
    });

    es.addEventListener("BOOSTER_BOUGHT", e => {
      const boosterUpdate = JSON.parse(e.data);
      dispatch(updateBoosterQuantity(boosterUpdate));
    });

    es.addEventListener("DAILY_BOOSTERS_RESET", e => {
      const boosters = JSON.parse(e.data);
      dispatch(setBoosters(boosters));
    });

    es.onerror = () => {
      console.log("SSE connection error");
      es.close();
    };

    return () => {
      es.close();
    };

  }, [loginToken]);

}


function App() {

  useSSE();

  const location = useLocation();
  const hidden = location.pathname === "/login";
  return (
    <>
      {!hidden && (
        <>
          <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100 }}>
            <Navbar />
          </Box>
          <Toolbar />
        </>
      )}
      <Routes>
        <Route path="/login" element={<AuthPage />} />

        <Route
          path="/home"
          element={<HomePage message="Hello! This is home!" />}
        />

        <Route
          path="/collection"
          element={<CollectionPage message="Hello! This is collection!" />}
        />

        <Route
          path="/collection/buy"
          element={<BoosterShopPage message="Hello! This is booster shop!" />}
        />

        <Route
          path="/collection/sell"
          element={<CollectionSellPage message="Hello! This is card sell shop!" />}
        />

        <Route
          path="/decks"
          element={<DecksPage message="Hello! This is decks!" />}
        />

        <Route
          path="/marketPlace"
          element={<MarketPlace message="Hello! This is MarketPlace!" />}
        />

        <Route
          path="marketplace/add"
          element={<AddMarketplaceOrder message="Hello! This is MarketPlace!" />}
        />

        <Route
          path="/userDetails"
          element={<UserDetails message="Hello! This is user account!" />}
        />
      </Routes>
    </>
  );
}

export default App
