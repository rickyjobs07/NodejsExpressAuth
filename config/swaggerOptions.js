const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Posts con Node.js, Express y Mongoose',
    version: '1.0.0',
    description: `
      Esta es la documentación de la API RESTful para gestionar publicaciones (posts).  
      Incluye autenticación con JWT (Bearer Token) y operaciones CRUD completas.
    `,
    contact: {
      name: 'Ricky Montero Terrero',
      email: 'rickymonterojobs07@ejemplo.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:8000/api',
      description: 'Servidor local de desarrollo',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Introduce el token JWT con el prefijo **Bearer**, seguido de un espacio y el token.\n\nEjemplo: `Bearer eyJhbGci...`',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routers/*.js'], // Aquí debe ir la ruta de tus archivos con anotaciones Swagger
};

module.exports = swaggerJSDoc(options);
