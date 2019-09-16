const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const Contact = require('../models/Contacts');
const auth = require('../middleware/auth');

//@route    GET  api/contacts
//@desc     Get all users contacts
//@access   Private
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({user: req.user.user}).sort({date: -1});
    res.json(contacts);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

//@route    POST  api/contacts
//@desc     Add new contacts
//@access   Private
router.post('/', [auth,
  check('name', 'name is required').not().isEmpty()
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }

  const {name, email, phone, type} = req.body;

  try {
    const newContact = new Contact({
      name,
      email,
      phone,
      type,
      user: req.user.user
    });

    const addedContact = await newContact.save();
    res.json(addedContact);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

//@route    PUT  api/contacts/:id
//@desc     Updateusers contact
//@access   Private
router.put('/:id', auth, async (req, res) => {
  const {name, email, phone, type} = req.body;

  const contactFields = {};

  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({msg: 'Contact not found'});

    //Make sure user own this contact
    if (contact.user.toString() !== req.user.user){
      return res.status(401).json({msg: 'Not authorized'});
    }

    contact = await Contact.findByIdAndUpdate(req.params.id, {
      $set: contactFields
    },{
      new: true
    });

    res.json(contact)
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

//@route    DELETE  api/contacts/:id
//@desc     Delete users contact
//@access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({msg: 'Contact not found'});

    //Make sure user own this contact
    if (contact.user.toString() !== req.user.user){
      return res.status(401).json({msg: 'Not authorized'});
    }

    await Contact.findByIdAndRemove(req.params.id);

    res.json({msg: 'Contact deleted'});
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;