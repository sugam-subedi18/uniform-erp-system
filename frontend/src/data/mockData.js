// Sample data shaped like the database schema. Replaced by API calls once the backend exists.
export const suppliers = [
  { id: 1, name: 'Himalayan Textiles', contact_person: 'Ramesh Shrestha', phone: '9801234567', email: 'ramesh@himtex.example', address: 'Kathmandu' },
  { id: 2, name: 'Bhaktapur Knit House', contact_person: 'Sita Maharjan', phone: '9812345678', email: 'sita@knithouse.example', address: 'Bhaktapur' },
  { id: 3, name: 'Birgunj Suiting Mart', contact_person: 'Anil Gupta', phone: '9823456789', email: 'anil@suitingmart.example', address: 'Birgunj' },
];

export const customers = [
  { id: 1, name: 'Sunrise English School', type: 'school', contact_person: 'Mr. Karki', phone: '9841000001', email: 'office@sunrise.example', address: 'Banepa' },
  { id: 2, name: 'Everest Hospitality Pvt. Ltd.', type: 'company', contact_person: 'Ms. Thapa', phone: '9841000002', email: 'hr@everesthospitality.example', address: 'Kathmandu' },
  { id: 3, name: 'Anita Gurung', type: 'individual', contact_person: 'Anita Gurung', phone: '9841000003', email: '', address: 'Dhulikhel' },
  { id: 4, name: 'Blue Valley Academy', type: 'school', contact_person: 'Mrs. Rai', phone: '9841000004', email: 'admin@bluevalley.example', address: 'Panauti' },
];

export const fabrics = [
  { id: 1, fabric_type: 'hosiery', color: 'Navy Blue', unit: 'kg', quantity: 120, cost_per_unit: 650, reorder_threshold: 50, supplier_id: 2 },
  { id: 2, fabric_type: 'hosiery', color: 'White', unit: 'kg', quantity: 35, cost_per_unit: 620, reorder_threshold: 60, supplier_id: 2 },
  { id: 3, fabric_type: 'shirting', color: 'Sky Blue', unit: 'meter', quantity: 410, cost_per_unit: 280, reorder_threshold: 150, supplier_id: 1 },
  { id: 4, fabric_type: 'shirting', color: 'White', unit: 'meter', quantity: 90, cost_per_unit: 270, reorder_threshold: 150, supplier_id: 1 },
  { id: 5, fabric_type: 'suiting', color: 'Charcoal Grey', unit: 'meter', quantity: 260, cost_per_unit: 950, reorder_threshold: 100, supplier_id: 3 },
  { id: 6, fabric_type: 'suiting', color: 'Black', unit: 'meter', quantity: 180, cost_per_unit: 980, reorder_threshold: 100, supplier_id: 3 },
];

export const purchases = [
  { id: 1, supplier_id: 1, fabric_type: 'shirting', fabric_color: 'Sky Blue', quantity: 200, total_cost: 56000, purchase_date: '2026-10-12', ordered_by: 'Store Manager' },
  { id: 2, supplier_id: 2, fabric_type: 'hosiery', fabric_color: 'Navy Blue', quantity: 80, total_cost: 52000, purchase_date: '2026-10-05', ordered_by: 'Store Manager' },
  { id: 3, supplier_id: 3, fabric_type: 'suiting', fabric_color: 'Black', quantity: 100, total_cost: 98000, purchase_date: '2026-09-28', ordered_by: 'Admin User' },
];

// design_image 'sample' means "a design is on file" for the seeded orders
export const orders = [
  { id: 1, customer_id: 1, order_date: '2026-10-10', due_date: '2026-11-05', status: 'in_production', created_by: 'Sales Staff', confirmed_at: '2026-10-11',
    items: [
      { id: 101, uniform_type: 'Shirt', size: 'M', color: 'Sky Blue', quantity: 120, fabric_id: 3, design_image: 'sample', printing_details: 'School logo on left chest, 3 inch, navy thread.' },
      { id: 102, uniform_type: 'Trouser', size: 'L', color: 'Charcoal Grey', quantity: 120, fabric_id: 5, design_image: 'sample', printing_details: 'Plain, no print. Elastic back waist.' },
    ] },
  { id: 2, customer_id: 2, order_date: '2026-10-08', due_date: '2026-10-29', status: 'ready', created_by: 'Sales Staff', confirmed_at: '2026-10-09',
    items: [
      { id: 201, uniform_type: 'Blazer', size: 'Mixed', color: 'Black', quantity: 40, fabric_id: 6, design_image: 'sample', printing_details: 'Gold embroidered company crest on breast pocket.' },
      { id: 202, uniform_type: 'Shirt', size: 'Mixed', color: 'White', quantity: 60, fabric_id: 4, design_image: 'sample', printing_details: 'Name tag stitched on right chest.' },
    ] },
  { id: 3, customer_id: 4, order_date: '2026-10-24', due_date: '2026-11-15', status: 'pending', created_by: 'Sales Staff', confirmed_at: null,
    items: [
      { id: 301, uniform_type: 'T-shirt', size: 'Mixed', color: 'White', quantity: 200, fabric_id: 2, design_image: '', printing_details: '' },
    ] },
  { id: 4, customer_id: 3, order_date: '2026-10-22', due_date: '2026-10-31', status: 'confirmed', created_by: 'Sales Staff', confirmed_at: '2026-10-23',
    items: [
      { id: 401, uniform_type: 'Shirt', size: 'S', color: 'Sky Blue', quantity: 4, fabric_id: 3, design_image: 'sample', printing_details: 'No print. Slim fit.' },
    ] },
  { id: 5, customer_id: 1, order_date: '2026-09-30', due_date: '2026-10-20', status: 'dispatched', created_by: 'Sales Staff', confirmed_at: '2026-10-01',
    items: [
      { id: 501, uniform_type: 'Tracksuit', size: 'Mixed', color: 'Navy Blue', quantity: 80, fabric_id: 1, design_image: 'sample', printing_details: 'School name printed on back, white vinyl.' },
    ] },
];

export const dispatches = [
  { id: 1, order_id: 5, dispatch_date: '2026-10-19', dispatched_by: 'Dispatch Staff', delivery_status: 'delivered', notes: 'Delivered by school van.' },
];
