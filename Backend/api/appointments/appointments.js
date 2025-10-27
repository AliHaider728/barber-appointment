const express = require('express');
const router = express.Router();
let appointments = [];

const generateId = () => Date.now().toString();

router.get('/', (req, res) => res.json(appointments));
router.post('/', (req, res) => {
  const newAppointment = { _id: generateId(), ...req.body, status: 'pending' };
  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const appointment = appointments.find(a => a._id === id);
  if (appointment) {
    appointment.status = status;
    res.json(appointment);
  } else res.status(404).json({ message: 'Appointment not found' });
});

module.exports = router;