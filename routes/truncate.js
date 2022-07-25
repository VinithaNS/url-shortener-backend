const express = require("express")
const Database = require("better-sqlite3")

const app = express.Router()
app.use(express.urlencoded({ extended: true }))
const db = Database("database.db")

app.post("/truncate", async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (!(username && password)) return res.send({ success: false, cause: "Username or password not provided!" })

    const dbAdminSelectStatement = db.prepare("SELECT * FROM admins")
    const adminData = dbAdminSelectStatement.all()

    for (const admin of adminData) {
        if (admin.username == username && admin.password == password) {
            const truncateTableStatement = db.prepare("DELETE FROM links")
            truncateTableStatement.run()
        
            res.send({
                success: true
            })

            const fetch = require("node-fetch-commonjs")
            const options = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: `**URL Shortener**\nTruncated Database.` }) }
            const apiURL = process.env.alertsAPI || config.alertsAPIURL
            await fetch(apiURL, options)
            return
        } else {
            res.send({
                success: false,
                cause: "Invalid Username or Password."
            })
            return
        }
    }
})

module.exports = app