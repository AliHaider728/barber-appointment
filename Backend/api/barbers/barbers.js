const express = require('express');
const router = express.Router();
let barbers = [
  { _id: "1", name: "James Cole", experience_years: 8, specialties: ["Haircuts", "Styling"], branch: "1" },
  { _id: "2", name: "Ryan Smith", experience_years: 5, specialties: ["Beard Trim", "Shave"], branch: "1" },
  { _id: "3", name: "Omar Ali", experience_years: 6, specialties: ["Hair Color", "Grooming"], branch: "1" },
  { _id: "4", name: "Michael Brown", experience_years: 4, specialties: ["Haircuts", "Styling"], branch: "2" },
  { _id: "5", name: "Liam Johnson", experience_years: 4, specialties: ["Beard Trim", "Shave"], branch: "2" },
  { _id: "6", name: "Noor Patel", experience_years: 5, specialties: ["Hair Color", "Grooming"], branch: "2" },
  { _id: "7", name: "Ethan White", experience_years: 6, specialties: ["Haircuts", "Styling"], branch: "3" },
  { _id: "8", name: "Aiden Clarke", experience_years: 3, specialties: ["Beard Trim", "Shave"], branch: "3" },
  { _id: "9", name: "Zara Khan", experience_years: 5, specialties: ["Hair Color", "Grooming"], branch: "3" },
  { _id: "10", name: "Oliver Green", experience_years: 5, specialties: ["Haircuts", "Styling"], branch: "4" },
  { _id: "11", name: "Luke Martin", experience_years: 4, specialties: ["Beard Trim", "Shave"], branch: "4" },
  { _id: "12", name: "Priya Singh", experience_years: 6, specialties: ["Hair Color", "Grooming"], branch: "4" },
  { _id: "13", name: "Callum Ross", experience_years: 7, specialties: ["Haircuts", "Styling"], branch: "5" },
  { _id: "14", name: "Sean MacLeod", experience_years: 5, specialties: ["Beard Trim", "Shave"], branch: "5" },
  { _id: "15", name: "Hamza Ahmed", experience_years: 4, specialties: ["Hair Color", "Grooming"], branch: "5" },
];

const generateId = () => Date.now().toString();

router.get('/', (req, res) => res.json(barbers));
router.get('/:id', (req, res) => {
  const barber = barbers.find(b => b._id === req.params.id);
  if (barber) res.json(barber);
  else res.status(404).json({ message: 'Barber not found' });
});
router.post('/', (req, res) => {
  const newBarber = { _id: generateId(), ...req.body };
  barbers.push(newBarber);
  res.status(201).json(newBarber);
});
router.put('/:id', (req, res) => {
  const index = barbers.findIndex(b => b._id === req.params.id);
  if (index !== -1) {
    barbers[index] = { _id: req.params.id, ...req.body };
    res.json(barbers[index]);
  } else res.status(404).json({ message: 'Barber not found' });
});
router.delete('/:id', (req, res) => {
  const index = barbers.findIndex(b => b._id === req.params.id);
  if (index !== -1) {
    barbers.splice(index, 1);
    res.status(204).send();
  } else res.status(404).json({ message: 'Barber not found' });
});

module.exports = router;