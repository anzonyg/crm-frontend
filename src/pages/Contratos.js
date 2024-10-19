import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Badge, Pagination } from 'react-bootstrap';
import { getContratos, createContrato, updateContrato, getContratoById } from '../services/contratoService.js';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import ContratoModal from '../components/ContratoModal';

//
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Para manejar tablas automáticamente

const Contratos = () => {
  const [contratos, setContratos] = useState([]);
  const [filteredContratos, setFilteredContratos] = useState([]);
  const [selectedContrato, setSelectedContrato] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  //
  const handleGenerateReport = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(20);
    doc.text('Reporte de Contratos', 14, 22);
  
    const tableColumn = ["Nombre", "Empresa", "Correo Electrónico", "Teléfono", "Estado", "Fecha de Inicio de Contrato"];
    const tableRows = [];
  
    currentItems.forEach(contrato => {
      const contratoData = [
        contrato.nombre || 'Sin nombre',
        contrato.empresa || 'Sin empresa',
        contrato.correoElectronico || 'Sin correo',
        contrato.telefono || 'Sin teléfono',
        contrato.estadoContrato || 'Sin estado',
        formatDate(contrato.fechaSeguimiento),
      ];
      tableRows.push(contratoData);
    });
  
    doc.autoTable(tableColumn, tableRows, { startY: 30 });
    doc.save('reporte_contratos.pdf');
  };
  

  const fetchContratos = async () => {
    try {
      const response = await getContratos();
      console.log(response.data);
      setContratos(response.data);
      setFilteredContratos(response.data);
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
        return <Badge bg="secondary">Renovacion</Badge>;
    }
  };

  // Logic for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContratos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredContratos.length / itemsPerPage);

  return (
    <Container>
      <h1 className="mt-4">Contratos</h1>
      <p className="text-muted">
      Un contrato de compraventa es un acuerdo legal entre una empresa vendedora y una compradora, donde se establecen los términos y condiciones para la compra de productos o servicios. En este contrato, la empresa vendedora se compromete a entregar los productos acordados, y la empresa compradora se compromete a pagar el precio estipulado, cumpliendo con las demás obligaciones especificadas, como plazos de entrega y condiciones de pago.
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
        <Button variant="success" onClick={handleGenerateReport} className="me-2">
      Generar Reporte
    </Button>
          <Button variant="primary" onClick={handleAddClick}>
            <FaPlus /> Añadir Contrato
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

      <ContratoModal
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
