const express = require("express");

const server = express();

const postsRouter = require("./posts/posts-router");
server.use(express.json());
require("dotenv").config();

server.get("/", (req, res) => {
  res.json({
    message: process.env.MESSAGE || "Hey, server is up and running...",
  });
});

server.use("/api/posts", postsRouter); //api posttan gelenleri postsRouter üzerinde karşılıyoruz.

module.exports = server;
