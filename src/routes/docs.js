const swaggerUi = require('swagger-ui-express');
const YAML = require('js-yaml');
const fs = require('fs');

function handler(req, res, next) {
  return res.sendStatus(200);
}

const swaggerDocument = YAML.load(fs.readFileSync('./docs.yaml', 'utf8'));
const docs = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerDocument),
  handler,
};

module.exports = docs
