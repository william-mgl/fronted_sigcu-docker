import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUtensils, FaMoneyBillWave, FaClock, FaCheckCircle, FaExclamationTriangle, FaWallet } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function Comedor() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [infoComedor, setInfoComedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!id) return;

    const authHeaders = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    // A) Cargar Información del Comedor
    fetch(`${API_URL}/api/comedores/${id}`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : null)
      .then(data => setInfoComedor(data))
      .catch(err => console.error("Error info comedor:", err));

    // B) Cargar Menú del día
    fetch(`${API_URL}/api/menu-dia/comedor/${id}`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setMenu(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando menú:", err);
        setMenu([]);
        setLoading(false);
      });
  }, [id, token]);

  const handleCompra = async (itemMenu) => {
    if (!user) return navigate("/login");

    // Validación previa de saldo en el cliente
    if (user.saldo < itemMenu.precio) {
        setMensaje({ type: 'error', text: "❌ Saldo insuficiente" });
        setTimeout(() => setMensaje(null), 3000);
        return;
    }

    if (!window.confirm(`¿Confirmar reserva de ${itemMenu.nombre} por $${itemMenu.precio}?`)) return;

    try {
      const res = await fetch(`${API_URL}/api/reservas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          usuario_id: user.id,
          menu_id: itemMenu.id // Este es el ID de la tabla menu_dia
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje({ type: 'success', text: `✅ ¡Reserva exitosa! Retira tu plato.` });
        
        // Actualizar stock localmente para feedback inmediato
        setMenu(prev => prev.map(item => 
            item.id === itemMenu.id 
            ? { ...item, cantidad_disponible: item.cantidad_disponible - 1 } 
            : item
        ));

        setTimeout(() => setMensaje(null), 3000);
      } else {
        setMensaje({ type: 'error', text: `❌ ${data.error || 'Error al procesar'}` });
        setTimeout(() => setMensaje(null), 4000);
      }
    } catch (err) {
      setMensaje({ type: 'error', text: "❌ Error de conexión con el servidor" });
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 text-white"
         style={{ background: "linear-gradient(135deg, #000428, #004e92)", overflowY: "auto", position: "relative" }}>

      {/* HEADER AMBIENTAL */}
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "600px", height: "600px", background: "rgba(255, 165, 0, 0.05)", borderRadius: "50%", filter: "blur(120px)", zIndex: 0 }}></div>

      <div className="container pt-4 pb-2 position-relative" style={{ zIndex: 10 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-outline-light rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm" onClick={() => navigate(-1)}>
                <FaArrowLeft /> Regresar
            </button>
            <div className="badge bg-dark bg-opacity-50 p-2 px-3 rounded-pill border border-info border-opacity-25 d-flex align-items-center gap-2">
                <FaWallet className="text-info"/> Mi Saldo: <span className="text-info">${Number(user?.saldo || 0).toFixed(2)}</span>
            </div>
        </div>

        {infoComedor && (
            <div className="animate__animated animate__fadeInLeft">
                <h2 className="fw-bold display-6 m-0">{infoComedor.nombre}</h2>
                <p className="text-white-50 d-flex align-items-center gap-2">
                    <FaUtensils className="text-warning"/> Menú disponible para hoy
                </p>
            </div>
        )}
      </div>

      {mensaje && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-4 p-3 rounded-4 shadow-lg animate__animated animate__fadeInDown"
             style={{ zIndex: 1000, background: mensaje.type === 'success' ? '#198754' : '#dc3545', backdropFilter: "blur(10px)", minWidth: "320px", textAlign: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
             <h6 className="m-0 fw-bold text-white">{mensaje.text}</h6>
        </div>
      )}

      <div className="container pb-5 mt-4 position-relative" style={{ zIndex: 1 }}>
        {loading ? (
            <div className="text-center mt-5 opacity-50">
                <div className="spinner-border text-warning mb-3" role="status"></div>
                <p>Cargando el menú...</p>
            </div>
        ) : menu.length === 0 ? (
            <div className="text-center p-5 rounded-4 bg-white bg-opacity-10">
                <FaExclamationTriangle size={50} className="text-warning mb-3" />
                <h3>No hay platos disponibles</h3>
                <p className="text-white-50">El comedor aún no ha publicado el menú de hoy.</p>
            </div>
        ) : (
            <div className="row g-4">
                {menu.map(plato => (
                    <div key={plato.id} className="col-md-6 col-lg-4">
                        <div className="card h-100 border-0 shadow-lg overflow-hidden"
                             style={{ background: "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(16px)", borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                            
                            <div className="card-img-top d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ height: "160px" }}>
                                <FaUtensils size={50} className="text-white-50" />
                            </div>

                            <div className="card-body d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="fw-bold text-white m-0">{plato.nombre}</h5>
                                    <span className="badge bg-warning text-dark rounded-pill">${plato.precio}</span>
                                </div>
                                
                                <p className="text-white-50 small flex-grow-1 mb-3">
                                    {plato.descripcion || "Plato balanceado del día."}
                                </p>

                                <div className="mt-auto pt-3 border-top border-white border-opacity-10 d-flex justify-content-between align-items-center">
                                    <small className={`fw-bold ${plato.cantidad_disponible > 0 ? 'text-info' : 'text-danger'}`}>
                                        <FaClock className="me-1"/> Cupos: {plato.cantidad_disponible}
                                    </small>
                                    
                                    <button 
                                        onClick={() => handleCompra(plato)}
                                        disabled={plato.cantidad_disponible <= 0}
                                        className={`btn btn-sm px-4 rounded-pill fw-bold ${plato.cantidad_disponible > 0 ? 'btn-success' : 'btn-secondary'}`}
                                    >
                                        {plato.cantidad_disponible > 0 ? "RESERVAR" : "AGOTADO"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}