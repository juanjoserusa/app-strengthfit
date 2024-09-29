import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import BackButton from './BackButton';

function GestionEconomica() {
  return (
    <> 
      <BackButton />
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <h1 className="mb-4">Gestión Economica</h1>
      <Row className="w-100 mt-4">
        <Col md={6} className="mb-4">
          <Link to="/control-de-gastos" className="text-decoration-none">
            <Card className="text-center h-100 shadow-sm card_home">
              <Card.Body className="d-flex flex-column justify-content-center" style={{ height: "300px" }}>
                <Card.Title className="fs-3">Añadir ingreso o gasto</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={6} className="mb-4">
          <Link to="/consultar-gastos" className="text-decoration-none">
            <Card className="text-center h-100 shadow-sm card_home">
              <Card.Body className="d-flex flex-column justify-content-center">
                <Card.Title className="fs-3">Consultar Ingresos y gastos</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </ Row>
    </Container>
    </>
    );

}

export default GestionEconomica;
