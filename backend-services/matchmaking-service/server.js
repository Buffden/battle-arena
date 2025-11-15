const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'matchmaking-service', port: PORT });
});

app.get('/', (req, res) => {
  res.json({
    service: 'matchmaking-service',
    port: PORT,
    status: 'running',
    message: 'Matchmaking service is running'
  });
});

app.listen(PORT, () => {
  console.log(`Matchmaking service running on port ${PORT}`);
});

