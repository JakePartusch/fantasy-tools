const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy('/api', {
      target: 'https://7kzk3mcrg1.execute-api.us-east-1.amazonaws.com',
      pathRewrite: {
        '^/api': '/dev'
      },
      changeOrigin: true
    })
  );
};
