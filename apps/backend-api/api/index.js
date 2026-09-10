const app = require('../dist/index.js').default || require('../dist/index.js');

module.exports = (req, res) => {
  return app(req, res);
};
