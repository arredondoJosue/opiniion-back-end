const mongoose = require("mongoose");

const customerLogSchema = new mongoose.Schema({
  customerId: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now.toString(),
  },
});

module.exports = mongoose.model("CustomerLog", customerLogSchema);
