import React, { useState } from 'react';
import { Table, Container, Button, Pagination, Form, Row, Col, Badge } from 'react-bootstrap';
import FiltrosCotizaciones from '../components/FiltrosCotizaciones';
import { obtenerCotizacionesFiltradas } from '../services/reportesService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa'; // Importar íconos
import logoUmg from '../assets/logo_umg.jpg';
import logoCrm from '../assets/logo_crm.jpg';

const ReporteCotizaciones = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [mostrarItems, setMostrarItems] = useState({});
  const [paginaActual, setPaginaActual] = useState(1);
  const [datosPorPagina, setDatosPorPagina] = useState(10);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [filtrosAplicados, setFiltrosAplicados] = useState({});

  const filtrarCotizaciones = async (filtros) => {
    const resultado = await obtenerCotizacionesFiltradas(filtros);
    setCotizaciones(resultado);
    setBusquedaRealizada(true);
    setFiltrosAplicados(filtros);
  };

  const toggleItems = (id) => {
    setMostrarItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const indexUltimoDato = paginaActual * datosPorPagina;
  const indexPrimerDato = indexUltimoDato - datosPorPagina;
  const cotizacionesPaginadas = cotizaciones.slice(indexPrimerDato, indexUltimoDato);

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

  const handleCambiarDatosPorPagina = (e) => {
    setDatosPorPagina(Number(e.target.value));
    setPaginaActual(1);
  };

  const totalPaginas = Math.ceil(cotizaciones.length / datosPorPagina);

  const renderBadge = (estado) => {
    switch (estado) {
      case 'aprobada':
        return <Badge bg="info">Aprobada</Badge>;
      case 'desaprobada':
        return <Badge bg="danger">Desaprobada</Badge>;
      default:
        return <Badge bg="secondary">Sin aprobar</Badge>;
    }
  };

    // Función para generar el archivo 
  const generarPDF = () => {
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

        // Título
        doc.setFontSize(18);
        doc.text('Reporte de Cotizaciones', 14, 50);

        // Filtros aplicados
        doc.setFontSize(12);
        doc.text('Filtros aplicados:', 14, 60);
        Object.keys(filtrosAplicados).forEach((key, index) => {
          doc.text(`${key}: ${filtrosAplicados[key]}`, 14, 70 + index * 10);
        });

        // Fecha y hora de creación
        const fecha = new Date().toLocaleDateString();
        const hora = new Date().toLocaleTimeString();
        doc.text(`Fecha de creación: ${fecha} - ${hora}`, 14, 70 + Object.keys(filtrosAplicados).length * 10 + 10);

        // Agregar tabla de cotizaciones
        doc.autoTable({
          startY: 90 + Object.keys(filtrosAplicados).length * 10,
          head: [['Nombre', 'Empresa', 'Correo', 'Teléfono', 'Descripción', 'Total', 'Estado', 'Fecha de Creación']],
          body: cotizacionesPaginadas.map(cotizacion => [
            cotizacion.nombre,
            cotizacion.empresa,
            cotizacion.correo,
            cotizacion.telefono,
            cotizacion.descripcion,
            cotizacion.totalGeneral,
            cotizacion.estado,
            new Date(cotizacion.fechaCreacion).toLocaleDateString(),
          ]),
        });

        // Guardar el PDF
        doc.save(`Reporte_Cotizaciones_${fecha}.pdf`);
      });
    });
  };


  // Función para generar el archivo Excel
  const exportarExcel = () => {
    const datos = cotizaciones.map(cotizacion => {
      const items = cotizacion.items.map(item => ({
        Nombre: cotizacion.nombre,
        Empresa: cotizacion.empresa,
        Correo: cotizacion.correo,
        Teléfono: cotizacion.telefono,
        Descripción: cotizacion.descripcion,
        'Total General': cotizacion.totalGeneral,
        Estado: cotizacion.estado,
        'Fecha de Creación': new Date(cotizacion.fechaCreacion).toLocaleDateString(),
        'Descripción Producto': item.descripcion,
        Cantidad: item.cantidad,
        'Precio Unitario': item.precioUnitario,
        'Precio Total': item.precioTotal,
      }));
      return items;
    }).flat();

    const hojaTrabajo = XLSX.utils.json_to_sheet(datos);
    const libroTrabajo = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroTrabajo, hojaTrabajo, 'Cotizaciones');
    XLSX.writeFile(libroTrabajo, `Reporte_Cotizaciones_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <Container>
      <h1 className="mt-4">Reportería de Cotizaciones</h1>
      <p className="text-muted mt-4">
        La "Reportería de Cotizaciones" permite al usuario buscar y ver cotizaciones filtradas por empresa, fecha, estado y producto. Con esta herramienta, es fácil encontrar y analizar cotizaciones de manera rápida, ayudando en la toma de decisiones sobre ventas y propuestas.
      </p>
      <FiltrosCotizaciones className="mt-2" onFiltrar={filtrarCotizaciones} />

      {/* Mostrar mensaje si aún no se ha realizado una búsqueda */}
      {!busquedaRealizada ? (
        <p className="text-center mt-4">Realiza una búsqueda para ver las cotizaciones.</p>
      ) : (
        <>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="danger" className="mr-2" onClick={generarPDF}>
              <FaFilePdf />
            </Button>
            <Button variant="success" onClick={exportarExcel}>
              <FaFileExcel />
            </Button>
          </div>

          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Empresa</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Descripción</th>
                <th>Total General</th>
                <th>Estado</th>
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cotizacionesPaginadas.map((cotizacion, index) => (
                <React.Fragment key={cotizacion._id}>
                  <tr>
                    <td>{indexPrimerDato + index + 1}</td>
                    <td>{cotizacion.nombre}</td>
                    <td>{cotizacion.empresa}</td>
                    <td>{cotizacion.correo}</td>
                    <td>{cotizacion.telefono}</td>
                    <td>{cotizacion.descripcion}</td>
                    <td>{cotizacion.totalGeneral}</td>
                    <td>{renderBadge(cotizacion.estado)}</td>
                    <td>{new Date(cotizacion.fechaCreacion).toLocaleDateString()}</td>
                    <td>
                      <Button variant="primary" onClick={() => toggleItems(cotizacion._id)}>
                        {mostrarItems[cotizacion._id] ? 'Ocultar Productos' : 'Mostrar Productos'}
                      </Button>
                    </td>
                  </tr>

                  {mostrarItems[cotizacion._id] && (
                    <>
                      <tr>
                        <td></td>
                        <td colSpan="2"><strong>Descripción del Producto</strong></td>
                        <td><strong>Cantidad</strong></td>
                        <td><strong>Precio Unitario</strong></td>
                        <td><strong>Precio Total</strong></td>
                        <td colSpan="3"></td>
                      </tr>

                      {cotizacion.items.map((item, i) => (
                        <tr key={i}>
                          <td></td>
                          <td colSpan="2">{item.descripcion}</td>
                          <td>{item.cantidad}</td>
                          <td>{item.precioUnitario}</td>
                          <td>{item.precioTotal}</td>
                          <td colSpan="3"></td>
                        </tr>
                      ))}
                    </>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>

          <Row className="mt-4 align-items-center">
            <Col className="d-flex justify-content-center">
              <Pagination>
                <Pagination.First onClick={() => cambiarPagina(1)} disabled={paginaActual === 1} />
                <Pagination.Prev onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} />
                {Array.from({ length: totalPaginas }, (_, index) => (
                  <Pagination.Item key={index + 1} active={index + 1 === paginaActual} onClick={() => cambiarPagina(index + 1)}>
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
                <Pagination.Last onClick={() => cambiarPagina(totalPaginas)} disabled={paginaActual === totalPaginas} />
              </Pagination>
            </Col>
            <Col md={3} className="d-flex justify-content-end">
              <Form.Group controlId="datosPorPagina" className="mt-3">
                <Form.Label>Ver</Form.Label>
                <Form.Control as="select" value={datosPorPagina} onChange={handleCambiarDatosPorPagina} style={{ width: '100px', display: 'inline-block', marginLeft: '10px' }}>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                </Form.Control>
                <Form.Label style={{ marginLeft: '10px' }}>por página</Form.Label>
              </Form.Group>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default ReporteCotizaciones;
