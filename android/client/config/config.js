const config = {
  production: {
    apiServer: 'https://plan-my-time.moshebergman.com/api',
    iconServer: '/',
    soundLocation: 'https://s3-us-west-1.amazonaws.com/plan-my-time/sounds/',
  },
  develop: {
    apiServer: 'http://192.168.1.173:5000/api',
    iconServer: '/',
    soundLocation: 'http://localhost:8000/sounds/',
  },
};

export default config;
