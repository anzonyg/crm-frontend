import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FaTimes, FaSave, FaEdit } from 'react-icons/fa'; // Importamos los iconos necesarios

const ProyectoModal = ({ show, handleClose, proyecto, handleChange, handleSubmit, isViewMode }) => {
  const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    handleSubmit();
  };

  const modalTitle = isViewMode ? 'Ver Proyecto' : (proyecto._id ? 'Editar Proyecto' : 'Crear Proyecto');
  const modalHeaderClass = isViewMode ? 'bg-secondary text-white' : (proyecto._id ? 'bg-info text-black' : 'bg-primary text-white');

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Form onSubmit={handleSubmitForm}>
        <Modal.Header closeButton className={modalHeaderClass}>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={4}> {/* Cambiado a 4 para un campo más pequeño */}
              <Form.Group className="mb-3" controlId="nombreProyecto">
                <Form.Label>Nombre del Proyecto</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreProyecto"
                  value={proyecto.nombreProyecto || ''}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre del proyecto"
                  disabled={isViewMode}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}> {/* Cambiado a 4 para un campo más pequeño */}
              <Form.Group className="mb-3" controlId="cliente">
                <Form.Label>Cliente</Form.Label>
                <Form.Control
                  type="text"
                  name="cliente"
                  value={proyecto.cliente || ''}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre del cliente"
                  disabled={isViewMode}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}> {/* Cambiado a 4 para un campo más pequeño */}
              <Form.Group className="mb-3" controlId="ingresosEstimados">
                <Form.Label>Ingresos Estimados</Form.Label>
                <Form.Control
                  type="number"
                  name="ingresosEstimados"
                  value={proyecto.ingresosEstimados || ''}
                  onChange={handleChange}
                  placeholder="Ingrese los ingresos estimados"
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
                  value={proyecto.fechaInicio ? new Date(proyecto.fechaInicio).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  placeholder="Seleccione la fecha de inicio"
                  disabled={isViewMode}
                  max={today} // No permite seleccionar una fecha mayor a hoy
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="fechaCierreEstimada">
                <Form.Label>Fecha de Cierre Estimada</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaCierreEstimada"
                  value={proyecto.fechaCierreEstimada ? new Date(proyecto.fechaCierreEstimada).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  placeholder="Seleccione la fecha de cierre"
                  disabled={isViewMode}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3" controlId="estadoProyecto">
                <Form.Label>Estado del Proyecto</Form.Label>
                <Form.Select
                  name="estadoProyecto"
                  value={proyecto.estadoProyecto || ''}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                >
                  <option value="">Seleccione un estado</option>
                  <option value="Nuevo">Nuevo</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3" controlId="notasComentarios">
            <Form.Label>Notas y Comentarios</Form.Label>
            <Form.Control
              as="textarea"
              rows={4} // Aumentado el tamaño del textarea
              name="notasComentarios"
              value={proyecto.notasComentarios || ''}
              onChange={handleChange}
              placeholder="Añadir cualquier comentario relevante sobre el proyecto"
              disabled={isViewMode}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <FaTimes /> {/* Icono para cerrar */}
          </Button>
          {!isViewMode && (
            <Button variant="primary" type="submit">
              {proyecto._id ? <FaEdit /> : <FaSave />} {/* Icono de editar o guardar según el estado */}
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProyectoModal;
