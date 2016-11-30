const scheduleApi = require('./schedule');
const express = require('express');
const redis = require('redis');

const router = express.Router();

// new redis client and connect to redis instance
const client = redis.createClient({
  retry_strategy: (options) => {
    if (options.total_retry_time > 1000) {
      // End reconnecting after a specific timeout
      // and flush all commands with a individual error
      return new Error('Retry time exhausted');
    }
    // reconnect after
    return Math.max(options.attempt * 100, 3000);
  },
});

const concertData = 'redisCache';


// if an error occurs, print it to the console
client.on('error', (err) => {
  console.log(`Error ${err}`);
});


router.get('/', (req, res) => {
  const title = 'Tónleikar';

  client.get(concertData, (error, result) => {
    if (result) {
      // the result exists in our cache - return it to our user immediately
      const fixed = JSON.parse(result);
      // console.log("redis");
      res.render('index', { title, concerts: fixed });
    } else {
      scheduleApi
        .concerts()
        .then((concerts) => {
          client.setex(concertData, 600, JSON.stringify(concerts));
          res.render('index', { title, concerts });
        })
        .catch((err) => {
          const message = 'Villa við að sækja tónleika';
          res.render('error', { message, err });
        });
    }
  });
});

router.get('/umokkur', (req, res) => {
  const title = 'Um okkur';
  res.render('umokkur', { title });
});

router.get('/hafasamband', (req, res) => {
  const title = 'Hafa samband';
  res.render('hafasamband', { title });
});

router.get('/send', (req, res) => {
  const title = 'Haft samband';
  const msg = 'Notaðu Hafa samband formið til að senda email';
  res.render('send', { title, msg });
});

module.exports = router;
