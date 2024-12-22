var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if (req.session.user_id && req.session.username) {
    return res.status(200).json({message: 'Valid!', id: req.session.user_id, username: req.session.username});
  } else {
    return res.status(401).json({message: 'Please log in first'});
  }
});

module.exports = router;
