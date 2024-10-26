import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FaSave, FaEdit } from 'react-icons/fa'; // Importamos los iconos necesarios

const LeadModal = ({ show, handleClose, lead, handleChange, handleSubmit, isViewMode }) => {
  const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    // Validaciones adicionales antes de enviar el formulario
    if (!validateEmail(lead.correoElectronico)) {
      alert("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    if (new Date(lead.fechaContacto) > new Date()) {
      alert("La fecha de contacto no puede ser mayor a la fecha de hoy.");
      return;
    }

    handleSubmit();
  };

  const modalTitle = isViewMode ? 'Ver Lead' : (lead._id ? 'Editar Lead' : 'Crear Lead');
  const modalHeaderClass = isViewMode ? 'bg-secondary text-white' : (lead._id ? 'bg-info text-black' : 'bg-primary text-white');

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Form onSubmit={handleSubmitForm}>
        <Modal.Header closeButton className={modalHeaderClass}>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="nombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={lead.nombre || ''}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre del lead"
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
                  value={lead.empresa || ''}
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
                  value={lead.correoElectronico || ''}
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
                  value={lead.telefono || ''}
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
                <Form.Label>Fecha de Contacto</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaContacto"
                  value={lead.fechaContacto ? new Date(lead.fechaContacto).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  placeholder="Seleccione la fecha de contacto"
                  disabled={isViewMode}
                  max={today} // No permite seleccionar una fecha mayor a hoy
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="fechaSeguimiento">
                <Form.Label>Fecha de Seguimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaSeguimiento"
                  value={lead.fechaSeguimiento ? new Date(lead.fechaSeguimiento).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  placeholder="Seleccione la fecha de seguimiento"
                  disabled={isViewMode}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="fuenteLead">
                <Form.Label>Fuente del Lead</Form.Label>
                <Form.Control
                  type="text"
                  name="fuenteLead"
                  value={lead.fuenteLead || ''}
                  onChange={handleChange}
                  placeholder="¿Cómo llegó este lead?"
                  disabled={isViewMode}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="estadoLead">
                <Form.Label>Estado del Lead</Form.Label>
                <Form.Select
                  name="estadoLead"
                  value={lead.estadoLead || ''}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                >
                  <option value="">Seleccione un estado</option>
                  <option value="Nuevo">Nuevo</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Contactado">Contactado</option>
                  <option value="Calificado">Calificado</option>
                  <option value="Descartado">Descartado</option>
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
                  value={lead.interes || ''}
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
              rows={3}
              name="notasComentarios"
              value={lead.notasComentarios || ''}
              onChange={handleChange}
              placeholder="Añadir cualquier comentario relevante sobre el lead"
              disabled={isViewMode}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          
          {!isViewMode && (
            <Button variant="primary" type="submit">
              {lead._id ? <FaEdit /> : <FaSave />} {/* Icono de editar o guardar según el estado */}
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default LeadModal;
