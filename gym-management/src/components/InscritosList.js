import React, { useContext, useState } from 'react';
import { FileContext } from '../context/FileContext';
import { Table, Container, InputGroup, FormControl, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';

const normalizeText = (text) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

function InscritosList() {
  const { inscritos, deleteInscrito, updateInscrito } = useContext(FileContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteInscrito(id)
          .then(() => {
            Swal.fire(
              'Eliminado!',
              'El inscrito ha sido eliminado.',
              'success'
            );
          })
          .catch((error) => {
            console.error('Error al eliminar el inscrito:', error);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar el inscrito.',
              'error'
            );
          });
      }
    });
  };

  const getWeekOfMonth = (date) => {
    const dayOfWeek = (date.getDay() + 6) % 7; // Hace que la semana comience en lunes
    const adjustedDate = date.getDate() - dayOfWeek + 1;
    return Math.ceil(adjustedDate / 7);
  };

  const groupByMonthAndWeek = (asistencia) => {
    return asistencia.reduce((acc, dateStr) => {
      const date = new Date(dateStr);
      const month = date.toLocaleString('default', { month: 'long' });
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

  const handleMarkAttendance = (id) => {
    const today = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato 'YYYY-MM-DD'
    const inscrito = inscritos.find((insc) => insc.id === id);

    if (inscrito) {
      // Verificar si la fecha ya existe
      if (inscrito.asistencia.includes(today)) {
        Swal.fire({
          icon: 'warning',
          title: 'Fecha ya marcada',
          text: `Ya se ha registrado la asistencia para la fecha ${today}.`,
        });
        return;
      }

      const updatedAsistencia = [...inscrito.asistencia, today];
      const date = new Date(today);
      const weekOfMonth = getWeekOfMonth(date);
      const monthYearKey = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;

      const asistenciaPorSemana = groupByMonthAndWeek(inscrito.asistencia);

      if (
        inscrito.tarifa === '2-dias' &&
        asistenciaPorSemana[monthYearKey] &&
        asistenciaPorSemana[monthYearKey][weekOfMonth] &&
        asistenciaPorSemana[monthYearKey][weekOfMonth].length >= 2
      ) {
        Swal.fire({
          icon: 'warning',
          title: 'Límite alcanzado',
          text: 'Ya ha registrado dos asistencias para esta semana.',
        });
        return;
      }

      const updatedInscrito = { ...inscrito, asistencia: updatedAsistencia };

      updateInscrito(id, updatedInscrito)
        .then(() => {
          Swal.fire(
            'Asistencia marcada!',
            `La asistencia para la fecha ${today} ha sido registrada.`,
            'success'
          );
        })
        .catch((error) => {
          console.error('Error al actualizar la asistencia:', error);
          Swal.fire(
            'Error',
            'Hubo un problema al marcar la asistencia.',
            'error'
          );
        });
    }
  };

  const handleToggleActivo = (id, activo) => {
    const inscrito = inscritos.find((insc) => insc.id === id);
    if (inscrito) {
      const updatedInscrito = { ...inscrito, activo: !activo };
      updateInscrito(id, updatedInscrito)
        .then(() => {
          Swal.fire(
            'Estado actualizado!',
            `El estado de "activo" ha sido actualizado.`,
            'success'
          );
        })
        .catch((error) => {
          console.error('Error al actualizar el estado:', error);
          Swal.fire(
            'Error',
            'Hubo un problema al actualizar el estado.',
            'error'
          );
        });
    }
  };

  const getLastPaidMonth = (pagos) => {
    if (!pagos || Object.keys(pagos).length === 0) return 'No registrado';

    const months = Object.keys(pagos);

    for (let i = months.length - 1; i >= 0; i--) {
      if (pagos[months[i]]) {
        return months[i];
      }
    }

    return 'No registrado';
  };

  const filteredInscritos = inscritos.filter(
    (inscrito) =>
      normalizeText(inscrito.nombre).includes(normalizeText(searchTerm)) ||
      normalizeText(inscrito.apellido).includes(normalizeText(searchTerm)) ||
      normalizeText(inscrito.dni).includes(normalizeText(searchTerm))
  );

  const totalInscritos = inscritos.length;
  const totalActivos = inscritos.filter(inscrito => inscrito.activo).length;
  const totalInactivos = inscritos.filter(inscrito => !inscrito.activo).length;

  const rowStyle = {
    cursor: 'pointer',
  };

  const rowHoverStyle = {
    backgroundColor: '#fffbe7', // color de fondo "yema de huevo" al hacer hover
  };

  const lastRowStyle = {
    backgroundColor: '#f8f9fa', // color gris claro para la última fila
  };

  return (
    <Container className="mt-4">
      <BackButton />
      <h2 className="mb-4 text-center">Lista de Inscritos</h2>

      <InputGroup className="mb-4">
        <FormControl
          placeholder="Buscar por Nombre, Apellido o DNI"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          autoFocus
        />
      </InputGroup>

      <div className="mb-4 d-flex justify-content-around">
        <p><strong>Total inscritos:</strong> {totalInscritos}</p>
        <p><strong>Usuarios activo:</strong> {totalActivos}</p>
        <p><strong>Usuarios inactivo:</strong> {totalInactivos}</p>
      </div>

      {filteredInscritos.length > 0 ? (
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <Table striped bordered hover responsive className="mb-0">
            <thead className="table-dark">
              <tr>
                <th>Activos</th>
                <th>Asistencia</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Edad</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Fecha Inscripcion</th>
                <th>Tarifa</th>
                <th>Último Mes Pagado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInscritos.map((inscrito, index) => (
                <tr
                  key={inscrito.id}
                  onClick={() => navigate(`/inscritos/${inscrito.id}`)}
                  style={index % 2 === 0 ? rowStyle : lastRowStyle} // alternar el color de las filas
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = rowHoverStyle.backgroundColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? rowStyle.backgroundColor : lastRowStyle.backgroundColor}
                >
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={inscrito.activo}
                      onChange={() => handleToggleActivo(inscrito.id, inscrito.activo)}
                      onClick={(e) => e.stopPropagation()} // Evita que se dispare la navegación al hacer clic
                    />
                  </td>
                  <td className='d-flex justify-content-center' onClick={(e) => { e.stopPropagation(); handleMarkAttendance(inscrito.id); }}>
                    <Button variant="success" size="sm">
                      Marcar asistencia
                    </Button>
                  </td>
                  <td>{inscrito.nombre}</td>
                  <td>{inscrito.apellido}</td>
                  <td>{inscrito.edad}</td>
                  <td>{inscrito.telefono}</td>
                  <td>{inscrito.email}</td>
                  <td>{inscrito.fechaInscripcion}</td>
                  <td>{inscrito.tarifa}</td>
                  <td>{getLastPaidMonth(inscrito.pagos)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/inscritos/${inscrito.id}/editar`)}
                      className="me-2"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(inscrito.id)}
                      className="me-2"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div>No hay inscritos registrados.</div>
      )}
    </Container>
  );
}

export default InscritosList;
