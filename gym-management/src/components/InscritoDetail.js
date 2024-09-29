import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Asegúrate de importar Link
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FileContext } from "../context/FileContext";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Card,
  ListGroup,
  Accordion,
} from "react-bootstrap";
import Swal from "sweetalert2";
import es from "date-fns/locale/es";
import BackButton from "./BackButton";
import { FaTimes } from "react-icons/fa";

registerLocale("es", es);

function InscritoDetail() {
  const { id } = useParams();
  const { inscritos, updateInscrito } = useContext(FileContext);
  const [inscrito, setInscrito] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [pagos, setPagos] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (inscritos.length > 0) {
      const selectedInscrito = inscritos.find((i) => i.id === parseInt(id));
      if (selectedInscrito) {
        setInscrito(selectedInscrito);
        setPagos(selectedInscrito.pagos || {}); // Asegúrate de que `pagos` esté inicializado
      } else {
        console.error(`No se encontró un inscrito con id ${id}`);
      }
    }
  }, [id, inscritos]);

  const handleDateClick = (date) => {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    setSelectedDate(localDate);
  };

  const confirmDate = () => {
    if (selectedDate && inscrito) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      let updatedAsistencia = [...inscrito.asistencia];

      const date = new Date(selectedDate);
      const weekOfMonth = getWeekOfMonth(date);
      const monthYearKey = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;

      const asistenciaPorSemana = groupByMonthAndWeek(updatedAsistencia);

      if (
        inscrito.tarifa === "2-dias" &&
        asistenciaPorSemana[monthYearKey] &&
        asistenciaPorSemana[monthYearKey][weekOfMonth] &&
        asistenciaPorSemana[monthYearKey][weekOfMonth].length >= 2
      ) {
        Swal.fire({
          icon: "warning",
          title: "Límite alcanzado",
          text: "Ya ha registrado dos asistencias para esta semana.",
        });
        return;
      }

      if (updatedAsistencia.includes(dateStr)) {
        Swal.fire({
          icon: "warning",
          title: "Fecha Duplicada",
          text: "Esta fecha ya ha sido registrada.",
        });
        return;
      }

      updatedAsistencia.push(dateStr);

      const updatedInscrito = { ...inscrito, asistencia: updatedAsistencia };
      setInscrito(updatedInscrito);
      updateInscrito(inscrito.id, updatedInscrito);
      setSelectedDate(null);
    }
  };

  const handlePagoChange = (mes, year) => {
    const updatedPagos = {
      ...pagos,
      [`${mes}-${year}`]: !pagos[`${mes}-${year}`],
    };
    setPagos(updatedPagos);
    const updatedInscrito = { ...inscrito, pagos: updatedPagos };
    setInscrito(updatedInscrito);
    updateInscrito(inscrito.id, updatedInscrito);
  };

  const deleteAttendance = (fecha) => {
    const updatedAsistencia = inscrito.asistencia.filter((f) => f !== fecha);
    const updatedInscrito = { ...inscrito, asistencia: updatedAsistencia };
    setInscrito(updatedInscrito);
    updateInscrito(inscrito.id, updatedInscrito);
  };

  const getWeekOfMonth = (date) => {
    const dayOfWeek = (date.getDay() + 6) % 7; // Hace que la semana comience en lunes
    const adjustedDate = date.getDate() - dayOfWeek + 1;
    return Math.ceil(adjustedDate / 7);
  };

  const groupByMonthAndWeek = (asistencia) => {
    return asistencia.reduce((acc, dateStr) => {
      const date = new Date(dateStr);
      const month = date.toLocaleString("default", { month: "long" });
      const week = getWeekOfMonth(date);
      const year = date.getFullYear();
      const monthYearKey = `${month} ${year}`;

      if (!acc[monthYearKey]) {
        acc[monthYearKey] = {};
      }
      if (!acc[monthYearKey][week]) {
        acc[monthYearKey][week] = [];
      }

      acc[monthYearKey][week].push(dateStr);
      return acc;
    }, {});
  };

  const asistenciaPorSemana = groupByMonthAndWeek(
    inscrito ? inscrito.asistencia : []
  );

  if (!inscrito) return <div>Loading...</div>;

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const years = [2024, 2025, 2026]; // Lista de años para el acordeón

  return (
    <Container fluid className="vh-100 d-flex flex-column">
      <BackButton />
      <Row className="mb-4">
        <Col md={6} className="d-flex flex-column">
          <Card className="shadow-sm">
            <Card.Body style={{ height: "350px", overflowY: "auto" }}>
              <div className="d-flex flex-column justify-content-center align-items-center mb-3">
                <h2 className="mb-2">Datos personales del usuario</h2>
                <div className="d-flex justify-content-between w-75">
                  <Link to={`/inscritos/${id}/detalles`} className="mt-2">
                    <Button variant="primary">Ver más detalles</Button>
                  </Link>
                  <Link to={`/inscritos/${id}/editar`} className="mt-2">
                    <Button variant="warning">Editar datos personales</Button>
                  </Link>
                </div>
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong className="me-2">Nombre:</strong> {inscrito.nombre}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong className="me-2">Apellido:</strong>{" "}
                  {inscrito.apellido}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong className="me-2">Fecha de Inscripción:</strong> {inscrito.fechaInscripcion}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong className="me-2">Tarifa:</strong> {inscrito.tarifa}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong className="me-2">Teléfono:</strong>{" "}
                  {inscrito.telefono}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong className="me-2">Email:</strong> {inscrito.email}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong className="me-2">Edad:</strong> {inscrito.edad}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong className="me-2">DNI:</strong> {inscrito.dni}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="d-flex flex-column">
          <Card
            className="shadow-sm"
          >
            <Card.Body style={{ height: "350px", overflowY: "auto" }}>
              <h3 className="text-center mb-3">Pagos Mensuales</h3>
              <Accordion>
                {years.map((year, idx) => (
                  <Accordion.Item eventKey={idx.toString()} key={year}>
                    <Accordion.Header>{year}</Accordion.Header>
                    <Accordion.Body>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Mes</th>
                            <th>Año</th>
                            <th>Pagado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {months.map((mes, index) => (
                            <tr key={`${mes}-${year}-${index}`}>
                              <td>{mes}</td>
                              <td>{year}</td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={pagos && pagos[`${mes}-${year}`]} // Verificación de existencia
                                  onChange={() => handlePagoChange(mes, year)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="">
        <Col md={6} className="d-flex flex-column">
          <Card className="shadow-sm h-100" >
            <Card.Body className="d-flex  justify-content-between"  style={{ height: "350px", overflowY: "auto" }}>
              <div>
                <h3 className="text-center mb-3">Asistencia</h3>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateClick}
                  dateFormat="yyyy-MM-dd"
                  inline
                  locale="es"
                  calendarStartDay={1}
                  className="w-100"
                />
              </div>
              <div className="mt-3">
                <Button
                  variant="danger"
                  onClick={confirmDate}
                  disabled={!selectedDate}
                  className="mt-3 w-100"
                >
                  Confirmar Fecha
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="d-flex flex-column">
          <Card className="shadow-sm flex-grow-1" >
            <Card.Body
              className="d-flex flex-column"
              style={{ height: "350px", overflowY: "auto" }}
            >
              <h3 className="text-center mb-3">Resumen de Asistencia</h3>
              <Accordion>
                {Object.keys(asistenciaPorSemana).map((monthYear, index) => (
                  <Accordion.Item eventKey={index.toString()} key={monthYear}>
                    <Accordion.Header>{monthYear}</Accordion.Header>
                    <Accordion.Body>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Semana</th>
                            <th>Fechas</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(asistenciaPorSemana[monthYear]).map(
                            (week) => {
                              const weekAttendance =
                                asistenciaPorSemana[monthYear][week];
                              let rowClass = "";
                              if (inscrito.tarifa === "2-dias") {
                                if (weekAttendance.length === 1) {
                                  rowClass = "bg-warning text-dark";
                                } else if (weekAttendance.length >= 2) {
                                  rowClass = "bg-danger text-white";
                                }
                              }
                              return (
                                <tr key={`${monthYear}-${week}`}>
                                  <td>Semana {week}</td>
                                  <td>
                                    {weekAttendance.map((fecha, idx) => (
                                      <div key={`${monthYear}-${week}-${idx}`}>
                                        {fecha}
                                      </div>
                                    ))}
                                  </td>
                                  <td>
                                    {weekAttendance.map((fecha, idx) => (
                                      <Button
                                        key={`${monthYear}-${week}-${idx}`}
                                        variant="danger"
                                        size="sm"
                                        onClick={() => deleteAttendance(fecha)}
                                        className="ms-2"
                                      >
                                        <FaTimes />
                                      </Button>
                                    ))}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default InscritoDetail;
