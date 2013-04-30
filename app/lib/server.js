module.exports = function(app, config) {

    var port = config.port;// || process.env.PORT || 3000;
    console.log('[express train application listening on %s]', port);
    return app.listen(port);
}