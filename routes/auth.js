const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

//@route    GET  api/auth
//@desc     Get logged in user
//@access   Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.user);
    res.json(user);  
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

//@route    POST  api/auth
//@desc     Log in
//@access   Public
router.post('/', [
  check('email', 'valid email is required').isEmail(),
  check('password', 'password is required with 6 or more characters').isLength({
    min: 6
  }).exists()
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }

  const {email, password} = req.body;

  try {
    let user = await User.findOne({email});

    if (!user) {
      return res.status(400).json({msg: 'No user with such credentials exists'});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({msg: 'Wrong password'});
    }

    const payload = {
      user: user.id
    }

    jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: 360000,

    }, (err, token) => {
      if (err) throw err;
      res.json({token});
    });
  } 
  catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;