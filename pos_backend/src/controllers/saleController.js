const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

exports.getAll = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    let query = {};
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const sales = await Sale.find(query)
      .populate('cashier', 'name')
      .populate('customer', 'name phone')
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({ success: true, count: sales.length, data: sales });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('cashier', 'name')
      .populate('customer', 'name phone email')
      .populate('items.product', 'name sku');
    if (!sale) return res.status(404).json({ success: false, message: 'Sale not found' });
    res.json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { items, tax = 0, discount = 0, amountPaid, paymentMethod, customer, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    let subtotal = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const total = product.price * item.quantity;
      subtotal += total;
      saleItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        total
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const totalAmount = subtotal + Number(tax) - Number(discount);
    if (amountPaid < totalAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient payment amount' });
    }

    const count = await Sale.countDocuments();
    const invoiceNumber = `INV${String(count + 1).padStart(6, '0')}`;

    const sale = await Sale.create({
      invoiceNumber,
      items: saleItems,
      subtotal,
      tax: Number(tax),
      discount: Number(discount),
      totalAmount,
      amountPaid: Number(amountPaid),
      change: Number(amountPaid) - totalAmount,
      paymentMethod: paymentMethod || 'cash',
      customer: customer || null,
      cashier: req.user._id,
      notes
    });

    if (customer) {
      await Customer.findByIdAndUpdate(customer, {
        $inc: { totalPurchases: 1, totalSpent: totalAmount }
      });
    }

    const populated = await Sale.findById(sale._id)
      .populate('cashier', 'name')
      .populate('customer', 'name phone');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.refund = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ success: false, message: 'Sale not found' });
    if (sale.status === 'refunded') {
      return res.status(400).json({ success: false, message: 'Already refunded' });
    }

    // Restore stock
    for (const item of sale.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    sale.status = 'refunded';
    await sale.save();

    res.json({ success: true, message: 'Sale refunded', data: sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
