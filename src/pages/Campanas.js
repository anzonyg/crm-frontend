import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Pagination, Badge, InputGroup } from 'react-bootstrap';
import { getCampanas, createCampanas, updateCampanas, getCampanasById, deleteCampanas } from '../services/campanasService';  // Actualizar la importación
import { FaEdit, FaTrash, FaPlus, FaEye, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import CampanasModal from '../components/CampanasModal';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Campanas = () => {

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

  const [campanas, setCampanas] = useState([]);
  const [filteredCampanas, setFilteredCampanas] = useState([]);
  const [selectedCampanas, setSelectedCampanas] = useState(defaultCampana);
  const [showModal, setShowModal] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [productoInput, setProductoInput] = useState('');
  const [patrocinadorInput, setPatrocinadorInput] = useState('');

  const fetchCampanas = async () => {
    try {
      const response = await getCampanas();
      setCampanas(response.data);
      setFilteredCampanas(response.data);
    } catch (error) {
      console.error("Error al obtener las campañas:", error);
    }
  };

  useEffect(() => {
    fetchCampanas();
  }, []);

  const handleAddClick = () => {
    setSelectedCampanas(defaultCampana);
    setIsViewMode(false);
    setShowModal(true);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredCampanas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Campanas');
    XLSX.writeFile(workbook, 'Campanas.xlsx');
  };

  const exportToPDF = () => {
    const input = document.getElementById('campanasTable'); // Asegúrate que este elemento exista
    if (!input) {
      console.error('Elemento con el ID "campanastTable" no encontrado.');
      return;
    }

    // Ocultar las columnas de acciones
    const actionElements = document.querySelectorAll('.action-column');
    actionElements.forEach(el => el.classList.add('hide-for-pdf'));

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190; // Ajusta el ancho según sea necesario
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Agregar un encabezado
      pdf.setFontSize(18);
      pdf.text('Reporte de Campañas', 10, 10);

      pdf.addImage(imgData, 'PNG', 5, 20, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('Campanas.pdf');

    }).finally(() => {
      // Vuelve a mostrar las columnas de acciones después de generar el PDF
      actionElements.forEach(el => el.classList.remove('hide-for-pdf'));
    });
  };

  const handleEditClick = async (id) => {
    const response = await getCampanasById(id);
    setSelectedCampanas(response.data);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleViewClick = async (id) => {
    const response = await getCampanasById(id);
    setSelectedCampanas(response.data);
    setIsViewMode(true);
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Está seguro que desea eliminar la campaña?, si la elimina esto no se puede revertir.")) {
      const response = await deleteCampanas(id);
      await fetchCampanas();
    }

  };

  const handleChange = (e) => {
    setSelectedCampanas({ ...selectedCampanas, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (selectedCampanas._id) {
      await updateCampanas(selectedCampanas._id, selectedCampanas);
    } else {
      await createCampanas(selectedCampanas);
    }
    setShowModal(false);
    fetchCampanas();
  };

  const handleClose = async () => {
    setShowModal(false);
    await fetchCampanas();
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = campanas.filter((campana) =>
      (campana.nombre ? campana.nombre.toLowerCase() : '').includes(searchValue) ||
      (campana.estado ? campana.estado.toLowerCase() : '').includes(searchValue) ||
      (campana.tipo ? campana.tipo.toLowerCase() : '').includes(searchValue)
    );    

    setFilteredCampanas(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No asignada';
    const date = new Date(dateString);
    return isNaN(date) ? 'No asignada' : date.toISOString().split('T')[0];
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);  // Reset to the first page when items per page changes
  };

  // Logic for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCampanas.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredCampanas.length / itemsPerPage);

  const renderBadge = (tipo, valor) => {
    switch (tipo) {
      case 'estado':
        switch (valor) {
          case 'Planificada':
            return <Badge bg="info">Planificada</Badge>;
          case 'Activa':
            return <Badge bg="success">Activa</Badge>;
          case 'Finalizada':
            return <Badge bg="warning">Finalizada</Badge>;
          case 'Cancelada':
            return <Badge bg="danger">Cancelada</Badge>;
          default:
            return <Badge bg="secondary">Desconocido</Badge>;
        }
      case 'tipo':
        switch (valor) {
          case 'Correo Electronico':
            return <Badge bg="info">Correo Electronico</Badge>;
          case 'Redes Sociales':
            return <Badge bg="success">Redes Sociales</Badge>;
          case 'Webinar':
            return <Badge bg="warning">Webinar</Badge>;
          case 'Feria':
            return <Badge bg="danger">Feria</Badge>;
          case 'Evento':
            return <Badge bg="danger">Evento</Badge>;
          default:
            return <Badge bg="secondary">Desconocido</Badge>;
        }
      case 'publicoObjetivo':
        switch (valor) {
          case 'Clientes Actuales':
            return <Badge bg="info">Clientes Actuales</Badge>;
          case 'Clientes VIP':
            return <Badge bg="success">Clientes VIP</Badge>;
          case 'Nuevos Clientes':
            return <Badge bg="warning">Nuevos Clientes</Badge>;
          case 'Leads':
            return <Badge bg="danger">Leads</Badge>;
          default:
            return <Badge bg="secondary">Desconocido</Badge>;
        }
      case 'asignadoA':
        // Puedes agregar los nombres directamente aquí
        switch (valor) {
          case 'Jair Carrera':
            return <Badge bg="secondary">Jair Carrera</Badge>;
          case 'Anzony Gonzalez':
            return <Badge bg="secondary">Anzony Gonzalez</Badge>;
          case 'Cecilia Gonzalez':
            return <Badge bg="secondary">Cecilia Gonzalez</Badge>;
          case 'Fredy Hi':
            return <Badge bg="secondary">Fredy Hi</Badge>;
          default:
            return <Badge bg="secondary">Sin Asignar</Badge>;
        }
      default:
        return <Badge bg="secondary">Desconocido</Badge>;
    }
  };

  return (
    <Container>
      <h1 className="mt-4">Gestión de Campañas</h1>
      <p className="text-muted">
        Las "Campañas" permiten gestionar los diferentes eventos y promociones que se llevan a cabo para promover productos o servicios. Administrarlas adecuadamente ayuda a optimizar los recursos y a medir el éxito de las iniciativas.
      </p>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre, estado, tipo o producto"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
        <Col className="d-flex justify-content-end">
          <Button variant="primary" onClick={handleAddClick}>
            <FaPlus /> Añadir Campaña
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover id="campanasTable">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Tipo</th>
            <th>Fecha Estimación Cierre</th>
            <th>Asignado a</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((campanas, index) => (
            <tr key={campanas._id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{campanas.nombre || 'Sin nombre'}</td>
              <td>{renderBadge('estado', campanas.estado)}</td>
              <td>{renderBadge('tipo', campanas.tipo)}</td>
              <td>{formatDate(campanas.fechaEstimacionCierre)}</td>
              <td>{renderBadge('asignadoA', campanas.asignadoA)}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center">
                  <Button variant="info" className="me-2" onClick={() => handleEditClick(campanas._id)}>
                    <FaEdit />
                  </Button>
                  <Button variant="secondary" className="me-2" onClick={() => handleViewClick(campanas._id)}>
                    <FaEye />
                  </Button>
                  <Button variant="danger" className="me-2" onClick={() => handleDeleteClick(campanas._id)}>
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

      <CampanasModal
        show={showModal}
        handleClose={handleClose}
        campanas={selectedCampanas}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isViewMode={isViewMode}
      />
    </Container>
  );
};

export default Campanas;