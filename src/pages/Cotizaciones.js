import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Pagination, Badge } from 'react-bootstrap';
import { getCotizaciones, createCotizacion, updateCotizacion, getCotizacionById, deleteCotizacion } from '../services/cotizacionService'; // Asegúrate de importar deleteCotizacion
import { FaEdit, FaTrash, FaPlus, FaEye, FaCheck } from 'react-icons/fa';
import CotizacionModal from '../components/CotizacionModal';
import { approveCotizacion } from '../services/cotizacionService';  // Asegúrate de tener este import correcto





const Cotizaciones = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [filteredCotizaciones, setFilteredCotizaciones] = useState([]);
  const [selectedCotizacion, setSelectedCotizacion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchCotizaciones = async () => {
    try {
      const response = await getCotizaciones();
      console.log(response.data)
      setCotizaciones(response.data);
      setFilteredCotizaciones(response.data);
    } catch (error) {
      console.error("Error al obtener las cotizaciones:", error);
    }
  };

  // Función para renderizar el badge según el estado de la cotización
  const renderBadge = (estado) => {
    switch (estado) {
      case 'aprobada':
        return <Badge bg="info">Aprobada</Badge>;
      case 'desaprobada':
        return <Badge bg="danger">Desaprobada</Badge>;
      default:
        return <Badge bg="secondary">Sin aprobar</Badge>;
    }
  };

  useEffect(() => {
    fetchCotizaciones();
  }, []);

  const handleApproveClick = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas aprobar esta cotización? Se desaprobarán las demás cotizaciones de este cliente.")) {
      try {
        // Llamada al backend para aprobar la cotización
        await approveCotizacion(id);  // Utiliza el servicio que tiene la URL base
        alert('Cotización aprobada correctamente.');
        fetchCotizaciones(); // Refrescar la lista de cotizaciones
      } catch (error) {
        console.error("Error al aprobar la cotización:", error);
        // Mostrar un mensaje más detallado del error al usuario
        alert(`Hubo un error al aprobar la cotización: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleAddClick = () => {
    setSelectedCotizacion(null); // Limpiar formulario
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleEditClick = async (id) => {
    const response = await getCotizacionById(id);
    setSelectedCotizacion(response.data);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleViewClick = async (id) => {
    const response = await getCotizacionById(id);
    setSelectedCotizacion(response.data);
    setIsViewMode(true);
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta cotización?")) {
      try {
        await deleteCotizacion(id); // Asegúrate de que deleteCotizacion esté definida e importada
        fetchCotizaciones(); // Refrescar la lista de cotizaciones después de eliminar
      } catch (error) {
        console.error("Error al eliminar la cotización:", error);
      }
    }
  };

  const handleSubmit = async () => {
    if (selectedCotizacion && selectedCotizacion._id) {
      await updateCotizacion(selectedCotizacion._id, selectedCotizacion);
    } else {
      await createCotizacion(selectedCotizacion);
    }
    setShowModal(false);
    fetchCotizaciones(); // Actualizar la tabla después de crear/editar
  };

  const handleClose = () => {
    setShowModal(false);
    fetchCotizaciones(); // Actualizar la tabla después de cerrar el modal
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = cotizaciones.filter((cotizacion) =>
      (cotizacion.nombre ? cotizacion.nombre.toLowerCase() : '').includes(searchValue) ||
      (cotizacion.empresa ? cotizacion.empresa.toLowerCase() : '').includes(searchValue) ||
      (cotizacion.telefono ? cotizacion.telefono.toLowerCase() : '').includes(searchValue) ||
      (cotizacion.correoElectronico ? cotizacion.correoElectronico.toLowerCase() : '').includes(searchValue)
    );

    setFilteredCotizaciones(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No asignada';
    const date = new Date(dateString);
    return isNaN(date) ? 'No asignada' : date.toISOString().split('T')[0];
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleChange = (e) => {
    setSelectedCotizacion({ ...selectedCotizacion, [e.target.name]: e.target.value });
  };
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);  // Reset to the first page when items per page changes
  };

  // Logic for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCotizaciones.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredCotizaciones.length / itemsPerPage);

  return (
    <Container>
      <h1 className="mt-4">Cotizaciones</h1>
      <p className="text-muted">
        Las "Cotizaciones" permiten estimar el valor total de productos o servicios que se ofrecerán a los clientes. Gestionarlas correctamente ayuda a mantener un registro detallado de las transacciones comerciales.
      </p>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre, empresa, correo o teléfono"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
        <Col className="d-flex justify-content-end">
          <Button variant="primary" onClick={handleAddClick}>
            <FaPlus /> Añadir Cotización
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Empresa</th>
            <th>Teléfono</th>
            <th>Correo Electrónico</th>
            <th>Fecha</th>
            <th>Valor Total</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((cotizacion, index) => (
            <tr key={cotizacion._id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{cotizacion.nombre || 'Sin nombre'}</td>
              <td>{cotizacion.empresa || 'Sin empresa'}</td>
              <td>{cotizacion.telefono || 'Sin teléfono'}</td>
              <td>{cotizacion.correo || 'Sin correo'}</td>
              <td>{formatDate(cotizacion.fechaCreacion)}</td>
              <td>Q. {cotizacion.totalGeneral || 'No asignado'}</td>
              <td>{renderBadge(cotizacion.estado)}</td> {/* Mostrar el estado con un badge */}
              <td className="text-center">
                <div className="d-flex justify-content-center">
                  {/* Botón para editar */}
                  <Button variant="info" className="me-2" onClick={() => handleEditClick(cotizacion._id)}>
                    <FaEdit />
                  </Button>
                  {/* Botón para ver */}
                  <Button variant="secondary" className="me-2" onClick={() => handleViewClick(cotizacion._id)}>
                    <FaEye />
                  </Button>
                  {/* Botón para eliminar */}
                  <Button variant="danger" className="me-2" onClick={() => handleDeleteClick(cotizacion._id)}>
                    <FaTrash />
                  </Button>
                  {/* Mostrar el botón "Aprobar" solo si el estado es "pendiente" */}
                  {cotizacion.estado === 'pendiente' && (
                    <Button variant="success" onClick={() => handleApproveClick(cotizacion._id)}>
                      <FaCheck />
                    </Button>
                  )}
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

      <CotizacionModal
        show={showModal}
        handleClose={handleClose}
        cotizacion={selectedCotizacion}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isViewMode={isViewMode}
      />
    </Container>
  );
};

export default Cotizaciones;
