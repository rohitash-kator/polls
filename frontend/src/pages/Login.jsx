import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import AuthContext from "../context/AuthContext";

const emailRegEx = /\S+@\S+\.\S+/;
const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

const Login = () => {
  const navigate = useNavigate();
  const isAuthorized = !!localStorage.getItem("authToken");
  if (isAuthorized) {
    navigate("/");
  }
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegEx.test(email)) {
      newErrors.email = "Enter a valid email";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!passwordRegEx.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase, one uppercase, one number, one special character, and be at least 8 characters long";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        height: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "80%",
          height: "100%",
          background:
            "linear-gradient(to top right, rgba(111, 25, 210, 0.7), rgba(21, 24, 192, 0.7), rgba(13, 52, 161, 0.7), rgba(2, 136, 209, 0.7), rgba(3, 169, 244, 0.7))",
          boxShadow: "0 4px 20px #000000",
          borderRadius: "10px",
        }}
      >
        {/* Left Side - Welcome Section */}
        <Box
          sx={{
            width: "40%",
            height: "70%",
            borderRadius: "5px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
          }}
        >
          <Typography variant="h3">Welcome Back!</Typography>
          <Typography variant="body">
            Please log in to continue and access your personalized content.
          </Typography>
        </Box>

        {/* Right Side - Login Form */}
        <Box
          sx={{
            width: "45%",
            height: "70%",
            zIndex: 1,
            background: "#d8f5f5",
            boxShadow: "0 4px 20px #000000",
            borderRadius: "5px",
            p: 2,
          }}
        >
          <Box>
            <Typography
              variant="h2"
              sx={{ pb: 5, display: "flex", justifyContent: "center" }}
            >
              Sign in
            </Typography>
          </Box>
          <Box
            sx={{
              borderRadius: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 3,
            }}
          >
            <Box sx={{ width: "100%" }}>
              <form onSubmit={handleLogin}>
                {/* Email Field */}
                <TextField
                  label="Email"
                  type="email"
                  required
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                />

                {/* Password Field */}
                <TextField
                  label="Password"
                  required
                  fullWidth
                  margin="normal"
                  value={password}
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword
                                ? "hide the password"
                                : "display the password"
                            }
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  color="primary"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
              <Box sx={{ textAlign: "center", marginTop: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Forgot password?{" "}
                  <Typography component={Link} to="/reset-password">
                    <Button>Reset</Button>
                  </Typography>
                </Typography>
              </Box>

              {/* Signup Link */}
              <Box sx={{ textAlign: "center", marginTop: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Do not have an account?{" "}
                  <Typography component={Link} to="/signup">
                    <Button>Sign Up</Button>
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
