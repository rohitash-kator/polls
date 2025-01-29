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

const Signup = () => {
  const navigate = useNavigate();
  const isAuthorized = !!localStorage.getItem("authToken");

  if (isAuthorized) {
    navigate("/");
  }

  const { signup } = useContext(AuthContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!firstName) {
      newErrors.firstName = "First name is required";
      valid = false;
    }
    if (!lastName) {
      newErrors.lastName = "Last name is required";
      valid = false;
    }
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
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await signup({ firstName, lastName, email, password, confirmPassword });
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
          <Typography variant="h3">Join the Conversation!</Typography>
          <Typography variant="body">
            Sign up to participate in our latest poll and share your opinion.
            Your voice matters!
          </Typography>
        </Box>

        {/* Right Side - Signup Form */}
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
              Sign up
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
              <form onSubmit={handleSignup} style={{ width: "100%" }}>
                {/* First Name and Last Name */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <TextField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    margin="normal"
                    type="text"
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    fullWidth
                    sx={{ mr: 1 }}
                  />

                  <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    margin="normal"
                    type="text"
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    fullWidth
                    sx={{ ml: 1 }}
                  />
                </Box>

                {/* Email */}
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email}
                />

                {/* Password and Confirm Password */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <TextField
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    type={showPassword ? "text" : "password"}
                    error={!!errors.password}
                    helperText={errors.password}
                    fullWidth
                    sx={{ mr: 1 }}
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
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    margin="normal"
                    type={showConfirmPassword ? "text" : "password"}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    fullWidth
                    sx={{ ml: 1 }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showConfirmPassword
                                  ? "hide the password"
                                  : "display the password"
                              }
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  color="primary"
                  fullWidth
                  variant="contained"
                  margin="normal"
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>

              {/* Already have an account? */}
              <Box sx={{ textAlign: "center", marginTop: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Already have an account?{" "}
                  <Typography component={Link} to="/login">
                    <Button>Log In</Button>
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

export default Signup;
