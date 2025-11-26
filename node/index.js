const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'node',
    database: 'nodedb'
}

const mariadb = require('mariadb')
const randomName = require("node-random-name");

async function insertNewUser(connection, randomName) {
    const sql = `INSERT INTO people (name) VALUES ('${randomName}')`
    await connection.query(sql)
}

async function getListOfPeople(connection) {
    const sql = `SELECT * FROM people ORDER BY id DESC LIMIT 100`

    return await connection.query(sql)
}

app.get("/", async (req, res) => {
    let output = "<h1>Full Cycle Rocks!</h1>"

    const connection = await mariadb.createConnection(config)

    try {
        const randomName = require('node-random-name');
        await insertNewUser(connection, randomName())

        const people = await getListOfPeople(connection)
        output += "<ul>";
        for (const person of people) {
            output += "<li>" + person.name + "</li>"
        }
        output += "</ul>";
    } catch (err) {
        console.log(err)
    } finally {
        await connection.end()
    }

    res.send(output)
})

app.listen(port, () => {
    console.log("Server started on port: " + port)
})
