import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FileContext } from '../context/FileContext';

function EditarInscrito() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inscritos, updateInscrito } = useContext(FileContext);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    telefono: '',
    email: '',
    dni: '',
    tarifa: '2-dias',
    trainingType: '',
    fechaInscripcion: '',
    notas: '',
  });

  useEffect(() => {
    const inscrito = inscritos.find((i) => i.id === parseInt(id));
    if (inscrito) {
      setFormData(inscrito);
    }
  }, [id, inscritos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateInscrito(id, formData)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Guardado!',
          text: 'Los cambios se han guardado correctamente.',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          navigate('/inscritos');
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al guardar los cambios.',
        });
      });
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Editar Inscrito</h2>
      <p className="text-center text-danger">
        Todos los datos modificados sustituirán a los datos anteriores
      </p>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
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
          Guardar Cambios
        </Button>
      </Form>
    </Container>
  );
}

export default EditarInscrito;
