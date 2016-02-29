function notFoundHandler(req, res, next) {
    var err = new Error('Not Found ' + req.url);
    err.status = 404;
    next(err);
}
module.exports = notFoundHandler;
