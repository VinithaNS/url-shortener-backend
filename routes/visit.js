const express = require("express")
const Database = require("better-sqlite3")

const app = express.Router()
app.use(express.urlencoded({ extended:true }))
const db = Database("database.db")
const config = require("../config.json")

app.get("/u/:code", (req, res) => {
    const code = req.params.code
    if (code === " " || code === "") return res.redirect(config.defaultRedirectIfNoCodeProvided)

    try {
        const dbData = db.prepare("SELECT * FROM links WHERE code = ?").all(code.toLowerCase())

        const url = dbData[0]["url"]

        const previousViews = dbData[0]["views"] || 0

        const increaseViewsStatement = db.prepare("UPDATE links SET views = ? WHERE code = ?")
        increaseViewsStatement.run((previousViews + 1), code)

        return res.redirect(url)
    } catch (error) {
        return res.send("Invalid Code!")
    }
})

module.exports = app