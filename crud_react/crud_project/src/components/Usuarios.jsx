import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import React, { useEffect, useState } from 'react';
import { getUsers, createUser, deleteUser, updateUser } from '../services/users.service';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ name: '', email: '', address: '', age: '' });
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const iniciarEdicion = (usuario) => {
    setUsuarioEditando({ ...usuario });  // corregido aquí: usuarioEditando, no productoEditando
  };

  const handleUpdate = async () => {
    try {
      const { id, name, email, address, age } = usuarioEditando;
      await updateUser(id, { name, email, address, age });
      setUsuarioEditando(null);
      cargarUsuarios();
    } catch (error) {
      console.error("Error al editar usuario:", error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const response = await getUsers();
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      if (!nuevoUsuario.name || !nuevoUsuario.email || !nuevoUsuario.address || !nuevoUsuario.age) {
        alert('Complete todos los campos');
        return;
      }
      await createUser({
        name: nuevoUsuario.name,
        email: nuevoUsuario.email,
        address: nuevoUsuario.address,
        age: parseInt(nuevoUsuario.age),
      });
      setNuevoUsuario({ name: '', email: '', address: '', age: '' });
      cargarUsuarios();
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      cargarUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const exportarUsuariosPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Listado de Usuarios", 105, 15, { align: "center" });

    autoTable(doc, {
      startY: 40,
      head: [["Nombre", "Email", "Dirección", "Edad"]],
      body: usuarios.map((user) => [
        user.name,
        user.email,
        user.address,
        user.age.toString(),
      ]),
    });
    doc.save("usuarios.pdf");
  }
  

  return (
    <div className="container mt-4">
      <h2>Usuarios</h2>
      <div className="mb-3">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={nuevoUsuario.name}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={nuevoUsuario.email}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={nuevoUsuario.address}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="number"
          name="age"
          placeholder="Edad"
          value={nuevoUsuario.age}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <button onClick={handleCreate} className="btn btn-primary">Agregar</button>
      </div>

      {usuarioEditando && (
        <div className="mb-3 mt-4">
          <h5>Editar Usuario</h5>
          <input
            type="text"
            name="name"
            value={usuarioEditando.name}
            onChange={(e) => setUsuarioEditando({ ...usuarioEditando, name: e.target.value })}
            className="form-control mb-2"
          />
          <input
            type="email"
            name="email"
            value={usuarioEditando.email}
            onChange={(e) => setUsuarioEditando({ ...usuarioEditando, email: e.target.value })}
            className="form-control mb-2"
          />
          <input
            type="text"
            name="address"
            value={usuarioEditando.address}
            onChange={(e) => setUsuarioEditando({ ...usuarioEditando, address: e.target.value })}
            className="form-control mb-2"
          />
          <input
            type="number"
            name="age"
            value={usuarioEditando.age}
            onChange={(e) => setUsuarioEditando({ ...usuarioEditando, age: e.target.value })}
            className="form-control mb-2"
          />
          <button onClick={handleUpdate} className="btn btn-success me-2">Guardar</button>
          <button onClick={() => setUsuarioEditando(null)} className="btn btn-secondary">Cancelar</button>
        </div>
      )}

      <button onClick={exportarUsuariosPDF} className="btn btn-success mb-3">
      Exportar usuarios a PDF
      </button>

      <ul className="list-group">
        {usuarios.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {user.name} - {user.email} - {user.address} - Edad: {user.age}
            <div>
              <button
                onClick={() => handleDelete(user.id)}
                className="btn btn-danger btn-sm me-2"
              >
                Eliminar
              </button>
              <button
                onClick={() => iniciarEdicion(user)}
                className="btn btn-warning btn-sm"
              >
                Editar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
