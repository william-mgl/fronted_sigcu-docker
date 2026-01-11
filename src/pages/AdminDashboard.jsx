import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FaUserShield, FaMoneyBillWave, FaSignOutAlt, FaUsers, FaCoins } from "react-icons/fa";

// Apuntamos a /api
const API_URL = import.meta.env.VITE_API_URL;

function AdminPanel() {
  const navigate = useNavigate(); 
  const [usuarios, setUsuarios] = useState([]);
  const [userId, setUserId] = useState("");
  const [monto, setMonto] = useState("");
  const [mensaje, setMensaje] = useState(null); // Para mostrar alertas bonitas

  const token = localStorage.getItem("token"); 

  // Cargar lista de usuarios
  const obtenerUsuarios = () => {
    fetch(`${API_URL}/usuarios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener usuarios");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
            setUsuarios(data);
        } else {
            setUsuarios([]); 
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (!token) {
        navigate('/login');
        return;
    }
    obtenerUsuarios(); 
  }, [token, navigate]);

  // Función de Recarga
  const recargar = async (e) => {
    e.preventDefault(); // Evita recargas de página
    if (!userId || !monto) {
      setMensaje({ type: "error", text: "⚠️ Selecciona un usuario y un monto." });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/usuarios/saldo`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ id: userId, monto }) 
      });

      const data = await res.json();
      
      if (res.ok) {
        setMensaje({ type: "success", text: `✅ ${data.message}` });
        setMonto(""); 
        obtenerUsuarios(); // Actualizar lista
        
        // Limpiar mensaje a los 3 segundos
        setTimeout(() => setMensaje(null), 3000);
      } else {
        setMensaje({ type: "error", text: `❌ ${data.error || "Error al recargar"}` });
      }
      
    } catch (error) {
      console.error(error);
      setMensaje({ type: "error", text: "❌ Error de conexión con el servidor" });
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 text-white"
         style={{ background: "linear-gradient(135deg, #141E30, #243B55)" }}> {/* Fondo Dark Premium */}

      {/* HEADER */}
      <nav className="navbar navbar-dark bg-dark bg-opacity-25 px-4 shadow-sm backdrop-blur">
        <div className="d-flex align-items-center gap-3">
            <FaUserShield size={28} className="text-warning" />
            <h3 className="m-0 fw-bold">Panel de Control</h3>
        </div>
        <button 
            className="btn btn-outline-danger d-flex align-items-center gap-2"
            onClick={() => {
                localStorage.clear();
                navigate('/login');
            }}
        >
            <FaSignOutAlt /> Salir
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="container d-flex flex-column align-items-center justify-content-center flex-grow-1">
        
        <div className="card shadow-lg p-4 border-0" 
             style={{ 
                 maxWidth: "500px", 
                 width: "100%", 
                 background: "rgba(255, 255, 255, 0.1)", // Efecto cristal
                 backdropFilter: "blur(10px)",
                 borderRadius: "15px",
                 border: "1px solid rgba(255,255,255,0.2)"
             }}>
          
          <div className="text-center mb-4">
            <div className="bg-success rounded-circle d-inline-flex p-3 mb-3 shadow">
                <FaMoneyBillWave size={40} className="text-white" />
            </div>
            <h2 className="fw-bold text-white">Bóveda Virtual</h2>
            <p className="text-white-50">Gestiona los fondos de los estudiantes</p>
          </div>

          {/* ALERTA DE ESTADO */}
          {mensaje && (
              <div className={`alert ${mensaje.type === 'error' ? 'alert-danger' : 'alert-success'} text-center animate__animated animate__fadeIn`}>
                  {mensaje.text}
              </div>
          )}

          <form onSubmit={recargar}>
            {/* SELECCIÓN DE USUARIO */}
            <div className="mb-3">
                <label className="form-label text-white d-flex align-items-center gap-2">
                    <FaUsers /> Seleccionar Estudiante:
                </label>
                <select
                    className="form-select form-select-lg bg-dark text-white border-secondary"
                    onChange={e => setUserId(e.target.value)}
                    value={userId}
                >
                    <option value="">-- Buscar en la lista --</option>
                    {usuarios.map(u => (
                        <option key={u.id} value={u.id}>
                            ID: {u.id} | {u.nombre} (Saldo: ${Number(u.saldo).toFixed(2)})
                        </option>
                    ))}
                </select>
            </div>

            {/* INPUT MONTO */}
            <div className="mb-4">
                <label className="form-label text-white d-flex align-items-center gap-2">
                    <FaCoins /> Monto a Recargar ($):
                </label>
                <div className="input-group">
                    <span className="input-group-text bg-secondary text-white border-secondary">$</span>
                    <input
                        type="number"
                        className="form-control form-control-lg bg-dark text-white border-secondary"
                        placeholder="Ej: 50.00"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        min="1"
                    />
                </div>
            </div>

            {/* BOTÓN DE ACCIÓN */}
            <button 
                type="submit" 
                className="btn btn-success w-100 btn-lg fw-bold shadow-sm hover-effect"
                disabled={!userId || !monto}
            >
                <FaMoneyBillWave className="me-2" /> PROCESAR RECARGA
            </button>
          </form>

        </div>
        
        <small className="mt-4 text-white-50">Sistema de Gestión Universitario - Módulo Admin</small>
      </div>
    </div>
  );
}

export default AdminPanel;