import { useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Badge } from 'react-bootstrap';
import { getReporteTickets } from '../services/ticketsSoporteService'; 
import { FaTimes, FaSave, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf'; // Solo una importación
import 'jspdf-autotable';
import logoUmg from '../assets/logo_umg.jpg';
import logoCrm from '../assets/logo_crm.jpg';

const ReporteCampanas = () => {
  const defaultForm = {
    correo: '',
    estado: '',
    prioridad: ''
  }

  const [form, setForm] = useState(defaultForm);
  const [tickets, setTickets] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmitInternal = async (e) => {
    e.preventDefault();
    const { correo, estado, prioridad } = form;

    let params = '';
    if (correo) params += `?correo=${correo}`;
    if (estado) params += `${params ? '&' : '?'}estado=${estado}`;
    if (prioridad) params += `${params ? '&' : '?'}prioridad=${prioridad}`;

    const response = await getReporteTickets(params);
    if (response?.data?.length) {
      setTickets(response.data);
    }
  };

  const handleLimpiar = () => {
    setForm(defaultForm);
    setTickets([]);
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No asignada';
    const date = new Date(dateString);
    return isNaN(date) ? 'No asignada' : date.toISOString().split('T')[0];
  };

  const renderBadge = (tipo, valor) => {
    switch (tipo) {
      case 'estado':
        // Renderiza las etiquetas de estado
        return <Badge bg={valor === 'Nuevo' ? 'info' : valor === 'En Progreso' ? 'success' : valor === 'Resuelto' ? 'warning' : 'danger'}>{valor}</Badge>;
      case 'prioridad':
        return <Badge bg={valor === 'Baja' ? 'info' : valor === 'Normal' ? 'success' : valor === 'Alta' ? 'warning' : 'danger'}>{valor}</Badge>;
      case 'agenteAsignado':
        return <Badge bg="secondary">{valor || 'Sin Asignar'}</Badge>;
      default:
        return <Badge bg="secondary">Desconocido</Badge>;
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tickets);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets');
    XLSX.writeFile(workbook, 'Tickets.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Función para convertir la imagen en Base64
    const getBase64Image = (imgPath, callback) => {
        const img = new Image();
        img.src = imgPath;
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/jpeg'); // Convierte a Base64
            callback(dataURL);
        };
    };

    // Convertir las imágenes a Base64 y agregarlas al PDF
    getBase64Image(logoCrm, (base64LogoCrm) => {
        getBase64Image(logoUmg, (base64LogoUmg) => {
            // Agregar el logo de CRM en la posición deseada (izquierda)
            doc.addImage(base64LogoCrm, 'JPEG', 165, 10, 30, 30); // (imagen, formato, x, y, ancho, alto)

            // Agregar el logo de UMG un poco a la derecha
            doc.addImage(base64LogoUmg, 'JPEG', 14, 10, 30, 30); // Ajusta las coordenadas si es necesario

            // Añadir el resto del contenido al PDF
            doc.setFontSize(18);
            doc.text("Reporte de Tickets", 14, 50);

            const fechaHora = new Date();
            const formattedDate = `${fechaHora.toLocaleDateString()} ${fechaHora.toLocaleTimeString()}`;
            doc.setFontSize(10);
            doc.text(`Fecha y Hora de Descarga: ${formattedDate}`, 14, 60);

            const nombreDescargador = "Cecilia Gonzalez"; // Cambia esto al nombre real o variable
            doc.text(`Descargado por: ${nombreDescargador}`, 14, 70);

            // Simulación de datos y creación de tabla
            const tableColumn = ["#", "Cliente", "Correo", "Asunto", "Estado", "Prioridad", "Agente Asignado"];
            const tableRows = tickets.map((ticket, index) => [
                index + 1,
                ticket.cliente || 'Sin cliente',
                ticket.correo || 'Sin correo',
                ticket.asunto || 'Sin asunto',
                ticket.estado,
                ticket.prioridad,
                ticket.agenteAsignado
            ]);

            // Crear la tabla en el PDF
            doc.autoTable(tableColumn, tableRows, { startY: 80 });

            // Guardar el archivo PDF
            doc.save("Tickets.pdf");
        });
    });
};

  return (
    <Container>
      <h1 className="mt-4">Reportería de Tickets de Soporte</h1>
      <Row className="mb-3">
        <Col className="d-flex justify-content-end">
          <Button variant="success" className="ms-2" onClick={exportToExcel}>
            <FaFileExcel />
          </Button>
          <Button variant="danger" className="ms-2" onClick={exportToPDF}>
            <FaFilePdf />
          </Button>
        </Col>
      </Row>
      <Form onSubmit={handleSubmitInternal}>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="correo">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                placeholder="Correo del cliente"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="estado">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={form.estado}
                onChange={handleChange}
              >
                <option value="">Seleccionar.....</option>
                <option value="Nuevo">Nuevo</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Resuelto">Resuelto</option>
                <option value="Rechazado">Rechazado</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="prioridad">
              <Form.Label>Prioridad</Form.Label>
              <Form.Select
                name="prioridad"
                value={form.prioridad}
                onChange={handleChange}
              >
                <option value="">Seleccionar.....</option>
                <option value="Baja">Baja</option>
                <option value="Normal">Normal</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <div>
          <Button variant="primary" type="submit">
            <FaSave /> Buscar
          </Button>
          <Button variant="secondary" className='mx-3' onClick={handleLimpiar}>
            <FaTimes /> Limpiar
          </Button>
        </div>
      </Form>
      {tickets.length ? (
        <section className='mt-5'>
          <Table striped bordered hover id="ticketTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Correo</th>
                <th>Asunto</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Agente Asignado</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, index) => (
                <tr key={ticket._id}>
                  <td>{index + 1}</td>
                  <td>{ticket.cliente || 'Sin cliente'}</td>
                  <td>{ticket.correo || 'Sin correo'}</td>
                  <td>{ticket.asunto || 'Sin asunto'}</td>
                  <td>{renderBadge('estado', ticket.estado)}</td>
                  <td>{renderBadge('prioridad', ticket.prioridad)}</td>
                  <td>{renderBadge('agenteAsignado', ticket.agenteAsignado)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>
      ) : null}
    </Container>
  );
}

export default ReporteCampanas;