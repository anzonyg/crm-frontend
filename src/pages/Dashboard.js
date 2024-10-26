import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Form, Pagination, Badge } from 'react-bootstrap';
import { getCampanasDashboard } from '../services/campanasService';
import { getTicketsDashboard } from '../services/ticketsSoporteService';
import { FaEdit, FaTrash, FaPlus, FaEye, FaFilePdf } from 'react-icons/fa';
import { pdf } from '@react-pdf/renderer';
import CampanasModal from '../components/CampanasModal';
import PdfCampanas from '../components/PdfCampanas'; // Actualizar la importación
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import DoughnutChart from '../components/DoughnutChart';

const Dashboard = () => {
  const [estados, setEstados] = useState(null)
  const [tipos, setTipos] = useState(null)
  const [estadosTicket, setEstadosTicket] = useState(null)
  const [prioridad, setPrioridad] = useState(null)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const campanas = await getCampanasDashboard()
    const tickets = await getTicketsDashboard()

    const estados = transformDataPieChart({ info: campanas.data, property: 'estado', title: 'Estados de Campañas' })
    setEstados(estados)

    const tipos = transformDataPieChart({ info: campanas.data, property: 'tipo', title: 'Tipos de Campañas' })
    setTipos(tipos)

    const estadosTicket = transformDataPieChart({ info: tickets.data, property: 'estado', title: 'Estados de Tickets' })
    setEstadosTicket(estadosTicket)

    const prioridad = transformDataPieChart({ info: tickets.data, property: 'prioridad', title: 'Prioridad de Ticketss' })
    setPrioridad(prioridad)
  }

  const transformDataPieChart = ({
    info,
    property,
    title
  }) => {

    const data = info[property]
    const labels = Object.keys(data).map(d => d)

    const datasets = {
      label: title,
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: []
    }

    for (let label of labels) {
      const campanas = data[label]
      datasets.data.push(campanas.length)
      datasets.backgroundColor.push(getColor(label))
      datasets.hoverBackgroundColor.push(getColor(label))
    }

    return {
      labels,
      datasets: [datasets]
    }
  }

  const getColor = (label) => {
    switch (label) {
      case 'Planificada':
      case 'Correo Electronico':
      case 'Nuevo':
      case 'Baja':
        return "#4A90E2"
      case 'Activa':
      case 'Redes Sociales':
      case 'En Progreso':
      case 'Normal':
        return "#5CD85C"
      case 'Finalizada':
      case 'Webinar':
      case 'Resuelto':
      case 'Alta':
        return "#F1C40F"
      case 'Cancelada':
      case 'Feria':
      case 'Evento':
      case 'Rechazado':
      case 'Urgente':
        return "#E67E22"
      default:
        return "#00BCD4"
    }

  }

  // el tema del dashboard para mostrar un apartado en donde muestre el tipo de campañas que hay. el estado de las campañas y el estado de los tickets que hay.
  return (
    <Container>
      <h1 className="mt-5">Dashboard</h1>
      <p className="text-muted">
        El "Dashboard" permite optimizar recursos, visualizar datos clave y medir el éxito de cada iniciativa de manera efectiva.
      </p>
      <Row className="mb-3">
        <Col md={6}>
          {estados && <PieChart data={estados} title="Cantidad de Campañas por Estado" />}
        </Col>
        <Col md={6}>
          {estados && <PieChart data={tipos} title="Cantidad de Campañas por Tipo" />}
        </Col>
      </Row>
      <Row className='mt-5'>
        <Col md={6}>
          {estadosTicket && <DoughnutChart data={estadosTicket} title="Cantidad de Tickets por Estado" />}
        </Col>
        <Col md={6}>
          {prioridad && <DoughnutChart data={prioridad} title="Cantidad de Tickets por Prioridad" />}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;