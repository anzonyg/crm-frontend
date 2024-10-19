import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import Leads from './components/Leads';
import EventosActividades from './components/EventosActividades';
// Importa todos tus componentes

function App() {
  return (
    <Router>
      <NavigationBar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/leads" component={Leads} />
        <Route path="/eventosActividades" component={EventosActividades} />
        <Route path="/cotizaciones" component={Cotizaciones} />
        <Route path="/contratos" component={Contratos} />
        <Route path="/inventarios" component={Inventarios} />
        <Route path="/proyectos" component={Proyectos} />
        <Route path="/followupContracts" component={FollowupContracts} />
        <Route path="/campanas" component={Campanas} />
        <Route path="/ticketsSoporte" component={TicketsSoporte} />
        <Route path="/clientes" component={Clientes} />
        {/* Aquí va el "catch-all" que manejará rutas no encontradas */}
        <Route component={Home} /> {/* Redirige cualquier ruta no encontrada a Home */}
      </Switch>
    </Router>
  );
}

export default App;
