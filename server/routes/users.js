var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/logout', function(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({message: 'failed to logout'});
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({message: 'logged out'});
  })
})

module.exports = router;
