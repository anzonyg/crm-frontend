import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup, Table } from 'react-bootstrap';
import { FaTimes, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { updateCampanas, createCampanas } from '../services/campanasService';

const CampanasModal = ({ show, handleClose, campanas, isViewMode }) => {

  const defaultCampana = {
    nombre: '',
    estado: '',
    tipo: '',
    producto: [],
    fechaCreacion: '',
    fechaInicio: '',
    fechaEstimacionCierre: '',
    publicoObjetivo: '',
    patrocinador: [],
    asignadoA: '',
    presupuesto: '',
    costeReal: '',
    estimacionVentas: '',
    ventasTotales: '',
    descripcion: '',
  }

  const [campanasData, setCampanasData] = useState(defaultCampana);
  const [productoInput, setProductoInput] = useState('');
  const [patrocinadorInput, setPatrocinadorInput] = useState('');

  useEffect(() => {
    if (campanas) {
      setCampanasData({
        ...campanas,
        producto: campanas.producto || [],
        patrocinador: campanas.patrocinador || [],
      });
    } else {
      setCampanasData(defaultCampana);
    }
  }, [campanas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampanasData({
      ...campanasData,
      [name]: value,
    });
  };

  const handleAddProducto = () => {
    if (productoInput.trim()) {
      setCampanasData((prevData) => ({
        ...prevData,
        producto: [...prevData.producto, productoInput.trim()],
      }));
      setProductoInput('');
    }
  };

  const handleDeleteProducto = (index) => {
    const updatedProducto = campanasData.producto.filter((_, i) => i !== index);
    setCampanasData({ ...campanasData, producto: updatedProducto });
  };

  const handleAddPatrocinador = () => {
    if (patrocinadorInput.trim()) {
      setCampanasData((prevData) => ({
        ...prevData,
        patrocinador: [...prevData.patrocinador, patrocinadorInput.trim()],
      }));
      setPatrocinadorInput('');
    }
  };

  const handleDeletePatrocinador = (index) => {
    const updatedPatrocinador = campanasData.patrocinador.filter((_, i) => i !== index);
    setCampanasData({ ...campanasData, patrocinador: updatedPatrocinador });
  };

  const handleSubmitInternal = (e) => {
    e.preventDefault();

    const finalCampanasData = {
      ...campanasData,
      producto: [...campanasData.producto],
      patrocinador: [...campanasData.patrocinador],
    };

    if (!campanasData.estado) {
      finalCampanasData.estado = "Planificada";
    }

    if (!campanasData.tipo) {
      finalCampanasData.tipo = "Correo Electronico";
    }

    if (!campanasData.publicoObjetivo) {
      finalCampanasData.publicoObjetivo = "Clientes Actuales";
    }

    if (!campanasData.asignadoA) {
      finalCampanasData.asignadoA = "Jair Carrera";
    }

    if (campanas && campanas._id) {
      updateCampanas(campanas._id, finalCampanasData)
        .then(() => handleClose())
        .catch(error => console.error("Error:", error));
    } else {
      createCampanas(finalCampanasData)
        .then(() => handleClose())
        .catch(error => console.error("Error:", error));
    }

    setCampanasData(defaultCampana);
  };

  const modalTitle = isViewMode ? 'Ver Campaña' : (campanas && campanas._id ? 'Editar Campaña' : 'Crear Campaña');
  const modalHeaderClass = isViewMode ? 'bg-secondary text-white' : (campanas && campanas._id ? 'bg-info text-black' : 'bg-primary text-white');

  return (
    <Modal show={show} onHide={handleClose} className="custom-modal">
      <Form onSubmit={handleSubmitInternal}>
        <Modal.Header closeButton className={modalHeaderClass}>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Información básica de la campaña */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="nombre">
                <Form.Label>Nombre de la Campaña</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={campanasData.nombre}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre"
                  disabled={isViewMode}
                  required
                  style={{ width: '200px' }} 
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  name="estado"
                  value={campanasData.estado}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                  style={{ width: '125px' }} 
                >
                  <option value="Planificada">Planificada</option>
                  <option value="Activa">Activa</option>
                  <option value="Finalizada">Finalizada</option>
                  <option value="Cancelada">Cancelada</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="tipo">
                <Form.Label>Tipo</Form.Label>
                <Form.Select
                  name="tipo"
                  value={campanasData.tipo}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                  style={{ width: '180px' }} 
                >
                  <option value="Correo Electronico">Correo Electrónico</option>
                  <option value="Redes Sociales">Redes Sociales</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Feria">Feria</option>
                  <option value="Evento">Evento</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="publicoObjetivo">
                <Form.Label>Público Objetivo</Form.Label>
                <Form.Select
                  name="publicoObjetivo"
                  value={campanasData.publicoObjetivo}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                  style={{ width: '170px' }} 
                >
                  <option value="Clientes Actuales">Clientes Actuales</option>
                  <option value="Clientes VIP">Clientes VIP</option>
                  <option value="Nuevos Clientes">Nuevos Clientes</option>
                  <option value="Leads">Leads</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="asignadoA">
                <Form.Label>Asignado A</Form.Label>
                <Form.Select
                  name="asignadoA"
                  value={campanasData.asignadoA} 
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                  style={{ width: '170px' }} 
                >
                  <option value="Jair Carrera">Jair Carrera</option>
                  <option value="Anzony Gonzalez">Anzony Gonzalez</option>
                  <option value="Cecilia Gonzalez">Cecilia Gonzalez</option>
                  <option value="Fredy Hi">Fredy Hi</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="presupuesto">
                <Form.Label>Presupuesto</Form.Label>
                <Form.Control
                  type="text"
                  name="presupuesto"
                  value={campanasData.presupuesto ? `Q. ${campanasData.presupuesto}` : ''} 
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/[^0-9]/g, ''); // Solo números
                    handleChange({ target: { name: 'presupuesto', value: newValue } });
                  }}
                  placeholder="Q."
                  disabled={isViewMode}
                  required
                  style={{ width: '150px' }} 
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="costeReal">
                <Form.Label>Coste Real</Form.Label>
                <Form.Control
                  type="text"
                  name="costeReal"
                  value={campanasData.presupuesto ? `Q. ${campanasData.presupuesto}` : ''}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/[^0-9]/g, ''); // Solo números
                    handleChange({ target: { name: 'costeReal', value: newValue } });
                  }}
                  placeholder="Q."
                  disabled={isViewMode}
                  required
                  style={{ width: '150px' }} 
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="ventasTotales">
                <Form.Label>Ventas Totales</Form.Label>
                <Form.Control
                  type="text"
                  name="ventasTotales"
                  value={campanasData.ventasTotales ? `Q. ${campanasData.ventasTotales}` : ''} 
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/[^0-9]/g, ''); // Solo números
                    handleChange({ target: { name: 'ventasTotales', value: newValue } });
                  }}
                  placeholder="Q."
                  disabled={isViewMode}
                  required
                  style={{ width: '150px' }} 
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
                  style={{ width: '130px' }} // Ajuste de tamaño
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="fechaInicio">
                <Form.Label>  Fecha de Inicio</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaInicio"
                  value={campanasData.fechaInicio ? new Date(campanasData.fechaInicio).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                  style={{ width: '130px' }} // Ajuste de tamaño
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="fechaEstimacionCierre">
                <Form.Label>Estimación Cierre</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaEstimacionCierre"
                  value={campanasData.fechaEstimacionCierre ? new Date(campanasData.fechaEstimacionCierre).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                  style={{ width: '130px' }} // Ajuste de tamaño
                />
              </Form.Group>
            </Col>
            </Row>

          {/* Productos */}
          <h5>Productos</h5>
          <Form.Group className="mb-3">
            <Form.Label>Productos</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre del producto"
                value={productoInput}
                onChange={(e) => setProductoInput(e.target.value)}
                disabled={isViewMode}
              />
              <Button variant="outline-secondary" onClick={handleAddProducto} disabled={isViewMode}>
                <FaPlus />
              </Button>
            </InputGroup>
            <Table striped bordered hover className="mt-2">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {campanasData.producto.map((producto, index) => (
                  <tr key={index}>
                    <td>{producto}</td>
                    <td>
                      <Button variant="outline-danger" onClick={() => handleDeleteProducto(index)} disabled={isViewMode}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Form.Group>

          {/* Patrocinadores */}
          <h5>Patrocinadores</h5>
          <Form.Group className="mb-3">
            <Form.Label>Patrocinadores</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre del patrocinador"
                value={patrocinadorInput}
                onChange={(e) => setPatrocinadorInput(e.target.value)}
                disabled={isViewMode}
              />
              <Button variant="outline-secondary" onClick={handleAddPatrocinador} disabled={isViewMode}>
                <FaPlus />
              </Button>
            </InputGroup>
            <Table striped bordered hover className="mt-2">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {campanasData.patrocinador.map((patrocinador, index) => (
                  <tr key={index}>
                    <td>{patrocinador}</td>
                    <td>
                      <Button variant="outline-danger" onClick={() => handleDeletePatrocinador(index)} disabled={isViewMode}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Form.Group>

          {/* Descripción */}
          <h5>Descripción</h5>
          <Form.Group className="mb-3" controlId="descripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={campanasData.descripcion}
              onChange={handleChange}
              disabled={isViewMode}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isViewMode}>
            <FaTimes /> Cerrar
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

export default CampanasModal;

