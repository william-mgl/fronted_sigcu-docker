import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Comedores from "./pages/Comedores";
import Comedor from "./pages/Comedor";
import AdminPanel from "./pages/AdminDashboard"; // Nombre corregido según tu carpeta

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
        alert("Cuenta creada correctamente.");
        window.location.href = "/login";
      } else {
        alert(data.error || "Error creando la cuenta");
      }
    } catch (error) {
      alert("Error de conexión");
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // CAMBIO CLAVE: Validación contra 'admin_comedor'
        if (data.user.rol === "admin_comedor") {
          alert("Modo Administrador Activo");
          window.location.href = "/admin-panel";
        } else {
          alert("Bienvenido!");
          window.location.href = "/dashboard";
        }
      } else {
        alert(data.error || "Credenciales incorrectas");
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/comedores/:id" element={<Comedores />} />
        <Route path="/comedor/:id" element={<Comedor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;