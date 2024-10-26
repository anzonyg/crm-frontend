import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaFileInvoice, FaBoxes, FaProjectDiagram, FaHandshake, FaChartLine} from 'react-icons/fa'; // Import icons

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">CRM</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Home */}
            <Nav.Link as={Link} to="/"><FaHome /> Home</Nav.Link>

            {/* Gestión de Clientes */}
            <NavDropdown title={<span><FaUsers /> Gestión de Clientes</span>} id="clientes-dropdown">
              <NavDropdown.Item as={Link} to="/leads">Leads</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/clientes">Clientes</NavDropdown.Item>
            </NavDropdown>

            {/* Gestión de Ventas */}
            <NavDropdown title={<span><FaFileInvoice /> Gestión de Ventas</span>} id="ventas-dropdown">
              <NavDropdown.Item as={Link} to="/cotizaciones">Cotizaciones</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reportCotizacion">Reporteria Cotizaciones</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/contratos">Gestión de Contratos</NavDropdown.Item>
            </NavDropdown>

            {/* Proyectos y Actividades */}
            <NavDropdown title={<span><FaProjectDiagram /> Proyectos & Actividades</span>} id="proyectos-dropdown">
              <NavDropdown.Item as={Link} to="/eventosActividades">Eventos & Actividades</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/proyectos">Proyecto de Ventas</NavDropdown.Item>
            </NavDropdown>

            {/* Seguimiento */}
            <NavDropdown title={<span><FaChartLine /> Seguimiento</span>} id="seguimiento-dropdown">
              <NavDropdown.Item as={Link} to="/followupContracts">Seguimiento Contratos</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/campanas">Gestión de Campañas</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reporte-campanas">Reporte de Campañas</NavDropdown.Item>
            </NavDropdown>

            {/* Soporte al Cliente */}
            <NavDropdown title={<span><FaHandshake /> Soporte</span>} id="soporte-dropdown">
              <NavDropdown.Item as={Link} to="/ticketsSoporte">Soporte al Cliente</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/reporte-tickets">Reporte de Tickets</NavDropdown.Item>
            </NavDropdown>
            
            {/* Inventarios */}
            <Nav.Link as={Link} to="/inventarios"><FaBoxes /> Inventarios</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
