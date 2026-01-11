import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaWallet, FaSignOutAlt, FaUserCircle, FaUniversity, FaUtensils, FaHistory, FaReceipt, FaClock, FaCheckCircle, FaSearch } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [facultades, setFacultades] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [saldo, setSaldo] = useState(0);

  // 1. Cargar usuario inicial
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // 2. Obtener datos (Facultades, Historial, Saldo)
  useEffect(() => {
    if (!user || !user.id) return;

    const token = localStorage.getItem("token");
    const authHeaders = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    };

    // A) Cargar Facultades - Usando el prefijo /api
    fetch(`${API_URL}/api/facultades`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : [])
      .then(data => setFacultades(data))
      .catch(err => console.error("Error facultades:", err)); 

    // B) Cargar Historial - Coincidiendo con tu esquema de DB
    fetch(`${API_URL}/api/reservas/usuario/${user.id}`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : [])
      .then(data => setHistorial(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error historial:", err)); 

    // C) Obtener Saldo actualizado directamente del perfil del usuario
    fetch(`${API_URL}/api/usuarios/${user.id}`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : { saldo: 0 })
      .then(data => setSaldo(Number(data.saldo) || 0))
      .catch(err => console.error("Error saldo:", err));
    
  }, [user]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center bg-dark text-white">
        <div className="spinner-border text-info me-2" role="status"></div>
        Cargando Sistema...
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 text-white"
         style={{ 
             background: "linear-gradient(135deg, #000428, #004e92)", 
             overflowY: "auto",
             position: "relative"
         }}>
      
      {/* FONDO AMBIENTAL */}
      <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "500px", height: "500px", background: "rgba(0, 255, 255, 0.05)", borderRadius: "50%", filter: "blur(100px)", zIndex: 0 }}></div>

      {/* NAVBAR GLASSMORPHISM */}
      <nav className="navbar navbar-expand-lg px-4 py-3 shadow-sm" 
           style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)", zIndex: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="container-fluid">
            <div className="d-flex align-items-center gap-3">
                <FaUserCircle size={40} className="text-info" />
                <div>
                    <h5 className="m-0 fw-bold text-white">Hola, {user.nombre}</h5>
                    <small className="text-white-50">{user.rol === 'estudiante' ? 'Estudiante UTM' : user.rol}</small>
                </div>
            </div>

            <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm"
                     style={{ background: "linear-gradient(90deg, #11998e, #38ef7d)" }}>
                    <FaWallet size={18} />
                    <span className="fw-bold fs-5">${saldo.toFixed(2)}</span>
                </div>
                <button
                    className="btn btn-outline-light btn-sm d-flex align-items-center gap-2 px-3 rounded-pill"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt /> Salir
                </button>
            </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="container py-5 d-flex flex-wrap gap-4 justify-content-center" style={{ zIndex: 1 }}>
        
        {/* PANEL IZQUIERDO: FACULTADES */}
        <div className="col-lg-7 col-md-12">
            <div className="card border-0 shadow-lg h-100"
                 style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(15px)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)" }}>
                
                <div className="card-header border-0 bg-transparent p-4 pb-2">
                    <h4 className="fw-bold text-white d-flex align-items-center gap-2">
                        <FaUniversity className="text-warning" /> Comedores Disponibles
                    </h4>
                    <p className="text-white-50 small">Selecciona una facultad para ver su menú diario</p>
                </div>

                <div className="card-body p-4 pt-0">
                    <div className="list-group list-group-flush gap-2">
                        {facultades.length > 0 ? facultades.map(f => (
                            <button
                                key={f.id}
                                className="list-group-item list-group-item-action d-flex align-items-center justify-content-between p-3 rounded-3 border-0 text-white"
                                onClick={() => navigate(`/comedores/${f.id}`)}
                                style={{ background: "rgba(0,0,0,0.3)", transition: "0.2s" }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-primary bg-opacity-25 p-2 rounded-circle text-info">
                                        <FaUtensils />
                                    </div>
                                    <span className="fw-bold">{f.nombre}</span>
                                </div>
                                <FaSearch className="text-white-50" />
                            </button>
                        )) : <p className="text-center opacity-50 py-4">No se encontraron facultades.</p>}
                    </div>
                </div>
            </div>
        </div>

        {/* PANEL DERECHO: HISTORIAL */}
        <div className="col-lg-4 col-md-12">
            <div className="card border-0 shadow-lg h-100"
                 style={{ background: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(15px)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
                
                <div className="card-header border-0 bg-transparent p-4 pb-2">
                    <h4 className="fw-bold text-white d-flex align-items-center gap-2">
                        <FaHistory className="text-info" /> Tus Pedidos
                    </h4>
                    <p className="text-white-50 small">Últimas transacciones</p>
                </div>

                <div className="card-body p-3 overflow-auto" style={{ maxHeight: "500px" }}>
                    {historial.length === 0 ? (
                        <div className="text-center py-5 opacity-50">
                            <FaReceipt size={50} className="mb-3" />
                            <p>No tienes compras recientes</p>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {historial.map(r => (
                                <div key={r.id} className="d-flex align-items-center justify-content-between p-3 rounded-3"
                                     style={{ background: "rgba(255,255,255,0.05)", borderLeft: `4px solid ${r.estado === 'retirado' ? '#38ef7d' : '#fdbb2d'}` }}>
                                    
                                    <div>
                                        <h6 className="m-0 fw-bold text-white" style={{fontSize: '0.9rem'}}>{r.plato_nombre || "Reserva de Menú"}</h6>
                                        <small className="text-white-50 d-flex align-items-center gap-1">
                                            <FaClock size={10} /> {new Date(r.fecha_reserva).toLocaleDateString()}
                                        </small>
                                    </div>

                                    <div className="text-end">
                                        <span className="d-block fw-bold text-success">${Number(r.precio_total || 0).toFixed(2)}</span>
                                        <span className={`badge rounded-pill ${r.estado === 'pendiente' ? 'bg-warning text-dark' : 'bg-success'}`} style={{fontSize: '0.7rem'}}>
                                            {r.estado}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

      </main>
      
      <footer className="mt-auto p-3 text-center text-white-50 w-100" style={{ fontSize: "0.8rem", zIndex: 1 }}>
        © 2026 Universidad Técnica de Manabí - Comedores Universitarios
      </footer>
    </div>
  );
}