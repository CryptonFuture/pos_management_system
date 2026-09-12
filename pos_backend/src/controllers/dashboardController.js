const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todaySales,
      todayRevenue,
      totalProducts,
      lowStock,
      totalCustomers,
      recentSales,
      paymentBreakdown
    ] = await Promise.all([
      Sale.countDocuments({ createdAt: { $gte: today, $lt: tomorrow }, status: 'completed' }),
      Sale.aggregate([
        { $match: { createdAt: { $gte: today, $lt: tomorrow }, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true, $expr: { $lte: ['$stock', '$minStock'] } }),
      Customer.countDocuments({ isActive: true }),
      Sale.find({ status: 'completed' })
        .populate('cashier', 'name')
        .sort({ createdAt: -1 })
        .limit(8),
      Sale.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: '$paymentMethod', total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
      ])
    ]);

    // Last 7 days sales
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dailySales = await Sale.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, status: 'completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          todaySales,
          todayRevenue: todayRevenue[0]?.total || 0,
          totalProducts,
          lowStock,
          totalCustomers
        },
        recentSales,
        paymentBreakdown,
        dailySales
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
