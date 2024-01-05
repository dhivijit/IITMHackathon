const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
// import the test function from the cb js file
const cb = require('./cb')
const crypto = require('crypto')

function calculateSHA256Hash(inputString) {
  // Create a SHA-256 hash object
  const hash = crypto.createHash('sha256');

  // Update the hash object with the input string
  hash.update(inputString);

  // Get the hexadecimal representation of the hash
  const hashedString = hash.digest('hex');

  return hashedString;
}


app.use(bodyParser.urlencoded({ extended: false }))

const port = process.env.port | 3000

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/main.html')
  cb.test()
})

app.post("/signup",(req, res)=> {
  const { username, password } = req.body
  res.send(`Username: ${username} Password: ${password}`)
  cred = username + "!|,$@(~()%?" + password
  credhashed = calculateSHA256Hash(cred)
  console.log(credhashed)
})

app.post("/login", (req, res) => {
  const { username, password } = req.body
  res.send(`Username: ${username} Password: ${password}`)
  cred = username + "!|,$@(~()%?" + password
  credhashed = calculateSHA256Hash(cred)
  console.log(credhashed)
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})