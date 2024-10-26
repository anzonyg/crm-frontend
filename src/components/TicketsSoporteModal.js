import React, { useState, useEffect } from 'react'; 
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FaTimes, FaSave, FaEdit } from 'react-icons/fa';
import { updateTicketsSoporte, createTicketsSoporte } from '../services/ticketsSoporteService';

const TicketsSoporteModal = ({ show, handleClose, ticket, handleSubmit, isViewMode, handleDownloadPDF}) => {
    const [ticketData, setTicketData] = useState({
        cliente: '',
        correo: '',
        telefono: '',
        asunto: '',
        descripcion: '',
        estado: 'Nuevo',
        prioridad: 'Normal',
        agenteAsignado: 'Jair Carrera',
    });

    useEffect(() => {
        if (ticket) {
            setTicketData(ticket);
        }
    }, [ticket]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicketData({
            ...ticketData,
            [name]: value,
        });
    };

    const handleSubmitInternal = (e) => {
        e.preventDefault();

        if (ticket && ticket._id) {
            updateTicketsSoporte(ticket._id, ticketData)
                .then(() => handleClose())
                .catch(error => console.error("Error:", error));
        } else {
            createTicketsSoporte(ticketData)
                .then(() => handleClose())
                .catch(error => console.error("Error:", error));
        }
    };

    const modalTitle = isViewMode ? 'Ver Ticket' : (ticket && ticket._id ? 'Editar Ticket' : 'Crear Ticket');
    const modalHeaderClass = isViewMode ? 'bg-secondary text-white' : (ticket && ticket._id ? 'bg-info text-black' : 'bg-primary text-white');

    return (
        <Modal show={show} onHide={handleClose} className="custom-modal">
            <Form onSubmit={handleSubmitInternal}>
                <Modal.Header closeButton className={modalHeaderClass}>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Información del Ticket</h5>
                    <Row>
                        <Col md={5}>
                            <Form.Group className="mb-3" controlId="cliente">
                                <Form.Label>Cliente</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cliente"
                                    value={ticketData.cliente}
                                    onChange={handleChange}
                                    placeholder="Nombre"
                                    disabled={isViewMode}
                                    required
                                    style={{ width: '150px' }} // Ajuste de tamaño
                                />
                            </Form.Group>
                        </Col>
                        <Col md={5}>
                            <Form.Group className="mb-3" controlId="correo">
                                <Form.Label>Correo Electrónico</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="correo"
                                    value={ticketData.correo}
                                    onChange={handleChange}
                                    placeholder="Correo del cliente"
                                    disabled={isViewMode}
                                    required
                                    style={{ width: '250px' }} // Ajuste de tamaño
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={5}>
                            <Form.Group className="mb-3" controlId="telefono">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="telefono"
                                    value={ticketData.telefono}
                                    onChange={handleChange}
                                    placeholder="Teléfono"
                                    disabled={isViewMode}
                                    required
                                    style={{ width: '95px' }} // Ajustado para 8 dígitos
                                    maxLength={8} // Limita a 8 dígitos
                                />
                            </Form.Group>
                        </Col>
                        <Col md={5}>
                            <Form.Group className="mb-3" controlId="asunto">
                                <Form.Label>Asunto</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="asunto"
                                    value={ticketData.asunto}
                                    onChange={handleChange}
                                    placeholder="Asunto del ticket"
                                    disabled={isViewMode}
                                    required
                                    style={{ width: '240px' }} // Ajuste de tamaño
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3" controlId="descripcion">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="descripcion"
                                    value={ticketData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Descripción del problema"
                                    disabled={isViewMode}
                                    style={{ width: '465px', height: '70px' }} // Ajuste de tamaño
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={5}>
                            <Form.Group className="mb-3" controlId="estado">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select
                                    name="estado"
                                    value={ticketData.estado}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    required
                                    style={{ width: '135px' }} // Ajuste de tamaño
                                >
                                    <option value="Nuevo">Nuevo</option>
                                    <option value="En Progreso">En Progreso</option>
                                    <option value="Resuelto">Resuelto</option>
                                    <option value="Rechazado">Rechazado</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={5}>
                            <Form.Group className="mb-3" controlId="prioridad">
                                <Form.Label>Prioridad</Form.Label>
                                <Form.Select
                                    name="prioridad"
                                    value={ticketData.prioridad}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    required
                                    style={{ width: '110px' }} // Ajuste de tamaño
                                >
                                    <option value="Baja">Baja</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Alta">Alta</option>
                                    <option value="Urgente">Urgente</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3" controlId="agenteAsignado">
                                <Form.Label>Agente Asignado</Form.Label>
                                <Form.Select
                                   name="agenteAsignado"
                                   value={ticketData.agenteAsignado}
                                   onChange={handleChange}
                                   disabled={isViewMode}
                                   required
                                   style={{ width: '170px' }} // Ajuste de tamaño
                               >
                                   <option value="Jair Carrera">Jair Carrera</option>
                                   <option value="Anzony Gonzalez">Anzony Gonzalez</option>
                                   <option value="Cecilia Gonzalez">Cecilia Gonzalez</option>
                                   <option value="Fredy Hi">Fredy Hi</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        <FaTimes /> {/* Icono para cerrar */}
                    </Button>
                    {!isViewMode && (
                        <Button variant="primary" type="submit">
                            {ticket && ticket._id ? <FaEdit /> : <FaSave />} {/* Icono de editar o guardar según el estado */}
                        </Button>
                    )}
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default TicketsSoporteModal;
