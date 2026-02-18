import { useState } from "react";
import {
    Box, TextField, Button, Typography, FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText
} from "@mui/material";


export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [civilization, setCivilization] = useState("");
    const [errors, setErrors] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors("");

        if (password !== confirmPassword) {
            setErrors("Passwords do not match!");
            return;
        }


        try {
            const res = await fetch("http://localhost:8080/register", {
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


            console.log("Registered successfully");
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
            <FormControl
                sx={{
                    width: 200,
                    "& .MuiOutlinedInput-root": {
                        color: "#FFFFFF",
                        "& fieldset": { borderColor: "#FFFFFF" },
                        "&:hover fieldset": { borderColor: "#FFFFFF" },
                        "&.Mui-focused fieldset": { borderColor: "#FFFFFF" }
                    },
                    "& .MuiInputLabel-root": { color: "#FFFFFF" },
                    "& .MuiSelect-icon": { color: "#FFFFFF" }
                }}
            >
                <InputLabel id="civilization-label">Civilization</InputLabel>

                <Select
                    labelId="civilization-label"
                    label="Civilization"
                    value={civilization}
                    onChange={(e) => setCivilization(e.target.value)}
                    renderValue={(value) => {
                        const civ = {
                            1: { label: "Light", img: "/resources/civilizations/Light.png" },
                            2: { label: "Water", img: "/resources/civilizations/Water.png" },
                            3: { label: "Darkness", img: "/resources/civilizations/Darkness.png" },
                            4: { label: "Fire", img: "/resources/civilizations/Fire.png" },
                            5: { label: "Nature", img: "/resources/civilizations/Nature.png" },
                        }[value];

                        return (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <img src={civ.img} width={40} height={24} />
                                {civ.label}
                            </Box>
                        );
                    }}
                >
                    <MenuItem value={1}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <img src="/resources/civilizations/Light.png" width={40} height={16} />
                            Light
                        </Box>
                    </MenuItem>

                    <MenuItem value={2}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <img src="/resources/civilizations/Water.png" width={40} height={16} />
                            Water
                        </Box>
                    </MenuItem>

                    <MenuItem value={3}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <img src="/resources/civilizations/Darkness.png" width={40} height={16} />
                            Darkness
                        </Box>
                    </MenuItem>

                    <MenuItem value={4}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <img src="/resources/civilizations/Fire.png" width={40} height={16} />
                            Fire
                        </Box>
                    </MenuItem>

                    <MenuItem value={5}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <img src="/resources/civilizations/Nature.png" width={40} height={16} />
                            Nature
                        </Box>
                    </MenuItem>
                </Select>
            </FormControl>

            <Button type="submit" variant="contained" color="primary">
                Register
            </Button>
        </Box>
    );
}
