// Load environment variables
require('dotenv').config();

const express = require('express');
const amqp = require('amqplib');

// Create Express router instance
const router = express.Router();

// RabbitMQ connection configuration
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const USER_QUEUE = 'user_events';
const ORDER_QUEUE = 'order_events';

// In-memory storage for processed user events (in real app, use database)
let processedUserEvents = [];

/**
 * RabbitMQ connection and channel management
 */
let connection = null;
let channel = null;

/**
 * Initialize RabbitMQ connection and consumer
 * Establishes connection to RabbitMQ server and sets up message consumer
 */
const initializeRabbitMQ = async () => {
  try {
    console.log('🐰 Connecting to RabbitMQ for Orders API...');
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Ensure queues exist
    await channel.assertQueue(USER_QUEUE, { durable: true });
    await channel.assertQueue(ORDER_QUEUE, { durable: true });
    
    console.log('✅ RabbitMQ connection established for Orders API');
    
    // Set up consumer for user events
    await setupUserEventConsumer();
    
    // Handle connection close
    connection.on('close', () => {
      console.log('⚠️  RabbitMQ connection closed');
    });
    
    connection.on('error', (err) => {
      console.error('❌ RabbitMQ connection error:', err.message);
    });
    
  } catch (error) {
    console.error('❌ Failed to connect to RabbitMQ:', error.message);
  }
};

/**
 * Set up consumer to listen for user events
 * Processes incoming user creation events from Users API
 */
const setupUserEventConsumer = async () => {
  try {
    await channel.consume(USER_QUEUE, (message) => {
      if (message) {
        const userEvent = JSON.parse(message.content.toString());
        console.log('📥 Received user event:', userEvent);
        
        // Process the user event (e.g., create welcome order, setup account)
        processUserEvent(userEvent);
        
        // Acknowledge message processing
        channel.ack(message);
      }
    });
    
    console.log('👂 Listening for user events on queue:', USER_QUEUE);
  } catch (error) {
    console.error('❌ Failed to setup consumer:', error.message);
  }
};

/**
 * Process user creation events
 * @param {Object} userEvent - User event data from RabbitMQ
 */
const processUserEvent = (userEvent) => {
  try {
    // Store processed event (in real app, save to database)
    processedUserEvents.push({
      ...userEvent,
      processedAt: new Date().toISOString(),
      orderStatus: 'welcome_order_created'
    });
    
    console.log(`✨ Processed user event for user ID: ${userEvent.userId}`);
  } catch (error) {
    console.error('❌ Error processing user event:', error.message);
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
 * POST /orders/create - Create a new order
 * Creates order and publishes event to RabbitMQ
 */
router.post('/create', async (req, res) => {
  try {
    const { userId, productName, quantity, price } = req.body;
    
    // Validate required fields
    if (!userId || !productName || !quantity || !price) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'userId, productName, quantity, and price are required',
        timestamp: new Date().toISOString()
      });
    }
    
    // Simulate order creation (in real app, this would save to database)
    const newOrder = {
      id: Math.floor(Math.random() * 10000) + 5000,
      userId: parseInt(userId),
      productName,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      totalAmount: parseInt(quantity) * parseFloat(price),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Publish order creation event to RabbitMQ
    const orderEvent = {
      eventType: 'ORDER_CREATED',
      orderId: newOrder.id,
      userId: newOrder.userId,
      orderData: newOrder,
      timestamp: new Date().toISOString()
    };
    
    const published = await publishMessage(ORDER_QUEUE, orderEvent);
    
    // Return response
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder,
      messagePublished: published,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /orders/processed-users - Get processed user events
 * Returns list of user events that have been processed by the order service
 */
router.get('/processed-users', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Processed user events retrieved successfully',
      count: processedUserEvents.length,
      data: processedUserEvents,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error retrieving processed users:', error.message);
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
  console.log('🛑 Shutting down Orders API gracefully...');
  if (channel) await channel.close();
  if (connection) await connection.close();
  process.exit(0);
});

// Export the router
module.exports = router;



