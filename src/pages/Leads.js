import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Badge, Pagination } from 'react-bootstrap';
import { getLeads, createLead, updateLead, getLeadById, deleteLead } from '../services/leadService'; 
import { FaEdit, FaTrash, FaPlus, FaEye, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import LeadModal from '../components/LeadModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx'; 
import { saveAs } from 'file-saver'; 
import logoCrm from '../assets/logo_crm.jpg'; 
import logoUmg from '../assets/logo_umg.jpg'; 

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchLeads = async () => {
    try {
      const response = await getLeads();
      setLeads(response.data);
      setFilteredLeads(response.data);
    } catch (error) {
      console.error("Error al obtener los leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAddClick = () => {
    setSelectedLead({});
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleEditClick = async (id) => {
    const response = await getLeadById(id);
    setSelectedLead(response.data);
    setIsViewMode(false);
    setShowModal(true);
  };

  const handleViewClick = async (id) => {
    const response = await getLeadById(id);
    setSelectedLead(response.data);
    setIsViewMode(true);
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este lead?")) {
      try {
        await deleteLead(id);
        fetchLeads(); 
      } catch (error) {
        console.error("Error al eliminar el lead:", error);
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setSelectedLead({ ...selectedLead, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (selectedLead._id) {
      await updateLead(selectedLead._id, selectedLead);
    } else {
      await createLead(selectedLead);
    }
    setShowModal(false);
    fetchLeads();
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = leads.filter((lead) =>
      (lead.nombre ? lead.nombre.toLowerCase() : '').includes(searchValue) ||
      (lead.empresa ? lead.empresa.toLowerCase() : '').includes(searchValue) ||
      (lead.correoElectronico ? lead.correoElectronico.toLowerCase() : '').includes(searchValue) ||
      (lead.telefono ? lead.telefono.toLowerCase() : '').includes(searchValue) ||
      (lead.estadoLead ? lead.estadoLead.toLowerCase() : '').includes(searchValue)
    );

    setFilteredLeads(filtered);
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
    setCurrentPage(1); 
  };

  const renderBadge = (estadoLead) => {
    switch (estadoLead) {
      case 'Nuevo':
        return <Badge bg="primary">Nuevo</Badge>;
      case 'En Proceso':
        return <Badge bg="warning">En Proceso</Badge>;
      case 'Contactado':
        return <Badge bg="success">Contactado</Badge>;
      case 'Calificado':
        return <Badge bg="info">Calificado</Badge>;
      case 'Descartado':
        return <Badge bg="danger">Descartado</Badge>;
      default:
        return <Badge bg="secondary">Desconocido</Badge>;
    }
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    
    doc.addImage(logoCrm, 'PNG', 10, 10, 40, 20);
    doc.addImage(logoUmg, 'PNG', 160, 10, 40, 20);

    doc.setFontSize(20);
    doc.text('Leads', 105, 30, { align: 'center' });

    const tableColumn = ["Nombre", "Empresa", "Correo Electrónico", "Teléfono", "Estado", "Fecha de Seguimiento"];
    const tableRows = [];

    currentItems.forEach(lead => {
      const leadData = [
        lead.nombre || 'Sin nombre',
        lead.empresa || 'Sin empresa',
        lead.correoElectronico || 'Sin correo',
        lead.telefono || 'Sin teléfono',
        lead.estadoLead || 'Sin estado',
        formatDate(lead.fechaSeguimiento),
      ];
      tableRows.push(leadData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 40 });
    doc.save('reporte_leads.pdf');
  };

  const handleGenerateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLeads.map(lead => ({
      Nombre: lead.nombre || 'Sin nombre',
      Empresa: lead.empresa || 'Sin empresa',
      'Correo Electrónico': lead.correoElectronico || 'Sin correo',
      Teléfono: lead.telefono || 'Sin teléfono',
      Estado: lead.estadoLead || 'Sin estado',
      'Fecha de Seguimiento': formatDate(lead.fechaSeguimiento),
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

    XLSX.writeFile(workbook, 'reporte_leads.xlsx');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  return (
    <Container>
      <h1 className="mt-4">Leads</h1>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre, empresa, correo, teléfono o estado"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
        <Col className="d-flex justify-content-end">
          <Button variant="success" onClick={handleGenerateReport} className="me-2">
            <FaFilePdf />
          </Button>
          <Button variant="info" onClick={handleGenerateExcel} className="me-2">
            <FaFileExcel />
          </Button>
          <Button variant="primary" onClick={handleAddClick}>
            <FaPlus /> Añadir Lead
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Empresa</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Fecha de Seguimiento</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((lead, index) => (
            <tr key={lead._id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{lead.nombre || 'Sin nombre'}</td>
              <td>{lead.empresa || 'Sin empresa'}</td>
              <td>{lead.correoElectronico || 'Sin correo'}</td>
              <td>{lead.telefono || 'Sin teléfono'}</td>
              <td>{renderBadge(lead.estadoLead)}</td>
              <td>{formatDate(lead.fechaSeguimiento)}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center">
                  <Button variant="info" className="me-2" onClick={() => handleEditClick(lead._id)}>
                    <FaEdit />
                  </Button>
                  <Button variant="secondary" className="me-2" onClick={() => handleViewClick(lead._id)}>
                    <FaEye />
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteClick(lead._id)}>
                    <FaTrash />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
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

      <LeadModal
        show={showModal}
        handleClose={handleClose}
        lead={selectedLead}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isViewMode={isViewMode}
      />
    </Container>
  );
};

export default Leads;
