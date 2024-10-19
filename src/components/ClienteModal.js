import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Table } from 'react-bootstrap';
import { FaTimes, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { updateCliente, createCliente } from '../services/clienteService';

const ClienteModal = ({ show, handleClose, cliente, handleSubmit, isViewMode }) => {
    const [clienteData, setClienteData] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        direccion: '',
        empresa: '',
        estado: '',
        contactos: []
    });

    const [contactoInput, setContactoInput] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        puesto: ''
    });

    useEffect(() => {
        if (cliente) {
            setClienteData({
                ...cliente,
                contactos: cliente.contactos || []
            });
        }
    }, [cliente]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClienteData({
            ...clienteData,
            [name]: value
        });
    };

    const handleContactoChange = (e) => {
        const { name, value } = e.target;
        setContactoInput({
            ...contactoInput,
            [name]: value
        });
    };

    const handleAddContacto = () => {
        if (contactoInput.nombre && contactoInput.correo && contactoInput.telefono) {
            setClienteData((prevData) => ({
                ...prevData,
                contactos: [...prevData.contactos, contactoInput]
            }));
            setContactoInput({ nombre: '', correo: '', telefono: '', puesto: '' });
        } else {
            alert('Por favor complete todos los campos para el contacto.');
        }
    };

    const handleDeleteContacto = (index) => {
        const updatedContactos = clienteData.contactos.filter((_, i) => i !== index);
        setClienteData({
            ...clienteData,
            contactos: updatedContactos
        });
    };

    const handleSubmitInternal = (e) => {
        e.preventDefault();
        if (clienteData.contactos.length === 0) {
            alert('Debe agregar al menos un contacto.');
            return;
        }

        if (cliente._id) {
            updateCliente(cliente._id, clienteData).then(() => handleClose());
        } else {
            createCliente(clienteData).then(() => handleClose());
        }
    };

    const modalTitle = cliente ? 'Editar Cliente' : 'Crear Cliente';
    const modalClass = cliente ? 'bg-info text-black' : 'bg-primary text-white';

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Form onSubmit={handleSubmitInternal}>
                <Modal.Header closeButton className={modalClass}>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Información del Cliente</h5>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="nombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={clienteData.nombre}
                                    onChange={handleChange}
                                    placeholder="Nombre del cliente"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="correo">
                                <Form.Label>Correo</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="correo"
                                    value={clienteData.correo}
                                    onChange={handleChange}
                                    placeholder="Correo electrónico"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="telefono">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="telefono"
                                    value={clienteData.telefono}
                                    onChange={handleChange}
                                    placeholder="Teléfono del cliente"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="empresa">
                                <Form.Label>Empresa</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="empresa"
                                    value={clienteData.empresa}
                                    onChange={handleChange}
                                    placeholder="Empresa del cliente"
                                    disabled={isViewMode}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="estado">
                                <Form.Label>Estado</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="estado"
                                    value={clienteData.estado}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    required
                                >
                                    <option value="">Seleccionar Estado</option>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    <h5>Contactos</h5>
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="contactoNombre">
                                <Form.Label>Nombre del Contacto</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={contactoInput.nombre}
                                    onChange={handleContactoChange}
                                    placeholder="Nombre del contacto"
                                    disabled={isViewMode}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="contactoCorreo">
                                <Form.Label>Correo del Contacto</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="correo"
                                    value={contactoInput.correo}
                                    onChange={handleContactoChange}
                                    placeholder="Correo electrónico del contacto"
                                    disabled={isViewMode}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="contactoTelefono">
                                <Form.Label>Teléfono del Contacto</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="telefono"
                                    value={contactoInput.telefono}
                                    onChange={handleContactoChange}
                                    placeholder="Teléfono del contacto"
                                    disabled={isViewMode}
                                />
                            </Form.Group>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Button onClick={handleAddContacto} disabled={!contactoInput.nombre || !contactoInput.correo || !contactoInput.telefono || isViewMode}>
                                <FaPlus />
                            </Button>
                        </Col>
                    </Row>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Teléfono</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clienteData.contactos.map((contacto, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{contacto.nombre}</td>
                                    <td>{contacto.correo}</td>
                                    <td>{contacto.telefono}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleDeleteContacto(index)}>
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        <FaTimes /> Cancelar
                    </Button>
                    {!isViewMode && (
                        <Button variant="primary" type="submit">
                            <FaSave /> Guardar
                        </Button>
                    )}
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ClienteModal;
