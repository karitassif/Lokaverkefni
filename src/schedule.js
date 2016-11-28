
const axios = require('axios');

const baseURL = process.env.BASE_URL ||
  'http://apis.is/'; // Sækja úr environment breytu

// Nennum ekki að bíða endalaust eftir gögnum
const timeout = 1000;

const instance = axios.create({ baseURL, timeout });

/**
 * Fetches all available concerts from endpoint, returns a promise that when
 * resolved returns an array, e.g.:
 * [{ eventDateName: 'Hjálmar', name: 'Tónleikar', ...  }, ... ]
 *
 * @returns {Promise} - Promise with available concerts when resolved
 */
function concerts() {
  return new Promise((resolve, reject) => {
    instance
      .get('/concerts')
      .then((response) => {
        if (response.status === 200) {
          const result = response.data.results;
          console.log("apis");

          resolve(result);
        }

        const status = `Endpoint returned non-200: ${response.status}`;
        reject({ status, stack: '' });
      })
      .catch((error) => {
        reject(error);
      });
  });
}


module.exports = {
  concerts
};
