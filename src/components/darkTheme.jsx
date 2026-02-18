// theme.js
import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark", // activează dark mode
    background: {
      default: "#000000", // fundal general
      paper: "#121212",   // fundal pentru Box, Card etc.
    },
    text: {
      primary: "#ffffff", // text alb
      secondary: "#bbbbbb",
    },
    divider: "#ffffff",    // pentru border-uri
  },
});

export default darkTheme;
