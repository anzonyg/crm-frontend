import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import Home from './pages/Home';
import Leads from './pages/Leads';
import EventosActividades from './pages/EventosActividades';
import Cotizaciones from './pages/Cotizaciones';
import GestionContratos from './pages/Contratos';
import FollowUpContracts from './pages/FollowUpContracts.js';
import Inventarios from './pages/Inventarios.js';
import Proyectos from './pages/Proyectos.js';
import Campanas from './pages/Campanas';
import TicketsSoporte from './pages/TicketsSoporte';
import Tareas from './pages/Tareas';
import Clientes from './pages/clientes';
import GestionPedidos from './pages/GestionPedidos';
import Login from './components/Login';
import Register from './components/Register'; // Importamos Register
import ForgotPassword from './components/ForgotPassword'; // Importamos ForgotPassword
import PrivateRoute from './components/PrivateRoute'; // Importamos PrivateRoute

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/eventosActividades" element={<EventosActividades />} />
        <Route path="/cotizaciones" element={<Cotizaciones />} />
        <Route path="/contratos" element={<GestionContratos />} />
        <Route path="/followupContracts" element={<FollowUpContracts />} />
        <Route path="/inventarios" element={<Inventarios />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/campanas" element={<Campanas />} />
        <Route path="/ticketsSoporte" element={<TicketsSoporte />} />
        {/* Ruta de login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta de registro */}
        <Route path="/register" element={<Register />} />

        {/* Ruta para restablecimiento de contraseña */}
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Añadido */}
        <Route path="/tareas" element={
          <>
            <NavigationBar />
            <Tareas />
          </>
        }
        />
        <Route
          path="/clientes"
          element={
            <>
              <NavigationBar />
              <Clientes />
            </>
          }
        />
        <Route
          path="/gestion-pedidos"
          element={
            <>
              <NavigationBar />
              <GestionPedidos />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
