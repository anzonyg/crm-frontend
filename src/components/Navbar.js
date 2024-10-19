import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import UserMenu from './UserMenu'; // Importa el componente UserMenu

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">CRM</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/leads">Leads</Nav.Link>
            <Nav.Link href="/eventosActividades">Eventos & Actividades</Nav.Link>
            <Nav.Link href="/cotizaciones">Cotizaciones</Nav.Link>
            <Nav.Link href="/contratos">Gestion de Contratos</Nav.Link>
            <Nav.Link href="/inventarios">Inventarios</Nav.Link>
            <Nav.Link href="/proyectos">Proyecto de Ventas</Nav.Link>
            <Nav.Link href="/followupContracts">Seguimiento Contratos</Nav.Link>
            <Nav.Link href="/campanas">Gestión de Campañas</Nav.Link>
            <Nav.Link href="/ticketsSoporte">Soporte al Cliente</Nav.Link>
            {/* <Nav.Link href="/tareas">Gestión de Tareas</Nav.Link>
            <Nav.Link href="/clientes">Clientes</Nav.Link>
            <Nav.Link href="/gestion-pedidos">Gestión de Pedidos</Nav.Link> */}
          </Nav>
          <Nav>
            <UserMenu /> {/* Menú de usuario */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
