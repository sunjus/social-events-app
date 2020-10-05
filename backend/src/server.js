// Importing required packages
const express = require("express");
const path = require("path");
const http = require("http");

const serverConfig = require("./server-core.js")


const app = express(); // Setup server for app requiring express
const server = http.Server(app);
const PORT = process.env.PORT || 8000;

serverConfig(app, server)

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const distPath = path.resolve(__dirname, '..', '..', 'frontend', 'build')
app.use("/", express.static(distPath));
app.get("/*", function(req, res) {
       res.sendFile('index.html', {root: distPath});
}); 
