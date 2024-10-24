import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const FiltrosCotizaciones = ({ onFiltrar }) => {
  const [empresa, setEmpresa] = useState('');
  const [fechaCreacion, setFechaCreacion] = useState('');
  const [estado, setEstado] = useState('');
  const [producto, setProducto] = useState('');

  const handleFiltrar = () => {
    const filtros = {
      empresa,
      fechaCreacion,
      estado,
      producto,
    };
    onFiltrar(filtros);
  };

  return (
    <Form>
      <Row>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Empresa</Form.Label>
            <Form.Control
              type="text"
              placeholder="Buscar por empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Fecha de Creación</Form.Label>
            <Form.Control
              type="date"
              value={fechaCreacion}
              onChange={(e) => setFechaCreacion(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Estado</Form.Label>
            <Form.Control
              as="select"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="">Seleccionar estado</option>
              <option value="pendiente">Pendiente</option>
              <option value="aprobada">Aceptada</option>
              <option value="desaprobada">Rechazada</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Producto</Form.Label>
            <Form.Control
              type="text"
              placeholder="Buscar por producto"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Button variant="primary" onClick={handleFiltrar} className="mt-3">
        Buscar
      </Button>
    </Form>
  );
};

export default FiltrosCotizaciones;
