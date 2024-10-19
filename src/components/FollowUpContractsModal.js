import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FaTimes, FaSave, FaEdit } from 'react-icons/fa';

const FollowUpContractsModal = ({ show, handleClose, contrato, handleChange, handleSubmit, isViewMode }) => {
  const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!validateEmail(contrato.correoElectronico)) {
      alert("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    if (new Date(contrato.fechaContactoInicial) > new Date()) {
      alert("La fecha de contacto no puede ser mayor a la fecha de hoy.");
      return;
    }

    handleSubmit();
  };

  const modalTitle = isViewMode ? 'Ver Seguimiento' : (contrato._id ? 'Editar Seguimiento' : 'Crear Seguimiento');
  const modalHeaderClass = isViewMode ? 'bg-secondary text-white' : (contrato._id ? 'bg-info text-black' : 'bg-primary text-white');

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
                  value={contrato.nombre || ''}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre"
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
                  pattern="[0-9]{8,}"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="fechaContactoInicial">
                <Form.Label>Fecha de Contacto Inicial</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaContactoInicial"
                  value={contrato.fechaContactoInicial ? new Date(contrato.fechaContactoInicial).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  placeholder="Seleccione la fecha de contacto inicial"
                  disabled={isViewMode}
                  max={today}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="fechaSeguimiento">
                <Form.Label>Fecha de Seguimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaSeguimiento"
                  value={contrato.fechaSeguimiento ? new Date(contrato.fechaSeguimiento).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  placeholder="Seleccione la fecha de seguimiento"
                  disabled={isViewMode}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="razon">
                <Form.Label>Razón</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="razon"
                  value={contrato.razon || ''}
                  onChange={handleChange}
                  placeholder="Escriba la razón"
                  disabled={isViewMode}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="soluciones">
                <Form.Label>Soluciones</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="soluciones"
                  value={contrato.soluciones || ''}
                  onChange={handleChange}
                  placeholder="Escriba las soluciones"
                  disabled={isViewMode}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <FaTimes />
          </Button>
          {!isViewMode && (
            <Button variant="primary" type="submit">
              {contrato._id ? <FaEdit /> : <FaSave />}
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FollowUpContractsModal;
