import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { Provider } from "react-redux";
import store from "./store/store.js";
import { SnackbarProvider } from "notistack";
import { ThemeProvider, CssBaseline } from "@mui/material";
import darkTheme from "./components/darkTheme.jsx";

createRoot(document.getElementById('root')).render(

    <ThemeProvider theme={darkTheme}>
       {/* <CssBaseline />  resetează fundalul și textul global */}
        <SnackbarProvider maxSnack={3}>
            <Provider store={store}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </Provider >
        </SnackbarProvider>
    </ThemeProvider>
)