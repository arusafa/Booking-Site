const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    Hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel'
    },
    Room: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    CheckInDate: Date,
    CheckOutDate: Date,
    NumberOfGuests: Number,
    TotalPrice: Number
});

module.exports = mongoose.model('Booking', BookingSchema);
