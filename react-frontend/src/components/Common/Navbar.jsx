import { useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import PollIcon from "@mui/icons-material/Poll";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonIcon from "@mui/icons-material/Person";
import userService from "../../api/userService";
import Loader from "./Loader";
import NotificationContext from "../../context/NotificationContext";

const pages = ["Polls", "Reports"];

const Navbar = () => {
  const isAuthorized = !!localStorage.getItem("authToken");
  const { logout } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);

  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthorized) {
      setLoading(true);
      userService
        .getCurrentUser()
        .then((fetchedUser) => {
          setUser(fetchedUser);
        })
        .catch((err) => {
          if (err.status === 401) {
            localStorage.removeItem("authToken");
          }
          addNotification(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load poll data.",
            "error"
          );
        })
        .finally(() => setLoading(false));
    }
  }, [isAuthorized, addNotification]);

  if (loading) {
    return <Loader />;
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ ml: 2, mr: 2 }} disableGutters>
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to={"/"}
          sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <PollIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1, mt: 0.5 }}
          />
          Poll
        </Typography>

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
            sx={{ display: { xs: "block", md: "none" } }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={handleCloseNavMenu}>
                <Typography
                  component={Link}
                  to={`/${page}`}
                  sx={{ textAlign: "center" }}
                >
                  {page}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Typography
          variant="h5"
          noWrap
          component={Link}
          to={"/"}
          sx={{
            mr: 2,
            display: { xs: "flex", md: "none" },
            flexGrow: 1,
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <PollIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1, mt: 0.5 }}
          />
          Poll
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          {pages.map((page) => (
            <Button
              key={page}
              component={Link}
              to={`/${page}`}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              {page}
            </Button>
          ))}
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          {isAuthorized ? (
            <>
              <Tooltip title="Open settings">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{
                    p: 0,
                    backgroundColor: "primary.main",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  <Avatar
                    alt={`${user?.firstName} ${user?.lastName}`}
                    src="fake-path.jpg"
                    sx={{
                      backgroundColor: "secondary.main",
                    }}
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
                <MenuItem key="profile" onClick={handleCloseUserMenu}>
                  <Button
                    component={Link}
                    to="/profile"
                    sx={{ textAlign: "center", display: "flex" }}
                  >
                    <PersonIcon sx={{ mr: 1 }} />
                    Profile
                  </Button>
                </MenuItem>
                <MenuItem key="logout" onClick={handleCloseUserMenu}>
                  <Button
                    onClick={handleLogout}
                    sx={{ textAlign: "center", display: "flex" }}
                  >
                    <ExitToAppIcon sx={{ mr: 1 }} />
                    Logout
                  </Button>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Button
                key="login"
                component={Link}
                to="/login"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Login
              </Button>
              <Button
                key="signup"
                component={Link}
                to="/signup"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Signup
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
