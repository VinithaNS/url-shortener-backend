const express = require("express")
const Database = require("better-sqlite3")

const app = express.Router()
app.use(express.urlencoded({ extended: true }))
const db = Database("database.db")

app.post("/delete", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const code = req.body.code

    if (!(username && password)) return res.send({ success: true, cause: "Username or password not provided!" })

    const adminData = db.prepare("SELECT * FROM admins").all()

    for (const admin of adminData) {
        if (admin.username == username && admin.password == password) {
            
            const codeData = db.prepare("SELECT * FROM links WHERE code = ?").all(code)
            if (codeData.length >= 1) {
                db.prepare("DELETE FROM links WHERE code = ?").run(code)
                return res.send({
                    success: true
                })
            } else { 
                return res.send({
                    success: false,
                    cause: "No short URL with the specified code found!"
                })
            }
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