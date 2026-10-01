import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { config } from './config.js';
import { authenticateTenant } from './middleware/auth.js';
import { rateLimiter, redis } from './middleware/rateLimiter.js';
import gatewayRouter from './routes/gateway.js';
import openApiRouter from './routes/openapi.js';

const app = express();
app.use(express.json());

// Routes & Middleware
app.use('/docs', openApiRouter);
app.use('/api', authenticateTenant, rateLimiter, gatewayRouter);

const server = http.createServer(app);

// WebSocket Upgrade for Real-time Multimodal Streams
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Process real-time frame or stream
    ws.send(JSON.stringify({ status: 'Sovereign Stream Connected', ack: true }));
  });
});

// Start Server
const PORT = config.port;
server.listen(PORT, () => {
  console.log(`Sovereign Builder OS Gateway listening on port ${PORT}`);
});

// Graceful Shutdown Procedure
const shutdown = async () => {
  console.log('Initiating graceful shutdown...');
  server.close(async () => {
    console.log('HTTP and WebSocket servers closed.');
    await redis.quit();
    console.log('Redis connections terminated.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
