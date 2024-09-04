const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  locationId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdDate: {
    type: String,
    default: Date.now.toString(),
  },
});

module.exports = mongoose.model("Location", locationSchema);
