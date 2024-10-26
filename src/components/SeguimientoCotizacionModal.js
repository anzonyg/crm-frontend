import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form, Table } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { getCotizacionById } from '../services/seguimientoCotizacionService'; // Usamos solo getCotizacionById

const SeguimientoCotizacionModal = ({ show, handleClose, cotizacionId }) => {
    const [cotizacionData, setCotizacionData] = useState({
        nombre: '',
        empresa: '',
        correo: '',
        telefono: '',
        descripcion: '',
        observaciones: '',
        items: [],
        totalGeneral: 0,
    });

    useEffect(() => {
        if (cotizacionId) {
            // Obtener los datos de la cotización aprobada
            getCotizacionById(cotizacionId)  // Aquí usamos getCotizacionById
                .then(response => {
                    setCotizacionData({
                        ...response,
                        items: response.items || [],
                        totalGeneral: response.items
                            ? response.items.reduce((sum, item) => sum + parseFloat(item.precioTotal), 0)
                            : 0,
                    });
                })
                .catch(error => console.error("Error al cargar la cotización aprobada:", error));
        }
    }, [cotizacionId]);

    const modalTitle = 'Ver Cotización Aprobada';
    const modalHeaderClass = 'bg-success text-white';

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton className={modalHeaderClass}>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Información de la Cotización Aprobada */}
                <h5>Información de la Cotización</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="nombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={cotizacionData.nombre}
                                placeholder="Nombre del cliente o empresa"
                                disabled
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="empresa">
                            <Form.Label>Empresa</Form.Label>
                            <Form.Control
                                type="text"
                                name="empresa"
                                value={cotizacionData.empresa}
                                placeholder="Empresa del cliente"
                                disabled
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="correo">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                name="correo"
                                value={cotizacionData.correo}
                                placeholder="Correo electrónico del cliente"
                                disabled
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="telefono">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                name="telefono"
                                value={cotizacionData.telefono}
                                placeholder="Teléfono del cliente"
                                disabled
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
                                value={cotizacionData.descripcion}
                                placeholder="Descripción general de la cotización"
                                disabled
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Sección: Ítems */}
                <h5>Ítems de la Cotización</h5>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Precio Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cotizacionData.items.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.descripcion}</td>
                                <td>{item.cantidad}</td>
                                <td>{item.precioUnitario}</td>
                                <td>{item.precioTotal}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Total General */}
                <Row>
                    <Col className="text-end">
                        <h5>Total General: Q.{cotizacionData.totalGeneral.toFixed(2)}</h5>
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
                                value={cotizacionData.observaciones}
                                placeholder="Cualquier observación adicional"
                                disabled
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    <FaTimes /> Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SeguimientoCotizacionModal;

