const User = require('../models/User');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id)
    req.token = token;
    next();
  } catch (err) {
    console.log(err)
    res.status(401).send('Authentication failed')
  }
}

module.exports = auth;
