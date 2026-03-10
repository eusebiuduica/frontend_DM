const API_URL = import.meta.env.VITE_API_BASE_URL;

import { useState } from "react";
import {
    Box, TextField, Button, Typography, FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import { useSnackbar } from "notistack";


const civilizations = [
    { label: "Any", value: 0 },

    {
        label: "Light",
        value: 1,
        img: "/resources/civilizations/Light.webp",
        width: 40,
        height: Math.round((621 / 1000) * 40),
    },

    {
        label: "Water",
        value: 2,
        img: "/resources/civilizations/Water.webp",
        width: 40,
        height: Math.round((449 / 1000) * 40),
    },

    {
        label: "Darkness",
        value: 3,
        img: "/resources/civilizations/Darkness.webp",
        width: 40,
        height: Math.round((391 / 1000) * 40),
    },

    {
        label: "Fire",
        value: 4,
        img: "/resources/civilizations/Fire.webp",
        width: 40,
        height: Math.round((625 / 1000) * 40),
    },

    {
        label: "Nature",
        value: 5,
        img: "/resources/civilizations/Nature.webp",
        width: 40,
        height: Math.round((370 / 1000) * 40),
    },
];

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [civilization, setCivilization] = useState("");
    const [errors, setErrors] = useState("");
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors("");

        if (password !== confirmPassword) {
            setErrors("Passwords do not match!");
            return;
        }


        try {
            const res = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    password,
                    civilization
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setErrors(data.errors);
                return;
            }
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setCivilization("");

            enqueueSnackbar("Registered successfully!", { variant: "success" });
        } catch {
            setErrors("Server error. Try again later.");
        }
    };




    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography color="error" sx={{ whiteSpace: "pre-line" }}>
                {errors}
            </Typography>

            <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputLabelProps={{
                    sx: { color: "#FFFFFF" }
                }}
                InputProps={{
                    sx: { color: "#FFFFFF" }
                }}
                FormHelperTextProps={{
                    sx: { color: "#FFFFFF" }
                }}
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{
                    sx: { color: "#FFFFFF" }
                }}
                InputProps={{
                    sx: { color: "#FFFFFF" }
                }}
                FormHelperTextProps={{
                    sx: { color: "#FFFFFF" }
                }}
            />
            <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputLabelProps={{
                    sx: { color: "#FFFFFF" }
                }}
                InputProps={{
                    sx: { color: "#FFFFFF" }
                }}
                FormHelperTextProps={{
                    sx: { color: "#FFFFFF" }
                }}
            />

            <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Civilization</InputLabel>
                <Select value={civilization} onChange={(e) => setCivilization(e.target.value)} label="Civilization">
                    {civilizations.map((c) => (
                        <MenuItem key={c.value} value={c.value}>
                            <Box display="flex" alignItems="center" gap={1}>
                                {c.value !== 0 && (
                                    <img
                                        src={c.img}
                                        alt={c.label}
                                        style={{ width: c.width, height: c.height }}
                                    />
                                )}
                                {c.label}
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button type="submit" variant="contained" color="primary">
                Register
            </Button>
        </Box>
    );
}
