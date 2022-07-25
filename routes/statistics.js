const express = require("express")
const Database = require("better-sqlite3")
const bodyParser = require("body-parser")

const app = express.Router()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const db = Database("database.db")

app.post("/statistics", (req, res) => {
    const code = req.body.code

    if (!code) return res.send({ success: false, cause: "No Code Provided!" })
    
    const checkStatement = db.prepare("SELECT * FROM links WHERE code = ?")
    const dbData = checkStatement.all(code)

    if (dbData.length < 1) return res.send({ success: false, cause: "No URL could be found with the specified code." })

    res.send({
        success: true,
        views: dbData[0].views || 0,
        url: dbData[0].url
    })
})

module.exports = app