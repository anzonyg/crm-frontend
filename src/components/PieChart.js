import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';

// Registrar los componentes de Chart.js que usaremos
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, title }) => {
  // Opciones para el gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
      },
      datalabels: {
        display: true, // Habilitar etiquetas
        color: 'black', // Color del texto de las etiquetas
        font: {
          weight: 'bold',
          size: 16,
        },
        formatter: (value) => `${value}`, // Mostrar el valor
      }
    },
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{title}</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Pie data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default PieChart;
