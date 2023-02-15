const express = require('express');
const { model } = require('mongoose');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// router.get("/",(req,res)=>{
router.post("/",
 body('name').isLength({ min: 2 }),
 // username must be an email
  body('email', 'Idiot! enter a valid email').isEmail(),
  // password must be at least 5 chars long
  body('password').isLength({ min: 5 }),
  async (req,res)=>{

     const errors = validationResult(req);
      // Finds the validation errors in this request and wraps them in an object with handy functions

// Error part 1 (is error is from the req body)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

try{

// Error part 2 (is error msg is from the db-model based error)
let user = await User.findOne({email:req.body.email});

if(user){
    return res.status(400).json({ errors: "Email already found." });
}

user =  User(req.body);
// user.save().then(user=>res.json(user)).catch(err=>res.json({'error':"dupli val"}));
user.save().then(user=>res.json(user)).catch(err=>res.json({'error':err, 'msg':err.message}));

// we can also create user manually
// User.create({
//     name:req.body.name,
//     email:req.body.email
// })
// console.log(req.body);
// res.send(req.body);
}
catch(err){
res.status(500).send("Some error occured");
}


})
 
module.exports = router;