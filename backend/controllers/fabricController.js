const { FabricStock, Supplier } = require('../models');
const { notifyIfLow } = require('../utils/mailer');

const TYPES = ['hosiery', 'shirting', 'suiting'];
const unitFor = (type) => (type === 'hosiery' ? 'kg' : 'meter'); // hosiery by weight, the rest by length
const include = [{ model: Supplier, attributes: ['id', 'name'] }];

// MySQL returns DECIMAL as text, so turn the numbers back into numbers for the frontend
const out = (f) => {
  const j = f.toJSON();
  return { ...j, quantity: +j.quantity, cost_per_unit: +j.cost_per_unit, reorder_threshold: +j.reorder_threshold };
};
const isNum = (v) => v !== '' && v !== null && v !== undefined && !Number.isNaN(Number(v)) && Number(v) >= 0;
const h = (fn) => async (req, res) => {
  try { await fn(req, res); }
  catch (err) { console.error(err); res.status(500).json({ message: 'Something went wrong on the server' }); }
};

exports.list = h(async (req, res) => {
  const where = {};
  if (TYPES.includes(req.query.type)) where.fabric_type = req.query.type;
  const rows = await FabricStock.findAll({ where, include, order: [['fabric_type', 'ASC'], ['color', 'ASC']] });
  let data = rows.map(out);
  if (req.query.low === 'true') data = data.filter((f) => f.quantity < f.reorder_threshold);
  res.json(data);
});

exports.create = h(async (req, res) => {
  const { fabric_type, color, quantity, cost_per_unit, reorder_threshold, supplier_id } = req.body;
  if (!TYPES.includes(fabric_type)) return res.status(400).json({ message: 'Fabric type must be hosiery, shirting or suiting' });
  if (!color || !color.trim()) return res.status(400).json({ message: 'Color is required' });
  if (![quantity, cost_per_unit, reorder_threshold].every(isNum))
    return res.status(400).json({ message: 'Quantity, cost and reorder point must be numbers of 0 or more' });
  if (supplier_id && !(await Supplier.findByPk(supplier_id))) return res.status(400).json({ message: 'That supplier does not exist' });
  if (await FabricStock.findOne({ where: { fabric_type, color: color.trim() } }))
    return res.status(409).json({ message: 'This fabric and color already exists. Update its stock instead.' });

  const fabric = await FabricStock.create({
    fabric_type, color: color.trim(), unit: unitFor(fabric_type),
    quantity, cost_per_unit, reorder_threshold, supplier_id: supplier_id || null,
  });
  await notifyIfLow(fabric, false);
  res.status(201).json(out(await FabricStock.findByPk(fabric.id, { include })));
});

exports.update = h(async (req, res) => {
  const fabric = await FabricStock.findByPk(req.params.id);
  if (!fabric) return res.status(404).json({ message: 'Fabric not found' });
  const wasLow = Number(fabric.quantity) < Number(fabric.reorder_threshold);

  const patch = {};
  for (const k of ['quantity', 'cost_per_unit', 'reorder_threshold']) {
    if (req.body[k] === undefined) continue;
    if (!isNum(req.body[k])) return res.status(400).json({ message: `${k} must be a number of 0 or more` });
    patch[k] = req.body[k];
  }
  if (req.body.color !== undefined) {
    if (!String(req.body.color).trim()) return res.status(400).json({ message: 'Color cannot be empty' });
    patch.color = String(req.body.color).trim();
  }
  if (req.body.supplier_id !== undefined) {
    if (req.body.supplier_id && !(await Supplier.findByPk(req.body.supplier_id))) return res.status(400).json({ message: 'That supplier does not exist' });
    patch.supplier_id = req.body.supplier_id || null;
  }

  await fabric.update(patch);
  await notifyIfLow(fabric, wasLow);
  res.json(out(await FabricStock.findByPk(fabric.id, { include })));
});

exports.remove = async (req, res) => {
  try {
    const fabric = await FabricStock.findByPk(req.params.id);
    if (!fabric) return res.status(404).json({ message: 'Fabric not found' });
    await fabric.destroy();
    res.json({ message: 'Fabric deleted' });
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError')
      return res.status(409).json({ message: 'This fabric is used by existing orders, so it cannot be deleted' });
    console.error(err);
    res.status(500).json({ message: 'Something went wrong on the server' });
  }
};
