import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import BackButton from './BackButton';

function GestionUsuarios() {
  return (
    <>
      <BackButton />
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <h1 className="mb-4">Gestión de Usuarios</h1>
      <Row className="w-100 mt-4">
        <Col md={6} className="mb-4">
          <Link to="/registrar" className="text-decoration-none">
            <Card className="text-center h-100 shadow-sm card_home">
              <Card.Body className="d-flex flex-column justify-content-center" style={{ height: "300px" }}>
                <Card.Title className="fs-3">Registrar Nuevo Usuario</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={6} className="mb-4">
          <Link to="/inscritos" className="text-decoration-none">
            <Card className="text-center h-100 shadow-sm card_home">
              <Card.Body className="d-flex flex-column justify-content-center">
                <Card.Title className="fs-3">Ver Usuarios</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>
    </Container>
    </>
  );
}

export default GestionUsuarios;
