const mongoose = require("mongoose");
const cors = require("cors");
const socketio = require("socket.io");
const express = require("express");
const path = require("path");

// Importing required files
const routes = require("./routes");

function serverConfig(app, server) {
    // Checking if in production or dev environment
    if (process.env.NODE_ENV != "production") {
        require("dotenv").config();
    }

    // Connecting to MongoDB by reading .env file if in dev environment
    try {
        mongoose.connect(process.env.MONGO_DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log(error);
    }

    //websocket
    const io = socketio(server);
    const connectedUsers = {}; //memory for server to store users
    io.on("connection", (socket) => {
        console.log("User is connected with: ", socket.id);
        //console.log(socket.handshake.query);
        const { user } = socket.handshake.query;
        connectedUsers[user] = socket.id;

        io.emit("sunju", { data: "hello-world" });
    });

    //app.use()
    app.use((req, res, next) => {
        req.io = io;
        req.connectedUsers = connectedUsers;
        return next();
    });
    app.use(cors());
    app.use(express.json());
    app.use('/api', routes);
    app.use("/files", express.static(path.resolve(__dirname, "..", "files")));
}

module.exports = serverConfig