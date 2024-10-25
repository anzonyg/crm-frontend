import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Table, Card } from 'react-bootstrap';
import { FaSave, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { updateCotizacion, createCotizacion } from '../services/cotizacionService';

const CotizacionModal = ({ show, handleClose, cotizacion, handleSubmit, isViewMode }) => {
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

    const [itemInput, setItemInput] = useState({
        descripcion: '',
        cantidad: '',
        precioUnitario: '',
        precioTotal: '',
    });

    useEffect(() => {
        if (cotizacion) {
            setCotizacionData({
                ...cotizacion,
                items: cotizacion.items || [],
                totalGeneral: cotizacion.items ? cotizacion.items.reduce((sum, item) => sum + parseFloat(item.precioTotal), 0) : 0,
            });
        } else {
            resetForm();
        }
    }, [cotizacion, show]);

    const resetForm = () => {
        setCotizacionData({
            nombre: '',
            empresa: '',
            correo: '',
            telefono: '',
            descripcion: '',
            observaciones: '',
            items: [],
            totalGeneral: 0,
        });
        setItemInput({
            descripcion: '',
            cantidad: '',
            precioUnitario: '',
            precioTotal: '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCotizacionData({
            ...cotizacionData,
            [name]: value,
        });
    };

    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setItemInput((prevItem) => ({
            ...prevItem,
            [name]: value,
            precioTotal: name === 'precioUnitario' || name === 'cantidad'
                ? (prevItem.cantidad * prevItem.precioUnitario).toFixed(2)
                : prevItem.precioTotal,
        }));
    };

    const handleAddItem = () => {
        if (itemInput.descripcion.trim() && itemInput.cantidad && itemInput.precioUnitario) {
            const nuevoItem = {
                ...itemInput,
                precioTotal: (itemInput.cantidad * itemInput.precioUnitario).toFixed(2),
            };
            setCotizacionData((prevData) => ({
                ...prevData,
                items: [...prevData.items, nuevoItem],
                totalGeneral: prevData.totalGeneral + parseFloat(nuevoItem.precioTotal),
            }));
            setItemInput({ descripcion: '', cantidad: '', precioUnitario: '', precioTotal: '' });
        } else {
            alert("Por favor, complete todos los campos obligatorios (Descripción, Cantidad, Precio Unitario) para añadir el ítem.");
        }
    };

    const handleDeleteItem = (index) => {
        const itemToDelete = cotizacionData.items[index];
        const updatedItems = cotizacionData.items.filter((_, i) => i !== index);
        setCotizacionData({
            ...cotizacionData,
            items: updatedItems,
            totalGeneral: cotizacionData.totalGeneral - parseFloat(itemToDelete.precioTotal),
        });
    };

    const handleSubmitInternal = (e) => {
        e.preventDefault();

        if (cotizacionData.items.length === 0) {
            alert("Debe añadir al menos un ítem a la cotización antes de guardar.");
            return;
        }

        if (cotizacion && cotizacion._id) {
            updateCotizacion(cotizacion._id, cotizacionData)
                .then(() => handleClose())
                .catch(error => console.error("Error:", error));
        } else {
            createCotizacion(cotizacionData)
                .then(() => handleClose())
                .catch(error => console.error("Error:", error));
        }
    };

    const modalTitle = isViewMode ? 'Ver Cotización' : (cotizacion && cotizacion._id ? 'Editar Cotización' : 'Crear Cotización');
    const modalHeaderClass = isViewMode ? 'bg-secondary text-white' : (cotizacion && cotizacion._id ? 'bg-info text-black' : 'bg-primary text-white');

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Form onSubmit={handleSubmitInternal}>
                <Modal.Header closeButton className={modalHeaderClass}>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Información de la Cotización */}
                    <Card className="mb-3">
                        <Card.Header>Información de la Cotización</Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="nombre">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nombre"
                                            value={cotizacionData.nombre}
                                            onChange={handleChange}
                                            placeholder="Nombre del cliente o empresa"
                                            disabled={isViewMode}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3" controlId="empresa">
                                        <Form.Label>Empresa</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="empresa"
                                            value={cotizacionData.empresa}
                                            onChange={handleChange}
                                            placeholder="Empresa del cliente"
                                            disabled={isViewMode}
                                            required
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
                                            onChange={handleChange}
                                            placeholder="Correo electrónico del cliente"
                                            disabled={isViewMode}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3" controlId="telefono">
                                        <Form.Label>Teléfono</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="telefono"
                                            value={cotizacionData.telefono}
                                            onChange={handleChange}
                                            placeholder="Teléfono del cliente"
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
                                            value={cotizacionData.descripcion}
                                            onChange={handleChange}
                                            placeholder="Descripción general de la cotización"
                                            disabled={isViewMode}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Sección: Ítems */}
                    <Card className="mb-3">
                        <Card.Header>Ítems de la Cotización</Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3" controlId="itemDescripcion">
                                        <Form.Label>Descripción del Ítem</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="descripcion"
                                            value={itemInput.descripcion}
                                            onChange={handleItemChange}
                                            placeholder="Descripción del ítem"
                                            disabled={isViewMode}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group className="mb-3" controlId="itemCantidad">
                                        <Form.Label>Cantidad</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="cantidad"
                                            value={itemInput.cantidad}
                                            onChange={handleItemChange}
                                            placeholder="Cantidad"
                                            disabled={isViewMode}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3" controlId="itemPrecioUnitario">
                                        <Form.Label>Precio Unitario</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="precioUnitario"
                                            value={itemInput.precioUnitario}
                                            onChange={handleItemChange}
                                            placeholder="Precio unitario"
                                            disabled={isViewMode}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3" controlId="itemPrecioTotal">
                                        <Form.Label>Precio Total</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="precioTotal"
                                            value={(itemInput.cantidad * itemInput.precioUnitario).toFixed(2)}
                                            placeholder="Precio total"
                                            disabled
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={12} className="d-flex justify-content-end">
                                    <Button onClick={handleAddItem} disabled={!itemInput.descripcion || !itemInput.cantidad || !itemInput.precioUnitario || isViewMode}>
                                        <FaPlus />
                                    </Button>
                                </Col>
                            </Row>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Descripción</th>
                                        <th>Cantidad</th>
                                        <th>Precio Unitario</th>
                                        <th>Precio Total</th>
                                        <th className="text-center">Acciones</th>
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
                                            <td className="text-center">
                                                <Button variant="danger" onClick={() => handleDeleteItem(index)} disabled={isViewMode}>
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="4" className="text-end">Total General</td>
                                        <td className="text-end">${cotizacionData.totalGeneral.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </Table>
                        </Card.Body>
                    </Card>

                    {/* Sección: Observaciones */}
                    <Card className="mb-3">
                        <Card.Header>Observaciones</Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3" controlId="observaciones">
                                <Form.Label>Observaciones</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="observaciones"
                                    value={cotizacionData.observaciones}
                                    onChange={handleChange}
                                    placeholder="Cualquier observación adicional"
                                    disabled={isViewMode}
                                />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    {!isViewMode && (
                        <Button variant="primary" type="submit">
                            {cotizacion && cotizacion._id ? <FaEdit /> : <FaSave />} {/* Icono de editar o guardar según el estado */}
                        </Button>
                    )}
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CotizacionModal;
