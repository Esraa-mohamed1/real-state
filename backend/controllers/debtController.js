const Debt = require('../models/Debt');

// Create a new debt
exports.createDebt = async (req, res) => {
  try {
    const { amount, date, category, description, status } = req.body;
    const debt = new Debt({
      amount,
      date,
      category,
      description,
      status,
      createdBy: req.user._id,
    });
    await debt.save();
    res.status(201).json(debt);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all debts
exports.getDebts = async (req, res) => {
  try {
    const debts = await Debt.find().sort({ date: -1 });
    res.json(debts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single debt by ID
exports.getDebtById = async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);
    if (!debt) return res.status(404).json({ message: 'Debt not found' });
    res.json(debt);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a debt
exports.updateDebt = async (req, res) => {
  try {
    const { amount, date, category, description, status } = req.body;
    const debt = await Debt.findByIdAndUpdate(
      req.params.id,
      { amount, date, category, description, status },
      { new: true }
    );
    if (!debt) return res.status(404).json({ message: 'Debt not found' });
    res.json(debt);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a debt
exports.deleteDebt = async (req, res) => {
  try {
    const debt = await Debt.findByIdAndDelete(req.params.id);
    if (!debt) return res.status(404).json({ message: 'Debt not found' });
    res.json({ message: 'Debt deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Breakdown of debt by type with percentage
exports.getDebtBreakdown = async (req, res) => {
  try {
    const total = await Debt.countDocuments();
    const breakdown = await Debt.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } }
    ]);
    const result = breakdown.map(b => ({
      category: b._id,
      count: b.count,
      totalAmount: b.totalAmount,
      percentage: total ? ((b.count / total) * 100).toFixed(2) : 0
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Pending and settled balances
exports.getDebtSummary = async (req, res) => {
  try {
    const summary = await Debt.aggregate([
      { $group: { _id: '$status', total: { $sum: '$amount' } } }
    ]);
    let pending = 0, settled = 0;
    summary.forEach(s => {
      if (s._id === 'pending') pending = s.total;
      if (s._id === 'settled') settled = s.total;
    });
    res.json({ pending, settled });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 


