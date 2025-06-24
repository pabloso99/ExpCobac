const Sauce = require('../models/Sauce');

exports.createSauce = async (req, res) => {
  try {
    const sauce = new Sauce(req.body);
    await sauce.save();
    res.status(201).json(sauce);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSauces = async (req, res) => {
  try {
    const sauces = await Sauce.find();
    res.json(sauces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findById(req.params.id);
    if (!sauce) {
      return res.status(404).json({ message: 'Salsa no encontrada' });
    }
    res.json(sauce);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!sauce) {
      return res.status(404).json({ message: 'Salsa no encontrada' });
    }
    res.json(sauce);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findByIdAndDelete(req.params.id);
    if (!sauce) {
      return res.status(404).json({ message: 'Salsa no encontrada' });
    }
    res.json({ message: 'Salsa eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
