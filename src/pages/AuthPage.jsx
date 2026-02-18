import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function AuthPage() {
    const [tab, setTab] = useState(0);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundImage: "url(/resources/other/login-bg.jpg)",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                position: "relative"
            }}
        >
            <Box
                sx={{
                    width: 300,
                    position: "absolute",
                    top: 20,
                    right: 20,
                    border: "solid #ff0000",
                    borderRadius: 3
                }}
            >
                <Box sx={{ mt: 3 }}>
                    {tab === 0 && <LoginForm />}
                    {tab === 1 && <RegisterForm />}
                </Box>

                <Tabs
                    value={tab}
                    onChange={(e, newValue) => setTab(newValue)}
                    centered
                    textColor="inherit"
                    indicatorColor="secondary"
                    sx={{ color: "#ff0000" }}  
                >
                    <Tab
                        label="Login"
                        sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                            fontSize: 18,
                            borderRadius: 3,
                            color: "#ff0000" 
                        }}
                    />
                    <Tab
                        label="Register"
                        sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                            fontSize: 18,
                            borderRadius: 3,
                            color: "#ff0000"
                        }}
                    />
                </Tabs>

            </Box>
        </Box>
    );
}
