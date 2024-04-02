const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Sub-schema for RoomMeals
const RoomMealsSchema = new Schema({
    Breakfast: Boolean,
    Dinner: Boolean,
    BreakfastAndDinner: Boolean
});

// Sub-schema for RoomAmenities
const RoomAmenitiesSchema = new Schema({
    Wifi: Boolean,
    CableTv: Boolean,
    AirCondition: Boolean,
    FreeCancellation: Boolean,
    NonSmoking: Boolean
});

// Sub-schema for BedType
const BedTypeSchema = new Schema({
    SingleBed: Boolean,
    TwinBed: Boolean,
    QueenBed: Boolean,
    KingBed: Boolean
});

// Sub-schema for each RoomOption type (e.g., StandardRoom, DoubleRoom, etc.)
const RoomOptionSchema = new Schema({
    RoomName: String,
    SquareFeet: Number,
    RoomMeals: RoomMealsSchema,
    RoomAmenities: RoomAmenitiesSchema,
    RoomImages: [String],
    NumberOfBeds: Number,
    NumOfEmptyRooms: Number,
    Price: Number,
    NumberOfGuests: Number,
    BedType: BedTypeSchema
});

const RoomSchema = new Schema({
    RoomOptions: [RoomOptionSchema]
});

module.exports = mongoose.model('Room', RoomSchema);
