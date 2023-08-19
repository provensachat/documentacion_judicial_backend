const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('./auth');
const connectToDatabase = require('./database');

const fileRouter = require('./routes/file');
const userRouter = require('./routes/user');
const caseRouter = require('./routes/case');
const extensionRouter = require('./routes/extension');
const observationRouter = require('./routes/observation');

const cors = require('cors');

// Configura express-session
app.use(session({
  secret: 'tu_secreto_aqui',
  resave: false,
  saveUninitialized: false
}));

// Para leer el body del req
app.use(cors());
app.use(express.json());

// Se encarga del manejo de sesión del usuario
app.use(passport.initialize());
app.use(passport.session());

// Ruta base para las rutas de los archivos
app.use('/api/file', fileRouter);

// Ruta base para las rutas de los usuarios
app.use('/api/user', userRouter);

// Ruta base para las rutas de los casos
app.use('/api/case', caseRouter);

// Ruta base para las rutas de las extensiones
app.use('/api/extension', extensionRouter);

// Ruta base para las rutas de las observaciones
app.use('/api/observation', observationRouter);

// Ruta prueba
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Login

app.post('/login', passport.authenticate('local'), function(req, res) {
  res.json(req.user);
});


// PORT utilizado
const PORT = 5000;

// Conexión a la base de datos
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
});
