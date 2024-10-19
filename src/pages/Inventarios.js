import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Badge, Pagination } from 'react-bootstrap';
import { getInventarios, createInventario, updateInventario, getInventarioById } from '../services/inventarioService.js';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import InventarioModal from '../components/InventarioModal';

import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Para manejar tablas automáticamente

const Inventarios = () => {
  const [inventarios, setInventarios] = useState([]);
  const [filteredInventarios, setFilteredInventarios] = useState([]);
  const [selectedInventario, setSelectedInventario] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleGenerateReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Reporte de Inventarios', 14, 22);

    const tableColumn = ["ID Producto", "Nombre", "Proveedor", "Precio", "Unidades Disponibles", "Estado"];
    const tableRows = [];

    currentItems.forEach(inventario => {
      const inventarioData = [
        inventario.IDProducto || 'Sin ID',
        inventario.NombreProducto || 'Sin nombre',
        inventario.Proveedor || 'Sin proveedor',
        inventario.Precio || 'Sin precio',
        inventario.UnidadesDisponibles || 'Sin unidades',
        inventario.EstadoProducto || 'Sin estado',
      ];
      tableRows.push(inventarioData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 30 });
    doc.save('reporte_inventarios.pdf');
  };

  const fetchInventarios = async () => {
    try {
      const response = await getInventarios();
      console.log(response.data);
      setInventarios(response.data);
      setFilteredInventarios(response.data);
    } catch (error) {
      console.error("Error al obtener los inventarios:", error);
    }
  };

  useEffect(() => {
    fetchInventarios();
  }, []);

  const handleAddClick = () => {
    setSelectedInventario({});
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleEditClick = async (id) => {
    const response = await getInventarioById(id);
    setSelectedInventario(response.data);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleViewClick = async (id) => {
    const response = await getInventarioById(id);
    setSelectedInventario(response.data);
    setIsViewMode(true);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setSelectedInventario({ ...selectedInventario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (selectedInventario._id) {
      await updateInventario(selectedInventario._id, selectedInventario);
    } else {
      await createInventario(selectedInventario);
    }
    setShowModal(false);
    fetchInventarios();
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = inventarios.filter((inventario) =>
      (inventario.NombreProducto ? inventario.NombreProducto.toLowerCase() : '').includes(searchValue) ||
      (inventario.Proveedor ? inventario.Proveedor.toLowerCase() : '').includes(searchValue) ||
      (inventario.EstadoProducto ? inventario.EstadoProducto.toLowerCase() : '').includes(searchValue)
    );

    setFilteredInventarios(filtered);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  // Logic for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventarios.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredInventarios.length / itemsPerPage);

  return (
    <Container>
      <h1 className="mt-4">Inventarios</h1>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre, proveedor o estado"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
        <Col className="d-flex justify-content-end">
          <Button variant="success" onClick={handleGenerateReport} className="me-2">
            Generar Reporte
          </Button>
          <Button variant="primary" onClick={handleAddClick}>
            <FaPlus /> Añadir Inventario
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>ID Producto</th>
            <th>Nombre</th>
            <th>Proveedor</th>
            <th>Precio</th>
            <th>Unidades Disponibles</th>
            <th>Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((inventario, index) => (
            <tr key={inventario._id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{inventario.IDProducto || 'Sin ID'}</td>
              <td>{inventario.NombreProducto || 'Sin nombre'}</td>
              <td>{inventario.Proveedor || 'Sin proveedor'}</td>
              <td>{inventario.Precio || 'Sin precio'}</td>
              <td>{inventario.UnidadesDisponibles || 'Sin unidades'}</td>
              <td>{inventario.EstadoProducto || 'Sin estado'}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center">
                  <Button variant="info" className="me-2" onClick={() => handleEditClick(inventario._id)}>
                    <FaEdit />
                  </Button>
                  <Button variant="secondary" className="me-2" onClick={() => handleViewClick(inventario._id)}>
                    <FaEye />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Paginación */}
      <Row className="mt-4 align-items-center">
        <Col className="d-flex justify-content-center">
          <Pagination>
            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        </Col>
        <Col md={3} className="d-flex justify-content-end">
          <Form.Select value={itemsPerPage} onChange={handleItemsPerPageChange}>
            <option value="10">10 por página</option>
            <option value="20">20 por página</option>
            <option value="30">30 por página</option>
          </Form.Select>
        </Col>
      </Row>

      <InventarioModal
        show={showModal}
        handleClose={handleClose}
        inventario={selectedInventario}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isViewMode={isViewMode}
      />
    </Container>
  );
};

export default Inventarios;
