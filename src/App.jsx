import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Comedores from "./pages/Comedores";
import Comedor from "./pages/Comedor";

// URL del backend (Render)
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const handleRegister = async (form) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Cuenta creada correctamente. Ahora inicia sesión.");
        window.location.href = "/login"; // se reemplaza en Register.jsx
      } else {
        alert(data.error || "Error creando la cuenta");
      }
    } catch (error) {
      console.error("Error register:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  const handleLogin = async (form) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Bienvenido!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/dashboard"; // se reemplaza en Login.jsx
      } else {
        alert(data.error || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error login:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/comedores/:facultadId" element={<Comedores />} />
        <Route path="/comedor/:comedorId" element={<Comedor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
