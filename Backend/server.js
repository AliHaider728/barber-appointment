const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Import API routes
const branchesRouter = require('./api/branches/branches');
const barbersRouter = require('./api/barbers/barbers');
const servicesRouter = require('./api/services/services');
const appointmentsRouter = require('./api/appointments/appointments');
const authRouter = require('./api/auth/auth');

// Use routes
app.use('/api/branches', branchesRouter);
app.use('/api/barbers', barbersRouter);
app.use('/api/services', servicesRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/auth', authRouter);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));