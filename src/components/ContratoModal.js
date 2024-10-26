import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FaTimes, FaSave, FaEdit } from 'react-icons/fa'; // Importamos los iconos necesarios

const ContratoModal = ({ show, handleClose, contrato, handleChange, handleSubmit, isViewMode }) => {
  const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    // Validaciones adicionales antes de enviar el formulario
    if (!validateEmail(contrato.correoElectronico)) {
      alert("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    if (new Date(contrato.fechaContacto) > new Date()) {
      alert("La fecha de contacto no puede ser mayor a la fecha de hoy.");
      return;
    }

    handleSubmit();
  };

  const modalTitle = isViewMode ? 'Ver Contrato' : (contrato._id ? 'Editar Contrato' : 'Crear Contrato');
  const modalHeaderClass = isViewMode ? 'bg-secondary text-white' : (contrato._id ? 'bg-info text-black' : 'bg-primary text-white');

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Form onSubmit={handleSubmitForm}>
        <Modal.Header closeButton className={modalHeaderClass}>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="nombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={contrato.nombre || ''}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre del contrato"
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
                  value={contrato.empresa || ''}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre de la empresa"
                  disabled={isViewMode}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="correoElectronico">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="correoElectronico"
                  value={contrato.correoElectronico || ''}
                  onChange={handleChange}
                  placeholder="ejemplo@dominio.com"
                  disabled={isViewMode}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="telefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="tel"
                  name="telefono"
                  value={contrato.telefono || ''}
                  onChange={handleChange}
                  placeholder="Ingrese el número de teléfono"
                  disabled={isViewMode}
                  pattern="[0-9]{8,}" // Ejemplo: mínimo 8 dígitos
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="fechaContacto">
                <Form.Label>Fecha de Inicio de Contrato</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaContacto"
                  value={contrato.fechaContacto ? new Date(contrato.fechaContacto).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  placeholder="Seleccione la fecha de Inicio del contrato"
                  disabled={isViewMode}
                  max={today} // No permite seleccionar una fecha mayor a hoy
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="fechaSeguimiento">
                <Form.Label>Fecha de Cierre</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaSeguimiento"
                  value={contrato.fechaSeguimiento ? new Date(contrato.fechaSeguimiento).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  placeholder="Seleccione la fecha de Cierre"
                  disabled={isViewMode}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="fuenteContrato">
                <Form.Label>Fuente del Contrato</Form.Label>
                <Form.Control
                  type="text"
                  name="fuenteContrato"
                  value={contrato.fuenteContrato || ''}
                  onChange={handleChange}
                  placeholder="¿Cómo llegó este contrato?"
                  disabled={isViewMode}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="estadoContrato">
                <Form.Label>Estado del Contrato</Form.Label>
                <Form.Select
                  name="estadoContrato"
                  value={contrato.estadoContrato || ''}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                >
                  <option value="">Seleccione un estado</option>
                  <option value="Nuevo">Nuevo</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Contactado">Contactado</option>
                  <option value="Cerrado">Cerrado</option>
                  <option value="Renovacion">Renovacion</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3" controlId="interes">
                <Form.Label>Interés</Form.Label>
                <Form.Select
                  name="interes"
                  value={contrato.interes || ''}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                >
                  <option value="">Seleccione un nivel de interés</option>
                  <option value="Bajo">Bajo</option>
                  <option value="Medio">Medio</option>
                  <option value="Alto">Alto</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3" controlId="notasComentarios">
            <Form.Label>Notas y Comentarios</Form.Label>
            <Form.Control
              as="textarea"
              rows={5} // Aumenté el tamaño del textarea
              name="notasComentarios"
              value={contrato.notasComentarios || ''}
              onChange={handleChange}
              placeholder="Añadir cualquier comentario relevante sobre el contrato"
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
              {contrato._id ? <FaEdit /> : <FaSave />} {/* Icono de editar o guardar según el estado */}
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ContratoModal;
