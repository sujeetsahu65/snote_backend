const express = require('express');
const { model } = require('mongoose');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

// ROUTE 1)creating/registering a user 
// router.get("/",(req,res)=>{
router.post("/create",
  body('name').isLength({ min: 2 }),
  // username must be an email
  body('email', 'Idiot! enter a valid email').isEmail(),
  // password must be at least 5 chars long
  body('password').isLength({ min: 5 }),
  async (req, res) =>
  {

    const errors = validationResult(req);
    // Finds the validation errors in this request and wraps them in an object with handy functions

    // Error part 1 (is error is from the req body)
    if (!errors.isEmpty())
    {
      return res.status(400).json({ errors: errors.array() });
    }

    try
    {

      // Error part 2 (is error msg is from the db-model based error)
      let user = await User.findOne({ email: req.body.email });

      if (user)
      {
        return res.status(400).json({ errors: "Email already found." });
      }
      // let salt = await bcrypt.genSalt(5);
      let salt = bcrypt.genSaltSync(5);
      // let hash = await  bcrypt.hash(req.body.password, salt);
      let hash = bcrypt.hashSync(req.body.password, salt);

      // user =  User(req.body);
      // or 
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash
      });

      // user.save().then(user=>res.json(user)).catch(err=>res.json({'error':"dupli val"}));
      // user.save().then(user=>res.json(user)).catch(err=>res.json({'error':err, 'msg':err.message}));

      // or 
      // we can also create user manually
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      });
      // }).then(user=>res.json(user)).catch(err=>res.json({'error':"dupli val"}));

      // console.log(req.body);
      // res.send(req.body);
      const dataId = {
        user: { id: user.id }
      };
      // after hashing password we can provide token to the user
      // console.log(dataId);
      let JWT_SECRET = "^$^%$jhbjhhjk";
      let signature = jwt.sign(dataId, JWT_SECRET);
      // also 
      // jwt.sign({
      //   exp: Math.floor(Date.now() / 1000) + (60 * 60),
      //   data: 'foobar'
      // }, 'secret');

      res.json({ signature });


    }
    catch (err)
    {
      console.error(err.message);
      res.status(500).send("Some error occured");
    }


  });


// ROUTE 2)authenticating/logging in a user 


router.post("/login",
  // username must be an email
  body('email', 'Idiot! enter a valid email').isEmail(),
  // password must be at least 5 chars long
  body('password').isLength({ min: 5 }),
  async (req, res) =>
  {

    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
      return res.status(400).json({ errors: errors.array() });
    }

    // verify a token symmetric - synchronous
    // var decoded = jwt.verify(token, JWT_SECRET);
    // console.log(decoded.foo)

    try
    {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user)
      {
        res.status(400).json({ error: "Invalid Credentials" })
      }

      let compPass = bcrypt.compareSync(password, user.password);
      if (!compPass)
      {
        res.status(400).json({ error: "Invalid Credentials" })
      }


      // if all credential matches
      const dataId = {
        user: { id: user.id }
      };
      // after hashing password we can provide token to the user
      // console.log(dataId);
      let JWT_SECRET = "^$^%$jhbjhhjk";
      let signature = jwt.sign(dataId, JWT_SECRET);
      // also 
      // jwt.sign({
      //   exp: Math.floor(Date.now() / 1000) + (60 * 60),
      //   data: 'foobar'
      // }, 'secret');

      res.json({ signature });

    } catch (error)
    {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }

  }
);

// ROUTE 3)getting user's details using auth-token

router.post("/getuser",
  // username must be an email
  fetchuser,
  async (req, res) =>
  {

    try
    {
      let userId = req.user.id;//getting the appended userid
      // const user = await User.findById(userId).$where(argument);
      const user = await User.findById(userId).select("-password");//all except password

      res.json(user);
    } catch (error)
    {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }



  }
)


module.exports = router;