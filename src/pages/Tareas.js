import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Pagination } from 'react-bootstrap';
import { getTareas, createTarea, updateTarea, deleteTarea, getTareaById } from '../services/tareaService';
import { FaEdit, FaTrash, FaPlus, FaEye, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import TareaModal from '../components/TareaModal';
import * as XLSX from 'xlsx';  // Librería para exportar Excel
import jsPDF from 'jspdf';  // Librería para exportar PDF
import html2canvas from 'html2canvas';  // Para capturar HTML y exportarlo a PDF

const Tareas = () => {
    const [tareas, setTareas] = useState([]);
    const [filteredTareas, setFilteredTareas] = useState([]);
    const [selectedTarea, setSelectedTarea] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Obtener las tareas al montar el componente
    useEffect(() => {
        fetchTareas();
    }, []);

    // Obtener las tareas desde el backend
    const fetchTareas = async () => {
        try {
            const tareasData = await getTareas();
            if (Array.isArray(tareasData)) {
                setTareas(tareasData);
                setFilteredTareas(tareasData);
            }
        } catch (error) {
            console.error('Error al obtener las tareas:', error);
        }
    };

    // Función para exportar a Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredTareas);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tareas');
        XLSX.writeFile(workbook, 'tareas.xlsx');
    };

    // Función para exportar a PDF
    const exportToPDF = () => {
        const input = document.getElementById('tareasTable');
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
            pdf.save('tareas.pdf');
        });
    };

    // Filtrado de tareas
    const handleSearchChange = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);
        const filtered = tareas.filter((tarea) =>
            (tarea.titulo ? tarea.titulo.toLowerCase() : '').includes(searchValue) ||
            (tarea.responsable ? tarea.responsable.toLowerCase() : '').includes(searchValue) ||
            (tarea.estado ? tarea.estado.toLowerCase() : '').includes(searchValue)
        );
        setFilteredTareas(filtered);
        setCurrentPage(1);  // Reiniciar a la primera página después del filtro
    };

    // Guardar o actualizar tarea
    const handleSubmit = async () => {
        try {
            if (selectedTarea._id) {
                await updateTarea(selectedTarea._id, selectedTarea);
            } else {
                await createTarea(selectedTarea);
            }
            setShowModal(false);
            fetchTareas();  // Recargar tareas después de actualizar/crear
        } catch (error) {
            console.error('Error al guardar o actualizar la tarea:', error);
        }
    };

    // Cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        fetchTareas();
    };

    // Editar tarea
    const handleEditClick = async (id) => {
        try {
            const tareaData = await getTareaById(id);
            setSelectedTarea(tareaData);
            setIsViewMode(false);
            setShowModal(true);
        } catch (error) {
            console.error('Error al obtener la tarea:', error);
        }
    };

    // Ver tarea
    const handleViewClick = async (id) => {
        try {
            const tareaData = await getTareaById(id);
            setSelectedTarea(tareaData);
            setIsViewMode(true);
            setShowModal(true);
        } catch (error) {
            console.error('Error al obtener la tarea:', error);
        }
    };

    // Eliminar tarea
    const handleDeleteClick = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
            try {
                await deleteTarea(id);
                fetchTareas();
            } catch (error) {
                console.error('Error al eliminar la tarea:', error);
            }
        }
    };

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTareas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTareas.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    return (
        <Container>
            <h1 className="mt-4">Gestión de Tareas</h1>
            <p className="text-muted">
                La "Gestión de Tareas" permite llevar un control de las tareas asignadas y su estado. Gestionarlas correctamente ayuda a mejorar el flujo de trabajo.
            </p>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por título, responsable o estado"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button variant="primary" onClick={() => { setSelectedTarea({}); setIsViewMode(false); setShowModal(true); }}>
                        <FaPlus /> Añadir Tarea
                    </Button>
                    <Button variant="success" className="ms-2" onClick={exportToExcel}>
                        <FaFileExcel />
                    </Button>
                    <Button variant="danger" className="ms-2" onClick={exportToPDF}>
                        <FaFilePdf />
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover id="tareasTable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Título</th>
                        <th>Responsable</th>
                        <th>Estado</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((tarea, index) => (
                        <tr key={tarea._id}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{tarea.titulo || 'Sin título'}</td>
                            <td>{tarea.responsable || 'Sin responsable'}</td>
                            <td>
                                <span className="badge bg-info" style={{ padding: '5px', borderRadius: '5px' }}>
                                    {tarea.estado || 'Sin estado'}
                                </span>
                            </td>
                            <td className="text-center">
                                <div className="d-flex justify-content-center">
                                    <Button variant="info" className="me-2" onClick={() => handleEditClick(tarea._id)}>
                                        <FaEdit />
                                    </Button>
                                    <Button variant="secondary" className="me-2" onClick={() => handleViewClick(tarea._id)}>
                                        <FaEye />
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDeleteClick(tarea._id)}>
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

            <TareaModal
                show={showModal}
                handleClose={handleCloseModal}
                tarea={selectedTarea}
                isViewMode={isViewMode}
                handleSubmit={handleSubmit}
            />
        </Container>
    );
};

export default Tareas;
