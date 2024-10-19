import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Pagination } from 'react-bootstrap';
import { getTareas, createTarea, updateTarea, deleteTarea, getTareaById } from '../services/tareaService';
import { FaEdit, FaTrash, FaPlus, FaEye, FaFileExcel, FaFilePdf } from 'react-icons/fa'; // Iconos para exportar
import TareaModal from '../components/TareaModal';
import * as XLSX from 'xlsx'; // Librería para exportar Excel
import jsPDF from 'jspdf'; // Librería para exportar PDF
import html2canvas from 'html2canvas'; // Para capturar HTML y exportarlo a PDF

const Tareas = () => {
    const [tareas, setTareas] = useState([]);
    const [filteredTareas, setFilteredTareas] = useState([]);
    const [selectedTarea, setSelectedTarea] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Número de elementos por página

    useEffect(() => {
        fetchTareas();  // Cargamos las tareas al montar el componente
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
        const worksheet = XLSX.utils.json_to_sheet(filteredTareas);  // Convertimos las tareas filtradas a Excel
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tareas');
        XLSX.writeFile(workbook, 'tareas.xlsx');  // Guardamos el archivo Excel
    };

    // Función para exportar a PDF
    const exportToPDF = () => {
        const input = document.getElementById('tareasTable');  // Capturamos la tabla por su ID
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
            pdf.save('tareas.pdf');  // Guardamos el archivo PDF
        });
    };

    // Función para asignar clase según estado
    const getBadgeClass = (estado) => {
        switch (estado) {
            case 'Pendiente':
                return 'badge bg-warning text-dark'; // Amarillo para Pendiente
            case 'Completada':
                return 'badge bg-success'; // Verde para Completada
            case 'Sin estado':
                return 'badge bg-secondary'; // Gris para Sin estado
            default:
                return 'badge bg-secondary'; // Default
        }
    };

    // Filtrado de tareas según el término de búsqueda
    const handleSearchChange = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);
        const filtered = tareas.filter((tarea) =>
            (tarea.titulo ? tarea.titulo.toLowerCase() : '').includes(searchValue) ||
            (tarea.responsable ? tarea.responsable.toLowerCase() : '').includes(searchValue) ||
            (tarea.estado ? tarea.estado.toLowerCase() : '').includes(searchValue)
        );
        setFilteredTareas(filtered);
        setCurrentPage(1); // Reiniciar a la primera página después del filtro
    };

    // Guardar o actualizar la tarea
    const handleSubmit = async () => {
        if (selectedTarea._id) {
            await updateTarea(selectedTarea._id, selectedTarea);
        } else {
            await createTarea(selectedTarea);
        }
        setShowModal(false);
        fetchTareas();  // Recargamos las tareas después de actualizar/crear
    };

    const handleCloseModal = () => {
        setShowModal(false);
        fetchTareas(); // Recargar la lista de tareas después de cerrar el modal
    };

    // Editar tarea seleccionada
    const handleEditClick = async (id) => {
        const tareaData = await getTareaById(id);
        setSelectedTarea(tareaData);
        setIsViewMode(false);
        setShowModal(true);
    };

    // Ver tarea seleccionada
    const handleViewClick = async (id) => {
        const tareaData = await getTareaById(id);
        setSelectedTarea(tareaData);
        setIsViewMode(true);
        setShowModal(true);
    };

    // Eliminar tarea seleccionada
    const handleDeleteClick = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
            await deleteTarea(id);
            fetchTareas(); // Recargar la lista después de eliminar
        }
    };

    // Paginación - Cambiar la página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Paginación - Obtener los elementos de la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTareas.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredTareas.length / itemsPerPage);

    // Cambio en el número de elementos por página
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reiniciar a la primera página
    };

    return (
        <Container>
            <h1 className="mt-4">Gestión de Tareas</h1>
            <p className="text-muted">
                La "Gestión de Tareas" permite llevar un control de las actividades asignadas a diferentes responsables. Gestionarlas correctamente ayuda a mejorar la eficiencia y el seguimiento de los procesos.
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
                        <FaFileExcel /> {/* Ícono para exportar a Excel */}
                    </Button>
                    <Button variant="danger" className="ms-2" onClick={exportToPDF}>
                        <FaFilePdf /> {/* Ícono para exportar a PDF */}
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover id="tareasTable"> {/* Agregamos ID para exportar a PDF */}
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Título</th>
                        <th>Responsable</th>
                        <th>Estado</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th className="text-center">Acciones</th> {/* Aquí está la columna de acciones */}
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((tarea, index) => (
                        <tr key={tarea._id}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{tarea.titulo || 'Sin título'}</td>
                            <td>{tarea.responsable || 'Sin responsable'}</td>
                            <td>
                                <span className={getBadgeClass(tarea.estado)} style={{ padding: '5px', borderRadius: '5px' }}>
                                    {tarea.estado || 'Sin estado'}
                                </span>
                            </td>
                            <td>{tarea.fechaInicio || 'No asignada'}</td>
                            <td>{tarea.fechaFin || 'No asignada'}</td>
                            <td className="text-center"> {/* Columna de Acciones */}
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
