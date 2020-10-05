// Import required packages and models
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Export modules
module.exports = {
  async store(req, res) {
    // Grab email and password from request body
    const { email } = req.body;

    try {
      // Check if both input fields have been filled
      if (!email) {
        return res.status(200).json({
          message: "Required field missing!",
        });
      }

      // Find the provided email in User database using findOne method
      const user = await User.findOne({ email });

      // Check if user exists. If not, ask to register as response
      if (!user) {
        return res.status(200).json({
          message: "User not found! Do you want to register?",
        });

        //return res.json(userResponse);
      } else {
        return res.status(200).json({
          message: "Email does not match",
        });
      }
    } catch (error) {
      throw Error(`Error while authenticating a User ${error}`);
    }
  },
};
