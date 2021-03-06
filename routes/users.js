const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route    POST  api/users
//@desc     Register a user
//@access   Public
router.post('/', [
  check('name', 'name is required').not().isEmpty(),
  check('email', 'please include a valid email').isEmail(),
  check('password', 'password is required with 6 or more characters').isLength({
    min: 6
  })
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }

  const {name, email, password} = req.body;

  try {
    //In ES6 if both variables are the same {email} will be the same as {email: email}
    let user = await User.findOne({email});

    //if user is already set in the db
    if (user){
      return res.status(400).json({msg: 'User already exists'});
    }

    user = new User({
      name,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

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