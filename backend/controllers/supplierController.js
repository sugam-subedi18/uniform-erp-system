const { Supplier } = require('../models');

const h = (fn) => async (req, res) => {
  try { await fn(req, res); }
  catch (err) { console.error(err); res.status(500).json({ message: 'Something went wrong on the server' }); }
};
const fields = ['name', 'contact_person', 'phone', 'email', 'address'];
const pick = (body) => Object.fromEntries(fields.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));

exports.list = h(async (req, res) => res.json(await Supplier.findAll({ order: [['name', 'ASC']] })));

exports.create = h(async (req, res) => {
  if (!req.body.name || !req.body.name.trim()) return res.status(400).json({ message: 'Supplier name is required' });
  res.status(201).json(await Supplier.create(pick(req.body)));
});

exports.update = h(async (req, res) => {
  const supplier = await Supplier.findByPk(req.params.id);
  if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
  if (req.body.name !== undefined && !String(req.body.name).trim()) return res.status(400).json({ message: 'Supplier name cannot be empty' });
  await supplier.update(pick(req.body));
  res.json(supplier);
});
