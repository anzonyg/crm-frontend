import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';

// Registrar los componentes de Chart.js que usaremos
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  // Datos para el gráfico
  const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
    datasets: [
      {
        label: 'Ventas en USD',
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4000],
        backgroundColor: 'rgba(75, 192, 192, 0.5)', // Color de las barras
      },
    ],
  };

  // Opciones para el gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gráfico de Ventas Mensuales',
      },
    },
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Reporte de Ventas</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default BarChart;
