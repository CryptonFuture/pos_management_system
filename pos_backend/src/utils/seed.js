const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Customer.deleteMany()
    ]);

    await User.create([
      { name: 'Admin', email: 'admin@pos.com', password: 'admin123', role: 'admin' },
      { name: 'Cashier One', email: 'cashier@pos.com', password: 'cashier123', role: 'cashier' },
      { name: 'Manager', email: 'manager@pos.com', password: 'manager123', role: 'manager' }
    ]);

    const categories = await Category.insertMany([
      { name: 'Beverages' },
      { name: 'Snacks' },
      { name: 'Grocery' },
      { name: 'Electronics' },
      { name: 'Personal Care' }
    ]);

    await Product.insertMany([
      { sku: 'BEV-001', name: 'Coca Cola 1.5L', category: categories[0]._id, price: 180, costPrice: 130, stock: 50, minStock: 10, barcode: '8901234567890' },
      { sku: 'BEV-002', name: 'Nestle Water 500ml', category: categories[0]._id, price: 50, costPrice: 30, stock: 100, minStock: 20, barcode: '8901234567891' },
      { sku: 'SNK-001', name: 'Lays Classic 50g', category: categories[1]._id, price: 50, costPrice: 35, stock: 80, minStock: 15, barcode: '8901234567892' },
      { sku: 'SNK-002', name: 'Oreo Biscuits', category: categories[1]._id, price: 80, costPrice: 55, stock: 40, minStock: 10, barcode: '8901234567893' },
      { sku: 'GRO-001', name: 'Sugar 1kg', category: categories[2]._id, price: 160, costPrice: 140, stock: 30, minStock: 8, barcode: '8901234567894' },
      { sku: 'GRO-002', name: 'Cooking Oil 1L', category: categories[2]._id, price: 450, costPrice: 400, stock: 25, minStock: 5, barcode: '8901234567895' },
      { sku: 'ELE-001', name: 'USB Cable Type-C', category: categories[3]._id, price: 350, costPrice: 200, stock: 20, minStock: 5, barcode: '8901234567896' },
      { sku: 'ELE-002', name: 'Earphones', category: categories[3]._id, price: 800, costPrice: 450, stock: 15, minStock: 3, barcode: '8901234567897' },
      { sku: 'PER-001', name: 'Toothpaste Colgate', category: categories[4]._id, price: 220, costPrice: 160, stock: 35, minStock: 8, barcode: '8901234567898' },
      { sku: 'PER-002', name: 'Hand Sanitizer 100ml', category: categories[4]._id, price: 150, costPrice: 90, stock: 6, minStock: 10, barcode: '8901234567899' }
    ]);

    await Customer.insertMany([
      { name: 'Walk-in Customer', phone: '' },
      { name: 'Ahmed Khan', phone: '03001234567', email: 'ahmed@email.com' },
      { name: 'Sara Ali', phone: '03009876543', email: 'sara@email.com' }
    ]);

    console.log('✅ POS seed data created successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('  Admin   → admin@pos.com / admin123');
    console.log('  Cashier → cashier@pos.com / cashier123');
    console.log('  Manager → manager@pos.com / manager123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
