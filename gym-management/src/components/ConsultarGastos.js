import React, { useContext, useState } from 'react';
import { ControlDeGastosContext } from '../context/ControlDeGastosContext';
import { Form, Table, Container, Row, Col, Button } from 'react-bootstrap';
import { Chart } from 'react-google-charts';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';

function ConsultarGastos() {
  const { gastos, fixedGastos, loading, error } = useContext(ControlDeGastosContext);
  const [selectedMonth, setSelectedMonth] = useState('08'); // Mes en formato numérico
  const [selectedYear, setSelectedYear] = useState('2024');
  const [filterType, setFilterType] = useState('Todos'); // 'Todos', 'Ingreso', 'Gasto'
  const [sortOrder, setSortOrder] = useState('asc'); // Orden de la tabla
  const navigate = useNavigate();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Combina los gastos y gastos fijos
  const allGastos = [...gastos, ...fixedGastos];

  // Filtrar los gastos por mes, año y tipo seleccionado
  const filteredGastos = allGastos?.filter(gasto => {
    const [year, month] = gasto.date.split('-');
    const matchesType = filterType === 'Todos' || gasto.type === filterType;
    return month === selectedMonth && year === selectedYear && matchesType;
  }) || [];

  // Calcular totales
  const totalIngresos = filteredGastos
    .filter(gasto => gasto.type === 'Ingreso')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalGastos = filteredGastos
    .filter(gasto => gasto.type === 'Gasto')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalGastosFijos = filteredGastos
    .filter(gasto => gasto.type === 'Gasto Fijo')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIngresos - (totalGastos + totalGastosFijos);

  // Generar datos para los 30 o 31 días del mes
  const daysInMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayStr = `${selectedYear}-${selectedMonth.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    const ingresos = filteredGastos
      .filter(gasto => gasto.type === 'Ingreso' && gasto.date === dayStr)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const numIngresos = filteredGastos.filter(gasto => gasto.type === 'Ingreso' && gasto.date === dayStr).length;

    const gastos = filteredGastos
      .filter(gasto => gasto.type === 'Gasto' && gasto.date === dayStr)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const numGastos = filteredGastos.filter(gasto => gasto.type === 'Gasto' && gasto.date === dayStr).length;

    const gastosFijos = filteredGastos
      .filter(gasto => gasto.type === 'Gasto Fijo' && gasto.date === dayStr)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const numGastosFijos = filteredGastos.filter(gasto => gasto.type === 'Gasto Fijo' && gasto.date === dayStr).length;

    const ingresoTooltip = `Ingresos: ${ingresos}€ (${numIngresos} transacciones)`;
    const gastoTooltip = `Gastos: ${gastos}€ (${numGastos} transacciones)`;
    const gastoFijoTooltip = `Gastos Fijos: ${gastosFijos}€ (${numGastosFijos} transacciones)`;

    return [day.toString(), ingresos, ingresoTooltip, gastos, gastoTooltip, gastosFijos, gastoFijoTooltip];
  });

  const barChartData = [
    ['Día', 'Ingresos', { role: 'tooltip', type: 'string' }, 'Gastos', { role: 'tooltip', type: 'string' }, 'Gastos Fijos', { role: 'tooltip', type: 'string' }],
    ...dailyData,
  ];

  const barChartOptions = {
    title: `Ingresos vs Gastos (${selectedMonth} ${selectedYear})`,
    chartArea: { width: '100%' },
    hAxis: {
      title: 'Día del mes',
      minValue: 0,
    },
    vAxis: {
      title: 'Cantidad (€)',
    },
    seriesType: 'bars',
    colors: ['#4caf50', '#f44336', '#1e88e5'], // Verde para ingresos, rojo para gastos, azul para gastos fijos
  };

  const pieChartData = [
    ['Tipo', 'Cantidad'],
    ['Ingresos', totalIngresos],
    ['Gastos', totalGastos],
    ['Gastos Fijos', totalGastosFijos],
  ];

  const pieChartOptions = {
    title: `Ingresos vs Gastos (${selectedMonth} ${selectedYear})`,
    pieHole: 0.4,
    chartArea: { width: '100%' },
    is3D: true,
    slices: {
      0: { color: '#4caf50' }, // Verde para ingresos
      1: { color: '#f44336' }, // Rojo para gastos
      2: { color: '#1e88e5' }, // Azul para gastos fijos
    },
  };

  const handleSort = () => {
    const order = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(order);
  };

  const sortedGastos = [...filteredGastos].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <BackButton />
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => navigate('/control-de-gastos')}>
            Añadir Ingreso o Gasto
          </Button>
        </Col>
      </Row>

      <h1>Consultar Ingresos y Gastos</h1>
      <Row>
        <Col>
          <Form.Group controlId="mesSelect">
            <Form.Label>Mes</Form.Label>
            <Form.Control as="select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="01">Enero</option>
              <option value="02">Febrero</option>
              <option value="03">Marzo</option>
              <option value="04">Abril</option>
              <option value="05">Mayo</option>
              <option value="06">Junio</option>
              <option value="07">Julio</option>
              <option value="08">Agosto</option>
              <option value="09">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="añoSelect">
            <Form.Label>Año</Form.Label>
            <Form.Control as="select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="tipoSelect">
            <Form.Label>Tipo</Form.Label>
            <Form.Control as="select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="Todos">Todos</option>
              <option value="Ingreso">Ingresos</option>
              <option value="Gasto">Gastos</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      {/* Sección para las gráficas */}
      <Row className="mt-4">
        <Col md={7}>
          <Chart
            chartType="ComboChart"
            data={barChartData}
            options={barChartOptions}
            width="100%px"
            height="300px"
          />
        </Col>
        <Col md={3}>
          <Chart
            chartType="PieChart"
            data={pieChartData}
            options={pieChartOptions}
            width="100%"
            height="300px"
          />
        </Col>
        <Col md={2}>
          <h5>Resumen del mes</h5>
          <p><strong>Total Ingresos:</strong> {totalIngresos}€</p>
          <p><strong>Total Gastos:</strong> {totalGastos}€</p>
          <p><strong>Total Gastos Fijos:</strong> {totalGastosFijos}€</p>
          <p><strong>Balance:</strong> {balance}€</p>
          {balance >= 0 ? (
            <p style={{ color: 'green' }}>¡Tienes un superávit este mes!</p>
          ) : (
            <p style={{ color: 'red' }}>Tienes un déficit este mes.</p>
          )}
        </Col>
      </Row>

      {/* Sección para la tabla de datos */}
      <Row className="mt-4">
        <Col>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th onClick={handleSort} style={{ cursor: 'pointer' }}>
                    Fecha {sortOrder === 'asc' ? '▲' : '▼'}
                  </th>
                  <th>Descripción</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {sortedGastos.map((gasto, index) => (
                  <tr key={index}>
                    <td>{gasto.date}</td>
                    <td>{gasto.description}</td>
                    <td>{gasto.type}</td>
                    <td>{gasto.amount}€</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ConsultarGastos;
