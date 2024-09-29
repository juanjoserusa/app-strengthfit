import React, { useContext, useState, useEffect } from 'react';
import { ControlDeGastosContext } from '../context/ControlDeGastosContext';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import BackButton from './BackButton';

function ControlDeGastos() {
  const { gastos, addGasto, deleteGasto, addFixedGasto, fixedGastos, deleteFixedGasto, loading, error } = useContext(ControlDeGastosContext);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('Ingreso'); // 'Ingreso', 'Gasto' o 'Gasto Fijo'

  const handleAddGasto = (e) => {
    e.preventDefault();

    const newGasto = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      date,
      type,
    };

    if (type === 'Gasto Fijo') {
      addFixedGasto(newGasto); // Almacenar como gasto fijo
    } else {
      addGasto(newGasto); // Almacenar como gasto normal
    }

    setDescription('');
    setAmount('');
    setDate('');
    setType('Ingreso'); // Resetear a ingreso por defecto
  };

  return (
    <Container>
      <BackButton />
      <h1 className="mb-4">Control de Ingresos y Gastos</h1>
      <Row>
        <Col md={6}>
          <Form onSubmit={handleAddGasto}>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Ingreso">Ingreso</option>
                <option value="Gasto">Gasto</option>
                <option value="Gasto Fijo">Gasto Fijo</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" variant="primary">
              Añadir
            </Button>
          </Form>
        </Col>
        <Col md={6}>
          <h2>Lista de Ingresos y Gastos</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <ListGroup>
              {gastos.length === 0 && fixedGastos.length === 0 ? (
                <p>No hay registros de gastos o ingresos.</p>
              ) : (
                <>
                  {gastos.map((gasto) => (
                    <ListGroup.Item
                      key={gasto.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>
                        {gasto.description} - {gasto.amount}€ ({gasto.date}) [{gasto.type}]
                      </span>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteGasto(gasto.id)}
                      >
                        Eliminar
                      </Button>
                    </ListGroup.Item>
                  ))}
                  {fixedGastos.map((gasto) => (
                    <ListGroup.Item
                      key={gasto.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>
                        {gasto.description} - {gasto.amount}€ (Gasto Fijo)
                      </span>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteFixedGasto(gasto.id)}
                      >
                        Eliminar Fijo
                      </Button>
                    </ListGroup.Item>
                  ))}
                </>
              )}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ControlDeGastos;
