import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Badge, Pagination } from 'react-bootstrap';
import { getProyectos, createProyecto, updateProyecto, getProyectoById } from '../services/proyectoService.js';
import { FaEdit, FaPlus, FaEye } from 'react-icons/fa';
import ProyectoModal from '../components/ProyectoModal';

// Importar jsPDF y autoTable para reportes
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Para manejar tablas automáticamente

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [filteredProyectos, setFilteredProyectos] = useState([]);
  const [selectedProyecto, setSelectedProyecto] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleGenerateReport = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(20);
    doc.text('Reporte de Proyectos', 14, 22);
  
    const tableColumn = ["Nombre Proyecto", "Cliente", "Fecha de Inicio", "Fecha de Cierre Estimada", "Estado", "Ingresos Estimados"];
    const tableRows = [];
  
    currentItems.forEach(proyecto => {
      const proyectoData = [
        proyecto.nombreProyecto || 'Sin nombre',
        proyecto.cliente || 'Sin cliente',
        formatDate(proyecto.fechaInicio),
        formatDate(proyecto.fechaCierreEstimada),
        proyecto.estadoProyecto || 'Sin estado',
        proyecto.ingresosEstimados || 'Sin ingresos',
      ];
      tableRows.push(proyectoData);
    });
  
    doc.autoTable(tableColumn, tableRows, { startY: 30 });
    doc.save('reporte_proyectos.pdf');
  };

  const fetchProyectos = async () => {
    try {
      const response = await getProyectos();
      console.log(response.data);
      setProyectos(response.data);
      setFilteredProyectos(response.data);
    } catch (error) {
      console.error("Error al obtener los proyectos:", error);
    }
  };

  useEffect(() => {
    fetchProyectos();
  }, []);

  const handleAddClick = () => {
    setSelectedProyecto({});
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleEditClick = async (id) => {
    const response = await getProyectoById(id);
    setSelectedProyecto(response.data);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleViewClick = async (id) => {
    const response = await getProyectoById(id);
    setSelectedProyecto(response.data);
    setIsViewMode(true);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setSelectedProyecto({ ...selectedProyecto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (selectedProyecto._id) {
      await updateProyecto(selectedProyecto._id, selectedProyecto);
    } else {
      await createProyecto(selectedProyecto);
    }
    setShowModal(false);
    fetchProyectos();
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = proyectos.filter((proyecto) =>
      (proyecto.nombreProyecto ? proyecto.nombreProyecto.toLowerCase() : '').includes(searchValue) ||
      (proyecto.cliente ? proyecto.cliente.toLowerCase() : '').includes(searchValue) ||
      (proyecto.estadoProyecto ? proyecto.estadoProyecto.toLowerCase() : '').includes(searchValue)
    );

    setFilteredProyectos(filtered);
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

  const renderBadge = (estadoProyecto) => {
    switch (estadoProyecto) {
      case 'Nuevo':
        return <Badge bg="primary">Nuevo</Badge>;
      case 'En Proceso':
        return <Badge bg="warning">En Proceso</Badge>;
      case 'Completado':
        return <Badge bg="success">Completado</Badge>;
      case 'Cancelado':
        return <Badge bg="danger">Cancelado</Badge>;
      default:
        return <Badge bg="secondary">Estado Desconocido</Badge>;
    }
  };

  // Logic for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProyectos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredProyectos.length / itemsPerPage);

  return (
    <Container>
      <h1 className="mt-4">Proyectos</h1>
      <p className="text-muted">
        La gestión de proyectos de ventas implica planificar, ejecutar y supervisar las actividades necesarias para cumplir con los objetivos de ventas establecidos.
      </p>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre, cliente o estado"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
        <Col className="d-flex justify-content-end">
          <Button variant="success" onClick={handleGenerateReport} className="me-2">
            Generar Reporte
          </Button>
          <Button variant="primary" onClick={handleAddClick}>
            <FaPlus /> Añadir Proyecto
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre Proyecto</th>
            <th>Cliente</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Cierre Estimada</th>
            <th>Estado</th>
            <th>Ingresos Estimados</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((proyecto, index) => (
            <tr key={proyecto._id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{proyecto.nombreProyecto || 'Sin nombre'}</td>
              <td>{proyecto.cliente || 'Sin cliente'}</td>
              <td>{formatDate(proyecto.fechaInicio)}</td>
              <td>{formatDate(proyecto.fechaCierreEstimada)}</td>
              <td>{renderBadge(proyecto.estadoProyecto)}</td>
              <td>{proyecto.ingresosEstimados || 'Sin ingresos'}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center">
                  <Button variant="info" className="me-2" onClick={() => handleEditClick(proyecto._id)}>
                    <FaEdit />
                  </Button>
                  <Button variant="secondary" className="me-2" onClick={() => handleViewClick(proyecto._id)}>
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

      <ProyectoModal
        show={showModal}
        handleClose={handleClose}
        proyecto={selectedProyecto}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isViewMode={isViewMode}
      />
    </Container>
  );
};

export default Proyectos;
