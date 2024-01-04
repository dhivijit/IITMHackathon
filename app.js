const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

const port = process.env.port | 3000

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/main.html')
})

app.post("/", (req, res) => {
    const { name, email, password } = req.body
    res.send(`Name: ${name} Email: ${email} Password: ${password}`)
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})