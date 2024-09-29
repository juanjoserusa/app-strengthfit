import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileContext } from '../context/FileContext';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import BackButton from './BackButton';

function Registrar() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    telefono: '',
    email: '',
    dni: '',
    tarifa: '2-dias',
    trainingType: '',
    notas: '',
    fechaInscripcion: '',  // Nuevo campo para la fecha de inscripción
  });

  const navigate = useNavigate();
  const { saveData } = useContext(FileContext); // Eliminamos la variable 'inscritos' ya que no se usará más

  const generateUniqueId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
  };

  const generateMonthlyAttendance = () => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const years = [2024, 2025, 2026];
    const attendance = {};

    years.forEach(year => {
      months.forEach(month => {
        attendance[`${month}-${year}`] = false;
      });
    });

    return attendance;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newInscrito = {
      ...formData,
      id: generateUniqueId(),
      asistencia: [],
      pagos: generateMonthlyAttendance(),
      trainingType: formData.trainingType || 'General',
      notas: formData.notas ? [formData.notas] : [], 
      fechaInscripcion: formData.fechaInscripcion || new Date().toISOString().split('T')[0], // Guarda la fecha de inscripción
      monthlySummary: {},
    };

    saveData(newInscrito);

    Swal.fire({
      icon: 'success',
      title: 'Registrado',
      text: 'El usuario ha sido registrado correctamente.',
    }).then(() => {
      navigate('/inscritos');
    });
  };

  return (
    <Container className="mt-4">
      <BackButton />
      <h2 className="mb-4 text-center">Registrar Nuevo Inscrito</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formApellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formTarifa">
              <Form.Label>Tarifa</Form.Label>
              <Form.Control
                as="select"
                name="tarifa"
                value={formData.tarifa}
                onChange={handleChange}
              >
                <option value="2-dias">2 Días a la Semana</option>
                <option value="ilimitada">Ilimitada</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formFechaInscripcion">
              <Form.Label>Fecha de Inscripción</Form.Label>
              <Form.Control
                type="date"
                name="fechaInscripcion"
                value={formData.fechaInscripcion}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formTrainingType">
              <Form.Label>Tipo de Entrenamiento</Form.Label>
              <Form.Control
                type="text"
                name="trainingType"
                placeholder="Tipo de Entrenamiento (ej. Cardio, Fuerza)"
                value={formData.trainingType}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formEdad">
              <Form.Label>Edad</Form.Label>
              <Form.Control
                type="number"
                name="edad"
                placeholder="Edad"
                value={formData.edad}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formTelefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formDni">
              <Form.Label>DNI</Form.Label>
              <Form.Control
                type="text"
                name="dni"
                placeholder="DNI"
                value={formData.dni}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          
        </Row>
        
        
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formNotas">
              <Form.Label>Notas</Form.Label>
              <Form.Control
                as="textarea"
                name="notas"
                placeholder="Notas sobre entrenamientos, dietas, etc."
                value={formData.notas}
                onChange={handleChange}
                rows={3}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="danger" type="submit">
          Registrar
        </Button>
      </Form>
    </Container>
  );
}

export default Registrar;
