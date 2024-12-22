var express = require('express');
var router = express.Router();
const { connection } = require('../database/db');

function validateData(req, res, next) {

  const { username } = req.body;

  if (!username) {

    return res.status(400).json({message: 'Username is required'});

  }

  next();

}

router.post('/', validateData, (req, res) => {
  const { username } = req.body;

  connection.query('SELECT * FROM users WHERE username = ?', [username], (err, rows) => {

    if (err) {
        console.log(err);
        return res.status(500).json({message: 'Internal Server Error'});
    }

    if (rows.length <= 0) {
      return res.status(400).json({message: "Username doesn't exists"});
    }

    console.log('rows:', rows);
    const username = rows[0].username;
    const id = rows[0].id;
    req.session.username = username;
    req.session.user_id = id;
    console.log("session:",req.session);
    console.log("session username:",req.session.user_id);
    console.log("session username:",req.session.username);
    return res.status(200).json({message:'Logged in.', id: req.session.user_id, username: req.session.username})

  });
});

module.exports = router;
