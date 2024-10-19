import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Pagination, Badge} from 'react-bootstrap';
import { getCampanas, createCampanas, updateCampanas, getCampanasById, deleteCampanas } from '../services/campanasService';  // Actualizar la importación
import { FaEdit, FaTrash, FaPlus, FaEye, FaFilePdf } from 'react-icons/fa';
import { pdf } from '@react-pdf/renderer';
import CampanasModal from '../components/CampanasModal'; 
import PdfCampanas from '../components/PdfCampanas'; // Actualizar la importación

const Campanas = () => {
  const [campanas, setCampanas] = useState([]);
  const [filteredCampanas, setFilteredCampanas] = useState([]);
  const [selectedCampanas, setSelectedCampanas] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchCampanas = async () => {
    try {
      const response = await getCampanas();
      setCampanas(response.data);
      setFilteredCampanas(response.data);
    } catch (error) {
      console.error("Error al obtener las campañas:", error);
    }
  };

  useEffect(() => {
    fetchCampanas();
  }, []);

  const handleAddClick = () => {
    setSelectedCampanas({});
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleEditClick = async (id) => {
    const response = await getCampanasById(id);
    setSelectedCampanas(response.data);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleViewClick = async (id) => {
    const response = await getCampanasById(id);
    setSelectedCampanas(response.data);
    setIsViewMode(true);
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Está seguro que desea eliminar la campaña?, si la elimina esto no se puede revertir.")) {
       const response = await deleteCampanas(id);
        await fetchCampanas();
    }
    
  };

  const handleDownloadClick = async (id) => {
    const response = await getCampanasById(id);
    const doc = <PdfCampanas data={response.data} />;
    const asPdf = pdf();
    asPdf.updateContainer(doc);
  
    // Genera el archivo Blob del PDF
    const blob = await asPdf.toBlob();
    
    // Crea un enlace para descargar el archivo
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'reportedecampañas.pdf';
    link.click();
  };


  const handleChange = (e) => {
    setSelectedCampanas({ ...selectedCampanas, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (selectedCampanas._id) {
      await updateCampanas(selectedCampanas._id, selectedCampanas);
    } else {
      await createCampanas(selectedCampanas);
    }
    setShowModal(false);
    fetchCampanas();
  };

  const handleClose = async () => {
    setShowModal(false);
    await fetchCampanas();
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = campanas.filter((campanas) =>
      (campanas.nombreCampanas? campanas.nombreCampanas.toLowerCase() : '').includes(searchValue) ||
      (campanas.estadoCampanas? campanas.estadocampanas.toLowerCase() : '').includes(searchValue) ||
      (campanas.tipoCampanas? campanas.tipocampanas.toLowerCase() : '').includes(searchValue) ||
      (campanas.producto ? campanas.producto.toLowerCase() : '').includes(searchValue)
    );

    setFilteredCampanas(filtered);
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

  // Logic for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCampanas.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredCampanas.length / itemsPerPage);

  const renderBadge = (estado) => {
    switch (estado) {
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

  return (
    <Container>
      <h1 className="mt-4">Gestión de Campañas</h1>
      <p className="text-muted">
        Las "Campañas" permiten gestionar los diferentes eventos y promociones que se llevan a cabo para promover productos o servicios. Administrarlas adecuadamente ayuda a optimizar los recursos y a medir el éxito de las iniciativas.
      </p>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre, estado, tipo o producto"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
        <Col className="d-flex justify-content-end">
          <Button variant="primary" onClick={handleAddClick}>
            <FaPlus /> Añadir Campaña
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Tipo</th>
            <th>Producto</th>
            <th>Fecha Estimación Cierre</th>
            <th>Asignado a</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((campanas, index) => (
            <tr key={campanas._id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{campanas.nombre|| 'Sin nombre'}</td>
              <td>{renderBadge(campanas.estado)}</td>
              <td>{campanas.tipo|| 'Sin tipo'}</td>
              <td>{campanas.producto || 'Sin producto'}</td>
              <td>{formatDate(campanas.fechaEstimacionCierre)}</td>
              <td>{campanas.asignadoA || 'No asignado'}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center">
                  <Button variant="info" className="me-2" onClick={() => handleEditClick(campanas._id)}>
                    <FaEdit />
                  </Button>
                  <Button variant="secondary" className="me-2" onClick={() => handleViewClick(campanas._id)}>
                    <FaEye />
                  </Button>
                  <Button variant="danger" className="me-2" onClick={() => handleDeleteClick(campanas._id)}>
                    <FaTrash />
                  </Button>
                  <Button variant="warning" className="me-2" onClick={() => handleDownloadClick(campanas._id)}>
                    <FaFilePdf />
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

      <CampanasModal
        show={showModal}
        handleClose={handleClose}
        campanas={selectedCampanas}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isViewMode={isViewMode}
      />
    </Container>
  );
};

export default Campanas;