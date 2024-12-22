var express = require('express');
var router = express.Router();
const { connection } = require('../database/db');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

function validateData(req, res, next) {

  const { username } = req.body;

  if (!username) {

    return res.status(400).send('Username is required');

  }

  connection.query('SELECT * FROM users WHERE username = ?', [username], (err, rows) => {

      if (err) {
          console.log(err);
          return res.status(500).send('Internal Server Error');
      }

      if (rows.length > 0) {
          return res.status(400).send('Username already exists');
      }

    next();

  });
}

router.post('/', validateData, (req, res) => {
  const { username } = req.body;

  connection.query('INSERT INTO users (username) VALUES (?)', [username], (err, result) => {
  
    if (err) {
        console.log(err);
        return res.status(500).send('Internal Server Error');
    }

    console.log(
      connection.query('SELECT * FROM users', (err, rows) => {
        if (err) throw err
        console.log(rows)
      })
    );
    return res.status(200).send('Registered');
  })
})

module.exports = router;
