const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
// import the test function from the cb js file
const cb = require('./cb.js')
const crypto = require('crypto')
require('dotenv').config()

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

const port = process.env.PORT || 3000

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/main.html')
})

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + '/signup.html')
})

app.post("/signup", (req, res) => {
  const { username, pandetails, Email_add, password, phoneNumber = '', DOB = '', Address = '' } = req.body
  res.send(`Username: ${username} Password: ${password} Email: ${Email_add} Phone Number: ${phoneNumber} DOB: ${DOB} Address: ${Address}`)
  var personData={
    "username": username,
    "pandetails": pandetails,
    "Email_add": Email_add,
    "password": password,
    "phoneNumber": phoneNumber,
    "DOB": DOB,
    "Address": Address
  }
  personDatastring = JSON.stringify(personData)
  // AES encryption
  const algorithm = 'aes-256-cbc';
  const key = process.env.secret;
  const iv = Buffer.from(crypto.randomBytes(16),"hex");

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedData = cipher.update(personDatastring, 'utf8', 'hex');
  encryptedData += cipher.final('hex');

  console.log('Encrypted Data:', encryptedData);

  cred = username + "!|,$@(~()%?" + password
  credhashed = calculateSHA256Hash(cred)
  ivhex=iv.toString('hex')
  // console.log(credhashed)
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