console.log("Development test server started")

const http = require("http")

const requestListener = (req, res) => {
    res.writeHead(200)
    res.end("My first server!")
}

const port = 3333
const host = "localhost"
const server = http.createServer(requestListener)
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
})