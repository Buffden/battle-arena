const express = require('express');
const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'game-engine', port: PORT });
});

app.get('/', (req, res) => {
  res.json({
    service: 'game-engine',
    port: PORT,
    status: 'running',
    message: 'Game engine service is running'
  });
});

app.listen(PORT, () => {
  console.log(`Game engine service running on port ${PORT}`);
});

