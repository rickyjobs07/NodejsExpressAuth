const express = require('express');//Se importa express, el framework para manejar el servidor.
const helmet = require('helmet');//Middleware de seguridad que agrega encabezados HTTP para proteger la aplicación contra ataques como XSS, clickjacking y CSRF.
const cors = require('cors');//Middleware que habilita el Cross-Origin Resource Sharing (CORS), permitiendo que tu API sea consumida desde diferentes dominios.
const cookieParser = require('cookie-parser');//Middleware que permite leer y gestionar cookies en las solicitudes HTTP.
const mongoose = require('mongoose');

const authRouter = require('./routers/authRouter');
const postsRouter = require('./routers/postsRouter');

//Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerOptions');

const app = express();//Se crea una instancia de Express para configurar rutas y middlewares.

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json()); //permite que la API pueda recibir datos en formato JSON en las peticiones POST o PUT.

app.use(express.urlencoded({ extended: true}));// Express convierte automáticamente los datos en un objeto JavaScript accesible en req.body.

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database connected");
}).catch(err => {
    console.log("Error while connecting to the database.",err)
})

app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req,res) => {
    res.json({message: "Hello from the server"});
});

app.use('/api/auth', authRouter);
app.use('/api/post', postsRouter);

app.listen(process.env.PORT, () => {
    console.log('Listening in port: ' + process.env.PORT);
    console.log(`Swagger docs available at http://localhost:${process.env.PORT}/api/api-docs`);
});