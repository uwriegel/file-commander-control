const addon = require('filesystem-utilities')
const express = require('express')
const cors = require('cors')
const ioPath = require('path')

console.log("Development test server started")

const app = express()
app.use(cors())

app.get('/root', async (req, res) => {
    const files = await addon.getDrives() 
    res.json(files)
})

app.get('/getFiles', async (req, res) => {
    const files = await addon.getFiles(req.query["path"])
    res.json(files)
})

app.get('/normalize', async (req, res) => {
    const normalizedPath = ioPath.normalize(req.query["path"])
    res.json({path: normalizedPath})
})

const port = 3333
const host = "localhost"
app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
})


