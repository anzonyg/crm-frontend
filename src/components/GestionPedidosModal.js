import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Table } from 'react-bootstrap';
import { FaTimes, FaSave, FaPlus, FaTrash } from 'react-icons/fa';

const GestionPedidosModal = ({ show, handleClose, pedido, isViewMode, handleSubmit }) => {
    const [pedidoData, setPedidoData] = useState({
        cliente: '',
        metodoEntrega: '',
        direccionEntrega: '',
        fechaEntrega: '',
        estado: '',
        prioridad: '',
        observaciones: '',
        productos: [],
        total: 0
    });

    const [productoInput, setProductoInput] = useState({
        nombre: '',
        cantidad: '',
        precio: '',
        total: '',
        estado: 'Pendiente'
    });

    useEffect(() => {
        if (pedido) {
            const totalPedido = (Array.isArray(pedido.productos) ? pedido.productos : []).reduce(
                (acc, prod) => acc + (prod.total || 0),
                0
            );

            setPedidoData({
                ...pedido,
                productos: pedido.productos || [],
                total: totalPedido
            });
        }
    }, [pedido]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPedidoData({
            ...pedidoData,
            [name]: value
        });
    };

    const handleProductoChange = (e) => {
        const { name, value } = e.target;
        const updatedProducto = {
            ...productoInput,
            [name]: value
        };

        if (name === 'cantidad' || name === 'precio') {
            const cantidad = parseFloat(updatedProducto.cantidad) || 0;
            const precio = parseFloat(updatedProducto.precio) || 0;
            updatedProducto.total = (cantidad * precio).toFixed(2);
        }

        setProductoInput(updatedProducto);
    };

    const handleAddProducto = () => {
        if (productoInput.nombre && productoInput.cantidad && productoInput.precio && productoInput.total) {
            const updatedProductos = [...pedidoData.productos, {
                ...productoInput,
                cantidad: parseFloat(productoInput.cantidad),
                precio: parseFloat(productoInput.precio),
                total: parseFloat(productoInput.total),
                estado: productoInput.estado
            }];

            const totalPedido = updatedProductos.reduce((acc, prod) => acc + parseFloat(prod.total), 0);

            setPedidoData((prevData) => ({
                ...prevData,
                productos: updatedProductos,
                total: totalPedido
            }));

            setProductoInput({ nombre: '', cantidad: '', precio: '', total: '', estado: 'Pendiente' });
        } else {
            alert('Por favor complete todos los campos para el producto.');
        }
    };

    const handleDeleteProducto = (index) => {
        const updatedProductos = pedidoData.productos.filter((_, i) => i !== index);
        const totalPedido = updatedProductos.reduce((acc, prod) => acc + parseFloat(prod.total), 0);

        setPedidoData({
            ...pedidoData,
            productos: updatedProductos,
            total: totalPedido
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Verificar si todos los campos obligatorios están completos
        if (!pedidoData.cliente || !pedidoData.metodoEntrega || !pedidoData.direccionEntrega ||
            !pedidoData.fechaEntrega || !pedidoData.estado || !pedidoData.prioridad || pedidoData.productos.length === 0) {
            alert('Por favor complete todos los campos obligatorios.');
            return;
        }

        // Calcular el total del pedido sumando los totales de todos los productos
        const totalPedido = pedidoData.productos.reduce((acc, prod) => acc + prod.total, 0);

        // Asignar el totalPedido al pedidoData
        const pedidoConTotal = {
            ...pedidoData,
            totalPedido: totalPedido  // Aseguramos que el totalPedido se envía al backend
        };

        // Log para verificar qué se está enviando
        console.log('Datos que se envían con totalPedido:', pedidoConTotal);

        handleSubmit(pedidoConTotal);
    };

    const modalTitle = pedido && pedido._id ? 'Editar Pedido' : 'Crear Pedido';
    const modalClass = pedido ? 'bg-info text-black' : 'bg-primary text-white';

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Form onSubmit={handleFormSubmit}>
                <Modal.Header closeButton className={modalClass}>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Información del Pedido</h5>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="cliente">
                                <Form.Label>Cliente</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cliente"
                                    value={pedidoData.cliente || ''}
                                    onChange={handleChange}
                                    placeholder="Nombre del cliente"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="metodoEntrega">
                                <Form.Label>Método de Entrega</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="metodoEntrega"
                                    value={pedidoData.metodoEntrega || ''}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    required
                                >
                                    <option value="">Seleccionar Método de Entrega</option>
                                    <option value="Domicilio">Domicilio</option>
                                    <option value="Recoger en Tienda">Recoger en Tienda</option>
                                    <option value="Mensajería">Mensajería</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="direccionEntrega">
                                <Form.Label>Dirección de Entrega</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="direccionEntrega"
                                    value={pedidoData.direccionEntrega || ''}
                                    onChange={handleChange}
                                    placeholder="Dirección de entrega"
                                    disabled={isViewMode}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="fechaEntrega">
                                <Form.Label>Fecha de Entrega</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fechaEntrega"
                                    value={pedidoData.fechaEntrega ? pedidoData.fechaEntrega.split("T")[0] : ''}
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
                                    value={pedidoData.estado || ''}
                                    onChange={handleChange}
                                    disabled={isViewMode}
                                    required
                                >
                                    <option value="">Seleccionar Estado</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Enviado">Enviado</option>
                                    <option value="Entregado">Entregado</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="prioridad">
                                <Form.Label>Prioridad</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="prioridad"
                                    value={pedidoData.prioridad || ''}
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
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3" controlId="observaciones">
                                <Form.Label>Observaciones</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="observaciones"
                                    value={pedidoData.observaciones || ''}
                                    onChange={handleChange}
                                    placeholder="Observaciones del pedido"
                                    disabled={isViewMode}
                                    rows={3}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <h5>Productos</h5>
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="productoNombre">
                                <Form.Label>Nombre del Producto</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={productoInput.nombre || ''}
                                    onChange={handleProductoChange}
                                    placeholder="Nombre del producto"
                                    disabled={isViewMode}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group className="mb-3" controlId="productoCantidad">
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="cantidad"
                                    value={productoInput.cantidad || ''}
                                    onChange={handleProductoChange}
                                    placeholder="Cantidad"
                                    disabled={isViewMode}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group className="mb-3" controlId="productoPrecio">
                                <Form.Label>Precio (GTQ)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="precio"
                                    value={productoInput.precio || ''}
                                    onChange={handleProductoChange}
                                    placeholder="Precio"
                                    disabled={isViewMode}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group className="mb-3" controlId="productoTotal">
                                <Form.Label>Total (GTQ)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="total"
                                    value={formatCurrency(productoInput.total)}
                                    placeholder="Total"
                                    disabled
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group className="mb-3" controlId="productoEstado">
                                <Form.Label>Estado del Producto</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="estado"
                                    value={productoInput.estado || 'Pendiente'}
                                    onChange={handleProductoChange}
                                    disabled={isViewMode}
                                    required
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Completado">Completado</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Button onClick={handleAddProducto} disabled={!productoInput.nombre || !productoInput.cantidad || !productoInput.precio || isViewMode}>
                                <FaPlus />
                            </Button>
                        </Col>
                    </Row>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                                <th>Precio (GTQ)</th>
                                <th>Total (GTQ)</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidoData.productos.map((producto, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.cantidad}</td>
                                    <td>{formatCurrency(producto.precio)}</td>
                                    <td>{formatCurrency(producto.total)}</td>
                                    <td>{producto.estado}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleDeleteProducto(index)}>
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <h5>Total Pedido: {formatCurrency(pedidoData.total)}</h5>
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

export default GestionPedidosModal;
