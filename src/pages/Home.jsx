import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Limpia token y user de una vez
    setUser(null);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 text-white"
      style={{
        background: "linear-gradient(135deg, #004e92, #000428)",
      }}
    >
      <div className="text-center p-5 animate__animated animate__fadeIn">
        <h1 className="fw-bold display-4 mb-3">
          <i className="bi bi-mortarboard-fill text-warning me-3"></i>
          Sistema de Comida Universitaria
        </h1>

        <h3 className="fw-light mb-4">Universidad Técnica de Manabí</h3>

        <p className="lead mb-5 opacity-75 mx-auto" style={{ maxWidth: "700px" }}>
          Consulta el menú del día, reserva tu comida y descubre el valor nutricional,
          todo desde una plataforma rápida y moderna.
        </p>

        <div className="d-flex justify-content-center gap-3">
          {!user ? (
            <>
              <Link 
                to="/login" 
                className="btn btn-warning btn-lg px-4 fw-semibold rounded-pill shadow"
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Iniciar sesión
              </Link>

              <Link 
                to="/register" 
                className="btn btn-outline-light btn-lg px-4 fw-semibold rounded-pill"
              >
                <i className="bi bi-person-plus me-2"></i>
                Crear cuenta
              </Link>
            </>
          ) : (
            <>
              {/* Si ya está logueado, le permitimos ir a su panel según su rol */}
              <button 
                onClick={() => navigate(user.rol === 'admin_comedor' ? "/admin-dashboard" : "/dashboard")}
                className="btn btn-info btn-lg px-4 fw-semibold rounded-pill text-white shadow"
              >
                <i className="bi bi-speedometer2 me-2"></i>
                Ir a mi Panel
              </button>
              
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger btn-lg px-4 fw-semibold rounded-pill"
              >
                <i className="bi bi-power me-2"></i>
                Cerrar sesión
              </button>
            </>
          )}
        </div>

        <footer className="mt-5 opacity-50">
          <small>© 2026 Universidad Técnica de Manabí – Sistema Comedor Inteligente</small>
        </footer>
      </div>
    </div>
  );
}