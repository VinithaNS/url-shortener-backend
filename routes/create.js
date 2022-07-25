const express = require("express")
const Database = require("better-sqlite3")
const bodyParser = require("body-parser")

const app = express.Router()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const db = Database("database.db")
const config = require("../config.json")

const createTableStatement = db.prepare("CREATE TABLE IF NOT EXISTS links (code text primary key, url text, views integer)")
createTableStatement.run()

app.post("/create", (req, res) => {
    const urlToShorten = req.body.url
    const customCode = req.body.code

    console.log(customCode)

    if (!urlToShorten) return res.send({ success: false, cause: "No URL Provided." })

    let code = getCode()

    const selectStatement = db.prepare("SELECT * FROM links WHERE code = ?")
    const dbData = selectStatement.get(code)

    let dbDataForCustomCode

    if (customCode) {
        if (customCode.strip() == "") return res.send({ success: false, cause: "No custom code provided!" })

        const selectStatementForCustomCode = db.prepare("SELECT * FROM links WHERE code = ?")
        dbDataForCustomCode = selectStatementForCustomCode.get(customCode)

        if (customCode.length > 20) return res.send({ success: false, cause: "Custom code is too long!" })
        
        if (dbDataForCustomCode) {
            return res.send({
                success: false,
                cause: "This code is already taken! Please try a different code."
            })
        } else {
            code = customCode
        }
    }

    if (dbData) {
        code = getCode()
    }

    const insertStatement = db.prepare("INSERT INTO links VALUES (?, ?, ?)")
    insertStatement.run(code, urlToShorten, 0)

    res.send({
        success: true,
        code: code
    })

    return
})

function getCode() {
    var randomChars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    var result = ''
    for ( var i = 0; i < config.shortURLCodeLength; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
    }
    return result
}

module.exports = app