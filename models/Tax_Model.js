const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaxSchema = new Schema({
    Country: String,
    Province: String,
    TaxRate: Number
});

module.exports = mongoose.model('Tax', TaxSchema);
