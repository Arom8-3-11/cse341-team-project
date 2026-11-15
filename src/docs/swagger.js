//src/docs/swagger.js
// Swagger/OpenAPI configuration. API routes are documented with
// @swagger JSDoc comments in src/routes/api-routes.js.
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'Kizuna Rail API',
            version: '1.0.0',
            description: 'JSON API for the Kizuna Rail scenic railway booking site.'
        }
    },
    apis: ['./src/routes/api-routes.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
