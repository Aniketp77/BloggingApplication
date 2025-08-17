import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box, Link } from "@mui/material";

export default function Login({ onLogin }) { // ✅ Ensure onLogin is received
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // ✅ Send cookies
    });

    console.log("Response Status:", response.status);

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    console.log("User Data:", data);

    localStorage.setItem("user", JSON.stringify(data));
    onLogin(data);
    navigate("/dashboard");
  } catch (err) {
    console.error("Login Error:", err);
    setError("Invalid email or password");
  }
};


  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography component="h1" variant="h5">Sign in</Typography>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus />
          <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign In</Button>
          <Link component="button" type="button" variant="body2" onClick={() => navigate('/signup')}>
            Don't have an account? Sign Up
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
