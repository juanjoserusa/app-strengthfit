const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const inscritosFilePath = path.join(__dirname, 'inscritos.json');
const gastosFilePath = path.join(__dirname, 'controlDeGastos.json');

// Función para leer el archivo de gastos y devolver un objeto con los gastos y gastos fijos
const readGastosFile = (callback) => {
    fs.readFile(gastosFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            callback(err, null);
            return;
        }
        try {
            const gastosData = JSON.parse(data);
            callback(null, gastosData);
        } catch (parseErr) {
            console.error('Error al parsear el archivo:', parseErr);
            callback(parseErr, null);
        }
    });
};

// Función para escribir en el archivo de gastos
const writeGastosFile = (gastosData, callback) => {
    fs.writeFile(gastosFilePath, JSON.stringify(gastosData, null, 2), (err) => {
        if (err) {
            console.error('Error al escribir en el archivo:', err);
            callback(err);
            return;
        }
        callback(null);
    });
};

// Obtener todos los inscritos
app.get('/inscritos', (req, res) => {
    fs.readFile(inscritosFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            res.status(500).send('Error al leer el archivo de inscritos.');
            return;
        }
        res.send(JSON.parse(data));
    });
});

// Agregar nuevo inscrito
app.post('/inscritos', (req, res) => {
    fs.readFile(inscritosFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            res.status(500).send('Error al leer el archivo de inscritos.');
            return;
        }

        const inscritos = JSON.parse(data);
        const newInscrito = req.body;
        inscritos.push(newInscrito);

        fs.writeFile(inscritosFilePath, JSON.stringify(inscritos, null, 2), (err) => {
            if (err) {
                console.error('Error al escribir en el archivo:', err);
                res.status(500).send('Error al guardar el nuevo inscrito.');
                return;
            }
            res.status(201).json(newInscrito); // Devuelve el nuevo inscrito como JSON
        });
    });
});

// Actualizar inscrito existente
app.put('/inscritos/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile(inscritosFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            res.status(500).send('Error al leer el archivo de inscritos.');
            return;
        }

        let inscritos = JSON.parse(data);
        const inscritoIndex = inscritos.findIndex((i) => i.id === parseInt(id));

        if (inscritoIndex !== -1) {
            inscritos[inscritoIndex] = { ...inscritos[inscritoIndex], ...req.body };

            fs.writeFile(inscritosFilePath, JSON.stringify(inscritos, null, 2), (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo:', err);
                    res.status(500).send('Error al guardar los cambios del inscrito.');
                    return;
                }
                res.json(inscritos[inscritoIndex]); // Devuelve el inscrito actualizado como JSON
            });
        } else {
            res.status(404).send('Inscrito no encontrado.');
        }
    });
});

// Eliminar inscrito
app.delete('/inscritos/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile(inscritosFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            res.status(500).send('Error al leer el archivo de inscritos.');
            return;
        }

        let inscritos = JSON.parse(data);
        const newInscritos = inscritos.filter((i) => i.id !== parseInt(id));

        if (newInscritos.length === inscritos.length) {
            return res.status(404).send('Inscrito no encontrado.');
        }

        fs.writeFile(inscritosFilePath, JSON.stringify(newInscritos, null, 2), (err) => {
            if (err) {
                console.error('Error al escribir en el archivo:', err);
                res.status(500).send('Error al eliminar el inscrito.');
                return;
            }
            res.json({ message: 'Inscrito eliminado con éxito.' });
        });
    });
});

// ** Rutas para control de gastos **

// Obtener todos los registros de ingresos y gastos (normales y fijos)
app.get('/control-de-gastos', (req, res) => {
    readGastosFile((err, gastosData) => {
        if (err) {
            res.status(500).send('Error al leer el archivo de control de gastos.');
            return;
        }
        res.json(gastosData); // Devolver los datos de gastos y gastos fijos
    });
});

// Agregar un nuevo ingreso o gasto
app.post('/control-de-gastos', (req, res) => {
    readGastosFile((err, gastosData) => {
        if (err) {
            res.status(500).send('Error al leer el archivo de control de gastos.');
            return;
        }

        const nuevoGasto = req.body;
        gastosData.gastos.push(nuevoGasto); // Agregar el gasto normal

        writeGastosFile(gastosData, (writeErr) => {
            if (writeErr) {
                res.status(500).send('Error al guardar el nuevo ingreso/gasto.');
                return;
            }
            res.status(201).json(nuevoGasto); // Responder con el gasto creado
        });
    });
});

// Agregar un nuevo gasto fijo
app.post('/control-de-gastos/fixed', (req, res) => {
    readGastosFile((err, gastosData) => {
        if (err) {
            res.status(500).send('Error al leer el archivo de control de gastos.');
            return;
        }

        const nuevoGastoFijo = req.body;
        gastosData.fixedGastos.push(nuevoGastoFijo); // Agregar el gasto fijo

        writeGastosFile(gastosData, (writeErr) => {
            if (writeErr) {
                res.status(500).send('Error al guardar el nuevo gasto fijo.');
                return;
            }
            res.status(201).json(nuevoGastoFijo); // Responder con el gasto fijo creado
        });
    });
});

// Eliminar un ingreso o gasto
app.delete('/control-de-gastos/:id', (req, res) => {
    const { id } = req.params;

    readGastosFile((err, gastosData) => {
        if (err) {
            res.status(500).send('Error al leer el archivo de control de gastos.');
            return;
        }

        const nuevosGastos = gastosData.gastos.filter((gasto) => gasto.id !== parseInt(id));
        gastosData.gastos = nuevosGastos;

        writeGastosFile(gastosData, (writeErr) => {
            if (writeErr) {
                res.status(500).send('Error al eliminar el ingreso/gasto.');
                return;
            }
            res.json({ message: 'Ingreso/Gasto eliminado con éxito.' });
        });
    });
});

// Eliminar un gasto fijo
app.delete('/control-de-gastos/fixed/:id', (req, res) => {
    const { id } = req.params;

    readGastosFile((err, gastosData) => {
        if (err) {
            res.status(500).send('Error al leer el archivo de control de gastos.');
            return;
        }

        const nuevosGastosFijos = gastosData.fixedGastos.filter((gasto) => gasto.id !== parseInt(id));
        gastosData.fixedGastos = nuevosGastosFijos;

        writeGastosFile(gastosData, (writeErr) => {
            if (writeErr) {
                res.status(500).send('Error al eliminar el gasto fijo.');
                return;
            }
            res.json({ message: 'Gasto fijo eliminado con éxito.' });
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
