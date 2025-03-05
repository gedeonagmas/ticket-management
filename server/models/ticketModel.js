const mongoose = require("mongoose");
const valid = require("../utils/validator");

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    title: {
      type: String,
      validate: valid.paragraph("Title", 3, 100),
    },

    description: {
      type: String,
      validate: valid.paragraph("Description", 3, 1000),
    },

    ticketId: { type: String },

    barcode: { type: String },

    qrCode: { type: String },

    status: {
      type: String,
      default: "Open",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

const Ticket = mongoose.model("tickets", schema);
module.exports = { Ticket };
