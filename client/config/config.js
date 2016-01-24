var config = {
  apiServer: 'http://localhost:5000/api',
  httpServer: 'http://localhost:8000',
  iconServer: '/'
}

// production settings
if (window.location.href.indexOf('moshebergman.com') > 0) {
  config = {
    apiServer: 'http://plan-my-time.moshebergman.com/api',
    httpServer: 'http://plan-my-time.moshebergman.com',
    iconServer: '/'
  }
}

export default config;
