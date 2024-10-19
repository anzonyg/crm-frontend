import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Pagination } from 'react-bootstrap';
import { getGestionPedidos, createGestionPedido, updateGestionPedido, deleteGestionPedido, getGestionPedidoById } from '../services/pedidoService';
import { FaEdit, FaTrash, FaPlus, FaEye, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import GestionPedidosModal from '../components/GestionPedidosModal';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const GestionPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [filteredPedidos, setFilteredPedidos] = useState([]);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        try {
            const pedidosData = await getGestionPedidos();
            if (Array.isArray(pedidosData)) {
                setPedidos(pedidosData);
                setFilteredPedidos(pedidosData);
            }
        } catch (error) {
            console.error('Error al obtener los pedidos:', error);
        }
    };

    const exportToExcel = () => {
        const exportData = filteredPedidos.map(pedido => ({
            ...pedido,
            'Total Pedido': formatCurrency(pedido.totalPedido)
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos');
        XLSX.writeFile(workbook, 'pedidos.xlsx');
    };

    const exportToPDF = () => {
        const input = document.getElementById('pedidosTable');
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
            pdf.save('pedidos.pdf');
        });
    };

    const handleSearchChange = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);
        const filtered = pedidos.filter((pedido) =>
            (pedido.cliente ? pedido.cliente.toLowerCase() : '').includes(searchValue) ||
            (pedido.estado ? pedido.estado.toLowerCase() : '').includes(searchValue) ||
            (pedido.prioridad ? pedido.prioridad.toLowerCase() : '').includes(searchValue) ||
            (pedido.metodoEntrega ? pedido.metodoEntrega.toLowerCase() : '').includes(searchValue)
        );
        setFilteredPedidos(filtered);
        setCurrentPage(1);
    };

    const handleSubmit = async (pedidoData) => {
        try {
            if (selectedPedido && selectedPedido._id) {
                // Editar pedido existente
                const updatedPedido = await updateGestionPedido(selectedPedido._id, pedidoData);
                console.log("Pedido actualizado:", updatedPedido);

                // Actualiza la lista local de pedidos y filteredPedidos
                setPedidos((prevPedidos) =>
                    prevPedidos.map((pedido) =>
                        pedido._id === updatedPedido._id ? updatedPedido : pedido
                    )
                );
                setFilteredPedidos((prevPedidos) =>
                    prevPedidos.map((pedido) =>
                        pedido._id === updatedPedido._id ? updatedPedido : pedido
                    )
                );
            } else {
                // Crear nuevo pedido
                const newPedido = await createGestionPedido(pedidoData);
                console.log("Nuevo pedido creado:", newPedido);

                // Añadir nuevo pedido a la lista
                setPedidos((prevPedidos) => [...prevPedidos, newPedido]);
                setFilteredPedidos((prevPedidos) => [...prevPedidos, newPedido]);
            }

            setShowModal(false); // Cierra el modal después de guardar
            setSelectedPedido(null); // Limpia el pedido seleccionado
        } catch (error) {
            console.error('Error al guardar o actualizar el pedido:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPedido(null);
    };

    const handleEditClick = async (id) => {
        try {
            const pedidoData = await getGestionPedidoById(id);
            console.log("Pedido para editar:", pedidoData);
            setSelectedPedido(pedidoData);
            setIsViewMode(false);
            setShowModal(true);
        } catch (error) {
            console.error('Error al obtener el pedido:', error);
        }
    };

    const handleViewClick = async (id) => {
        try {
            const pedidoData = await getGestionPedidoById(id);
            setSelectedPedido(pedidoData);
            setIsViewMode(true);
            setShowModal(true);
        } catch (error) {
            console.error('Error al obtener el pedido:', error);
        }
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
            try {
                await deleteGestionPedido(id);
                fetchPedidos(); // Vuelve a cargar los pedidos después de eliminar
            } catch (error) {
                console.error('Error al eliminar el pedido:', error);
            }
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(value);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPedidos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    return (
        <Container>
            <h1 className="mt-4">Gestión de Pedidos</h1>
            <p className="text-muted">
                La "Gestión de Pedidos" permite llevar un control detallado de los pedidos y sus productos. Gestionarlos correctamente ayuda a mejorar la eficiencia operativa.
            </p>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por cliente, estado, prioridad o método de entrega"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button variant="primary" onClick={() => { setSelectedPedido({}); setIsViewMode(false); setShowModal(true); }}>
                        <FaPlus /> Añadir Pedido
                    </Button>
                    <Button variant="success" className="ms-2" onClick={exportToExcel}>
                        <FaFileExcel />
                    </Button>
                    <Button variant="danger" className="ms-2" onClick={exportToPDF}>
                        <FaFilePdf />
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover id="pedidosTable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Cliente</th>
                        <th>Estado</th>
                        <th>Prioridad</th>
                        <th>Método de Entrega</th>
                        <th>Fecha de Entrega</th>
                        <th>Total</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((pedido, index) => (
                        <tr key={pedido._id}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{pedido.cliente || 'Sin cliente'}</td>
                            <td>
                                <span className="badge bg-info" style={{ padding: '5px', borderRadius: '5px' }}>
                                    {pedido.estado || 'Sin estado'}
                                </span>
                            </td>
                            <td>{pedido.prioridad || 'Sin prioridad'}</td>
                            <td>{pedido.metodoEntrega || 'Sin método'}</td>
                            <td>{pedido.fechaEntrega ? new Date(pedido.fechaEntrega).toLocaleDateString() : 'Sin fecha'}</td>
                            <td>{pedido.total && pedido.total > 0 ? formatCurrency(pedido.total) : 'Q0.00'}</td>
                            <td className="text-center">
                                <div className="d-flex justify-content-center">
                                    <Button variant="info" className="me-2" onClick={() => handleEditClick(pedido._id)}>
                                        <FaEdit />
                                    </Button>
                                    <Button variant="secondary" className="me-2" onClick={() => handleViewClick(pedido._id)}>
                                        <FaEye />
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDeleteClick(pedido._id)}>
                                        <FaTrash />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination>
                {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
            <Form.Group as={Row} className="mt-3">
                <Form.Label column sm={2}>Mostrar</Form.Label>
                <Col sm={2}>
                    <Form.Control as="select" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                    </Form.Control>
                </Col>
                <Form.Label column sm={2}>por página</Form.Label>
            </Form.Group>

            {showModal && (
                <GestionPedidosModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    pedido={selectedPedido}
                    isViewMode={isViewMode}
                    handleSubmit={handleSubmit} // Pasa la función al modal
                />
            )}
        </Container>
    );
};

export default GestionPedidos;
