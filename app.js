const express = require('express');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');

// Create Express application instance
const app = express();

// Define port number - use environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Import Swagger documentation (will be generated)
let swaggerDocument;
try {
  swaggerDocument = require('./swagger-output.json');
} catch (error) {
  console.log('Swagger documentation not found. Run "npm run swagger" to generate it.');
}

// Setup Swagger UI if documentation exists
if (swaggerDocument) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
/*
// Swagger documentation route - this is only for documentation purposes
app.get('/api/users', (req, res, next) => { 
  next();
});
*/
// Use routes from routes.js - this will handle the actual implementation
app.use('/api', routes);

// Root endpoint for API health check
app.get('/', (req, res) => {
  // #swagger.tags = ['Health Check']
  // #swagger.summary = 'API Health Check'
  // #swagger.description = 'Returns API status and available endpoints'
  try {
    res.status(200).json({
      message: 'REST API is running successfully!',
      version: '1.0.0',
      endpoints: {
        users: '/api/users',
        documentation: '/api-docs'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error.message);
  res.status(error.status || 500).json({
    error: 'Something went wrong!',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// Handle 404 - Route not found
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    availableRoutes: ['/api/users', '/api-docs'],
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📖 API Documentation available at: http://localhost:${PORT}/api-docs`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

// Export app for testing purposes
module.exports = app;
