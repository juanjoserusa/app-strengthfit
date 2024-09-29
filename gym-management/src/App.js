import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import GestionUsuarios from './components/GestionUsuarios';
import GestionEconomica from './components/GestionEconomica';
import Registrar from './components/Registrar';
import InscritosList from './components/InscritosList';
import InscritoDetail from './components/InscritoDetail';
import EditarInscrito from './components/EditarInscrito'; 
import UserDetail from './components/UserDetail'; 
import ControlDeGastos from './components/ControlDeGastos';
import ConsultarGastos from './components/ConsultarGastos';
import Navbar from './components/Navbar';
import { FileProvider } from './context/FileContext';
import { ControlDeGastosProvider } from './context/ControlDeGastosContext';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Entrenamientos from './components/entrenamientos';
import ConcursoRetos from './components/ConcursoRetos';

function App() {
  return (
    <Router>
      <FileProvider>
        <ControlDeGastosProvider>
          <div className="d-flex">
            <Navbar />
            <div className="flex-grow-1 p-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gestion-usuarios" element={<GestionUsuarios />} />
                <Route path="/gestion-economica" element={<GestionEconomica />} />
                <Route path="/registrar" element={<Registrar />} />
                <Route path="/inscritos" element={<InscritosList />} />
                <Route path="/inscritos/:id" element={<InscritoDetail />} />
                <Route path="/inscritos/:id/editar" element={<EditarInscrito />} />
                <Route path="/inscritos/:id/detalles" element={<UserDetail />} />
                <Route path="/control-de-gastos" element={<ControlDeGastos />} />
                <Route path="/consultar-gastos" element={<ConsultarGastos />} />
                <Route path="/entrenamientos" element={<Entrenamientos />} />
                <Route path="/retos" element={<ConcursoRetos />} />
              </Routes>
            </div>
          </div>
        </ControlDeGastosProvider>
      </FileProvider>
    </Router>
  );
}

export default App;
