import React, { createContext, useState, useEffect } from 'react';

// Definición del contexto
export const FileContext = createContext();

// Proveedor del contexto
export const FileProvider = ({ children }) => {
  const [inscritos, setInscritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/inscritos')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setInscritos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar los inscritos:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const saveData = (newInscrito) => {
    return fetch('http://localhost:5000/inscritos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newInscrito),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setInscritos((prev) => [...prev, data]);
      })
      .catch((error) => {
        console.error('Error al guardar el inscrito:', error);
        throw error;
      });
  };

  const updateInscrito = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/inscritos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();

      setInscritos((prev) =>
        prev.map((inscrito) =>
          inscrito.id === parseInt(id) ? data : inscrito
        )
      );

    } catch (error) {
      console.error('Error al actualizar el inscrito:', error);
      throw error;
    }
  };

  const deleteInscrito = (id) => {
    return fetch(`http://localhost:5000/inscritos/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.text();
      })
      .then(() => {
        setInscritos((prev) => prev.filter((inscrito) => inscrito.id !== parseInt(id)));
      })
      .catch((error) => {
        console.error('Error al eliminar el inscrito:', error);
        throw error;
      });
  };

  // Nueva función para completar un reto y asignar puntos al mes correspondiente
  const completarReto = (idUsuario, idReto, puntos, mes) => {
    setInscritos((prevInscritos) =>
      prevInscritos.map((inscrito) => {
        if (inscrito.id === idUsuario) {
          const puntosMes = inscrito.puntosPorMes || {}; // Verifica si existe el objeto de puntos por mes
          const puntosActuales = puntosMes[mes] || 0; // Obtiene los puntos actuales del mes, si no, empieza en 0

          return {
            ...inscrito,
            puntosPorMes: {
              ...puntosMes,
              [mes]: puntosActuales + puntos, // Suma los puntos al mes correspondiente
            },
            retosCompletados: [...(inscrito.retosCompletados || []), idReto],
          };
        }
        return inscrito;
      })
    );

    // También podrías hacer un fetch para actualizar en la base de datos
  };

  return (
    <FileContext.Provider
      value={{
        inscritos,
        saveData,
        updateInscrito,
        deleteInscrito,
        completarReto, // Añadir la nueva función al contexto
        loading,
        error,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
