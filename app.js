'use strict';

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const crypto = require('crypto')
const fs = require('fs')
require('dotenv').config()
var aes256 = require('aes256');
var ejs = require('ejs');
const { decrypt } = require('dotenv');

app.set('view engine', 'ejs');

var data = fs.readFileSync(__dirname + '/userdata/data.json')
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
  res.redirect("/login")
})

app.route("/signup").get(function (req, res) {
  res.render('signup')
}).post(function (req, res) {
  const { name, username, pan, email, password, mobile = '', DOB = '', Address = '' } = req.body
  // res.send(`Username: ${username} Password: ${password} Email: ${email} Phone Number: ${mobile} DOB: ${DOB} Address: ${Address}`)
  var personData = {
    "name":name,
    "username": username,
    "pandetails": pan,
    "Email_add": email,
    "phoneNumber": mobile,
    "DOB": DOB,
    "Address": Address
  }
  var data = fs.readFileSync(__dirname + '/userdata/data.json')
  data = JSON.parse(data)
  var personDatastring = JSON.stringify(personData)
  // AES encryption

  var encryptedData = aes256.encrypt(ENC_KEY + "" + password, personDatastring);

  // console.log('Encrypted Data:', encryptedData);

  var credhashed = calculateSHA256Hash(password)

  data[username] = {
    "pass": credhashed,
    "encryptedData": encryptedData
  };

  // console.log(data)

  data = JSON.stringify(data)
  fs.writeFileSync(__dirname + '/userdata/data.json', data)
  res.redirect('/login')
})

app.route("/login")
  .get(function (req, res) {
    res.render('login', { errormessage: "",target:"/login" })
  })
  .post(function (req, res) {
    const { username, password } = req.body
    var data = fs.readFileSync(__dirname + '/userdata/data.json')
    data = JSON.parse(data)
    var credhashed = calculateSHA256Hash(password)
    if (data[username] && data[username].pass === credhashed) {
      // console.log("Login Successful")
      var decryptedData = aes256.decrypt(ENC_KEY + "" + password, data[username].encryptedData);
      // console.log('Decrypted Data:', decryptedData);
      res.render('dashboard',{data:JSON.parse(decryptedData)})
    } else {
      // console.log("Login Failed")
      res.render('login', { errormessage: "Login Failed, Please Try Again" })
    }
  })

  // app.route("/edit")
  // .get(function (req, res) {
  //   res.render('login', { errormessage: "",target:"/edit" })
  // }).post(function (req, res) {
  //   const { username, password } = req.body
  //   global.password=password
  //   var data = fs.readFileSync(__dirname + '/userdata/data.json')
  //   data = JSON.parse(data)
  //   var credhashed = calculateSHA256Hash(password)
  //   if (data[username] && data[username].pass === credhashed) {
  //     // console.log("Login Successful")
  //     global.decryptedData = aes256.decrypt(ENC_KEY + "" + password, data[username].encryptedData);
  //     // console.log('Decrypted Data:', decryptedData);
  //     res.render('edit')
  //   } else {
  //     // console.log("Login Failed")
  //     res.render('login', { errormessage: "Login Failed, Please Try Again" })
  //   }
  // })

// app.post("/edited",function(req,res){
//   const { edit_fullname='', edit_pan='', edit_email='', edit_password='', edit_mobile = '', edit_dob = '', edit_address = '' } = req.body
//   decryptedData = JSON.parse(global.decryptedData)
//   // change the values of the decrypted data if and only if they are changed in the form
//   if(edit_fullname!=''){
//     decryptedData.name = edit_fullname
//   }
//   if(edit_pan!=''){
//     decryptedData.pandetails = edit_pan
//   }
//   if(edit_email!=''){
//     decryptedData.Email_add = edit_email
//   }
//   if(edit_password!=''){
//     password = edit_password
//   }
//   if(edit_mobile!=''){
//     decryptedData.phoneNumber = edit_mobile
//   }
//   if(edit_dob!=''){
//     decryptedData.DOB = edit_dob
//   }
//   if(edit_address!=''){
//     decryptedData.Address = edit_address
//   }
  
//   var encryptedData = aes256.encrypt(ENC_KEY + "" + password, decryptedData);

//   // console.log('Encrypted Data:', encryptedData);

//   var credhashed = calculateSHA256Hash(password)

//   data[username] = {
//     "pass": credhashed,
//     "encryptedData": encryptedData
//   };

//   // console.log(data)

//   data = JSON.stringify(data)
//   fs.writeFileSync(__dirname + '/userdata/data.json', data)
// })

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})