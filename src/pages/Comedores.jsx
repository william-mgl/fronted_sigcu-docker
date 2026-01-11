import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUtensils, FaArrowLeft, FaMapMarkerAlt, FaClock, FaStoreSlash, FaDoorOpen } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function Comedores() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [comedores, setComedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");

    // Agregamos /api/ a la ruta para que coincida con el backend
    fetch(`${API_URL}/api/comedores/facultad/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
          if (!res.ok) throw new Error("Error al cargar comedores");
          return res.json();
      })
      .then(data => {
        // Nos aseguramos de que sea un array para evitar errores de .map()
        setComedores(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setComedores([]); 
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="d-flex flex-column min-vh-100 text-white"
         style={{ 
             background: "linear-gradient(135deg, #000428, #004e92)", 
             overflowY: "auto",
             position: "relative"
         }}>

      {/* FONDO AMBIENTAL */}
      <div style={{ position: "absolute", top: "10%", left: "-10%", width: "400px", height: "400px", background: "rgba(0, 255, 127, 0.05)", borderRadius: "50%", filter: "blur(100px)", zIndex: 0 }}></div>

      {/* HEADER */}
      <div className="container pt-5 pb-3" style={{ zIndex: 1 }}>
        <button 
            className="btn btn-outline-light rounded-pill px-4 d-flex align-items-center gap-2 mb-4"
            onClick={() => navigate('/dashboard')}
            style={{ backdropFilter: "blur(5px)", transition: "0.3s" }}
        >
            <FaArrowLeft /> Volver al Dashboard
        </button>
        
        <h2 className="fw-bold d-flex align-items-center gap-3">
            <FaUtensils className="text-warning" /> 
            Comedores de la Facultad
        </h2>
        <p className="text-white-50">Selecciona un local para ver su menú de hoy.</p>
      </div>

      {/* LISTA DE COMEDORES */}
      <div className="container d-flex flex-wrap gap-4 pb-5 justify-content-center" style={{ zIndex: 1 }}>
        
        {loading ? (
            <div className="text-center mt-5 opacity-50">
                <div className="spinner-border text-info mb-3" role="status"></div>
                <p>Buscando lugares para comer...</p>
            </div>
        ) : comedores.length === 0 ? (
            <div className="text-center mt-5 p-5 rounded-4" 
                 style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <FaStoreSlash size={60} className="text-secondary mb-3" />
                <h4>No hay comedores registrados aquí</h4>
                <p className="text-white-50">Intenta buscar en otra facultad o vuelve más tarde.</p>
            </div>
        ) : (
            comedores.map(c => (
                <div 
                    key={c.id} 
                    className="card border-0 shadow-lg text-white"
                    style={{ 
                        width: "350px",
                        background: "rgba(255, 255, 255, 0.1)", 
                        backdropFilter: "blur(16px)",
                        borderRadius: "20px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        transition: "all 0.3s ease",
                        cursor: c.abierto ? "pointer" : "not-allowed"
                    }}
                    onMouseEnter={(e) => c.abierto && (e.currentTarget.style.transform = "translateY(-10px)")}
                    onMouseLeave={(e) => c.abierto && (e.currentTarget.style.transform = "translateY(0)")}
                    onClick={() => c.abierto && navigate(`/comedor/${c.id}`)}
                >
                    <div className="card-body p-4 d-flex flex-column align-items-center text-center">
                        <div className={`rounded-circle p-3 mb-3 shadow ${c.abierto ? 'bg-success' : 'bg-secondary'}`}>
                            {c.abierto ? <FaDoorOpen size={30} /> : <FaStoreSlash size={30} />}
                        </div>
                        <h4 className="fw-bold mb-1">{c.nombre}</h4>
                        <div className="text-white-50 small mb-3 d-flex align-items-center gap-1">
                            <FaMapMarkerAlt /> {c.ubicacion || "Ubicación no disponible"}
                        </div>
                        <p className="small opacity-75 mb-4" style={{ minHeight: "40px" }}>
                            {c.descripcion || "Disfruta de la mejor alimentación universitaria."}
                        </p>
                        <div className="mt-auto w-100">
                            {c.abierto ? (
                                <button className="btn btn-info w-100 rounded-pill fw-bold text-white shadow-sm border-0">
                                    <FaUtensils className="me-2" /> VER MENÚ
                                </button>
                            ) : (
                                <button className="btn btn-secondary w-100 rounded-pill fw-bold disabled" disabled>
                                    <FaClock className="me-2" /> CERRADO
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>

      <footer className="mt-auto py-3 text-center text-white-50 small">
        © 2026 Universidad Técnica de Manabí - Comedor Inteligente
      </footer>
    </div>
  );
}