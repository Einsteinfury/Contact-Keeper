const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  //Get token from header
  const token = req.header('x-auth-token');

  //Check if token doesn't exist
  if(!token) {
    return res.status(401).json({msg: 'No token authorization denied'});
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    console.log(decoded);
    req.user = decoded;
    next();
  } 
  catch (error) {
    res.status(401).json({msg: 'Token is not valid'});
  }
}