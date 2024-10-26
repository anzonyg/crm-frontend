import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Table, InputGroup } from 'react-bootstrap';
import { FaSave, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { updateEventoActividad, createEventoActividad } from '../services/eventosActividadesService';

const EventosActividadesModal = ({ show, handleClose, evento, handleSubmit, isViewMode }) => {
    const [eventoData, setEventoData] = useState({
        tipo: '',
        subtipo: '',
        modalidad: '',
        nombre: '',
        descripcion: '',
        fecha: '',
        hora: '',
        ubicacion: '',
        clientes: [],
        clientesVIP: [],
        otrosInvitados: [],
        observaciones: '',
    });

    const [clienteInput, setClienteInput] = useState('');
    const [clienteVIPInput, setClienteVIPInput] = useState('');
    const [otroInvitadoInput, setOtroInvitadoInput] = useState('');

    useEffect(() => {
        if (evento) {
            setEventoData({
                ...evento,
                clientes: evento.clientes || [],
                clientesVIP: evento.clientesVIP || [],
                otrosInvitados: evento.otrosInvitados || [],
            });
        } else {
            // Restablecer el formulario a los valores iniciales cuando se crea un nuevo evento
            setEventoData({
                tipo: '',
                subtipo: '',
                modalidad: '',
                nombre: '',
                descripcion: '',
                fecha: '',
                hora: '',
                ubicacion: '',
                clientes: [],
                clientesVIP: [],
                otrosInvitados: [],
                observaciones: '',
            });
        }
    }, [evento, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventoData({
            ...eventoData,
            [name]: value,
        });
    };

    const handleAddCliente = () => {
        if (clienteInput.trim()) {
            setEventoData((prevData) => ({
                ...prevData,
                clientes: [...prevData.clientes, clienteInput.trim()],
            }));
            setClienteInput('');
        }
    };

    const handleDeleteCliente = (index) => {
        const updatedClientes = eventoData.clientes.filter((_, i) => i !== index);
        setEventoData({ ...eventoData, clientes: updatedClientes });
    };

    const handleAddClienteVIP = () => {
        if (clienteVIPInput.trim()) {
            setEventoData((prevData) => ({
                ...prevData,
                clientesVIP: [...prevData.clientesVIP, clienteVIPInput.trim()],
            }));
            setClienteVIPInput('');
        }
    };

    const handleDeleteClienteVIP = (index) => {
        const updatedClientesVIP = eventoData.clientesVIP.filter((_, i) => i !== index);
        setEventoData({ ...eventoData, clientesVIP: updatedClientesVIP });
    };

    const handleAddOtroInvitado = () => {
        if (otroInvitadoInput.trim()) {
            setEventoData((prevData) => ({
                ...prevData,
                otrosInvitados: [...prevData.otrosInvitados, otroInvitadoInput.trim()],
            }));
            setOtroInvitadoInput('');
        }
    };

    const handleDeleteOtroInvitado = (index) => {
        const updatedOtrosInvitados = eventoData.otrosInvitados.filter((_, i) => i !== index);
        setEventoData({ ...eventoData, otrosInvitados: updatedOtrosInvitados });
    };

    const handleSubmitInternal = (e) => {
        e.preventDefault();

        const finalEventoData = {
            ...eventoData,
            clientes: Array.isArray(eventoData.clientes) ? eventoData.clientes : [],
            clientesVIP: Array.isArray(eventoData.clientesVIP) ? eventoData.clientesVIP : [],
            otrosInvitados: Array.isArray(eventoData.otrosInvitados) ? eventoData.otrosInvitados : [],
        };

        if (
            finalEventoData.clientes.length === 0 &&
            finalEventoData.clientesVIP.length === 0 &&
            finalEventoData.otrosInvitados.length === 0
        ) {
            alert("Debe añadir al menos un cliente, cliente VIP, o invitado antes de guardar.");
            return;
        }

        if (evento && evento._id) {  // Verificación de `evento && evento._id`
            updateEventoActividad(evento._id, finalEventoData)
                .then(() => handleClose())
                .catch(error => console.error("Error:", error));
        } else {
            createEventoActividad(finalEventoData)
                .then(() => handleClose())
                .catch(error => console.error("Error:", error));
        }
    };

    const modalTitle = isViewMode ? 'Ver Evento/Actividad' : (evento && evento._id ? 'Editar Evento/Actividad' : 'Crear Evento/Actividad');
    const modalHeaderClass = isViewMode ? 'bg-secondary text-white' : (evento && evento._id ? 'bg-info text-black' : 'bg-primary text-white');

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Form onSubmit={handleSubmitInternal}>
                <Modal.Header closeButton className={modalHeaderClass}>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Sección: Información del Evento */}
                    <h5>Información del Evento</h5>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="tipo">
                                <Form.Label>Tipo</Form.Label>
                                <Form.Select
                                    name="tipo"
                                    value={eventoData.tipo}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    required
                                >
                                    <option value="">Seleccione un tipo</option>
                                    <option value="Evento">Evento</option>
                                    <option value="Actividad">Actividad</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="subtipo">
                                <Form.Label>Subtipo</Form.Label>
                                <Form.Select
                                    name="subtipo"
                                    value={eventoData.subtipo}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    required
                                >
                                    <option value="">Seleccione un subtipo</option>
                                    <option value="Conferencia">Conferencia</option>
                                    <option value="Taller">Taller</option>
                                    <option value="Seminario">Seminario</option>
                                    <option value="Reunión">Reunión</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="modalidad">
                                <Form.Label>Modalidad</Form.Label>
                                <Form.Select
                                    name="modalidad"
                                    value={eventoData.modalidad}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    required
                                >
                                    <option value="">Seleccione una modalidad</option>
                                    <option value="Presencial">Presencial</option>
                                    <option value="Virtual">Virtual</option>
                                    <option value="Híbrido">Híbrido</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="nombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={eventoData.nombre}
                                    onChange={handleChange}
                                    placeholder="Nombre del evento o actividad"
                                    disabled={isViewMode}
                                    required
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
                                    value={eventoData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Descripción del evento o actividad"
                                    disabled={isViewMode}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="fecha">
                                <Form.Label>Fecha</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fecha"
                                    value={eventoData.fecha ? new Date(eventoData.fecha).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    placeholder="Seleccione la fecha del evento"
                                    min={new Date().toISOString().split('T')[0]}  // La fecha mínima es hoy
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="hora">
                                <Form.Label>Hora</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="hora"
                                    value={eventoData.hora}
                                    onChange={handleChange}
                                    placeholder="Seleccione la hora del evento"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3" controlId="ubicacion">
                                <Form.Label>Ubicación</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ubicacion"
                                    value={eventoData.ubicacion}
                                    onChange={handleChange}
                                    placeholder="Dirección física o enlace virtual"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Sección: Clientes */}
                    <h5>Clientes</h5>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3" controlId="clientes">
                                <Form.Label>Clientes</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        name="clientes"
                                        value={clienteInput}
                                        onChange={(e) => setClienteInput(e.target.value)}
                                        placeholder="Añadir un cliente"
                                        disabled={isViewMode}
                                    />
                                    <Button onClick={handleAddCliente} disabled={!clienteInput.trim() || isViewMode}>
                                        <FaPlus />
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Cliente</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eventoData.clientes.map((cliente, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{cliente}</td>
                                            <td className="text-center">
                                                <Button variant="danger" onClick={() => handleDeleteCliente(index)} disabled={isViewMode}>
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                    {/* Sección: Clientes VIP */}
                    <h5>Clientes VIP</h5>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3" controlId="clientesVIP">
                                <Form.Label>Clientes VIP</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        name="clientesVIP"
                                        value={clienteVIPInput}
                                        onChange={(e) => setClienteVIPInput(e.target.value)}
                                        placeholder="Añadir un cliente VIP"
                                        disabled={isViewMode}
                                    />
                                    <Button onClick={handleAddClienteVIP} disabled={!clienteVIPInput.trim() || isViewMode}>
                                        <FaPlus />
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Cliente VIP</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eventoData.clientesVIP.map((clienteVIP, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{clienteVIP}</td>
                                            <td className="text-center">
                                                <Button variant="danger" onClick={() => handleDeleteClienteVIP(index)} disabled={isViewMode}>
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                    {/* Sección: Otros Invitados */}
                    <h5>Otros Invitados</h5>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3" controlId="otrosInvitados">
                                <Form.Label>Otros Invitados</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        name="otrosInvitados"
                                        value={otroInvitadoInput}
                                        onChange={(e) => setOtroInvitadoInput(e.target.value)}
                                        placeholder="Añadir otro invitado"
                                        disabled={isViewMode}
                                    />
                                    <Button onClick={handleAddOtroInvitado} disabled={!otroInvitadoInput.trim() || isViewMode}>
                                        <FaPlus />
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Otro Invitado</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eventoData.otrosInvitados.map((otroInvitado, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{otroInvitado}</td>
                                            <td className="text-center">
                                                <Button variant="danger" onClick={() => handleDeleteOtroInvitado(index)} disabled={isViewMode}>
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                    {/* Sección: Observaciones */}
                    <h5>Observaciones</h5>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3" controlId="observaciones">
                                <Form.Label>Observaciones</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="observaciones"
                                    value={eventoData.observaciones}
                                    onChange={handleChange}
                                    placeholder="Cualquier observación adicional"
                                    disabled={isViewMode}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    
                    {!isViewMode && (
                        <Button variant="primary" type="submit">
                            {evento && evento._id ? <FaEdit /> : <FaSave />} {/* Cambia el icono según si se está editando o creando */}
                        </Button>
                    )}
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EventosActividadesModal;
