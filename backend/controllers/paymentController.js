const Payment = require('../models/Payment');

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { amount, date, payer, description } = req.body;
    const payment = new Payment({
      amount,
      date,
      payer,
      description,
      createdBy: req.user._id,
    });
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all payments (optionally filter by user)
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a payment
exports.updatePayment = async (req, res) => {
  try {
    const { amount, date, payer, description } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { amount, date, payer, description },
      { new: true }
    );
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payment summary (total amount paid)
exports.getPaymentSummary = async (req, res) => {
  try {
    const totalPaid = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    res.json({ totalPaid: totalPaid[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 