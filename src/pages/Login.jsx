import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaUniversity, FaUserShield, FaIdCard, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
  
  // 'estudiante' coincide con el rol por defecto en tu Register
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

    // Ajustamos los endpoints para que sean consistentes
    // Normalmente el login es uno solo, pero si tu backend separa rutas:
    const endpoint = view === "estudiante" ? "/api/auth/login" : "/api/auth/admin-login";
    
    const bodyData = view === "estudiante" 
        ? { email, password } 
        : { adminId, adminName };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (res.ok) {
        // Guardar token y datos de usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirigir según el rol devuelto por el servidor
        if (data.user.rol === "admin" || data.user.rol === "admin_comedor") {
            navigate("/admin-dashboard");
        } else {
            navigate("/dashboard");
        }
      } else {
        // Mostrar el mensaje exacto que viene del servidor
        setError(data.error || data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error connection:", err);
      setError("No se pudo conectar con el servidor. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100"
         style={{ 
             background: "linear-gradient(135deg, #000428, #004e92)", 
             overflow: "hidden"
         }}>
      
      {/* TARJETA GLASSMORPHISM */}
      <div className="card border-0 shadow-lg p-4"
           style={{
               width: "100%",
               maxWidth: "450px",
               background: "rgba(255, 255, 255, 0.1)",
               backdropFilter: "blur(16px)",
               borderRadius: "20px",
               border: "1px solid rgba(255, 255, 255, 0.2)"
           }}>
        
        <div className="text-center text-white mb-4">
            <div className="mb-3">
                {view === "estudiante" ? (
                    <FaUniversity size={50} className="text-info" />
                ) : (
                    <FaUserShield size={50} className="text-warning" />
                )}
            </div>
            <h2 className="fw-bold">Bienvenido</h2>
            <p className="text-white-50 small">Sistema de Comedores UTM</p>
        </div>

        {/* SWITCH DE VISTA */}
        <div className="d-flex justify-content-center mb-4 bg-dark bg-opacity-50 rounded-pill p-1">
            <button 
                className={`btn rounded-pill w-50 fw-bold ${view === 'estudiante' ? 'btn-primary shadow' : 'text-white'}`}
                onClick={() => { setView('estudiante'); setError(null); }}
            >
                Estudiantes
            </button>
            <button 
                className={`btn rounded-pill w-50 fw-bold ${view === 'admin' ? 'btn-warning text-dark shadow' : 'text-white'}`}
                onClick={() => { setView('admin'); setError(null); }}
            >
                Administrador
            </button>
        </div>

        {error && (
            <div className="alert alert-danger py-2 small" role="alert">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            {view === "estudiante" ? (
                <>
                    <div className="input-group">
                        <span className="input-group-text bg-dark border-secondary text-secondary"><FaUser /></span>
                        <input 
                            type="email" 
                            className="form-control bg-dark border-secondary text-white"
                            placeholder="Correo Institucional"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <span className="input-group-text bg-dark border-secondary text-secondary"><FaLock /></span>
                        <input 
                            type="password" 
                            className="form-control bg-dark border-secondary text-white"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </>
            ) : (
                <>
                    <div className="input-group">
                        <span className="input-group-text bg-dark border-secondary text-warning"><FaIdCard /></span>
                        <input 
                            type="text" 
                            className="form-control bg-dark border-secondary text-white"
                            placeholder="ID de Administrador"
                            value={adminId}
                            onChange={(e) => setAdminId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <span className="input-group-text bg-dark border-secondary text-warning"><FaUserShield /></span>
                        <input 
                            type="text" 
                            className="form-control bg-dark border-secondary text-white"
                            placeholder="Nombre de Usuario"
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            required
                        />
                    </div>
                </>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className={`btn btn-lg w-100 fw-bold mt-2 ${view === 'estudiante' ? 'btn-info text-white' : 'btn-warning text-dark'}`}
            >
                <FaSignInAlt className="me-2" /> 
                {loading ? "Cargando..." : (view === 'estudiante' ? 'Iniciar Sesión' : 'Acceder')}
            </button>
        </form>

        {view === "estudiante" && (
            <div className="text-center mt-4">
                <span className="text-white-50 small">¿No tienes cuenta? </span>
                <button 
                    onClick={() => navigate('/register')} 
                    className="btn btn-link text-info text-decoration-none fw-bold p-0 small"
                >
                    Regístrate aquí
                </button>
            </div>
        )}
      </div>
    </div>
  );
}