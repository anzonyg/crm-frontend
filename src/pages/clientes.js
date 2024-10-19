import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Pagination } from 'react-bootstrap';
import { getClientes, createCliente, updateCliente, deleteCliente, getClienteById } from '../services/clienteService';
import { FaEdit, FaTrash, FaPlus, FaEye, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import ClienteModal from '../components/ClienteModal';
import * as XLSX from 'xlsx';  // Librería para exportar Excel
import jsPDF from 'jspdf';  // Librería para exportar PDF
import html2canvas from 'html2canvas';  // Para capturar HTML y exportarlo a PDF

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Obtener los clientes al montar el componente
    useEffect(() => {
        fetchClientes();
    }, []);

    // Obtener los clientes desde el backend
    const fetchClientes = async () => {
        try {
            const clientesData = await getClientes();
            if (Array.isArray(clientesData)) {
                setClientes(clientesData);
                setFilteredClientes(clientesData);
            }
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
        }
    };

    // Función para exportar a Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredClientes);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');
        XLSX.writeFile(workbook, 'clientes.xlsx');
    };

    // Función para exportar a PDF
    const exportToPDF = () => {
        const input = document.getElementById('clientesTable');
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 200;
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 5, 5, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save('clientes.pdf');
        });
    };

    // Filtrado de clientes
    const handleSearchChange = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);
        const filtered = clientes.filter((cliente) =>
            (cliente.nombre ? cliente.nombre.toLowerCase() : '').includes(searchValue) ||
            (cliente.empresa ? cliente.empresa.toLowerCase() : '').includes(searchValue) ||
            (cliente.estado ? cliente.estado.toLowerCase() : '').includes(searchValue)
        );
        setFilteredClientes(filtered);
        setCurrentPage(1);  // Reiniciar a la primera página después del filtro
    };

    // Guardar o actualizar cliente
    const handleSubmit = async () => {
        try {
            if (selectedCliente._id) {
                await updateCliente(selectedCliente._id, selectedCliente);
            } else {
                await createCliente(selectedCliente);
            }
            setShowModal(false);
            fetchClientes();  // Recargar clientes después de actualizar/crear
        } catch (error) {
            console.error('Error al guardar o actualizar el cliente:', error);
        }
    };

    // Cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        fetchClientes();
    };

    // Editar cliente
    const handleEditClick = async (id) => {
        try {
            const clienteData = await getClienteById(id);
            setSelectedCliente(clienteData);
            setIsViewMode(false);
            setShowModal(true);
        } catch (error) {
            console.error('Error al obtener el cliente:', error);
        }
    };

    // Ver cliente
    const handleViewClick = async (id) => {
        try {
            const clienteData = await getClienteById(id);
            setSelectedCliente(clienteData);
            setIsViewMode(true);
            setShowModal(true);
        } catch (error) {
            console.error('Error al obtener el cliente:', error);
        }
    };

    // Eliminar cliente
    const handleDeleteClick = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            try {
                await deleteCliente(id);
                fetchClientes();
            } catch (error) {
                console.error('Error al eliminar el cliente:', error);
            }
        }
    };

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredClientes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    return (
        <Container>
            <h1 className="mt-4">Gestión de Clientes</h1>
            <p className="text-muted">
                La "Gestión de Clientes" permite llevar un control de los clientes y sus contactos. Gestionarlos correctamente ayuda a mejorar las relaciones comerciales.
            </p>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre, empresa o estado"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button variant="primary" onClick={() => { setSelectedCliente({}); setIsViewMode(false); setShowModal(true); }}>
                        <FaPlus /> Añadir Cliente
                    </Button>
                    <Button variant="success" className="ms-2" onClick={exportToExcel}>
                        <FaFileExcel />
                    </Button>
                    <Button variant="danger" className="ms-2" onClick={exportToPDF}>
                        <FaFilePdf />
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover id="clientesTable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Empresa</th>
                        <th>Estado</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((cliente, index) => (
                        <tr key={cliente._id}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{cliente.nombre || 'Sin nombre'}</td>
                            <td>{cliente.empresa || 'Sin empresa'}</td>
                            <td>
                                <span className="badge bg-info" style={{ padding: '5px', borderRadius: '5px' }}>
                                    {cliente.estado || 'Sin estado'}
                                </span>
                            </td>
                            <td>{cliente.correo || 'Sin correo'}</td>
                            <td>{cliente.telefono || 'Sin teléfono'}</td>
                            <td className="text-center">
                                <div className="d-flex justify-content-center">
                                    <Button variant="info" className="me-2" onClick={() => handleEditClick(cliente._id)}>
                                        <FaEdit />
                                    </Button>
                                    <Button variant="secondary" className="me-2" onClick={() => handleViewClick(cliente._id)}>
                                        <FaEye />
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDeleteClick(cliente._id)}>
                                        <FaTrash />
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

            <ClienteModal
                show={showModal}
                handleClose={handleCloseModal}
                cliente={selectedCliente}
                isViewMode={isViewMode}
                handleSubmit={handleSubmit}
            />
        </Container>
    );
};

export default Clientes;
