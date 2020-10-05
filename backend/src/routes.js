const express = require("express");
const multer = require("multer");

const verifyToken = require("./config/verifyToken");
const UserController = require("./controllers/UserController");
const EventController = require("./controllers/EventController");
const DashboardController = require("./controllers/DashboardController");
const LoginController = require("./controllers/LoginController");
const RegistrationController = require("./controllers/RegistrationController");
const ApprovalController = require("./controllers/ApprovalController");
const RejectionController = require("./controllers/RejectionController");
const uploadConfig = require("./config/upload");
const ForgotController = require("./controllers/ForgotController");
const CommentController = require("./controllers/CommentController");
const uploadToS3 = require("./config/s3Upload");

//Creating instances
//define middleware which allows us to route from different file
const routes = express.Router();
//multer instance of our upload config to use functionality
//const upload = multer(uploadConfig);
//const uploadToS3

//define routes using express Router method
//checking if app is running fine
routes.get("/status", (req, res) => {
  res.send({ status: 200 });
});

// Event
// Event creation end point
routes.post(
  "/event",
  verifyToken,
  uploadToS3.single("thumbnail"),
  EventController.createEvent
);
// Deleting event by ID
routes.delete("/event/:eventId", verifyToken, EventController.delete);
//modify
routes.post(
  "/event/:eventId",
  verifyToken,
  uploadToS3.single("thumbnail"),
  EventController.modifyEvent
); // FIXME put doesn't work. why?

//User
//registering
routes.post("/user/register", UserController.createUser);
// Getting events by user ID
routes.get("/user/events", verifyToken, DashboardController.getEventsByUserId);
//getting user by ID
routes.get("/user/:userId", UserController.getUserById);

//Dashboard
//getting events with ID using function called getEventById from EventController
routes.get("/event/:eventId", verifyToken, DashboardController.getEventById);
//getting all events
routes.get("/dashboard", verifyToken, DashboardController.getAllEvents);
//getting events by category
routes.get(
  "/dashboard/:category",
  verifyToken,
  DashboardController.getAllEvents
);

//Login
routes.post("/login", LoginController.store);

//ForgotPassword
routes.post("/forgotpassword", ForgotController.store);

//Registration
routes.post(
  "/registration/:eventId",
  verifyToken,
  RegistrationController.createRegistration
);
routes.get(
  "/registration/:registrationId",
  RegistrationController.getRegistration
);
routes.get(
  "/registration",
  verifyToken,
  RegistrationController.getMyRegistrations
);
// Approvals and Rejections
routes.post(
  "/registration/:registrationId/approvals",
  verifyToken,
  ApprovalController.approval
);
routes.post(
  "/registration/:registrationId/rejections",
  verifyToken,
  RejectionController.rejection
);

// Comments API
routes.get("/comments/event/:eventId", CommentController.getCommentsByEventId);
routes.post("/comment", verifyToken, CommentController.createComment);

//Sep.7.20
//npx i jsonwebtoken
//Todo: add JWT token to project(v)
//return token when login(v)
//send token on request(v)
//create function to protect routes(v)
//add function / middleware to routers(v)
//modify response to decode the token(v)

//export routes
module.exports = routes;
