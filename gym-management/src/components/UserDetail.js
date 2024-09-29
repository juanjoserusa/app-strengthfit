import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileContext } from "../context/FileContext";
import {
  Container,
  Card,
  ListGroup,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import { Chart } from "react-google-charts";
import { FaTrash } from "react-icons/fa";

function UserDetail() {
  const { id } = useParams();
  const { inscritos, updateInscrito } = useContext(FileContext);
  const [inscrito, setInscrito] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [showModal, setShowModal] = useState(false);
  const [newNote, setNewNote] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const selectedInscrito = inscritos.find((i) => i.id === parseInt(id));
    if (selectedInscrito) {
      setInscrito(selectedInscrito);
    } else {
      console.error(`No se encontró un inscrito con id ${id}`);
    }
  }, [id, inscritos]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleAddNote = () => {
    setShowModal(true);
  };

  const handleSaveNote = () => {
    const updatedInscrito = {
      ...inscrito,
      notas: [...(inscrito.notas || []), newNote],
    };
    updateInscrito(inscrito.id, updatedInscrito);
    setInscrito(updatedInscrito);
    setShowModal(false);
    setNewNote("");
  };

  const handleDeleteNote = (index) => {
    const updatedNotas = inscrito.notas.filter((_, i) => i !== index);
    const updatedInscrito = { ...inscrito, notas: updatedNotas };
    updateInscrito(inscrito.id, updatedInscrito);
    setInscrito(updatedInscrito);
  };

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

  const paidMonths = months.filter(
    (month) => inscrito.pagos?.[`${month}-${selectedYear}`] === true
  ).length;
  const unpaidMonths = 12 - paidMonths;

  const chartData = [
    ["Estado", "Cantidad"],
    ["Pagado", paidMonths],
    ["No Pagado", unpaidMonths],
  ];

  const chartOptions = {
    title: `Resumen de Pagos ${selectedYear}`,
    pieSliceText: "percentage",
    slices: {
      0: { color: "#e6693e" },
      1: { color: "#e6e6e6" },
    },
    width: "100%",
    height: "300px",
  };

  return (
    <Container>
      <Button variant="secondary" onClick={() => navigate(`/inscritos/${id}`)}>
        Volver a Detalles
      </Button>

      <Card className="shadow-sm mt-3">
        <Card.Body>
          <h2 className="mb-3 text-center">Detalles del Usuario</h2>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex flex-row justify-content-between">
              <span>
                <strong>Nombre:</strong> {inscrito.nombre}
              </span>
              <span>
                <strong>Apellido:</strong> {inscrito.apellido}
              </span>
              <span>
                <strong>Edad:</strong> {inscrito.edad}
              </span>
              <span>
                <strong>Tipo de Entrenamiento:</strong>{" "}
                {inscrito.trainingType || "No especificado"}
              </span>
              <span>
                <strong>Tarifa:</strong> {inscrito.tarifa}
              </span>
            </ListGroup.Item>
          </ListGroup>

          <hr style={{ marginTop: "1rem", marginBottom: "1rem" }} />

          <div className="mt-3">
            <h2 className="text-center mb-2">Resumen de Pagos</h2>

            <Row>
              <Col md={6}>
                <Chart
                  chartType="PieChart"
                  data={chartData}
                  options={chartOptions}
                  width="100%"
                  height="275px"
                />
              </Col>
              <Col md={6}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5>Estado de Pagos por Mes</h5>
                  <Form.Select
                    aria-label="Seleccionar año"
                    value={selectedYear}
                    onChange={handleYearChange}
                    style={{ maxWidth: "150px" }}
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </Form.Select>
                </div>
                <Table bordered className="mt-3">
                  <tbody>
                    {Array.from({ length: 3 }).map((_, rowIndex) => (
                      <tr key={rowIndex}>
                        {months
                          .slice(rowIndex * 4, rowIndex * 4 + 4)
                          .map((month) => (
                            <td
                              key={month}
                              style={{
                                backgroundColor: inscrito.pagos?.[
                                  `${month}-${selectedYear}`
                                ]
                                  ? "#e6693e"
                                  : "#e6e6e6",
                                color: inscrito.pagos?.[
                                  `${month}-${selectedYear}`
                                ]
                                  ? "#ffffff"
                                  : "#000000",
                                textAlign: "center",
                              }}
                            >
                              {month}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </div>
          <hr style={{ marginBottom: "1rem" }} />
          <div className="mt-4">
            <h2 className="text-center">Notas</h2>
            <div
              style={{
                maxHeight: "230px",
                overflowY: "auto",
                marginBottom: "1rem",
              }}
            >
              {inscrito.notas?.length > 0 ? (
                <ListGroup>
                  {inscrito.notas.map((nota, index) => (
                    <ListGroup.Item
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{nota}</span>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteNote(index)}
                      >
                        <FaTrash />
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No hay notas disponibles.</p>
              )}
            </div>
            <Button variant="primary" onClick={handleAddNote}>
              Añadir Nota
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Modal para Añadir Notas */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Nota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="notaText">
            <Form.Label>Nota</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveNote}>
            Guardar Nota
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UserDetail;
