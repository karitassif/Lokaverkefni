const scheduleApi = require('./schedule');

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  const title = 'Dagskráin';

  scheduleApi
    .channels()
    .then((channels) => {
      res.render('index', { title, channels });
    })
    .catch((error) => {
      const message = 'Villa við að sækja stöðvar';
      res.render('error', { message, error });
    });
});

router.get('/tv/:name', (req, res) => {
  const name = req.params.name || '';

  scheduleApi
    .channel(name)
    .then((schedule) => {
      const title = 'Dagksrá stöðvar';

      res.render('channel', { title, schedule });
    })
    .catch((error) => {
      const message = 'Villa við að sækja stöð';
      res.render('error', { message, error });
    });
});

module.exports = router;
