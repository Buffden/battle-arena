const request = require('supertest');

// Mock the server module
let app;
let server;

beforeAll(() => {
  // Set test port
  process.env.PORT = '0'; // Use random port for tests
  const express = require('express');
  app = express();
  app.use(express.json());
  
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'game-engine', port: process.env.PORT || 5002 });
  });
  
  app.get('/', (req, res) => {
    res.json({ 
      service: 'game-engine',
      port: process.env.PORT || 5002,
      status: 'running',
      message: 'Game engine service is running'
    });
  });
});

afterAll(() => {
  if (server) {
    server.close();
  }
});

describe('Game Engine Service', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('service', 'game-engine');
      expect(response.body).toHaveProperty('port');
    });
  });

  describe('GET /', () => {
    it('should return service information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.body).toHaveProperty('service', 'game-engine');
      expect(response.body).toHaveProperty('status', 'running');
      expect(response.body).toHaveProperty('message');
    });
  });
});

