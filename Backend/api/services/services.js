const express = require('express');
const router = express.Router();
let services = [
  { _id: "1", name: "Men's Haircut", duration: "30 minutes", price: "£25" },
  { _id: "2", name: "Beard Trim", duration: "20 minutes", price: "£15" },
  { _id: "3", name: "Hair Color", duration: "45 minutes", price: "£40" },
  { _id: "4", name: "Facial & Grooming", duration: "40 minutes", price: "£35" },
  { _id: "5", name: "Kids Haircut", duration: "25 minutes", price: "£20" },
  { _id: "6", name: "Head Massage", duration: "30 minutes", price: "£30" },
  { _id: "7", name: "Hair Wash", duration: "10 minutes", price: "£10" },
  { _id: "8", name: "Shave", duration: "20 minutes", price: "£18" },
  { _id: "9", name: "Hair Styling", duration: "25 minutes", price: "£22" },
  { _id: "10", name: "Waxing", duration: "15 minutes", price: "£12" },
];

const generateId = () => Date.now().toString();

router.get('/', (req, res) => res.json(services));
router.get('/:id', (req, res) => {
  const service = services.find(s => s._id === req.params.id);
  if (service) res.json(service);
  else res.status(404).json({ message: 'Service not found' });
});
router.post('/', (req, res) => {
  const newService = { _id: generateId(), ...req.body };
  services.push(newService);
  res.status(201).json(newService);
});
router.put('/:id', (req, res) => {
  const index = services.findIndex(s => s._id === req.params.id);
  if (index !== -1) {
    services[index] = { _id: req.params.id, ...req.body };
    res.json(services[index]);
  } else res.status(404).json({ message: 'Service not found' });
});
router.delete('/:id', (req, res) => {
  const index = services.findIndex(s => s._id === req.params.id);
  if (index !== -1) {
    services.splice(index, 1);
    res.status(204).send();
  } else res.status(404).json({ message: 'Service not found' });
});

module.exports = router;