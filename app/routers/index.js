const adminRouter = require('./admin');
const movieRouter = require('./movie');
const { cookieJwtAuth, checkAdmin, cookieLogin } = require('../../middleware/basicAuth')
// const { authToken } = require('../../middleware/basicAuth')
function route(app) {
    // app.use('/:slug', movieRouter);
    app.use('/admin', cookieJwtAuth, checkAdmin, adminRouter);
    app.use('/', movieRouter);
}

module.exports = route;
