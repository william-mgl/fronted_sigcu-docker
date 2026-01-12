import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import { FaUserShield, FaMoneyBillWave, FaSignOutAlt, FaUsers, FaCoins } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const navigate = useNavigate(); 
  const [usuarios, setUsuarios] = useState([]);
  const [userId, setUserId] = useState("");
  const [monto, setMonto] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); 
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const obtenerUsuarios = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/usuarios`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        setUsuarios(data);
      } else {
        console.error("Error del servidor:", data.error);
      }
    } catch (err) {
      console.error("Error de red:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Validar acceso
    if (!token || user?.rol !== 'admin_comedor') {
      navigate('/login');
      return;
    }
    obtenerUsuarios();
  }, [token, user, navigate, obtenerUsuarios]);

  const recargar = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/usuarios/saldo`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ id: userId, monto: Number(monto) }) 
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje({ type: "success", text: `✅ Recarga de $${monto} exitosa para ${data.usuario}` });
        setMonto(""); 
        setUserId("");
        obtenerUsuarios(); // Actualizar lista
      } else {
        setMensaje({ type: "error", text: data.error });
      }
    } catch (error) {
      setMensaje({ type: "error", text: "Error de conexión" });
    }
    setTimeout(() => setMensaje(null), 4000);
  };

  return (
    <div className="min-vh-100 bg-dark text-white">
      <nav className="navbar navbar-dark bg-black px-4 shadow">
        <span className="navbar-brand mb-0 h1"><FaUserShield className="text-warning" /> SIGCU ADMIN</span>
        <button className="btn btn-outline-danger btn-sm" onClick={() => { localStorage.clear(); navigate('/login'); }}>
          <FaSignOutAlt /> Salir
        </button>
      </nav>

      <div className="container py-5 d-flex justify-content-center">
        <div className="card bg-secondary bg-opacity-10 p-4 border-secondary shadow-lg" style={{ width: "100%", maxWidth: "500px", borderRadius: "20px" }}>
          <h3 className="text-center mb-4">Recargar Saldo</h3>
          
          {mensaje && <div className={`alert ${mensaje.type === 'error' ? 'alert-danger' : 'alert-success'} text-center`}>{mensaje.text}</div>}

          <form onSubmit={recargar}>
            <div className="mb-3">
              <label className="form-label small text-info"><FaUsers /> Seleccionar Estudiante:</label>
              <select className="form-select bg-dark text-white border-secondary" value={userId} onChange={e => setUserId(e.target.value)} required>
                <option value="">{loading ? "Cargando estudiantes..." : "-- Buscar en lista --"}</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.nombre} (Saldo: ${Number(u.saldo).toFixed(2)})</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label small text-info"><FaCoins /> Monto a Cargar ($):</label>
              <input type="number" className="form-control bg-dark text-white border-secondary" placeholder="0.00" value={monto} onChange={e => setMonto(e.target.value)} step="0.01" min="0.10" required />
            </div>

            <button type="submit" className="btn btn-success w-100 fw-bold py-2" disabled={loading || !userId}>
              EJECUTAR RECARGA
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}