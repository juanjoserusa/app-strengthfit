import React, { useState, useContext } from 'react';
import { Card, Button, Container, Row, Col, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FileContext } from '../context/FileContext';

const ConcursoRetos = () => {
  const { inscritos, completarReto } = useContext(FileContext); // Obtener los usuarios y la función del contexto
  const [selectedUser, setSelectedUser] = useState(null); // Estado para el usuario seleccionado
  const [selectedMonth, setSelectedMonth] = useState('Enero'); // Estado para el mes seleccionado
  const [retos] = useState([
    // Retos de Asistencia
    { id: 1, titulo: 'Asiste 3 días seguidos', descripcion: 'Asiste 3 días seguidos al gimnasio.', puntos: 30 },
    { id: 2, titulo: 'Asiste 5 días en una semana', descripcion: 'Asiste 5 días en una misma semana.', puntos: 50 },
    { id: 3, titulo: 'Reto del Mes', descripcion: 'Asiste 20 días en un mes.', puntos: 100 },
  
    // Retos de PECHO
    { id: 4, titulo: 'Press banca barra', descripcion: 'Realiza 4 series de 10 repeticiones de press banca con barra.', puntos: 40 },
    { id: 5, titulo: 'Press mancuerna horizontal', descripcion: 'Realiza 4 series de 12 repeticiones de press con mancuerna horizontal.', puntos: 50 },
    { id: 6, titulo: 'Press inclinado barra', descripcion: 'Haz 4 series de 8 repeticiones de press inclinado con barra.', puntos: 60 },
    { id: 7, titulo: 'Press declinado con barra', descripcion: 'Realiza 4 series de 10 repeticiones de press declinado con barra.', puntos: 50 },
    { id: 8, titulo: 'Apertura mancuerna banco', descripcion: 'Realiza 3 series de 15 repeticiones de apertura con mancuerna en banco.', puntos: 40 },
  
    // Retos de BICEPS
    { id: 9, titulo: 'Curl barra', descripcion: 'Haz 3 series de 12 repeticiones de curl con barra.', puntos: 40 },
    { id: 10, titulo: 'Curl mancuerna', descripcion: 'Haz 3 series de 12 repeticiones de curl con mancuerna.', puntos: 40 },
    { id: 11, titulo: 'Martillo mancuerna', descripcion: 'Realiza 3 series de 10 repeticiones de curl martillo con mancuerna.', puntos: 40 },
    { id: 12, titulo: 'Banco Scott', descripcion: 'Haz 3 series de 12 repeticiones de curl en Banco Scott.', puntos: 50 },
  
    // Retos de TRICEPS
    { id: 13, titulo: 'Frances barra', descripcion: 'Realiza 3 series de 12 repeticiones de triceps francés con barra.', puntos: 40 },
    { id: 14, titulo: 'Polea cuerda', descripcion: 'Haz 3 series de 15 repeticiones de polea con cuerda.', puntos: 40 },
    { id: 15, titulo: 'Fondo', descripcion: 'Haz 3 series de 10 fondos para triceps.', puntos: 50 },
  
    // Retos de ESPALDA
    { id: 16, titulo: 'Dominadas', descripcion: 'Completa 3 series de 8 dominadas.', puntos: 60 },
    { id: 17, titulo: 'Jalon al pecho', descripcion: 'Realiza 4 series de 10 repeticiones de jalón al pecho.', puntos: 50 },
    { id: 18, titulo: 'Remo barra', descripcion: 'Realiza 4 series de 10 repeticiones de remo con barra.', puntos: 50 },
    { id: 19, titulo: 'Peso muerto', descripcion: 'Haz 4 series de 8 repeticiones de peso muerto.', puntos: 60 },
  
    // Retos de HOMBRO
    { id: 20, titulo: 'Press mancuerna', descripcion: 'Haz 3 series de 10 repeticiones de press con mancuerna para hombros.', puntos: 40 },
    { id: 21, titulo: 'Vuelo polea', descripcion: 'Realiza 3 series de 12 repeticiones de vuelo con polea.', puntos: 40 },
    { id: 22, titulo: 'Posterior polea', descripcion: 'Haz 3 series de 12 repeticiones de apertura posterior en polea.', puntos: 40 },
  
    // Retos de PIERNAS
    { id: 23, titulo: 'Prensa de piernas', descripcion: 'Realiza 4 series de 15 repeticiones en la prensa de piernas.', puntos: 60 },
    { id: 24, titulo: 'Sentadilla con barra', descripcion: 'Haz 4 series de 10 repeticiones de sentadillas con barra.', puntos: 70 },
    { id: 25, titulo: 'Extensión cuadriceps', descripcion: 'Realiza 4 series de 15 repeticiones de extensión de cuadriceps.', puntos: 50 },
    { id: 26, titulo: 'Peso muerto búlgaro', descripcion: 'Realiza 4 series de 12 repeticiones de peso muerto búlgaro.', puntos: 60 },
  
    // Retos de CARDIO
    { id: 27, titulo: 'Corre 5 km en la cinta', descripcion: 'Completa 5 km en la cinta de correr.', puntos: 60 },
    { id: 28, titulo: 'Elíptica 45 minutos', descripcion: 'Realiza una sesión de 45 minutos en la elíptica.', puntos: 50 },
    { id: 29, titulo: 'Corre 30 minutos sin parar', descripcion: 'Corre 30 minutos en la cinta sin parar.', puntos: 50 },
  ]);

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value); // Actualiza el usuario seleccionado
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value); // Actualiza el mes seleccionado
  };

  const handleCompletarReto = (idReto, puntos) => {
    if (!selectedUser) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, selecciona un usuario primero.',
        icon: 'error',
      });
      return;
    }

    completarReto(parseInt(selectedUser), idReto, puntos, selectedMonth); // Llamamos a la función del contexto con el usuario seleccionado
    Swal.fire({
      title: '¡Reto completado!',
      text: 'El reto ha sido marcado como completado.',
      icon: 'success',
    });
  };

  // Función para calcular el ranking basado en los puntos del mes seleccionado
  const calculateRanking = () => {
    return inscritos
      .map((usuario) => ({
        nombre: `${usuario.nombre} ${usuario.apellido}`,
        puntos: usuario.puntosPorMes?.[selectedMonth] || 0, // Obtener los puntos del mes seleccionado
      }))
      .sort((a, b) => b.puntos - a.puntos); // Ordenar por puntos en orden descendente
  };

  const ranking = calculateRanking();

  return (
    <Container className="mt-4" style={{"height":"800px", "overflow":"auto"}}>
      <h1 className="text-center">Retos del Gimnasio</h1>

      {/* Selector de mes */}
      <Form.Group controlId="selectMonth" className="mt-3">
        <Form.Label>Selecciona el Mes</Form.Label>
        <Form.Control as="select" value={selectedMonth} onChange={handleMonthChange}>
          {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map(
            (mes) => (
              <option key={mes} value={mes}>
                {mes}
              </option>
            )
          )}
        </Form.Control>
      </Form.Group>

      {/* Selector de usuario */}
      <Form.Group controlId="selectUser" className="mt-3">
        <Form.Label>Selecciona un Usuario</Form.Label>
        <Form.Control as="select" value={selectedUser || ''} onChange={handleUserChange}>
          <option value="">Selecciona un usuario</option>
          {inscritos.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nombre} {user.apellido}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Row className="mt-4">
        <Col md={6}>
          <h3>Retos Disponibles</h3>
          {retos.map((reto) => (
            <Card key={reto.id} className="mb-3">
              <Card.Body>
                <Card.Title>{reto.titulo}</Card.Title>
                <Card.Text>{reto.descripcion}</Card.Text>
                <Card.Text>
                  <strong>Puntos:</strong> {reto.puntos}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => handleCompletarReto(reto.id, reto.puntos)} // Llama al handler con el id del reto y puntos
                >
                  Marcar como Completado
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Col>
        <Col md={6}>
          <h3>Ranking de {selectedMonth}</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Usuario</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((usuario, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.puntos}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default ConcursoRetos;
