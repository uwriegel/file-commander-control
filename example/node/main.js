const addon = require('filesystem-utilities')
const http = require("http")
const url = require('url')

console.log("Development test server started")

const requestListener = async (req, res) => {
    try {
        const reqUrl = new URL(req.url, "http://localhost")
        
        const files = 
            reqUrl.pathname == "/root" 
            ? await addon.getDrives() 
            : reqUrl.pathname == "/getFiles" 
                ? await addon.getFiles(reqUrl.searchParams.get('path'))
                : null
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(files))
    } catch (err) {
        console.log(err)
    }
}

const port = 3333
const host = "localhost"
const server = http.createServer(requestListener)
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
})


