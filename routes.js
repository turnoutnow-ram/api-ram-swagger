const express = require('express');
// Create Express router instance
const router = express.Router();

// Sample users data - in a real application, this would come from a database
const sampleUsers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    age: 30,
    department: 'Engineering',
    isActive: true,
    createdAt: '2023-01-15T10:30:00Z'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    age: 28,
    department: 'Marketing',
    isActive: true,
    createdAt: '2023-02-20T14:45:00Z'
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    age: 35,
    department: 'Sales',
    isActive: false,
    createdAt: '2023-03-10T09:15:00Z'
  },
  {
    id: 4,
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice.williams@example.com',
    age: 32,
    department: 'Engineering',
    isActive: true,
    createdAt: '2023-04-05T16:20:00Z'
  }
];

/**
 * GET /users - Retrieve all users
 * Returns a list of all users with optional filtering
 */
router.get('/users', (req, res) => {
  try {
    let filteredUsers = [...sampleUsers];  

    // Return successful response with users data
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      count: filteredUsers.length,
      data: filteredUsers,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Handle any errors that occur during processing
    console.error('Error retrieving users:', error.message);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
 

// Export the router to be used in app.js
module.exports = router;
