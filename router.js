const health = require('./controllers/health');
const crypto = require('./controllers/cryptodash');

module.exports = (app) => {
       app.get('/heartbeat', health.heartbeat);
       app.get('/currencies/list', crypto.getCurrenciesList);
       app.post('/currencies/limit', crypto.getWidgetCardData);
}
