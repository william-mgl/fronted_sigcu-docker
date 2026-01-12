import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaUniversity, FaUserShield, FaIdCard, FaSignInAlt } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
  const [view, setView] = useState("estudiante"); 
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminId, setAdminId] = useState("");
  const [adminName, setAdminName] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = "/api/auth/login"; 
    
    // Enviamos los datos según la vista activa
    const bodyData = view === "estudiante" 
        ? { email, password } 
        : { adminId, adminName, is_admin: true }; 

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // CORRECCIÓN AQUÍ: Usamos el rol exacto de tu base de datos
        if (data.user.rol === "admin_comedor") {
            navigate("/admin-panel");
        } else {
            navigate("/dashboard");
        }
      } else {
        setError(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100"
         style={{ background: "linear-gradient(135deg, #000428, #004e92)" }}>
      
      <div className="card border-0 shadow-lg p-4"
           style={{
               width: "100%", maxWidth: "450px",
               background: "rgba(255, 255, 255, 0.1)",
               backdropFilter: "blur(16px)", borderRadius: "20px",
               border: "1px solid rgba(255, 255, 255, 0.2)"
           }}>
        
        <div className="text-center text-white mb-4">
            <div className="mb-3">
                {view === "estudiante" ? <FaUniversity size={50} className="text-info" /> : <FaUserShield size={50} className="text-warning" />}
            </div>
            <h2 className="fw-bold">UTM Comedor</h2>
            <p className="text-white-50">Acceso {view === 'estudiante' ? 'Estudiantes' : 'Administrativo'}</p>
        </div>

        <div className="d-flex justify-content-center mb-4 bg-dark bg-opacity-50 rounded-pill p-1">
            <button className={`btn rounded-pill w-50 fw-bold ${view === 'estudiante' ? 'btn-primary shadow' : 'text-white'}`}
                    onClick={() => { setView('estudiante'); setError(null); }}>Estudiante</button>
            <button className={`btn rounded-pill w-50 fw-bold ${view === 'admin' ? 'btn-warning text-dark shadow' : 'text-white'}`}
                    onClick={() => { setView('admin'); setError(null); }}>Admin</button>
        </div>

        {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            {view === "estudiante" ? (
                <>
                    <div className="input-group">
                        <span className="input-group-text bg-dark border-secondary text-secondary"><FaUser /></span>
                        <input type="email" className="form-control bg-dark border-secondary text-white shadow-none"
                               placeholder="Correo Institucional" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <span className="input-group-text bg-dark border-secondary text-secondary"><FaLock /></span>
                        <input type="password" className="form-control bg-dark border-secondary text-white shadow-none"
                               placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                </>
            ) : (
                <>
                    <div className="input-group">
                        <span className="input-group-text bg-dark border-secondary text-warning"><FaIdCard /></span>
                        <input type="text" className="form-control bg-dark border-secondary text-white shadow-none"
                               placeholder="ID de Administrador" value={adminId} onChange={(e) => setAdminId(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <span className="input-group-text bg-dark border-secondary text-warning"><FaUserShield /></span>
                        <input type="text" className="form-control bg-dark border-secondary text-white shadow-none"
                               placeholder="Usuario Admin" value={adminName} onChange={(e) => setAdminName(e.target.value)} required />
                    </div>
                </>
            )}

            <button type="submit" disabled={loading}
                    className={`btn btn-lg w-100 fw-bold mt-2 ${view === 'estudiante' ? 'btn-info text-white' : 'btn-warning text-dark'}`}>
                {loading ? "Cargando..." : <><FaSignInAlt className="me-2" /> Ingresar</>}
            </button>
        </form>
      </div>
    </div>
  );
}