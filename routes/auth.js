const express = require('express');
const { model } = require('mongoose');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// router.get("/",(req,res)=>{
router.post("/",
 body('name').isLength({ min: 2 }),
 // username must be an email
  body('email', 'Idiot! enter a valid email').isEmail(),
  // password must be at least 5 chars long
  body('password').isLength({ min: 5 }),
  (req,res)=>{
      // Finds the validation errors in this request and wraps them in an object with handy functions
     const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
const user = User(req.body);
// user.save().then(user=>res.json(user)).catch(err=>res.json({'error':"dupli val"}));
user.save().then(user=>res.json(user)).catch(err=>res.json({'error':err, 'msg':err.message}));
// console.log(req.body);
// res.send(req.body);
})
 
module.exports = router;