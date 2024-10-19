import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Badge, Pagination } from 'react-bootstrap';
import { getLeads, createLead, updateLead, getLeadById, deleteLead } from '../services/leadService'; // Importa deleteLead
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import LeadModal from '../components/LeadModal';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchLeads = async () => {
    try {
      const response = await getLeads();
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (error) {
      console.error("Error al obtener los leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAddClick = () => {
    setSelectedLead({});
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleEditClick = async (id) => {
    const response = await getLeadById(id);
    setSelectedLead(response.data);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleViewClick = async (id) => {
    const response = await getLeadById(id);
    setSelectedLead(response.data);
    setIsViewMode(true);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setSelectedLead({ ...selectedLead, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (selectedLead._id) {
      await updateLead(selectedLead._id, selectedLead);
    } else {
      await createLead(selectedLead);
    }
    setShowModal(false);
    fetchLeads();
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este lead?")) {
      try {
        await deleteLead(id);
        fetchLeads(); // Refrescar la lista de leads después de eliminar
      } catch (error) {
        console.error("Error al eliminar el lead:", error);
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = leads.filter((lead) =>
      (lead.nombre ? lead.nombre.toLowerCase() : '').includes(searchValue) ||
      (lead.empresa ? lead.empresa.toLowerCase() : '').includes(searchValue) ||
      (lead.correoElectronico ? lead.correoElectronico.toLowerCase() : '').includes(searchValue) ||
      (lead.telefono ? lead.telefono.toLowerCase() : '').includes(searchValue) ||
      (lead.estadoLead ? lead.estadoLead.toLowerCase() : '').includes(searchValue)
    );

    setFilteredLeads(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No asignada';
    const date = new Date(dateString);
    return isNaN(date) ? 'No asignada' : date.toISOString().split('T')[0];
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);  // Reset to the first page when items per page changes
  };

  const renderBadge = (estadoLead) => {
    switch (estadoLead) {
      case 'Nuevo':
        return <Badge bg="primary">Nuevo</Badge>;
      case 'En Proceso':
        return <Badge bg="warning">En Proceso</Badge>;
      case 'Contactado':
        return <Badge bg="success">Contactado</Badge>;
      case 'Calificado':
        return <Badge bg="info">Calificado</Badge>;
      case 'Descartado':
        return <Badge bg="danger">Descartado</Badge>;
      default:
        return <Badge bg="secondary">Desconocido</Badge>;
    }
  };

  // Logic for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  return (
    <Container>
      <h1 className="mt-4">Leads</h1>
      <p className="text-muted">
        Los "Leads" son posibles clientes o contactos que han mostrado interés en tus productos o servicios.
        Administrar los leads de manera efectiva te ayuda a convertir estos contactos en clientes y a seguir su progreso
        a lo largo del proceso de ventas.
      </p>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre, empresa, correo, teléfono o estado"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
        <Col className="d-flex justify-content-end">
          <Button variant="primary" onClick={handleAddClick}>
            <FaPlus /> Añadir Lead
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Empresa</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Fecha de Seguimiento</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((lead, index) => (
            <tr key={lead._id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{lead.nombre || 'Sin nombre'}</td>
              <td>{lead.empresa || 'Sin empresa'}</td>
              <td>{lead.correoElectronico || 'Sin correo'}</td>
              <td>{lead.telefono || 'Sin teléfono'}</td>
              <td>{renderBadge(lead.estadoLead)}</td>
              <td>{formatDate(lead.fechaSeguimiento)}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center">
                  <Button variant="info" className="me-2" onClick={() => handleEditClick(lead._id)}>
                    <FaEdit />
                  </Button>
                  <Button variant="secondary" className="me-2" onClick={() => handleViewClick(lead._id)}>
                    <FaEye />
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteClick(lead._id)}>
                    <FaTrash />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Paginación */}
      <Row className="mt-4 align-items-center">
        <Col className="d-flex justify-content-center">
          <Pagination>
            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        </Col>
        <Col md={3} className="d-flex justify-content-end">
          <Form.Select value={itemsPerPage} onChange={handleItemsPerPageChange}>
            <option value="10">10 por página</option>
            <option value="20">20 por página</option>
            <option value="30">30 por página</option>
          </Form.Select>
        </Col>
      </Row>

      <LeadModal
        show={showModal}
        handleClose={handleClose}
        lead={selectedLead}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isViewMode={isViewMode}
      />
    </Container>
  );
};

export default Leads;
