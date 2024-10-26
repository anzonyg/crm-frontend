import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Pagination } from 'react-bootstrap';
import { getGestionPedidos, createGestionPedido, updateGestionPedido, deleteGestionPedido, getGestionPedidoById } from '../services/pedidoService';
import { FaEdit, FaTrash, FaPlus, FaEye, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import GestionPedidosModal from '../components/GestionPedidosModal';
import ExportModal from '../components/ExportModal';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Asegúrate de que esta librería esté instalada

// Importa las imágenes desde el directorio público (donde ya las tienes)
import logoDerecho from '../assets/logoDerecho.png';
import logoIzquierdo from '../assets/logoIzquierdo.png';

const GestionPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [filteredPedidos, setFilteredPedidos] = useState([]);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFilter, setExportFilter] = useState('all'); // Filtro de exportación

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
            console.error('Error al obtener los pedidos:', error.response?.data?.mensaje || error.message);
        }
    };

    const handleExportConfirm = (type, selectedFilter) => {
        let filtered = pedidos;
        if (selectedFilter !== 'all') {
            filtered = pedidos.filter((pedido) => pedido.estado === selectedFilter); // Filtrar según el estado seleccionado
        }
        if (type === 'excel') {
            exportToExcel(filtered);
        } else if (type === 'pdf') {
            exportToPDF(filtered, "Usuario");
        }
    };

    const exportToExcel = (filteredPedidos) => {
        const exportData = filteredPedidos.map(pedido => ({
            ...pedido,
            'Total Pedido': formatCurrency(pedido.totalPedido)
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos');
        XLSX.writeFile(workbook, 'pedidos.xlsx');
    };

    const exportToPDF = (filteredPedidos, usuario) => {
        const pdf = new jsPDF();

        // Usa las imágenes importadas
        pdf.addImage(logoIzquierdo, 'PNG', 10, 5, 30, 30); // Logo izquierdo
        pdf.addImage(logoDerecho, 'PNG', 170, 5, 30, 30); // Logo derecho

        pdf.setFontSize(12);
        pdf.text('CRM', 105, 10, { align: 'center' });
        pdf.text('UNIVERSIDAD MARIANO GALVEZ', 105, 20, { align: 'center' });

        const tableColumn = ["#", "Cliente", "Estado", "Prioridad", "Método de Entrega", "Fecha de Entrega", "Total"];
        const tableRows = [];
        let totalReporte = 0;

        filteredPedidos.forEach((pedido, index) => {
            const pedidoData = [
                index + 1,
                pedido.cliente,
                pedido.estado,
                pedido.prioridad,
                pedido.metodoEntrega,
                pedido.fechaEntrega ? new Date(pedido.fechaEntrega).toLocaleDateString() : 'Sin fecha',
                formatCurrency(pedido.totalPedido)
            ];
            tableRows.push(pedidoData);
            totalReporte += pedido.totalPedido;
        });

        pdf.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] },
            styles: { fontSize: 10, cellPadding: 4 },
            margin: { top: 10 },
        });

        pdf.setFontSize(12);
        pdf.text(`Total del Reporte: ${formatCurrency(totalReporte)}`, 14, pdf.lastAutoTable.finalY + 10);
        pdf.setFontSize(10);
        pdf.text(`Usuario: ${usuario}`, 14, pdf.lastAutoTable.finalY + 20);

        pdf.save('pedidos.pdf');
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
                const updatedPedido = await updateGestionPedido(selectedPedido._id, pedidoData);
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
                const newPedido = await createGestionPedido(pedidoData);
                setPedidos((prevPedidos) => [...prevPedidos, newPedido]);
                setFilteredPedidos((prevPedidos) => [...prevPedidos, newPedido]);
            }
            setShowModal(false);
            setSelectedPedido(null);
        } catch (error) {
            console.error('Error al guardar o actualizar el pedido:', error.response?.data?.mensaje || error.message);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPedido(null);
    };

    const handleEditClick = async (id) => {
        try {
            const pedidoData = await getGestionPedidoById(id);
            setSelectedPedido(pedidoData);
            setIsViewMode(false);
            setShowModal(true);
        } catch (error) {
            console.error('Error al obtener el pedido:', error.response?.data?.mensaje || error.message);
        }
    };

    const handleViewClick = async (id) => {
        try {
            const pedidoData = await getGestionPedidoById(id);
            setSelectedPedido(pedidoData);
            setIsViewMode(true);
            setShowModal(true);
        } catch (error) {
            console.error('Error al obtener el pedido:', error.response?.data?.mensaje || error.message);
        }
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
            try {
                await deleteGestionPedido(id);
                fetchPedidos();
            } catch (error) {
                console.error('Error al eliminar el pedido:', error.response?.data?.mensaje || error.message);
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
                La "Gestión de Pedidos" permite llevar un control detallado de los pedidos y sus productos.
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
                    <Button variant="success" className="ms-2" onClick={() => setShowExportModal(true)}>
                        <FaFileExcel /> Exportar
                    </Button>
                    <Button variant="danger" className="ms-2" onClick={() => setShowExportModal(true)}>
                        <FaFilePdf /> Exportar
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
                                <span className={`badge ${pedido.estado === 'Pendiente' ? 'bg-warning' : pedido.estado === 'Enviado' ? 'bg-primary' : 'bg-success'}`} style={{ padding: '5px', borderRadius: '5px' }}>
                                    {pedido.estado || 'Sin estado'}
                                </span>
                            </td>
                            <td>{pedido.prioridad || 'Sin prioridad'}</td>
                            <td>{pedido.metodoEntrega || 'Sin método'}</td>
                            <td>{pedido.fechaEntrega ? new Date(pedido.fechaEntrega).toLocaleDateString() : 'Sin fecha'}</td>
                            <td>{pedido.totalPedido && pedido.totalPedido > 0 ? formatCurrency(pedido.totalPedido) : 'Q0.00'}</td>
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
                    handleSubmit={handleSubmit}
                />
            )}

            <ExportModal
                show={showExportModal}
                handleClose={() => setShowExportModal(false)}
                handleExport={handleExportConfirm}
                setExportFilter={setExportFilter}
                exportFilter={exportFilter}
            />
        </Container>
    );
};

export default GestionPedidos;
