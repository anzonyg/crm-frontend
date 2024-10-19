import React from 'react';
import { Container, Card } from 'react-bootstrap';

const Home = () => {
    return (
      <Container className="mt-5">
        <Card className="text-center">
          <Card.Body>
            <Card.Title>Bienvenido al CRM</Card.Title>
            <Card.Text>
              Gestione sus Leads, Eventos & Actividades, y Cotizaciones eficientemente.
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  };

export default Home;
