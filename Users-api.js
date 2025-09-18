// Load environment variables
require('dotenv').config();

const express = require('express');
const amqp = require('amqplib');

// Create Express router instance
const router = express.Router();

// RabbitMQ connection configuration
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const USER_QUEUE = 'user_events';

/**
 * RabbitMQ connection and channel management
 */
let connection = null;
let channel = null;

/**
 * Initialize RabbitMQ connection
 * Establishes connection to RabbitMQ server and creates channel
 */
const initializeRabbitMQ = async () => {
  try {
    console.log('🐰 Connecting to RabbitMQ...');
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Ensure the queue exists
    await channel.assertQueue(USER_QUEUE, { durable: true });
    
    console.log('✅ RabbitMQ connection established for Users API');
    
    // Handle connection close
    connection.on('close', () => {
      console.log('⚠️  RabbitMQ connection closed');
    });
    
    connection.on('error', (err) => {
      console.error('❌ RabbitMQ connection error:', err.message);
    });
    
  } catch (error) {
    console.error('❌ Failed to connect to RabbitMQ:', error.message);
    // In production, you might want to retry or exit the process
  }
};

/**
 * Publish message to RabbitMQ queue
 * @param {string} queue - Queue name
 * @param {Object} message - Message payload
 */
const publishMessage = async (queue, message) => {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel not initialized');
    }
    
    const messageBuffer = Buffer.from(JSON.stringify(message));
    await channel.sendToQueue(queue, messageBuffer, { persistent: true });
    
    console.log(`📤 Message published to queue '${queue}':`, message);
    return true;
  } catch (error) {
    console.error('❌ Failed to publish message:', error.message);
    return false;
  }
};

/**
 * POST /users/create - Create a new user
 * Creates user and publishes event to RabbitMQ for order processing
 */
router.post('/create', async (req, res) => {
  try {
    const { firstName, lastName, email, department } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'firstName, lastName, and email are required',
        timestamp: new Date().toISOString()
      });
    }
    
    // Simulate user creation (in real app, this would save to database)
    const newUser = {
      id: Math.floor(Math.random() * 10000) + 1000,
      firstName,
      lastName,
      email,
      department: department || 'General',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    // Publish user creation event to RabbitMQ
    const userEvent = {
      eventType: 'USER_CREATED',
      userId: newUser.id,
      userEmail: newUser.email,
      userData: newUser,
      timestamp: new Date().toISOString()
    };
    
    const published = await publishMessage(USER_QUEUE, userEvent);
    
    // Return response
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
      messagePublished: published,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Initialize RabbitMQ when module loads
initializeRabbitMQ();

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down Users API gracefully...');
  if (channel) await channel.close();
  if (connection) await connection.close();
  process.exit(0);
});

// Export the router
module.exports = router;



