// implement your server here
// require your posts router and connect it here
const express = require("express");

const server = express();

const postsRouter = require("./posts/posts-router");
server.use(express.json());

server.get("/", (req, res) => {
  res.send("2.gün projesi");
});

server.use("/api/posts", postsRouter); //api posttan gelenleri postsRouter üzerinde karşılıyoruz.

module.exports = server;
