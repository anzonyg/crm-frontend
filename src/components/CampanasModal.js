import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FaTimes, FaSave, FaEdit } from 'react-icons/fa';
import { updateCampanas, createCampanas } from '../services/campanasService';

const CampanasModal = ({ show, handleClose, campanas, handleSubmit, isViewMode }) => {
    const [campanasData, setCampanasData] = useState({
        nombre: '',
        estado: '',
        tipo: '',
        producto: '',
        fechaCreacion: '',
        fechaInicio: '',
        fechaEstimacionCierre: '',
        publicoObjetivo: '',
        patrocinador: '',
        asignadoA: '',
        presupuesto: '',
        costeReal: '',
        estimacionVentas: '',
        ventasTotales: '',
        descripcion: '',
    });

    useEffect(() => {
        if (campanas) {
            setCampanasData(campanas);
        }
    }, [campanas]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCampanasData({
            ...campanasData,
            [name]: value,
        });
    };

    const handleSubmitInternal = (e) => {
        e.preventDefault();

        if (campanas && campanas._id) {
            updateCampanas(campanas._id, campanasData)
                .then(() => handleClose())
                .catch(error => console.error("Error:", error));
        } else {
            createCampanas(campanasData)
                .then(() => handleClose())
                .catch(error => console.error("Error:", error));
        }
    };

    const modalTitle = isViewMode ? 'Ver Campaña' : (campanas && campanas._id ? 'Editar Campaña' : 'Crear Campaña');
    const modalHeaderClass = isViewMode ? 'bg-secondary text-white' : (campanas && campanas._id ? 'bg-info text-black' : 'bg-primary text-white');

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Form onSubmit={handleSubmitInternal}>
                <Modal.Header closeButton className={modalHeaderClass}>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Información de la Campaña</h5>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="nombre">
                                <Form.Label>Nombre de la Campaña</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={campanasData.nombre}
                                    onChange={handleChange}
                                    placeholder="Nombre de la campaña"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="estado">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select
                                    name="estado"
                                    value={campanasData.estado || ''}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    required
                                >
                                    <option value="">Seleccione un estado</option>
                                    <option value="Nuevo">Nuevo</option>
                                    <option value="En Proceso">En Proceso</option>
                                    <option value="Descartado">Descartado</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="tipo">
                                <Form.Label>Tipo de Campaña</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="tipo"
                                    value={campanasData.tipo}
                                    onChange={handleChange}
                                    placeholder="Tipo de campaña"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="producto">
                                <Form.Label>Producto</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="producto"
                                    value={campanasData.producto}
                                    onChange={handleChange}
                                    placeholder="Producto asociado a la campaña"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="fechaCreacion">
                                <Form.Label>Fecha de Creación</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fechaCreacion"
                                    value={campanasData.fechaCreacion ? new Date(campanasData.fechaCreacion).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="fechaInicio">
                                <Form.Label>Fecha de Inicio</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fechaInicio"
                                    value={campanasData.fechaInicio ? new Date(campanasData.fechaInicio).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="fechaEstimacionCierre">
                                <Form.Label>Fecha de Estimación de Cierre</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fechaEstimacionCierre"
                                    value={campanasData.fechaEstimacionCierre ? new Date(campanasData.fechaEstimacionCierre).toISOString().split('T')[0] : ''}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="publicoObjetivo">
                                <Form.Label>Público Objetivo</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="publicoObjetivo"
                                    value={campanasData.publicoObjetivo}
                                    onChange={handleChange}
                                    placeholder="Público objetivo de la campaña"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="patrocinador">
                                <Form.Label>Patrocinador</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="patrocinador"
                                    value={campanasData.patrocinador}
                                    onChange={handleChange}
                                    placeholder="Patrocinador de la campaña"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="asignadoA">
                                <Form.Label>Asignado a</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="asignadoA"
                                    value={campanasData.asignadoA}
                                    onChange={handleChange}
                                    placeholder="Persona asignada a la campaña"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="presupuesto">
                                <Form.Label>Presupuesto</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="presupuesto"
                                    value={campanasData.presupuesto}
                                    onChange={handleChange}
                                    placeholder="Presupuesto de la campaña"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="costeReal">
                                <Form.Label>Coste Real</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="costeReal"
                                    value={campanasData.costeReal}
                                    onChange={handleChange}
                                    placeholder="Coste real de la campaña"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="estimacionVentas">
                                <Form.Label>Estimación de Ventas</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="estimacionVentas"
                                    value={campanasData.estimacionVentas}
                                    onChange={handleChange}
                                    placeholder="Estimación de ventas"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="ventasTotales">
                                <Form.Label>Ventas Totales</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="ventasTotales"
                                    value={campanasData.ventasTotales}
                                    onChange={handleChange}
                                    placeholder="Ventas totales"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="descripcion">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="descripcion"
                                    value={campanasData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Descripción de la campaña"
                                    disabled={isViewMode}
                                    required
                                />
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
                            {campanas && campanas._id ? <FaEdit /> : <FaSave />} {/* Icono de editar o guardar según el estado */}
                        </Button>
                    )}
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CampanasModal;
