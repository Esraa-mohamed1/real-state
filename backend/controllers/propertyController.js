const Property = require('../models/Property');

// Create a new property
exports.createProperty = async (req, res) => {
  try {
    const { name, type, address, units } = req.body;
    const property = new Property({
      name,
      type,
      address,
      units,
      createdBy: req.user._id,
      incomeHistory: [],
    });
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all properties
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a property
exports.updateProperty = async (req, res) => {
  try {
    const { name, type, address, units } = req.body;
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { name, type, address, units },
      { new: true }
    );
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get rented vs vacant units
exports.getRentedVacant = async (req, res) => {
  try {
    const properties = await Property.find();
    let rented = 0, vacant = 0;
    properties.forEach(p => {
      p.units.forEach(u => {
        if (u.isRented) rented++;
        else vacant++;
      });
    });
    res.json({ rented, vacant });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get monthly income and portfolio value
exports.getIncomePortfolio = async (req, res) => {
  try {
    const properties = await Property.find();
    let monthlyIncome = 0, portfolioValue = 0;
    properties.forEach(p => {
      p.units.forEach(u => {
        if (u.isRented) monthlyIncome += u.monthlyRent;
        portfolioValue += u.monthlyRent;
      });
    });
    res.json({ monthlyIncome, portfolioValue });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 

