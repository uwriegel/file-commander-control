const addon = require('filesystem-utilities')
const http = require("http")
const url = require('url')

console.log("Development test server started")

const requestListener = async (req, res) => {
    const reqUrl = new URL(req.url, "http://localhost")
    console.log(reqUrl, reqUrl.searchParams, reqUrl.searchParams.get('path'))

    //const files = await addon.getFiles("/home/uwe/Bilder")
    const files = await addon.getDrives()
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify(files))
}

const port = 3333
const host = "localhost"
const server = http.createServer(requestListener)
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
})


