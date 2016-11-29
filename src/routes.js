const scheduleApi = require('./schedule');
const express = require('express');
const redis = require('redis');

const router = express.Router();

// new redis client and connect to redis instance
const client = redis.createClient({
  retry_strategy: function (options) {
    if (options.total_retry_time > 1000 * 10) {
        // End reconnecting after a specific timeout
        // and flush all commands with a individual error
        return new Error('Retry time exhausted');
    }
    // reconnect after
    return Math.max(options.attempt * 100, 3000);
  }
});

const concertData = "test1";

// if an error occurs, print it to the console
client.on('error', function (err) {
    console.log("Error " + err);
});

router.get('/', (req, res) => {
  const title = 'Tónleikar';

  client.get(concertData, function(error, result) {

    if (result) {
      // the result exists in our cache - return it to our user immediately
      const fixed = JSON.parse(result);
      console.log("redis");
      res.render('index', { title, concerts: fixed });

    } else {

      scheduleApi
        .concerts()
        .then((concerts) => {
          client.setex(concertData, 600, JSON.stringify(concerts));
          res.render('index', { title, concerts });
        })
        .catch((error) => {
          const message = 'Villa við að sækja tónleika';
          res.render('error', { message, error });
        });
    }
  });
});

router.get('/umokkur', (req, res) => {
  const title = 'Um okkur';
  res.render('umokkur', { title});
});

router.get('/hafasamband', (req, res) => {
  const title = 'Hafa samband';
  res.render('hafasamband', { title});
});

module.exports = router;
