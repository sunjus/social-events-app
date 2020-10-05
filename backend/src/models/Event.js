const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    price: Number,
    thumbnail: String,
    date: Date,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    meta: {
      nApproved: { type: Number, default: 0 },
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

EventSchema.virtual("thumbnail_url").get(function () {
  return this.thumbnail;
});

module.exports = mongoose.model("Event", EventSchema);
