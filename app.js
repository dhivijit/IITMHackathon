'use strict';

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
// import the test function from the cb js file
// const cb = require('./cb.js')
const crypto = require('crypto')
const fs = require('fs')
require('dotenv').config()
var aes256 = require('aes256');

var data = fs.readFileSync(__dirname + '/data.json')
data = JSON.parse(data)

function calculateSHA256Hash(inputString) {
  // Create a SHA-256 hash object
  const hash = crypto.createHash('sha256');

  // Update the hash object with the input string
  hash.update(inputString);

  // Get the hexadecimal representation of the hash
  const hashedString = hash.digest('hex');

  return hashedString;
}

const ENC_KEY = process.env.secret


app.use(bodyParser.urlencoded({ extended: false }))

const port = process.env.PORT || 3000

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.route("/signup").get(function (req, res) {
  res.sendFile(__dirname + '/signup.html')
}).post(function (req, res) {
  const { username, pandetails, Email_add, password, phoneNumber = '', DOB = '', Address = '' } = req.body
  res.send(`Username: ${username} Password: ${password} Email: ${Email_add} Phone Number: ${phoneNumber} DOB: ${DOB} Address: ${Address}`)
  var personData = {
    "username": username,
    "pandetails": pandetails,
    "Email_add": Email_add,
    "phoneNumber": phoneNumber,
    "DOB": DOB,
    "Address": Address
  }
  var data = fs.readFileSync(__dirname + '/data.json')
  data = JSON.parse(data)
  var personDatastring = JSON.stringify(personData)
  // AES encryption

  var encryptedData = aes256.encrypt(ENC_KEY + "" + password, personDatastring);

  console.log('Encrypted Data:', encryptedData);

  var credhashed = calculateSHA256Hash(password)

  data[username] = {
    "pass": credhashed,
    "encryptedData": encryptedData
  };

  console.log(data)

  data = JSON.stringify(data)
  fs.writeFileSync(__dirname + '/data.json', data)
  // console.log(credhashed)
})


app.route("/login").get(function (req, res) {
  res.sendFile(__dirname + '/login.html')
}).post(function (req, res) {
  const { username, password } = req.body
  var data = fs.readFileSync(__dirname + '/data.json')
  data = JSON.parse(data)
  var credhashed = calculateSHA256Hash(password)
  if (data[username] && data[username].pass === credhashed) {
    console.log("Login Successful")
    var decryptedData = aes256.decrypt(ENC_KEY + "" + password, data[username].encryptedData);
    console.log('Decrypted Data:', decryptedData);
    res.send(`Login Successful`)
  } else {
    console.log("Login Failed")
    res.send(`Login Failed`)
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})