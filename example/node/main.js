const addon = require('filesystem-utilities')
const express = require('express')
const cors = require('cors')
const ioPath = require('path')
console.log("Development test server started")

const app = express()
app.use(cors())
app.use(express.json({limit: '50mb'}))

app.get('/root', async (req, res) => {
    const files = await addon.getDrives() 
    res.json(files)
})

app.get('/getFiles', async (req, res) => {
    const files = await addon.getFiles(req.query["path"])
    res.json(files)
})

app.get('/geticon', async (req, res) => {
    const iconPath = await addon.getIcon(req.query["ext"])
    res.download(iconPath)
})

app.post('/getExifDates', async (req, res) => {
    const exifDates = req.body.files
    await Promise.all(exifDates.map(async n => 
        n.exifDate = await addon.getExifDate(ioPath.join(req.body.path, n.name))
    ))
    res.json(exifDates.filter(n => n.exifDate))
})

app.get('/normalize', async (req, res) => {
    const normalizedPath = ioPath.normalize(req.query["path"])
    res.setHeader("content_type", "image/png")
    res.json({path: normalizedPath})
})

const port = 3333
const host = "localhost"
app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
})


