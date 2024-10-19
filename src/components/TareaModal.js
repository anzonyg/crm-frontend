import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Table } from 'react-bootstrap';
import { FaTimes, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { updateTarea, createTarea } from '../services/tareaService';

const TareaModal = ({ show, handleClose, tarea, handleSubmit, isViewMode }) => {
    const [tareaData, setTareaData] = useState({
        titulo: '',
        responsable: '',
        fechaInicio: '',
        fechaFin: '',
        estado: '',
        prioridad: '',
        descripcion: '',
        subtareas: []
    });

    const [subtareaInput, setSubtareaInput] = useState({
        descripcion: '',
        responsable: '',
        estado: ''
    });

    useEffect(() => {
        if (tarea) {
            setTareaData({
                ...tarea,
                subtareas: tarea.subtareas || []
            });
        }
    }, [tarea]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTareaData({
            ...tareaData,
            [name]: value
        });
    };

    const handleSubtareaChange = (e) => {
        const { name, value } = e.target;
        setSubtareaInput({
            ...subtareaInput,
            [name]: value
        });
    };

    const handleAddSubtarea = () => {
        if (subtareaInput.descripcion && subtareaInput.responsable && subtareaInput.estado) {
            setTareaData((prevData) => ({
                ...prevData,
                subtareas: [...prevData.subtareas, subtareaInput]
            }));
            setSubtareaInput({ descripcion: '', responsable: '', estado: '' });
        } else {
            alert('Por favor complete todos los campos para la subtarea.');
        }
    };

    const handleDeleteSubtarea = (index) => {
        const updatedSubtareas = tareaData.subtareas.filter((_, i) => i !== index);
        setTareaData({
            ...tareaData,
            subtareas: updatedSubtareas
        });
    };

    const handleSubmitInternal = (e) => {
        e.preventDefault();
        if (tareaData.subtareas.length === 0) {
            alert('Debe agregar al menos una subtarea.');
            return;
        }

        if (tarea._id) {
            updateTarea(tarea._id, tareaData).then(() => handleClose());
        } else {
            createTarea(tareaData).then(() => handleClose());
        }
    };

    const modalTitle = tarea ? 'Editar Tarea' : 'Crear Tarea';
    const modalClass = tarea ? 'bg-info text-black' : 'bg-primary text-white';

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Form onSubmit={handleSubmitInternal}>
                <Modal.Header closeButton className={modalClass}>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Información de la Tarea</h5>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="titulo">
                                <Form.Label>Título</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="titulo"
                                    value={tareaData.titulo}
                                    onChange={handleChange}
                                    placeholder="Título de la tarea"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="responsable">
                                <Form.Label>Responsable</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="responsable"
                                    value={tareaData.responsable}
                                    onChange={handleChange}
                                    placeholder="Responsable de la tarea"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="fechaInicio">
                                <Form.Label>Fecha de Inicio</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fechaInicio"
                                    value={tareaData.fechaInicio}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="fechaFin">
                                <Form.Label>Fecha de Fin</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fechaFin"
                                    value={tareaData.fechaFin}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    required
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
                                    value={tareaData.estado}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    required
                                >
                                    <option value="">Seleccionar Estado</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En Progreso">En Progreso</option>
                                    <option value="Completada">Completada</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="prioridad">
                                <Form.Label>Prioridad</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="prioridad"
                                    value={tareaData.prioridad}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    required
                                >
                                    <option value="">Seleccionar Prioridad</option>
                                    <option value="Alta">Alta</option>
                                    <option value="Media">Media</option>
                                    <option value="Baja">Baja</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3" controlId="descripcion">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="descripcion"
                            value={tareaData.descripcion}
                            onChange={handleChange}
                            disabled={isViewMode}
                        />
                    </Form.Group>

                    <h5>Subtareas</h5>
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="subtareaDescripcion">
                                <Form.Label>Descripción de la Subtarea</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="descripcion"
                                    value={subtareaInput.descripcion}
                                    onChange={handleSubtareaChange}
                                    placeholder="Descripción de la subtarea"
                                    disabled={isViewMode}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="subtareaResponsable">
                                <Form.Label>Responsable</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="responsable"
                                    value={subtareaInput.responsable}
                                    onChange={handleSubtareaChange}
                                    placeholder="Responsable de la subtarea"
                                    disabled={isViewMode}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="subtareaEstado">
                                <Form.Label>Estado</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="estado"
                                    value={subtareaInput.estado}
                                    onChange={handleSubtareaChange}
                                    disabled={isViewMode}
                                >
                                    <option value="">Seleccionar Estado</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Completada">Completada</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Button onClick={handleAddSubtarea} disabled={!subtareaInput.descripcion || !subtareaInput.responsable || !subtareaInput.estado || isViewMode}>
                                <FaPlus />
                            </Button>
                        </Col>
                    </Row>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Descripción</th>
                                <th>Responsable</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tareaData.subtareas.map((subtarea, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{subtarea.descripcion}</td>
                                    <td>{subtarea.responsable}</td>
                                    <td>{subtarea.estado}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleDeleteSubtarea(index)}>
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

export default TareaModal;

