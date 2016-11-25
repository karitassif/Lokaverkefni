
const axios = require('axios');

const baseURL = process.env.BASE_URL ||
  'http://apis.is/'; // Sækja úr environment breytu

// Nennum ekki að bíða endalaust eftir gögnum
const timeout = 1000;

const instance = axios.create({ baseURL, timeout });

// helper function to fetch the endpoint for a channel
function fetchChannel(endpoint) {
  return new Promise((resolve, reject) => {
    instance
      .get(endpoint)
      .then((response) => {
        if (response.status === 200) {
          resolve(response.data.results);
        }

        const status = `Endpoint returned non-200: ${response.status}`;
        reject({ status, stack: '' });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * Fetches all available channels from endpoint, returns a promise that when
 * resolved returns an array, e.g.:
 * [{ name: 'Rúv', endpoint: '/tv/ruv' }, ... ]
 *
 * @returns {Promise} - Promise with available channels when resolved
 */
function channels() {
  return new Promise((resolve, reject) => {
    instance
      .get('/tv')
      .then((response) => {
        if (response.status === 200) {
          const result = response.data.results[0].channels; // mjög brothætt!

          // lögum gögn, öll `endpoint` stök eiga að enda á /
          const fixed = result.map((c) => {
            const { name, endpoint } = c;

            const fixedEndpoint = endpoint[endpoint.length - 1] !== '/' ?
              `${endpoint}/` : endpoint;

            return { name, endpoint: fixedEndpoint };
          });

          resolve(fixed);
        }

        const status = `Endpoint returned non-200: ${response.status}`;
        reject({ status, stack: '' });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * Fetches schedule for a channel by name, returns an array, e.g.:
 * [{ title: '...', duration: '...', startTime: '...', ...}, ...]
 * If the channel does not exist, the empty array is returned.
 *
 * @param {string} name - Name of the channel
 * @returns {Promise} - Promise with schedule for channel when resolved
 */
function channel(name) {
  return new Promise((resolve, reject) => {
    // Byrjum á að sækja *allar* stöðvar til að vita að `name` sé lögleg
    channels()
      .then((result) => {
        const found = result.find(c => c.endpoint === `/tv/${name}/`);

        if (found) {
          resolve(fetchChannel(found.endpoint));
        }

        resolve([]);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = {
  channels,
  channel,
};
