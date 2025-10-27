const express = require('express');
const router = express.Router();
let branches = [
  { _id: "1", name: "Central London", city: "London", address: "18 Baker Street, Central London, W1U 3EZ", phone: "+44 20 7946 0958", openingHours: "09:00 - 19:00" },
  { _id: "2", name: "Deansgate", city: "Manchester", address: "12 Deansgate, Manchester, M3 4EN", phone: "+44 161 832 4444", openingHours: "09:30 - 18:30" },
  { _id: "3", name: "City Centre", city: "Birmingham", address: "44 High Street, Birmingham, B2 5PR", phone: "+44 121 555 0123", openingHours: "10:00 - 19:00" },
  { _id: "4", name: "Headingley", city: "Leeds", address: "7 Otley Road, Headingley, LS6 3DG", phone: "+44 113 350 3344", openingHours: "09:00 - 17:00" },
  { _id: "5", name: "Merchant City", city: "Glasgow", address: "25 Ingram Street, Merchant City, G1 1HA", phone: "+44 141 221 0000", openingHours: "09:30 - 18:00" },
];

const generateId = () => Date.now().toString();


router.get('/', (req, res) => res.json(branches));
router.get('/:id', (req, res) => {
  const branch = branches.find(b => b._id === req.params.id);
  if (branch) res.json(branch);
  else res.status(404).json({ message: 'Branch not found' });
});
router.post('/', (req, res) => {
  const newBranch = { _id: generateId(), ...req.body };
  branches.push(newBranch);
  res.status(201).json(newBranch);
});
router.put('/:id', (req, res) => {
  const index = branches.findIndex(b => b._id === req.params.id);
  if (index !== -1) {
    branches[index] = { _id: req.params.id, ...req.body };
    res.json(branches[index]);
  } else res.status(404).json({ message: 'Branch not found' });
});
router.delete('/:id', (req, res) => {
  const index = branches.findIndex(b => b._id === req.params.id);
  if (index !== -1) {
    branches.splice(index, 1);
    res.status(204).send();
  } else res.status(404).json({ message: 'Branch not found' });
});

module.exports = router;