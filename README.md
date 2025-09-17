# My REST API

A professional REST API built with Node.js, Express, and comprehensive Swagger documentation.

## 🚀 Features

- **RESTful API** with proper HTTP status codes
- **Comprehensive Swagger Documentation** using swagger-ui-express and swagger-autogen
- **Error Handling** with detailed error responses
- **Input Validation** and parameter filtering
- **Modular Architecture** with separate routes file
- **Health Check Endpoint** for monitoring
- **Sample User Data** with realistic user objects

## 📦 Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Generate Swagger Documentation**
   ```bash
   npm run swagger
   ```

3. **Start the Server**
   ```bash
   # Production
   npm start
   
   # Development (with auto-reload)
   npm run dev
   ```

## 🔗 API Endpoints

### Base URL
```
http://localhost:3000
```

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API health check |
| GET | `/api/users` | Get all users (with optional filtering) |
| GET | `/api/users/:id` | Get user by ID |
| GET | `/api-docs` | Swagger documentation |

### Query Parameters for `/api/users`

- `department` (string): Filter users by department (e.g., Engineering, Marketing, Sales)
- `isActive` (boolean): Filter users by active status (true/false)

### Example Requests

```bash
# Get all users
curl http://localhost:3000/api/users

# Get users by department
curl http://localhost:3000/api/users?department=Engineering

# Get active users only
curl http://localhost:3000/api/users?isActive=true

# Get specific user by ID
curl http://localhost:3000/api/users/1

# API health check
curl http://localhost:3000/
```

## 📖 Documentation

Once the server is running, visit:
```
http://localhost:3000/api-docs
```

This will show the complete Swagger UI documentation with:
- Interactive API testing
- Request/response schemas
- Parameter descriptions
- Example responses

## 🏗️ Project Structure

```
my_apis/
├── app.js              # Main application file
├── routes.js           # API routes definition
├── swagger.js          # Swagger documentation generator
├── swagger-output.json # Generated Swagger specification
├── package.json        # Project dependencies and scripts
└── README.md          # Project documentation
```

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **swagger-ui-express** - Swagger UI middleware
- **swagger-autogen** - Automatic Swagger documentation generation

## 📝 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": [...],
  "count": 4,
  "timestamp": "2023-09-17T12:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message",
  "timestamp": "2023-09-17T12:00:00Z"
}
```

## 🔧 Development

### Adding New Routes

1. Add your route handlers in `routes.js`
2. Include Swagger annotations using `#swagger` comments
3. Run `npm run swagger` to regenerate documentation
4. Restart the server to see changes

### Swagger Annotations Example

```javascript
router.get('/example', (req, res) => {
  // #swagger.tags = ['Example']
  // #swagger.summary = 'Example endpoint'
  // #swagger.description = 'Description of what this endpoint does'
  /* #swagger.responses[200] = {
    description: 'Success response',
    schema: { message: 'Example response' }
  } */
  
  res.json({ message: 'Example response' });
});
```

## 🚨 Error Handling

The API includes comprehensive error handling:
- **400** - Bad Request (invalid parameters)
- **404** - Not Found (resource doesn't exist)
- **500** - Internal Server Error (server issues)

All errors return detailed error messages and timestamps for debugging.

## 📊 Sample Data

The API includes sample user data with the following structure:
- `id` - Unique user identifier
- `firstName` - User's first name
- `lastName` - User's last name
- `email` - User's email address
- `age` - User's age
- `department` - User's department
- `isActive` - User's active status
- `createdAt` - Account creation timestamp

## 🤝 Contributing

1. Follow camelCase naming convention for JavaScript variables and methods
2. Add comprehensive comments for new functions
3. Implement proper error handling
4. Update Swagger documentation for new endpoints
5. Test all endpoints before committing

## 📄 License

ISC License
