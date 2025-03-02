import * as React from "react";
import "./Navbar.css";
import AppBar from "@mui/material/AppBar";
import { UserAuth } from "./context/AuthContext";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import logo from "./assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logOut } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleprofile = () => {
    navigate("/account");
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  React.useEffect(() => {
    console.log("user", user);
  });
  return (
    <AppBar
      position="static"
      style={{
        backgroundColor: "#009688",
        position: "sticky",
        top: "0",
        zIndex: "999",
      }}
    >
      {user && (
        <>
          <Container maxWidth="xxxl">
            <Toolbar sx={{ padding: 0 }}>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  <Link to="/" style={{ textDecoration: "none" }}>
                    <MenuItem key="Home">
                      <Typography>Home</Typography>
                    </MenuItem>
                  </Link>
                  <Link to="/donate" style={{ textDecoration: "none" }}>
                    <MenuItem key="Donate book">
                      <Typography>Donate Book</Typography>
                    </MenuItem>
                  </Link>
                  <Link to="/account" style={{ textDecoration: "none" }}>
                    <MenuItem key="Profile">
                      <Typography href="/account">Profile</Typography>
                    </MenuItem>
                  </Link>
                  <Link to="/about" style={{ textDecoration: "none" }}>
                    <MenuItem key="About">
                      <Typography href="/about">About</Typography>
                    </MenuItem>
                  </Link>
                </Menu>
                <Link to="/">
                  <Box
                    className="mobile"
                    component="img"
                    sx={{ height: 40, marginTop: 0.5 }}
                    alt="Logo"
                    src={logo}
                  />
                </Link>
              </Box>
              <Link to="/">
                <Box
                  className="desktop"
                  component="img"
                  sx={{ height: 54 }}
                  alt="Logo"
                  src={logo}
                />
              </Link>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                  <MenuItem key="Home">
                    <Typography
                      variant="h5"
                      noWrap
                      component="a"
                      sx={{
                        mr: 2,
                        display: "block",
                        color: "#ffff",
                        textDecoration: "none",
                      }}
                    >
                      Home
                    </Typography>
                  </MenuItem>
                </Link>
                <Link
                  to="/donate"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <MenuItem key="Donate book">
                    <Typography
                      variant="h5"
                      noWrap
                      component="a"
                      sx={{
                        mr: 2,
                        display: "block",
                        color: "#ffff",
                        textDecoration: "none",
                      }}
                    >
                      Donate Book
                    </Typography>
                  </MenuItem>
                </Link>
                <Link
                  to="/account"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <MenuItem key="Profile">
                    <Typography
                      variant="h5"
                      noWrap
                      component="a"
                      sx={{
                        mr: 2,
                        display: "block",
                        color: "#ffff",
                        textDecoration: "none",
                      }}
                    >
                      Profile
                    </Typography>
                  </MenuItem>
                </Link>
                <Link
                  to="/about"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <MenuItem key="Profile">
                    <Typography
                      variant="h5"
                      noWrap
                      component="a"
                      sx={{
                        mr: 2,
                        display: "block",
                        color: "#ffff",
                        textDecoration: "none",
                      }}
                    >
                      About
                    </Typography>
                  </MenuItem>
                </Link>
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={user.email ? user.email.charAt(0).toUpperCase() : ""}
                      src={user.photoURL ? user.photoURL : "/alttext"}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {user.displayName && (
                    <MenuItem onClick={handleprofile}>
                      <Typography
                        sx={{
                          fontWeight: 900,
                        }}
                      >
                        Hi {user.displayName}
                      </Typography>
                    </MenuItem>
                  )}
                  {!user.displayName && user.email && (
                    <MenuItem onClick={handleprofile}>
                      <Typography
                        sx={{
                          fontWeight: 900,
                        }}
                      >
                        Login with {user.email}
                      </Typography>
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleSignOut}>
                    <Typography>Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </>
      )}
    </AppBar>
  );
};
export default Navbar;
