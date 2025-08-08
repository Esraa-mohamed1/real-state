
const Payment = require('../models/Payment');
const Debt = require('../models/Debt');

exports.getOverview = async (req, res) => {
  try {
    // Total payments received
    const payments = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalPayments = payments[0]?.total || 0;

    // Outstanding debt (pending only)
    const debts = await Debt.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const outstandingDebt = debts[0]?.total || 0;

    // Net position
    const netPosition = totalPayments - outstandingDebt;

    res.json({
      totalPayments,
      outstandingDebt,
      netPosition
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 
