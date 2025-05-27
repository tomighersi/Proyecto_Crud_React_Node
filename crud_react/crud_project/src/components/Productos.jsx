import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, deleteProduct, updateProduct } from '../services/products.service.js';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ name: '', price: '', stock: '' });
  const [productoEditando, setProductoEditando] = useState(null);


  useEffect(() => {
    cargarProductos();
  }, []);

  const iniciarEdicion = (producto) => {
    setProductoEditando({ ...producto });
  };

  const handleUpdate = async () => {
    try {
      const { id, name, price, stock } = productoEditando;
      await updateProduct(id, { name, price, stock });
      setProductoEditando(null);
      cargarProductos();
    } catch (error) {
      console.error("Error al editar producto:", error);
    }
  };
  

  const cargarProductos = async () => {
    try {
      const response = await getProducts();
      setProductos(response.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      if (!nuevoProducto.name || !nuevoProducto.price || !nuevoProducto.stock) {
        alert('Complete todos los campos');
        return;
      }
      await createProduct({
        name: nuevoProducto.name,
        price: parseFloat(nuevoProducto.price),
        stock: parseInt(nuevoProducto.stock),
      });
      setNuevoProducto({ name: '', price: '', stock: '' });
      cargarProductos();
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      cargarProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const exportarProductosPDF = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(18);
    doc.text("Listado de Productos", 105, 15, { align: "center" });
  
    autoTable(doc, {
        startY: 40,
        head: [["Nombre", "Precio", "Stock"]],
        body: productos.map((producto) => [
            producto.name,
            producto.price.toString(),
            producto.stock.toString(),
        ]),
    });
    doc.save("productos.pdf");
  }

  return (
    <div className="container mt-4">
      <h2>Productos</h2>
      <div className="mb-3">
        <input type="text" name="name" placeholder="Nombre" value={nuevoProducto.name} onChange={handleChange} className="form-control mb-2" />
        <input type="number" name="price" placeholder="Precio" value={nuevoProducto.price} onChange={handleChange} className="form-control mb-2" />
        <input type="number" name="stock" placeholder="Stock" value={nuevoProducto.stock} onChange={handleChange} className="form-control mb-2" />
        <button onClick={handleCreate} className="btn btn-primary">Agregar</button>
      </div>
    {productoEditando && (
    <div className="mb-3 mt-4">
        <h5>Editar Producto</h5>
        <input type="text" name="name" value={productoEditando.name} onChange={(e) => setProductoEditando({...productoEditando, name: e.target.value})} className="form-control mb-2" />
        <input type="number" name="price" value={productoEditando.price} onChange={(e) => setProductoEditando({...productoEditando, price: e.target.value})} className="form-control mb-2" />
        <input type="number" name="stock" value={productoEditando.stock} onChange={(e) => setProductoEditando({...productoEditando, stock: e.target.value})} className="form-control mb-2" />
        <button onClick={handleUpdate} className="btn btn-success me-2">Guardar</button>
        <button onClick={() => setProductoEditando(null)} className="btn btn-secondary">Cancelar</button>
    </div>
    )}
      <button onClick={exportarProductosPDF} className="btn btn-success mb-3">
      Exportar usuarios a PDF
      </button>

      <ul className="list-group">
        {productos.map((prod) => (
          <li key={prod.id} className="list-group-item d-flex justify-content-between align-items-center">
            {prod.name} - ${prod.price} - Stock: {prod.stock}
            <button onClick={() => handleDelete(prod.id)} className="btn btn-danger btn-sm">Eliminar</button>
            <button onClick={() => iniciarEdicion(prod)} className="btn btn-warning btn-sm me-2">Editar</button>

          </li>
        ))}
      </ul>
    </div>
  );
}

  