const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy('/dev/user', {
      target: 'https://7kzk3mcrg1.execute-api.us-east-1.amazonaws.com',
      changeOrigin: true
    }),
    proxy('/dev/user/email', {
      target: 'https://7kzk3mcrg1.execute-api.us-east-1.amazonaws.com',
      changeOrigin: true
    })
  );
};
