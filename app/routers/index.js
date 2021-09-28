const adminRouter = require('./admin');
const movieRouter = require('./movie');
function route(app) {
    // app.use('/:slug', movieRouter);
    app.use('/admin', adminRouter);
    app.use('/', movieRouter);
}

module.exports = route;
