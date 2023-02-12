const express = require('express');
const { model } = require('mongoose');
const User = require('../models/User');
const router = express.Router();


// router.get("/",(req,res)=>{
router.post("/",(req,res)=>{
const user = User(req.body);
user.save();
// console.log(req.body);
res.send(req.body);
})
 
module.exports = router;