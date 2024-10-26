import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Pagination } from 'react-bootstrap';
import { getCotizacionesAprobadas, getCotizacionById } from '../services/seguimientoCotizacionService';
import { FaEye } from 'react-icons/fa';
import SeguimientoCotizacionModal from '../components/SeguimientoCotizacionModal';

const SeguimientoCotizaciones = () => {
    const [cotizaciones, setCotizaciones] = useState([]);
    const [filteredCotizaciones, setFilteredCotizaciones] = useState([]);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Función para obtener cotizaciones aprobadas del servicio
    const fetchCotizacionesAprobadas = async () => {
        try {
            const response = await getCotizacionesAprobadas();
            if (Array.isArray(response)) {
                setCotizaciones(response);
                setFilteredCotizaciones(response);
            } else {
                console.error("La respuesta no es un array.");
            }
        } catch (error) {
            console.error("Error al obtener las cotizaciones aprobadas:", error);
        }
    };

    useEffect(() => {
        fetchCotizacionesAprobadas(); // Obtener las cotizaciones aprobadas al cargar el componente
    }, []);

    // Función para manejar la visualización de una cotización específica
    const handleViewClick = async (id) => {
        try {
            const response = await getCotizacionById(id);
            setSelectedCotizacion(response);
            setShowModal(true);
        } catch (error) {
            console.error("Error al obtener los detalles de la cotización:", error);
        }
    };

    // Función para cerrar el modal de detalles
    const handleClose = () => {
        setShowModal(false);
    };

    // Función para manejar la búsqueda de cotizaciones
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

    // Función para dar formato a la fecha
    const formatDate = (dateString) => {
        if (!dateString) return 'No asignada';
        const date = new Date(dateString);
        return isNaN(date) ? 'No asignada' : date.toISOString().split('T')[0];
    };

    // Función para manejar el cambio de página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Función para manejar el cambio del número de items por página
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    // Lógica de paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(filteredCotizaciones)
        ? filteredCotizaciones.slice(indexOfFirstItem, indexOfLastItem)
        : [];

    const totalPages = Math.ceil(filteredCotizaciones.length / itemsPerPage);

    return (
        <Container>
            <h1 className="mt-4">Seguimiento de Cotizaciones Aprobadas</h1>
            <p className="text-muted">
                Aquí puedes visualizar las cotizaciones aprobadas. Las cotizaciones aprobadas se mantienen en esta sección para realizar el seguimiento adecuado.
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
                            <td>{cotizacion.correoElectronico || 'Sin correo'}</td>
                            <td>{formatDate(cotizacion.fechaCreacion)}</td>
                            <td>Q. {cotizacion.totalGeneral || 'No asignado'}</td>
                            <td className="text-center">
                                <Button variant="secondary" onClick={() => handleViewClick(cotizacion._id)}>
                                    <FaEye /> Ver
                                </Button>
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

            <SeguimientoCotizacionModal
                show={showModal}
                handleClose={handleClose}
                cotizacion={selectedCotizacion}
            />
        </Container>
    );
};

export default SeguimientoCotizaciones;
