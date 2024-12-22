var express = require('express');
var router = express.Router();
const WebSocket = require('ws');

const { connection } = require('../database/db');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('A new client connected.');
  
    ws.on('message', (message) => {
      const data = JSON.parse(message);
      const userdata = data.userdata
      const receievemsg = data.message
      console.log("User:", userdata);
      console.log("Message:", receievemsg);
    
      connection.query('INSERT INTO chat (user_id, message) VALUES (?, ?)', [userdata.id, receievemsg], (err, result) => {
  
        if (err) {
            console.log(err);
            return;
        }
    
      })

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          const msgData = {
            id: userdata.id,
            username: userdata.username,
            message: receievemsg
          }
          console.log("Broadcasting to clients:", msgData);
          client.send(JSON.stringify(msgData));
        }
      });
    });
  
    // Event listener for client disconnection
    ws.on('close', () => {
      console.log('A client disconnected.');
    });
  });
  

/* GET home page. */
router.get('/', function(req, res) {
    connection.query('SELECT users.id, users.username, chat.message FROM users INNER JOIN chat ON users.id = chat.user_id;', (err, rows) => {
        if (err) throw err
        console.log(rows)
        return res.send(rows);
    })
});

module.exports = router;
