const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
    HotelName: String,
    HotelAddress: {
        Country: String,
        City: String,
        Province: String,
        PostalCode: String
    },
    HotelRating: Number,
    HotelAmenities: {
        Pool: Boolean,
        Gym: Boolean,
        AirportShuttle: Boolean,
        Pets: Boolean
    },
    HotelDescription: {
        Images: [String],
        Description: String
    },
    HotelReviews: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        rating: Number,
        reviewText: String
    }],
    HotelDetails: {
        AirportDistance: Number,
        DowntownDistance: Number,
        SeaDistance: Number
    },
    Rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }]
});

module.exports = mongoose.model('Hotel', hotelSchema);
