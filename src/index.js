// src/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const { PORT } = require('./config');
const { connectToMongo } = require('./db/client');
const employeesRoutes = require('./routes/employees');
const tasksRoutes = require('./routes/tasks');
const healthRoutes = require('./routes/health');
const { errorHandler } = require('./utils/errors');

async function start() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Serve static frontend from /public (repo root)
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Swagger UI at /api/docs (if openapi.yaml exists)
  try {
    const swaggerDoc = YAML.load(path.join(__dirname, 'openapi.yaml'));
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
  } catch (err) {
    console.warn('Swagger not available:', err.message);
  }

  try {
    await connectToMongo();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB on startup:', err);
    process.exit(1);
  }

  app.use('/api/employees', employeesRoutes);
  app.use('/api/tasks', tasksRoutes);
  app.use('/api/health', healthRoutes);

  // Error handler (last)
  app.use(errorHandler);

  const port = PORT;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

start().catch((err) => {
  console.error('Fatal error starting app', err);
  process.exit(1);
});
