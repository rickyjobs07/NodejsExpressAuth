const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info:{
        title: 'Mi API con Node js, Express y Mongoose',
        version: '1.0.0',
        description: 'Documentación con Swaager',
    },
    servers:[
        {
            url: 'http://localhost:8000/api',
            description: 'Servidor local'
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routers/*.js'],
}

module.exports = swaggerJSDoc(options);