import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Badge, Pagination } from 'react-bootstrap';
import { getContratos, createContrato, updateContrato, getContratoById } from '../services/contratoService.js';
import { FaEdit, FaPlus, FaEye } from 'react-icons/fa';
import FollowUpContractsModal from '../components/FollowUpContractsModal';

const Contratos = () => {
  const [contratos, setContratos] = useState([]);
  const [filteredContratos, setFilteredContratos] = useState([]);
  const [selectedContrato, setSelectedContrato] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [followUpData, setFollowUpData] = useState([]); // Estado para los datos de seguimiento

  const fetchContratos = async () => {
    try {
      const response = await getContratos();
      const filtered = response.data.filter(
        contrato => contrato.estadoContrato === 'Cerrado' || contrato.estadoContrato === 'Contactado'
      );
      setContratos(filtered);
      setFilteredContratos(filtered);
    } catch (error) {
      console.error("Error al obtener los contratos:", error);
    }
  };

  useEffect(() => {
    fetchContratos();
  }, []);

  const handleAddClick = () => {
    setSelectedContrato({});
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleEditClick = async (id) => {
    const response = await getContratoById(id);
    setSelectedContrato(response.data);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleViewClick = async (id) => {
    const response = await getContratoById(id);
    setSelectedContrato(response.data);
    setIsViewMode(true);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setSelectedContrato({ ...selectedContrato, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (selectedContrato._id) {
      await updateContrato(selectedContrato._id, selectedContrato);
    } else {
      await createContrato(selectedContrato);
    }

    // Agregar el nuevo seguimiento a followUpData
    setFollowUpData((prevData) => [...prevData, selectedContrato]);
    setShowModal(false);
    fetchContratos();
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = contratos.filter((contrato) =>
      (contrato.nombre ? contrato.nombre.toLowerCase() : '').includes(searchValue) ||
      (contrato.empresa ? contrato.empresa.toLowerCase() : '').includes(searchValue) ||
      (contrato.correoElectronico ? contrato.correoElectronico.toLowerCase() : '').includes(searchValue) ||
      (contrato.telefono ? contrato.telefono.toLowerCase() : '').includes(searchValue) ||
      (contrato.estadoContrato ? contrato.estadoContrato.toLowerCase() : '').includes(searchValue)
    );
    setFilteredContratos(filtered);
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

  const renderBadge = (estadoContrato) => {
    switch (estadoContrato) {
      case 'Nuevo':
        return <Badge bg="primary">Nuevo</Badge>;
      case 'En Proceso':
        return <Badge bg="warning">En Proceso</Badge>;
      case 'Contactado':
        return <Badge bg="success">Contactado</Badge>;
      case 'Cerrado':
        return <Badge bg="info">Cerrado</Badge>;
      case 'Renovacion':
        return <Badge bg="danger">Renovacion</Badge>;
      default:
        return <Badge bg="secondary">Desconocido</Badge>;
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContratos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredContratos.length / itemsPerPage);

  return (
    <Container>
      <h1 className="mt-4">Seguimiento de Contratos</h1>
      <p className="text-muted">
        Revision de contratos reportados como "Contactados" y "Cancelados".
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
            <FaPlus /> Generar Seguimiento
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
            <th>Fecha de Inicio de Contrato</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((contrato, index) => (
            <tr key={contrato._id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{contrato.nombre || 'Sin nombre'}</td>
              <td>{contrato.empresa || 'Sin empresa'}</td>
              <td>{contrato.correoElectronico || 'Sin correo'}</td>
              <td>{contrato.telefono || 'Sin teléfono'}</td>
              <td>{renderBadge(contrato.estadoContrato)}</td>
              <td>{formatDate(contrato.fechaSeguimiento)}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center">
                  <Button variant="info" className="me-2" onClick={() => handleEditClick(contrato._id)}>
                    <FaEdit />
                  </Button>
                  <Button variant="secondary" className="me-2" onClick={() => handleViewClick(contrato._id)}>
                    <FaEye />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Título y Segunda tabla de seguimiento */}
      {followUpData.length > 0 && (
        <>
          <h2 className="mt-4">Seguimiento de Contratos</h2>
          <Table striped bordered hover className="mt-2">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Empresa</th>
                <th>Correo Electrónico</th>
                <th>Teléfono</th>
                <th>Fecha de Contacto Inicial</th>
                <th>Fecha de Seguimiento</th>
                <th>Razón</th>
                <th>Soluciones</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {followUpData.map((followUp, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{followUp.nombre || 'Sin nombre'}</td>
                  <td>{followUp.empresa || 'Sin empresa'}</td>
                  <td>{followUp.correoElectronico || 'Sin correo'}</td>
                  <td>{followUp.telefono || 'Sin teléfono'}</td>
                  <td>{followUp.fechaContactoInicial ? formatDate(followUp.fechaContactoInicial) : 'No asignada'}</td>
                  <td>{followUp.fechaSeguimiento ? formatDate(followUp.fechaSeguimiento) : 'No asignada'}</td>
                  <td>{followUp.razon || 'Sin razón'}</td>
                  <td>{followUp.soluciones || 'Sin soluciones'}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center">
                      <Button variant="info" className="me-2" onClick={() => handleEditClick(followUp._id)}>
                        <FaEdit />
                      </Button>
                      <Button variant="secondary" className="me-2" onClick={() => handleViewClick(followUp._id)}>
                        <FaEye />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <Pagination>
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      </Pagination>

      <FollowUpContractsModal
        show={showModal}
        handleClose={handleClose}
        contrato={selectedContrato}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isViewMode={isViewMode}
      />
    </Container>
  );
};

export default Contratos;