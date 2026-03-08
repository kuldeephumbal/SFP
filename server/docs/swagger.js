const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Determine port and server URL (sync with app.js and .env)
const port = process.env.PORT || 8000;
const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SFP API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Shankhnad Foundation Project (SFP)',
      contact: {
        name: 'SFP Support',
      },
    },
    servers: [
      {
        url: serverUrl,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Login to /api/auth/login to get a token, then enter it here in the format: Bearer <token>',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Use forward slashes for glob patterns to ensure compatibility on Windows
  apis: [
    path.join(__dirname, '../routes/*.js').replace(/\\/g, '/'),
    path.join(__dirname, '../app.js').replace(/\\/g, '/')
  ],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  // Swagger UI Page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "SFP API Reference"
  }));

  // JSON documentation for external tools
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`Swagger documentation is available at: ${serverUrl}/api-docs`);
};

module.exports = swaggerDocs;
