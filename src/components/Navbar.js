import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import UserMenu from './UserMenu'; // Importa el componente UserMenu
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">CRM</Navbar.Brand> {/* Cambié href por as={Link} */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/leads">Leads</Nav.Link>
            <Nav.Link as={Link} to="/eventosActividades">Eventos & Actividades</Nav.Link>
            <Nav.Link as={Link} to="/cotizaciones">Cotizaciones</Nav.Link>
            <Nav.Link as={Link} to="/contratos">Gestión de Contratos</Nav.Link>
            <Nav.Link as={Link} to="/inventarios">Inventarios</Nav.Link>
            <Nav.Link as={Link} to="/proyectos">Proyecto de Ventas</Nav.Link>
            <Nav.Link as={Link} to="/followupContracts">Seguimiento Contratos</Nav.Link>
            <Nav.Link as={Link} to="/campanas">Gestión de Campañas</Nav.Link>
            <Nav.Link as={Link} to="/ticketsSoporte">Soporte al Cliente</Nav.Link>
            <Nav.Link as={Link} to="/clientes">Clientes</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;