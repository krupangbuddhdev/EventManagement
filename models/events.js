const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  clg: {
    type: String,
    required: true,
  },
  comm: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  subEvents: {
    type: Number,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Event", eventSchema);
