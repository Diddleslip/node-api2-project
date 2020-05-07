const express = require('express');
const postsRouter = require('./hubs/hubs-router.js');
const server = express();

server.use(express.json())

const Port = 5000;

server.use("/api/posts", postsRouter)

server.get("/", (req, res) => {
    res.send(  `
        <h1>API</h1>
        <p>Welcome to the API</p>
    `);
})

server.listen(Port, () => {
    console.log(`success! Servers up! on port:${Port}`)
})