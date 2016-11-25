const scheduleApi = require('./schedule');

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  const title = 'Tónleikar';

  scheduleApi
    .concerts()
    .then((concerts) => {
      res.render('index', { title, concerts });
    })
    .catch((error) => {
      const message = 'Villa við að sækja stöðvar';
      res.render('error', { message, error });
    });
});


module.exports = router;
