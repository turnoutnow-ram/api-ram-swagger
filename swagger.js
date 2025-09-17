// Load environment variables from .env file (for local development)
require('dotenv').config();

const swaggerAutogen = require('swagger-autogen')();

// Swagger configuration object
const swaggerConfig = {
  info: {
    title: 'My REST API',
    description: 'A REST API built with Node.js, Express, and Swagger documentation',
    version: '1.0.0',
    contact: {
      name: 'API Support',
      email: 'support@myapi.com'
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
    }
  },
  // Dynamic host configuration - will be set by the application at runtime
  host: process.env.RAILWAY_PUBLIC_DOMAIN || 'localhost:3000',
  basePath: '/',
  schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
  consumes: ['application/json'],
  produces: ['application/json']
};

// Output file for generated Swagger documentation
const outputFile = './swagger-output.json';

// Input files to scan for Swagger annotations - only scan app.js to avoid duplicate routes
const endpointsFiles = ['./app.js'];

/**
 * Generate Swagger documentation
 * This function scans the specified files for Swagger annotations
 * and generates a complete OpenAPI specification
 */
const generateSwaggerDocs = async () => {
  try {
    console.log('🔄 Generating Swagger documentation...');
    
    await swaggerAutogen(outputFile, endpointsFiles, swaggerConfig);
    
    console.log('✅ Swagger documentation generated successfully!');
    console.log(`📄 Documentation file: ${outputFile}`);
    console.log('🚀 Start your server with "npm start" and visit /api-docs to view the documentation');
    
  } catch (error) {
    console.error('❌ Error generating Swagger documentation:', error.message);
    process.exit(1);
  }
};

// Run the documentation generation
generateSwaggerDocs();
