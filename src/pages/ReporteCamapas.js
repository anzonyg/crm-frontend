import { useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Badge } from 'react-bootstrap';
import { getReporteCampanas } from '../services/campanasService';  
import { FaTimes, FaSave, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logoUmg from '../assets/logo_umg.jpg';
import logoCrm from '../assets/logo_crm.jpg';

const ReporteCampanas = () => {
  const defaultForm = {
    estado: '',
    tipo: '',
    publicoObjetivo: '',
    fechaCreacion: ''
  }

  const [form, setForm] = useState(defaultForm)
  const [campanas, setCampanas] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmitInternal = async (e) => {
    e.preventDefault();
    const { estado, tipo, publicoObjetivo, fechaCreacion } = form;

    let params = ''
    if (!!estado) {
      params += `?estado=${estado}`
    }
    if (!!tipo) {
      const concat = (params) ? '&' : '?';
      params += `${concat}tipo=${tipo}`;
    }
    if (!!publicoObjetivo) {
      const concat = (params) ? '&' : '?';
      params += `${concat}publicoObjetivo=${publicoObjetivo}`;
    }
    if (!!fechaCreacion) {
      const concat = (params) ? '&' : '?';
      params += `${concat}fechaCreacion=${fechaCreacion}`;
    }

    const response = await getReporteCampanas(params);
    response?.data?.length && setCampanas(response.data);
  };

  const handleLimpiar = () => {
    setForm(defaultForm);
    setCampanas([]);
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No asignada';
    const date = new Date(dateString);
    return isNaN(date) ? 'No asignada' : date.toISOString().split('T')[0];
  };

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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(campanas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Campanas');
    XLSX.writeFile(workbook, 'Campanas.xlsx');
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

    // Convertir ambas imágenes a Base64 y agregarlas al PDF
    getBase64Image(logoUmg, (base64LogoUmg) => {
        getBase64Image(logoCrm, (base64LogoCrm) => {
            // Agregar el logo de UMG a la izquierda
            doc.addImage(base64LogoUmg, 'JPEG', 14, 10, 30, 30);

            // Agregar el logo de CRM a la derecha del logo UMG
            doc.addImage(base64LogoCrm, 'JPEG', 165, 10, 30, 30);

            // Añadir el título del PDF y otros detalles
            doc.setFontSize(18);
            doc.text("Reporte de Campañas", 14, 50);

            const fechaHora = new Date();
            const formattedDate = `${fechaHora.toLocaleDateString()} ${fechaHora.toLocaleTimeString()}`;
            doc.setFontSize(10);
            doc.text(`Fecha y Hora de Descarga: ${formattedDate}`, 14, 60);

            const nombreDescargador = "Cecilia Gonzalez"; // Cambia esto al nombre real o variable
            doc.text(`Descargado por: ${nombreDescargador}`, 14, 70);

            // Crear la tabla de campañas
            const tableColumn = [
                "#", "Nombre", "Estado", "Tipo", "Público Objetivo", "Asignado a", "Fecha Creación"
            ];
            const tableRows = campanas.map((campana, index) => [
                index + 1,
                campana.nombre || 'Sin nombre',
                campana.estado,
                campana.tipo,
                campana.publicoObjetivo,
                campana.asignadoA,
                formatDate(campana.fechaCreacion)
            ]);

            // Insertar la tabla en el PDF
            doc.autoTable(tableColumn, tableRows, { startY: 80 });

            // Guardar el archivo PDF
            doc.save("Campanas.pdf");
        });
    });
};

  return (
    <Container>
      <h1 className="mt-4">Reportería de Campañas</h1>
      <p className="text-muted">
        La "Reportería de Campañas" permite al usuario buscar y ver campañas por estado, tipo y público objetivo.
      </p>
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
          <Col md={3}>
            <Form.Group className="mb-3" controlId="estado">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                disabled={false}
              >
                <option value="">Seleccionar.....</option>
                <option value="Planificada">Planificada</option>
                <option value="Activa">Activa</option>
                <option value="Finalizada">Finalizada</option>
                <option value="Cancelada">Cancelada</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3" controlId="tipo">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                disabled={false}
              >
                <option value="">Seleccionar.....</option>
                <option value="Correo Electronico">Correo Electrónico</option>
                <option value="Redes Sociales">Redes Sociales</option>
                <option value="Webinar">Webinar</option>
                <option value="Feria">Feria</option>
                <option value="Evento">Evento</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3" controlId="publicoObjetivo">
              <Form.Label>Público Objetivo</Form.Label>
              <Form.Select
                name="publicoObjetivo"
                value={form.publicoObjetivo}
                onChange={handleChange}
                disabled={false}
              >
                <option value="">Seleccionar.....</option>
                <option value="Clientes Actuales">Clientes Actuales</option>
                <option value="Clientes VIP">Clientes VIP</option>
                <option value="Nuevos Clientes">Nuevos Clientes</option>
                <option value="Leads">Leads</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3" controlId="fechaCreacion">
              <Form.Label>Fecha de Creación</Form.Label>
              <Form.Control
                type="date"
                name="fechaCreacion"
                value={form.fechaCreacion ? new Date(form.fechaCreacion).toISOString().split('T')[0] : ''}
                onChange={handleChange}
                disabled={false}
              />
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
      {campanas.length ?
        <section className='mt-5'>
          <Table striped bordered hover id="campanasTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Tipo</th>
                <th>Público Objetivo</th>
                <th>Asignado a</th>
                <th>Fecha Creacion</th>
              </tr>
            </thead>
            <tbody>
              {campanas.map((campana, index) => (
                <tr key={campana._id}>
                  <td>{index + 1}</td>
                  <td>{campana.nombre || 'Sin nombre'}</td>
                  <td>{renderBadge('estado', campana.estado)}</td>
                  <td>{renderBadge('tipo', campana.tipo)}</td>
                  <td>{renderBadge('publicoObjetivo', campana.publicoObjetivo)}</td>
                  <td>{renderBadge('asignadoA', campana.asignadoA)}</td>
                  <td>{formatDate(campana.fechaCreacion)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>
        : <></>
      }
    </Container>
  );
};

export default ReporteCampanas;
