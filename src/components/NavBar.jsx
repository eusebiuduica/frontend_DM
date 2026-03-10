const API_URL = import.meta.env.VITE_API_BASE_URL;

import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateGold } from "../slices/userDetails";
import { useLocation } from "react-router";

function Navbar() {
    const location = useLocation();
    const hidden = location.pathname === "/login";
    const [collectionMenu, setCollectionMenu] = useState(null);
    const [marketplaceMenu, setMarketplaceMenu] = useState(null);
    const [navBarText, setNavBarText] = useState(
        localStorage.getItem("navBarText") || ""
    );
    const handleCollectionMenuOpen = (event) => {
        setCollectionMenu(event.currentTarget);
    };

    const handleCollectionMenuClose = () => {
        setCollectionMenu(null);
    };

    const handleMarketPlaceMenuOpen = (event) => {
        setMarketplaceMenu(event.currentTarget);
    };

    const handleMarketPlaceMenuClose = () => {
        setMarketplaceMenu(null);
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        fetch(`${API_URL}/user/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                dispatch(updateGold(data.gold));
            });
    }, []);

    const handleSetNavBarText = (text) => {
        setNavBarText(text);
        localStorage.setItem("navBarText", text);
    };

    const gold = useSelector((state) => state.userDetails.gold);

    return (
        <AppBar>
            <Toolbar>
                <Typography
                    variant="h6"
                    sx={{
                        color: "#fff",
                        fontWeight: 600,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        textShadow: "0 2px 6px rgba(0,0,0,0.4)",
                    }}
                >
                    {navBarText}
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Button
                    color="inherit" onClick={() => { handleSetNavBarText("Home"); navigate("/home"); }}
                >
                    <img
                        src="/resources/other/icoApp.webp"
                        alt="home"
                        style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    Home
                </Button>

                <Button
                    color="inherit"
                    onClick={handleCollectionMenuOpen}
                    aria-controls="collection-menu"
                    aria-haspopup="true"
                >
                    <img
                        src="/resources/other/collection.webp"
                        alt="home"
                        style={{ width: 23, height: 32, marginRight: 8 }}
                    />
                    Collection ▾
                </Button>

                <Menu
                    id="collection-menu"
                    anchorEl={collectionMenu}
                    open={Boolean(collectionMenu)}
                    onClose={handleCollectionMenuClose}

                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            handleSetNavBarText("Collection");
                            handleCollectionMenuClose();
                            navigate("/collection");
                        }}
                    >
                        Collection
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            handleSetNavBarText("Collection - Buy");
                            handleCollectionMenuClose();
                            navigate("/collection/buy");
                        }}
                    >
                        Buy
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            handleSetNavBarText("Collection - Sell");
                            handleCollectionMenuClose();
                            navigate("/collection/sell");
                        }}
                    >
                        Sell
                    </MenuItem>

                </Menu>

                <Button
                    color="inherit"
                    onClick={() => {
                        handleSetNavBarText("Decks Manager");
                        navigate("/decks");
                    }}
                >
                    <img
                        src="/resources/other/deck_manager.webp"
                        alt="decks"
                        style={{ width: 23, height: 32, marginRight: 8 }}
                    />
                    Decks Manager
                </Button>

                <Button
                    color="inherit"
                    onClick={handleMarketPlaceMenuOpen}
                    aria-controls="marketplace-menu"
                    aria-haspopup="true"
                >
                    <img
                        src="/resources/other/collection.webp"
                        alt="home"
                        style={{ width: 23, height: 32, marginRight: 8 }}
                    />
                    Markeplace ▾
                </Button>

                <Menu
                    id="marketplace-menu"
                    anchorEl={marketplaceMenu}
                    open={Boolean(marketplaceMenu)}
                    onClose={handleMarketPlaceMenuClose}

                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            handleSetNavBarText("Marketplace");
                            handleMarketPlaceMenuClose();
                            navigate("/marketplace");
                        }}
                    >
                        Marketplace
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            handleSetNavBarText("Marketplace - Add order");
                            handleMarketPlaceMenuClose();
                            navigate("/marketplace/add");
                        }}
                    >
                        Add order
                    </MenuItem>
                </Menu>
                <Button
                    color="inherit"
                    onClick={() => {
                        handleSetNavBarText("User");
                        navigate("/userDetails");
                    }}
                >
                    User
                </Button>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <img
                        src="/resources/other/iconGold.webp"
                        alt="Gold"
                        style={{ width: 24, height: 24 }}
                    />
                    <Typography>
                        {gold}
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar >
    );
}

export default Navbar;
