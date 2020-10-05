//own property: date,approved

const mongoose = require("mongoose");
const Event = require("./Event");

const RegistrationSchema = new mongoose.Schema({
  date: () => Date.now(),
  approved: Boolean,
  owner: String,
  eventTitle: String,
  eventPrice: String,
  userEmail: String,
  eventDate: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
});

RegistrationSchema.statics.updateEvent = async function (event_id) {
  const event = await Event.findById(event_id);
  event.meta.nApproved = await this.countDocuments({
    event: event._id,
    approved: true,
  });
  await event.save();
};

module.exports = mongoose.model("Registration", RegistrationSchema);
