/**
 * Test file for API routes
 * Testing the GET /api/users endpoint
 */

const request = require('supertest');

// Import app without starting the server
// We'll use supertest to handle the server lifecycle
const app = require('./app');

// Test suite for Users API
describe('GET /api/users', () => {
  /**
   * Test case: Should return all users successfully
   * Verifies that the endpoint returns a 200 status with proper response structure
   */
  test('should return all users with success response', async () => {
    // Make GET request to /api/users endpoint
    const response = await request(app)
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /json/);

    // Verify response structure and data
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Users retrieved successfully');
    expect(response.body).toHaveProperty('count');
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('timestamp');
    
    // Verify data is an array
    expect(Array.isArray(response.body.data)).toBe(true);
    
    // Verify count matches data length
    expect(response.body.count).toBe(response.body.data.length);
    
    // Verify each user has required properties
    if (response.body.data.length > 0) {
      const firstUser = response.body.data[0];
      expect(firstUser).toHaveProperty('id');
      expect(firstUser).toHaveProperty('firstName');
      expect(firstUser).toHaveProperty('lastName');
      expect(firstUser).toHaveProperty('email');
      expect(firstUser).toHaveProperty('department');
      expect(firstUser).toHaveProperty('isActive');
      expect(firstUser).toHaveProperty('createdAt');
    }
    
    // Verify timestamp is a valid ISO string
    expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
  });
});
