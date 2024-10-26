import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Pagination } from 'react-bootstrap';
import { getEventosActividades, createEventoActividad, updateEventoActividad, getEventoActividadById, deleteEventoActividad } from '../services/eventosActividadesService'; // Importa deleteEventoActividad
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import EventosActividadesModal from '../components/EventosActividadesModal';

const EventosActividades = () => {
    const [eventos, setEventos] = useState([]);
    const [filteredEventos, setFilteredEventos] = useState([]);
    const [selectedEvento, setSelectedEvento] = useState(null); // Cambia a null
    const [showModal, setShowModal] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const fetchEventos = async () => {
        try {
            const response = await getEventosActividades();
            setEventos(response.data);
            setFilteredEventos(response.data);
        } catch (error) {
            console.error("Error al obtener los eventos:", error);
        }
    };

    useEffect(() => {
        fetchEventos();
    }, []);

    const handleAddClick = () => {
        setSelectedEvento(null); // Resetea el evento seleccionado
        setIsViewMode(false);
        setShowModal(true);
    };

    const handleEditClick = async (id) => {
        const response = await getEventoActividadById(id);
        setSelectedEvento(response.data);
        setIsViewMode(false);
        setShowModal(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este evento o actividad?")) {
            try {
                await deleteEventoActividad(id);
                fetchEventos(); // Refrescar la lista de eventos después de eliminar
            } catch (error) {
                console.error("Error al eliminar el evento o actividad:", error);
            }
        }
    };

    const handleViewClick = async (id) => {
        const response = await getEventoActividadById(id);
        setSelectedEvento(response.data);
        setIsViewMode(true);
        setShowModal(true);
    };

    const handleChange = (e) => {
        setSelectedEvento({ ...selectedEvento, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (selectedEvento._id) {
            await updateEventoActividad(selectedEvento._id, selectedEvento);
        } else {
            await createEventoActividad(selectedEvento);
        }
        setShowModal(false);
        fetchEventos(); // Actualiza la tabla después de guardar/editar
    };

    const handleClose = () => {
        setShowModal(false);
        fetchEventos(); // Actualiza la tabla al cerrar el modal
    };

    const handleSearchChange = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);

        const filtered = eventos.filter((evento) =>
            (evento.nombre ? evento.nombre.toLowerCase() : '').includes(searchValue) ||
            (evento.tipo ? evento.tipo.toLowerCase() : '').includes(searchValue) ||
            (evento.subtipo ? evento.subtipo.toLowerCase() : '').includes(searchValue) ||
            (evento.modalidad ? evento.modalidad.toLowerCase() : '').includes(searchValue)
        );

        setFilteredEventos(filtered);
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
    const currentItems = filteredEventos.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredEventos.length / itemsPerPage);

    return (
        <Container>
            <h1 className="mt-4">Eventos y Actividades</h1>
            <p className="text-muted">
                Los "Eventos y Actividades" son actividades planificadas que pueden incluir seminarios, conferencias, talleres y más. Administrar estos eventos de manera efectiva te ayudará a coordinar mejor los recursos y a maximizar el impacto de cada actividad.
            </p>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre, tipo, subtipo, modalidad o estado"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button variant="primary" onClick={handleAddClick}>
                        <FaPlus /> Añadir Evento
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Subtipo</th>
                        <th>Fecha</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((evento, index) => (
                        <tr key={evento._id}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{evento.nombre || 'Sin nombre'}</td>
                            <td>{evento.tipo || 'Sin tipo'}</td>
                            <td>{evento.subtipo || 'Sin subtipo'}</td>
                            <td>{formatDate(evento.fecha)}</td>
                            <td className="text-center">
                                <div className="d-flex justify-content-center">
                                    <Button variant="info" className="me-2" onClick={() => handleEditClick(evento._id)}>
                                        <FaEdit />
                                    </Button>
                                    <Button variant="secondary" className="me-2" onClick={() => handleViewClick(evento._id)}>
                                        <FaEye />
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDeleteClick(evento._id)}>
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

            <EventosActividadesModal
                show={showModal}
                handleClose={handleClose}
                evento={selectedEvento}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                isViewMode={isViewMode}
            />
        </Container>
    );
};

export default EventosActividades;
