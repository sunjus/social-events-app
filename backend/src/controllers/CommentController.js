const Comment = require("../models/Comment");
const Event = require("../models/Event");
const jwt = require("jsonwebtoken");

module.exports = {
  async createComment(req, res) {
    jwt.verify(req.token, "secret", async (err, authData) => {
      if (err) {
        res.sendStatus(401);
      } else {
        const { comment } = req.body;

        const userId = authData.user._id;
        const eventId = comment.eventId;
        const content = comment.content;
        const date = Date.now();

        const event = await Event.findById(eventId);
        if (!event) {
          return res.status(400).json({ message: "Event does not exist" });
        }

        const commentDoc = await Comment.create({
          content,
          date,
          event: eventId,
          user: userId,
        });

        try {
          await commentDoc.save();
        } catch {
          return res.status(500).json({ error: "fail" }); // FIXME
        }
        return res.status(201).json(commentDoc);
      }
    });
  },

  async getCommentsByEventId(req, res) {
    const { eventId } = req.params;
    try {
      console.log("#### ", eventId);
      const comments = await Comment.find({ event: eventId }).populate(
        "user",
        "-password"
      );
      if (comments) {
        return res.status(200).json(comments);
      }
    } catch {
      return res.status(400).json({ error: "no comments" }); // FIXME
    }
  },
};
