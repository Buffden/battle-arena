const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
