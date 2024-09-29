import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';

function Home() {
  const navigate = useNavigate();

  const sendBackupEmail = (filePath, fileName) => {
    fetch(`http://localhost:5000/${filePath}`)
      .then(response => response.json())
      .then(data => {
        const jsonContent = JSON.stringify(data, null, 2);

        const templateParams = {
          to_name: 'Tu Nombre',
          message: `Aquí tienes la copia de seguridad del archivo ${fileName}.json`,
          json_content: jsonContent,
        };

        emailjs.send('service_0q57l6e', 'template_bhldg4h', templateParams, '2rBtVNFTQLeJiUiRc')
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: `Copia de seguridad de ${fileName} enviada por correo electrónico.`,
              confirmButtonText: 'Aceptar'
            });
          }, () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `Hubo un problema al enviar la copia de seguridad de ${fileName}.`,
              confirmButtonText: 'Aceptar'
            });
          });
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Hubo un problema al obtener el archivo ${fileName}.json.`,
          confirmButtonText: 'Aceptar'
        });
      });
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <h1 className="mb-4">Strength Fit</h1>
      <Row className="w-100 mt-4">
        <Col md={4} className="mb-4">
          <Card className="text-center h-100 shadow-sm card_home" onClick={() => navigate('/gestion-usuarios')}>
            <Card.Body className="d-flex flex-column justify-content-center" style={{ height: "300px" }}>
              <Card.Title className="fs-3">Gestión de Usuarios</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="text-center h-100 shadow-sm card_home" onClick={() => navigate('/gestion-economica')}>
            <Card.Body className="d-flex flex-column justify-content-center" >
              <Card.Title className="fs-3">Gestión Económica</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="text-center h-100 shadow-sm card_home" onClick={() => navigate('/entrenamientos')}>
            <Card.Body className="d-flex flex-column justify-content-center" style={{ height: "300px" }}>
              <Card.Title className="fs-3">Gestión de entrenamientos</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="w-100 mt-4">
        <Col md={6} className="mb-4">
          <Card
            style={{ height: "100px", cursor: 'pointer' }}
            className="text-center h-15 shadow-sm card_home"
            onClick={() => sendBackupEmail('inscritos', 'inscritos')}
          >
            <Card.Body className="d-flex flex-column justify-content-center" style={{ height: "300px" }}>
              <Card.Title className="fs-3">Enviar copia de seguridad de inscritos</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card
            style={{ height: "100px", cursor: 'pointer' }}
            className="text-center h-15 shadow-sm card_home"
            onClick={() => sendBackupEmail('control-de-gastos', 'controlDeGastos')}
          >
            <Card.Body className="d-flex flex-column justify-content-center" style={{ height: "300px" }}>
              <Card.Title className="fs-3">Enviar copia de seguridad de gastos</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
