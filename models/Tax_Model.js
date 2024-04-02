const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaxSchema = new Schema({
    Country: String,
    Province: String,
    TaxRate: Number // Represented as a percentage (e.g., 0.15 for 15%)
});

module.exports = mongoose.model('Tax', TaxSchema);
