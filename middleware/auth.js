const User = require('../models/User');
const jwt = require('jsonwebtoken');
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.jwtSecret);

    req.user = await User.findById(decoded.id)
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send('Authentication failed')
  }
}

module.exports = auth;
