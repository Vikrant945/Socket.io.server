// Cron job to hit endpoint every 5 minutes to keep the backend alive always
const cron = require('cron');
const https = require('https');

// Replace with your actual backend API endpoint
const backendUrl = 'https://socket-io-server-vmy8.onrender.com/socket.io/socket.io.js';

const job = new cron.CronJob('*/1 * * * *', function () {
  // This function will be executed every 5 minutes.
  console.log(`Hitting backend endpoint to keep server alive...`);

  // Perform an HTTPS GET request to hit any backend API.
  https
    .get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log('Successfully hit backend endpoint. Server is active.');
      } else {
        console.error(`Failed to hit endpoint. Status code: ${res.statusCode}`);
      }
    })
    .on('error', (err) => {
      console.error('Error during HTTPS request:', err.message);
    });
});

// Start the cron job
job.start();

// Export the cron job (if you need to use it elsewhere)
module.exports = { job };
