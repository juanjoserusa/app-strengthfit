import React, { createContext, useState, useEffect } from 'react';

export const ControlDeGastosContext = createContext();

export const ControlDeGastosProvider = ({ children }) => {
  const [gastos, setGastos] = useState([]);
  const [fixedGastos, setFixedGastos] = useState([]); // Lista de gastos fijos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar los gastos y los gastos fijos al inicializar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/control-de-gastos');
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json();
        setGastos(data.gastos || []);
        setFixedGastos(data.fixedGastos || []); // Aseguramos que los gastos fijos también se carguen
      } catch (error) {
        console.error('Error al cargar los gastos:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para agregar un gasto
  const addGasto = (nuevoGasto) => {
    return fetch('http://localhost:5000/control-de-gastos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoGasto),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setGastos((prev) => [...prev, data]);
      })
      .catch((error) => {
        console.error('Error al guardar el gasto:', error);
        throw error; // Lanza el error para que pueda ser manejado por el componente
      });
  };

  // Función para agregar un gasto fijo
  const addFixedGasto = (nuevoGastoFijo) => {
    return fetch('http://localhost:5000/control-de-gastos/fixed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoGastoFijo),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setFixedGastos((prev) => [...prev, data]);
      })
      .catch((error) => {
        console.error('Error al guardar el gasto fijo:', error);
        throw error; // Lanza el error para que pueda ser manejado por el componente
      });
  };

  // Función para eliminar un gasto
  const deleteGasto = (id) => {
    return fetch(`http://localhost:5000/control-de-gastos/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        setGastos((prev) => prev.filter((gasto) => gasto.id !== id));
      })
      .catch((error) => {
        console.error('Error al eliminar el gasto:', error);
        throw error; // Lanza el error para que pueda ser manejado por el componente
      });
  };

  // Función para eliminar un gasto fijo
  const deleteFixedGasto = (id) => {
    return fetch(`http://localhost:5000/control-de-gastos/fixed/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        setFixedGastos((prev) => prev.filter((gasto) => gasto.id !== id));
      })
      .catch((error) => {
        console.error('Error al eliminar el gasto fijo:', error);
        throw error; // Lanza el error para que pueda ser manejado por el componente
      });
  };

  // Función para generar los gastos fijos desde la fecha de creación hasta diciembre de 2026
  const generateFixedGastosForAllMonths = () => {
    const currentDate = new Date();
    const endDate = new Date(2026, 11, 31); // Hasta diciembre de 2026
    const allFixedGastos = [];

    fixedGastos.forEach(fixedGasto => {
      let gastoDate = new Date(fixedGasto.date);

      while (gastoDate <= endDate) {
        const newGasto = {
          ...fixedGasto,
          date: gastoDate.toISOString().split('T')[0], // Fecha en formato YYYY-MM-DD
        };
        allFixedGastos.push(newGasto);

        // Avanzar un mes
        gastoDate.setMonth(gastoDate.getMonth() + 1);
      }
    });

    return allFixedGastos;
  };

  // Esta función debe ser llamada cuando se consulten los gastos (por ejemplo, en el componente de consulta)
  const getAllGastosIncludingFixed = () => {
    return [...gastos, ...generateFixedGastosForAllMonths()];
  };

  return (
    <ControlDeGastosContext.Provider
      value={{
        gastos: getAllGastosIncludingFixed(), // Incluimos los gastos fijos replicados
        addGasto,
        deleteGasto,
        fixedGastos,
        addFixedGasto,
        deleteFixedGasto,
        loading,
        error,
      }}
    >
      {children}
    </ControlDeGastosContext.Provider>
  );
};
