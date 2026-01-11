import { useState, useEffect } from "react";

export default function Register() {
  const [facultades, setFacultades] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    facultad_id: "",
  });
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/facultades`)
      .then((res) => res.json())
      .then((data) => setFacultades(data))
      .catch((err) => console.error("Error backend facultades:", err));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    if (!form.nombre || !form.email || !form.password || !form.facultad_id) {
      return alert("Completa todos los campos");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          password: form.password,
          facultad_id: form.facultad_id,
          rol: "estudiante",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Cuenta creada con éxito");
        window.location.href = "/login";
      } else {
        alert(data.error || "Error al crear cuenta");
      }
    } catch (err) {
      console.error(err);
      alert("Error en la petición");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister();
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div className="card glass-card shadow-lg p-5" style={{ width: "480px" }}>
        <h3 className="text-center mb-4 fw-bold text-white">
          <i className="bi bi-person-plus-fill me-2"></i> Crear cuenta UTM
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-white">Nombre completo</label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="nombre"
              placeholder="Juan Pérez"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-white">Correo institucional</label>
            <input
              type="email"
              className="form-control form-control-lg"
              name="email"
              placeholder="ejemplo@utm.edu.ec"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-white">Contraseña</label>
            <input
              type="password"
              className="form-control form-control-lg"
              name="password"
              placeholder="•••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-white">Facultad</label>
            <select
              className="form-select form-select-lg"
              name="facultad_id"
              value={form.facultad_id}
              onChange={handleChange}
            >
              <option value="">Seleccione una facultad</option>
              {facultades.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nombre}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-success w-100 btn-lg d-flex justify-content-center align-items-center gap-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : <><i className="bi bi-check2-circle"></i> Crear cuenta</>}
          </button>
        </form>

        <p className="text-center mt-4 text-white">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-info fw-semibold">
            Iniciar sesión
          </a>
        </p>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border-radius: 1rem;
        }
        .btn-success {
          transition: all 0.3s ease;
        }
        .btn-success:hover:not(:disabled) {
          transform: translateY(-2px);
          background-color: #28a745cc;
        }
        .form-control:focus,
        .form-select:focus {
          border-color: #28a745;
          box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
        }
      `}</style>
    </div>
  );
}
