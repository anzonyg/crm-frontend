import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FaTimes, FaSave, FaEdit } from 'react-icons/fa'; // Importamos los iconos necesarios

const InventarioModal = ({ show, handleClose, inventario, handleChange, handleSubmit, isViewMode }) => {
  const handleSubmitForm = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  const modalTitle = isViewMode ? 'Ver Inventario' : (inventario._id ? 'Editar Inventario' : 'Crear Inventario');
  const modalHeaderClass = isViewMode ? 'bg-secondary text-white' : (inventario._id ? 'bg-info text-black' : 'bg-primary text-white');

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Form onSubmit={handleSubmitForm}>
        <Modal.Header closeButton className={modalHeaderClass}>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={4}> {/* Cambiado a 4 para un campo más pequeño */}
              <Form.Group className="mb-3" controlId="IDProducto">
                <Form.Label>ID Producto</Form.Label>
                <Form.Control
                  type="text"
                  name="IDProducto"
                  value={inventario.IDProducto || ''}
                  onChange={handleChange}
                  placeholder="Ingrese el ID del producto"
                  disabled={isViewMode}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}> {/* Cambiado a 4 para un campo más pequeño */}
              <Form.Group className="mb-3" controlId="NombreProducto">
                <Form.Label>Nombre Producto</Form.Label>
                <Form.Control
                  type="text"
                  name="NombreProducto"
                  value={inventario.NombreProducto || ''}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre del producto"
                  disabled={isViewMode}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}> {/* Cambiado a 4 para un campo más pequeño */}
              <Form.Group className="mb-3" controlId="Proveedor">
                <Form.Label>Proveedor</Form.Label>
                <Form.Control
                  type="text"
                  name="Proveedor"
                  value={inventario.Proveedor || ''}
                  onChange={handleChange}
                  placeholder="Ingrese el proveedor"
                  disabled={isViewMode}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="Precio">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  name="Precio"
                  value={inventario.Precio || ''}
                  onChange={handleChange}
                  placeholder="Ingrese el precio"
                  disabled={isViewMode}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="UnidadesDisponibles">
                <Form.Label>Unidades Disponibles</Form.Label>
                <Form.Control
                  type="number"
                  name="UnidadesDisponibles"
                  value={inventario.UnidadesDisponibles || ''}
                  onChange={handleChange}
                  placeholder="Ingrese las unidades disponibles"
                  disabled={isViewMode}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}> {/* Aumentado a 12 para ocupar todo el ancho */}
              <Form.Group className="mb-3" controlId="EstadoProducto">
                <Form.Label>Estado del Producto</Form.Label>
                <Form.Select
                  name="EstadoProducto"
                  value={inventario.EstadoProducto || ''}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                >
                  <option value="">Seleccione un estado</option>
                  <option value="Disponible">Disponible</option>
                  <option value="Agotado">Agotado</option>
                  <option value="Pendiente">Pendiente</option>
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
              {inventario._id ? <FaEdit /> : <FaSave />} {/* Icono de editar o guardar según el estado */}
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default InventarioModal;
