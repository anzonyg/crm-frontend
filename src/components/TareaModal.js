import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Table } from 'react-bootstrap';
import { FaTimes, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { updateTarea, createTarea } from '../services/tareaService';  // Asegúrate de tener este servicio

const TareaModal = ({ show, handleClose, tarea, handleSubmit, isViewMode }) => {
    const [tareaData, setTareaData] = useState({
        titulo: '',
        descripcion: '',
        responsable: '',
        estado: '',
        adjuntos: []
    });

    const [adjuntoInput, setAdjuntoInput] = useState(null);

    useEffect(() => {
        if (tarea) {
            setTareaData({
                ...tarea,
                adjuntos: tarea.adjuntos || []
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

    const handleAdjuntoChange = (e) => {
        setAdjuntoInput(e.target.files[0]);
    };

    const handleAddAdjunto = () => {
        if (adjuntoInput) {
            setTareaData((prevData) => ({
                ...prevData,
                adjuntos: [...prevData.adjuntos, adjuntoInput.name]  // Solo agregamos el nombre
            }));
            setAdjuntoInput(null);
        } else {
            alert('Debe seleccionar un archivo adjunto.');
        }
    };

    const handleDeleteAdjunto = (index) => {
        const updatedAdjuntos = tareaData.adjuntos.filter((_, i) => i !== index);
        setTareaData({
            ...tareaData,
            adjuntos: updatedAdjuntos
        });
    };

    const handleSubmitInternal = (e) => {
        e.preventDefault();

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
                        <Col md={12}>
                            <Form.Group className="mb-3" controlId="descripcion">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="descripcion"
                                    value={tareaData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Descripción de la tarea"
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
                                    <option value="En progreso">En progreso</option>
                                    <option value="Completada">Completada</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    <h5>Archivos Adjuntos</h5>
                    <Row>
                        <Col md={10}>
                            <Form.Group className="mb-3" controlId="adjunto">
                                <Form.Label>Subir Archivo</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleAdjuntoChange}
                                    disabled={isViewMode}
                                />
                            </Form.Group>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Button onClick={handleAddAdjunto} disabled={!adjuntoInput || isViewMode}>
                                <FaPlus />
                            </Button>
                        </Col>
                    </Row>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre del Archivo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tareaData.adjuntos.map((adjunto, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{adjunto}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleDeleteAdjunto(index)}>
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
