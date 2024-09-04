const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerId: {
    type: Number,
    required: true,
  },
  locationId: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  createdDate: {
    type: String,
    default: Date.now.toString(),
  },
});

module.exports = mongoose.model("Customer", customerSchema);
