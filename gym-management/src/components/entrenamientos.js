import React, { useState } from 'react';
import { Accordion, Form, Button, Container, Row, Col } from 'react-bootstrap';
import jsPDF from 'jspdf';
import logo from '../assets/logo.png'; // Asegúrate de importar correctamente el logo
import BackButton from './BackButton';

const Entrenamiento = () => {
  const [nombrePersona, setNombrePersona] = useState(''); // Nuevo estado para el nombre de la persona
  const [ejercicios, setEjercicios] = useState({
    PECHO: {
      Superior: {
        'Press banca barra': { series: '', repeticiones: '' },
        'Press mancuerna horizontal': { series: '', repeticiones: '' },
        'Press horizontal maquina': { series: '', repeticiones: '' },
      },
      Medio: {
        'Press banca inclinado barra': { series: '', repeticiones: '' },
        'Press inclinado mancuerna': { series: '', repeticiones: '' },
        'Press inclinado maquina': { series: '', repeticiones: '' },
        'Polea': { series: '', repeticiones: '' },
      },
      Inferior: {
        'Press banca declinado barra': { series: '', repeticiones: '' },
        'Banco declinado mancuerna': { series: '', repeticiones: '' },
        'Polea': { series: '', repeticiones: '' },
        'Fondo': { series: '', repeticiones: '' },
      },
      Apertura: {
        'Apertura maquina': { series: '', repeticiones: '' },
        'Apertura polea': { series: '', repeticiones: '' },
        'Apertura mancuerna banco': { series: '', repeticiones: '' },
      }
    },
    BICEPS: {
      Curl: {
        'Curl Barra': { series: '', repeticiones: '' },
        'Curl Mancuerna': { series: '', repeticiones: '' },
        'Curl Polea': { series: '', repeticiones: '' },
      },
      Martillo: {
        'Martillo Polea': { series: '', repeticiones: '' },
        'Martillo Mancuerna': { series: '', repeticiones: '' },
      },
      Predicador: {
        'Predicador Maquina': { series: '', repeticiones: '' },
        'Banco Scott': { series: '', repeticiones: '' },
      }
    },
    TRICEPS: {
      Frances: {
        'Frances Barra': { series: '', repeticiones: '' },
        'Frances Mancuerna': { series: '', repeticiones: '' },
        'Frances Maquina': { series: '', repeticiones: '' },
      },
      Polea: {
        'Polea Cuerda': { series: '', repeticiones: '' },
        'Polea Agarre': { series: '', repeticiones: '' },
      },
      Fondo: {
        'Fondo': { series: '', repeticiones: '' },
      }
    },
    ESPALDA: {
      Dominadas: {
        'Dominadas': { series: '', repeticiones: '' }
      },
      'Jalon al pecho': {
        'Jalon al pecho': { series: '', repeticiones: '' }
      },
      'Pullover en polea': {
        'Pullover en polea': { series: '', repeticiones: '' }
      },
      Remo: {
        'Remo barra': { series: '', repeticiones: '' },
        'Remo Maquina': { series: '', repeticiones: '' },
        'Remo mancuerna': { series: '', repeticiones: '' },
      },
      'Peso muerto': {
        'Peso muerto': { series: '', repeticiones: '' }
      },
      'Espalda superior': {
        'Espalda superior maquina': { series: '', repeticiones: '' },
        'Espalda superior barra': { series: '', repeticiones: '' },
        'Espalda superior mancuerna': { series: '', repeticiones: '' },
      }
    },
    HOMBRO: {
      Press: {
        'Press maquina': { series: '', repeticiones: '' },
        'Press mancuerna': { series: '', repeticiones: '' },
        'Press barra': { series: '', repeticiones: '' },
      },
      Vuelo: {
        'Vuelo polea': { series: '', repeticiones: '' },
        'Vuelo mancuerna': { series: '', repeticiones: '' },
      },
      Posterior: {
        'Posterior polea': { series: '', repeticiones: '' },
        'Posterior mancuerna': { series: '', repeticiones: '' },
        'Posterior maquina': { series: '', repeticiones: '' },
      }
    },
    PIERNAS: {
      Delantera: {
        'Prensa / sentadilla hack': { series: '', repeticiones: '' },
        'Sentadilla Sissy': { series: '', repeticiones: '' },
        'Sentadilla barra': { series: '', repeticiones: '' },
        'Abductor': { series: '', repeticiones: '' },
        'Extensión cuadriceps': { series: '', repeticiones: '' },
        'Peso muerto': { series: '', repeticiones: '' },
        'Gemelo': { series: '', repeticiones: '' },
      },
      Trasera: {
        'Hit Thrust': { series: '', repeticiones: '' },
        'Femoral tumbado': { series: '', repeticiones: '' },
        'Femoral tumbado': { series: '', repeticiones: '' },
        'Peso muerto búlgaro': { series: '', repeticiones: '' },
        'Patada gluteo polea': { series: '', repeticiones: '' },
        'Patada gluteo suelo': { series: '', repeticiones: '' },
        'Abductor': { series: '', repeticiones: '' },
      }
    }
  });

  const isValidValue = (value) => value !== '' && value !== '0' && value !== 0;

  const handleChange = (muscle, group, exercise, field, value) => {
    setEjercicios((prevState) => {
      const updatedEjercicio = {
        ...prevState[muscle][group][exercise],
        [field]: value,
        checked:
          isValidValue(value) ||
          (isValidValue(prevState[muscle][group][exercise].series) &&
            isValidValue(prevState[muscle][group][exercise].repeticiones))
      };

      if (
        (!isValidValue(updatedEjercicio.series) &&
          !isValidValue(updatedEjercicio.repeticiones))
      ) {
        updatedEjercicio.checked = false;
      }

      return {
        ...prevState,
        [muscle]: {
          ...prevState[muscle],
          [group]: {
            ...prevState[muscle][group],
            [exercise]: updatedEjercicio,
          },
        },
      };
    });
  };

  // Función para obtener la fecha actual en formato dd/mm/yyyy
  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString();
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    // Añadir logo en la esquina superior derecha
    const img = new Image();
    img.src = logo; 
    doc.addImage(img, 'PNG', 150, 10, 30, 30);

    // Título principal y nombre de la persona
    doc.setFontSize(18);
    doc.text(`Entrenamiento de ${nombrePersona}`, 10, 20);

    let yPosition = 40; 

    // Recorrer todos los músculos
    Object.keys(ejercicios).forEach((muscle) => {
      let muscleAdded = false;

      Object.keys(ejercicios[muscle]).forEach((group) => {
        let groupAdded = false;

        Object.keys(ejercicios[muscle][group]).forEach((exercise) => {
          const { series, repeticiones, checked } = ejercicios[muscle][group][exercise];

          if (checked && isValidValue(series) && isValidValue(repeticiones)) {
            if (!muscleAdded) {
              doc.setFontSize(14);
              doc.setTextColor(0, 0, 255);
              doc.text(muscle, 10, yPosition);
              yPosition += 8;
              muscleAdded = true;
            }

            if (!groupAdded) {
              doc.setFontSize(12);
              doc.setTextColor(0, 102, 204);
              doc.text(group, 15, yPosition);
              yPosition += 6;
              groupAdded = true;
            }

            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(
              `${exercise}: ${series} series x ${repeticiones} repeticiones`,
              20,
              yPosition
            );
            yPosition += 6;
          }
        });

        if (groupAdded) yPosition += 4;
      });

      if (muscleAdded) yPosition += 10;
    });

    doc.save('entrenamiento.pdf');
  };

  return (
    <>
      <BackButton />
      <Container>
        <h1 className="my-4">Plan de Entrenamiento</h1>

        {/* Input para ingresar el nombre de la persona */}
        <Form.Group controlId="nombrePersona" className="mb-4">
          <Form.Label>Nombre de la Persona</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa el nombre"
            value={nombrePersona}
            onChange={(e) => setNombrePersona(e.target.value)}
          />
        </Form.Group>

        <div style={{ height: '600px', overflowY: 'auto' }}>
          <Accordion defaultActiveKey="0">
            {Object.keys(ejercicios).map((muscle, idx) => (
              <Accordion.Item eventKey={idx.toString()} key={muscle}>
                <Accordion.Header>{muscle}</Accordion.Header>
                <Accordion.Body>
                  {Object.keys(ejercicios[muscle]).map((group) => (
                    <div key={group}>
                      <h5>{group}</h5>
                      {Object.keys(ejercicios[muscle][group]).map((exercise) => (
                        <div key={exercise} className="mb-3">
                          <Row>
                            <Col md={1}>
                              <Form.Check
                                type="checkbox"
                                checked={ejercicios[muscle][group][exercise].checked}
                                disabled
                              />
                            </Col>
                            <Col md={2}>
                              <Form.Control
                                type="number"
                                placeholder="Series"
                                value={ejercicios[muscle][group][exercise].series}
                                onChange={(e) =>
                                  handleChange(muscle, group, exercise, 'series', e.target.value)
                                }
                              />
                            </Col>
                            <Col md={2}>
                              <Form.Control
                                type="number"
                                placeholder="Repeticiones"
                                value={ejercicios[muscle][group][exercise].repeticiones}
                                onChange={(e) =>
                                  handleChange(muscle, group, exercise, 'repeticiones', e.target.value)
                                }
                              />
                            </Col>
                            <Col md={7}>
                              <Form.Label>{exercise}</Form.Label>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </div>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>

        <Button variant="primary" className="mt-4" onClick={generatePDF}>
          Generar PDF
        </Button>
      </Container>
    </>
  );
};

export default Entrenamiento;
