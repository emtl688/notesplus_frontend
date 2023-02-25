import { useState, useEffect } from "react";
import {
  AppBar,
  Button,
  Box,
  Typography,
  Toolbar,
  Menu,
  MenuItem,
} from "@mui/material";
import { Home, ArrowDropDownOutlined } from "@mui/icons-material";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import FlexBetween from "./FlexBetween";
import profileImage from "../img/profile.jpeg";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#2196f3",
    },
  },
});

export default function DashHeader() {
  const { username, status } = useAuth();

  const navigate = useNavigate();
  const onGoHomeClicked = () => navigate("/dash");

  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const [sendLogout, { isSuccess }] = useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        sx={{
          position: "static",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* LEFT SIDE */}
          <FlexBetween>
            <button
              className="dash-footer__button icon-button"
              onClick={onGoHomeClicked}
            >
              <Home />
            </button>
            <FlexBetween>
              <p style={{ fontSize: "medium", paddingLeft: "20px" }}>{today}</p>
            </FlexBetween>
          </FlexBetween>

          {/* RIGHT SIDE */}
          <FlexBetween gap="1.5rem">
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: "#fff6e0" }}
                >
                  {username}
                </Typography>
                <Typography fontSize="0.75rem" sx={{ color: "#ffedc2" }}>
                  {status}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{ color: "#ffe3a3", fontSize: "25px" }}
              />
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem onClick={sendLogout}>Log Out</MenuItem>
            </Menu>
          </FlexBetween>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}