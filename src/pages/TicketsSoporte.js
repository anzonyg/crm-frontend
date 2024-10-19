import React, { useEffect, useState } from 'react';
import { Modal, Table, Button, Container, Row, Col, Form, Badge, Pagination } from 'react-bootstrap';
import { getTicketsSoporte, createTicketsSoporte, updateTicketsSoporte, getTicketsSoporteById, deleteTicketsSoporte } from '../services/ticketsSoporteService';
import { FaEdit, FaPlus, FaEye, FaTrash } from 'react-icons/fa';
import TicketsSoporteModal from '../components/TicketsSoporteModal';

const TicketsSoporte = () => {
    const [ticket, setTicket] = useState([]);
    const [filteredTicket, setFilteredTicket] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);

    const fetchTicket = async () => {
        try {
            const response = await getTicketsSoporte();
            setTicket(response.data);
            setFilteredTicket(response.data);
        } catch (error) {
            console.error("Error al obtener los tickets:", error);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, []);

    const handleShowConfirmModal = (id) => {
        setTicketToDelete(id);
        setShowConfirmModal(true);
    };
    
    const handleCloseConfirmModal = () => {
        setTicketToDelete(null);
        setShowConfirmModal(false);
    };
    
    const handleConfirmDelete = async () => {
        if (ticketToDelete) {
            try {
                await deleteTicketsSoporte(ticketToDelete);
                await fetchTicket();
                handleCloseConfirmModal(); // Cierra el modal tras eliminar
            } catch (error) {
                console.error("Error al eliminar el ticket:", error);
            }
        }
    };
    
    const handleAddClick = () => {
        setSelectedTicket({
            cliente: '',
            correo: '',
            telefono: '',
            asunto: '',
            descripcion: '',
            estado: 'Nuevo',
            prioridad: 'Normal',
            agenteAsignado: 'Jair Carrera',
        });
        setIsViewMode(false);
        setShowModal(true);
    };

    const handleEditClick = async (id) => {
        const response = await getTicketsSoporteById(id);
        setSelectedTicket(response.data);
        setIsViewMode(false);
        setShowModal(true);
    };

    const handleViewClick = async (id) => {
        const response = await getTicketsSoporteById(id);
        setSelectedTicket(response.data);
        setIsViewMode(true);
        setShowModal(true);
    };

    const handleChange = (e) => {
        setSelectedTicket({ ...selectedTicket, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (selectedTicket._id) {
            await updateTicketsSoporte(selectedTicket._id, selectedTicket);
        } else {
            await createTicketsSoporte(selectedTicket);
        }
        setShowModal(false);
        await fetchTicket(); // Asegúrate de que esta línea esté aquí
    };

    const handleClose = () => {
        setShowModal(false);
        fetchTicket();
    };

    const handleSearchChange = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);

        const filtered = ticket.filter((ticket) =>
            (ticket.cliente ? ticket.cliente.toLowerCase() : '').includes(searchValue) ||
            (ticket.asunto ? ticket.asunto.toLowerCase() : '').includes(searchValue) ||
            (ticket.estado ? ticket.estado.toLowerCase() : '').includes(searchValue) ||
            (ticket.prioridad ? ticket.prioridad.toLowerCase() : '').includes(searchValue)
        );

        setFilteredTicket(filtered);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);  // Reset to the first page when items per page changes
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Está seguro que desea eliminar el ticket, si es eliminado esto no se puede revertir.")) {
           const response = await deleteTicketsSoporte(id);
            await fetchTicket();
        }
        
      };

      const renderBadge = (tipo, valor) => {
        switch (tipo) {
            case 'estado':
                switch (valor) {
                    case 'Nuevo':
                        return <Badge bg="info">Nuevo</Badge>;
                    case 'En Progreso':
                        return <Badge bg="success">En Progreso</Badge>;
                    case 'Resuelto':
                        return <Badge bg="warning">Resuelto</Badge>;
                    case 'Rechazado':
                        return <Badge bg="danger">Rechazado</Badge>;
                    default:
                        return <Badge bg="secondary">Desconocido</Badge>;
                }
            case 'prioridad':
                switch (valor) {
                    case 'Baja':
                        return <Badge bg="info">Baja</Badge>;
                    case 'Normal':
                        return <Badge bg="success">Normal</Badge>;
                    case 'Alta':
                        return <Badge bg="warning">Alta</Badge>;
                    case 'Urgente':
                        return <Badge bg="danger">Urgente</Badge>;
                    default:
                        return <Badge bg="secondary">Desconocido</Badge>;
                }
            case 'agenteAsignado':
                // Puedes agregar los nombres directamente aquí
                switch (valor) {
                    case 'Jair Carrera':
                        return <Badge bg="secondary">Jair Carrera</Badge>;
                    case 'Anzony Gonzalez':
                        return <Badge bg="secondary">Anzony Gonzalez</Badge>;
                    case 'Cecilia Gonzalez':
                        return <Badge bg="secondary">Cecilia Gonzalez</Badge>;
                    case 'Fredy Hi':
                        return <Badge bg="secondary">Fredy Hi</Badge>;
                    default:
                        return <Badge bg="secondary">Sin Asignar</Badge>;
                }
            default:
                return <Badge bg="secondary">Desconocido</Badge>;
        }
    };
    

    // Logic for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTicket.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredTicket.length / itemsPerPage);

    return (
        <Container>
            <h1 className="mt-4">Tickets de Soporte</h1>
            <p className="text-muted">
                Los "Tickets de Soporte" son solicitudes de asistencia que los clientes envían para resolver problemas. Administrar estos tickets te ayudará a brindar un mejor servicio al cliente.
            </p>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por cliente, asunto o estado"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button variant="primary" onClick={handleAddClick}>
                        <FaPlus /> Añadir Ticket
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Cliente</th>
                        <th>Correo</th>
                        <th>Asunto</th>
                        <th>Estado</th>
                        <th>Prioridad</th>
                        <th>Agente Asignado</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((ticket, index) => (
                        <tr key={ticket._id}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{ticket.cliente || 'Sin cliente'}</td>
                            <td>{ticket.correo || 'Sin correo'}</td>
                            <td>{ticket.asunto || 'Sin asunto'}</td>
                            <td>{renderBadge('estado', ticket.estado)}</td>
                            <td>{renderBadge('prioridad',ticket.prioridad)}</td>
                            <td>{renderBadge('agenteAsignado',ticket.agenteAsignado)}</td>
                            <td className="text-center">
                                <div className="d-flex justify-content-center">
                                    <Button variant="info" className="me-2" onClick={() => handleEditClick(ticket._id)}>
                                        <FaEdit />
                                    </Button>
                                    <Button variant="secondary" className="me-2" onClick={() => handleViewClick(ticket._id)}>
                                        <FaEye />
                                    </Button>
                                    <Button variant="danger" onClick={() => handleShowConfirmModal(ticket._id)}>
                                    <FaTrash />
                                </Button>
                                {/* Modal de confirmación */}
                                 <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
                                    <Modal.Header closeButton>
                                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                    ¿Estás seguro de que deseas eliminar este ticket? Esta acción no se puede deshacer.
                                     </Modal.Body>
                                    <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseConfirmModal}>
                                    Cancelar
                                </Button>
                                <Button variant="danger" onClick={handleConfirmDelete}>
                                    Eliminar
                                </Button>
                            </Modal.Footer>
                        </Modal>
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

            <TicketsSoporteModal
                show={showModal}
                handleClose={handleClose}
                ticket={selectedTicket}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                isViewMode={isViewMode}
            />
        </Container>
    );
};

export default TicketsSoporte;