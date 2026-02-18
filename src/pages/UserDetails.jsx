import { Box, Typography, Button, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
//import { logout } from "../slices/userDetails";

export default function UserDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = useSelector((state) => state.userDetails.username);
  const gold = useSelector((state) => state.userDetails.gold);
  const token = useSelector((state) => state.userDetails.loginToken);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
  //  dispatch(logout());
    navigate("/login", { replace: true });
  };

  const handleDelete = async () => {
    try {
      const res = await fetch("http://localhost:8080/user/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      localStorage.removeItem("authToken");
      dispatch(logout());
      navigate("/register", { replace: true });

    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Paper elevation={4} sx={{ p: 4, minWidth: 300, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          User Details
        </Typography>

        <Typography sx={{ mt: 2 }}>
          <strong>Username:</strong> {username}
        </Typography>

        <Typography sx={{ mt: 1 }}>
          <strong>Gold:</strong> {gold}
        </Typography>

        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>

          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete Account
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
