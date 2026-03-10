const API_URL = import.meta.env.VITE_API_BASE_URL;

import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from 'react-router';
import { updateGold, setLoginToken, setUsername } from "../slices/userDetails";
import { useDispatch } from "react-redux";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setGeneralError("");

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: email,
                    password: password
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setGeneralError(data.errors);
            } else {
                const data = await res.json();
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("dailyReward", "false");
                dispatch(updateGold(data.totalGold));
                localStorage.setItem("username", email);
                if (data.dailyReward) {
                    localStorage.setItem("dailyReward", "true");
                    localStorage.setItem("dailyRewardGold", data.goldReceived);
                }

                localStorage.setItem("navBarText", "Home");
                dispatch(setLoginToken(data.token));
                dispatch(setUsername(email));
                navigate("/home", { replace: true });
            }
        } catch (err) {
            setGeneralError("Network error");
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {Array.isArray(generalError) && generalError.map((err, i) => (
                <Typography key={i} color="error">
                    • {err}
                </Typography>
            ))}
            <TextField
                label="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
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
                error={!!errors.password}
                helperText={errors.password}
                InputLabelProps={{ sx: { color: "#FFFFFF" } }}
                InputProps={{ sx: { color: "#FFFFFF" } }}
                FormHelperTextProps={{ sx: { color: "#FFFFFF" } }}
            />

            <Button type="submit" variant="contained" color="primary">
                Login
            </Button>
        </Box>
    );
}
