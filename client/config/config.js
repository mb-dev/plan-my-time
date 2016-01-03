var config = {
  apiServer: 'http://localhost:5000',
  httpServer: 'http://localhost:8000',
  iconServer: '/'
}

// production settings
if (window.location.href.indexOf('plot-my-trip.com') > 0) {
  config = {
    apiServer: 'http://www.plot-my-trip.com',
    timeApiServer: 'http://time-api.plot-my-trip.com',
    httpServer: 'http://www.plot-my-trip.com',
    iconServer: '/'
  }
}

export default config;
