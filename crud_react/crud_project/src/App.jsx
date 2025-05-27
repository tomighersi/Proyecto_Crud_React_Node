import React from 'react';
import Productos from './components/Productos';
import Usuarios from './components/Usuarios';

function App() {
  return (
    <div className="App">
      <h1 className="text-center mt-4">Gestión de Productos y Usuarios</h1>
      <Productos />
      <Usuarios />
    </div>
  );
}

export default App;
