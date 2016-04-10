var config = {
  apiServer: 'http://localhost:5000/api',
  httpServer: 'http://localhost:8000',
  iconServer: '/',
  soundLocation: 'http://localhost:8000/sounds/',
};

// production settings
if (window.location.href.indexOf('moshebergman.com') > 0) {
  config = {
    apiServer: 'https://plan-my-time.moshebergman.com/api',
    httpServer: 'https://plan-my-time.moshebergman.com',
    iconServer: '/',
    soundLocation: 'https://s3-us-west-1.amazonaws.com/plan-my-time/sounds/',
  };
}

export default config;
