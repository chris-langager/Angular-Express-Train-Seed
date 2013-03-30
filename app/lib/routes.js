
module.exports = function (app) {

    // Home
    app.get('/', app.controllers.home.index);

    //User
    app.get('/user', app.controllers.user.getCurrent);
    app.post('/user/login', app.controllers.user.authenticate);
    app.post('/user/register', app.controllers.user.create);
    app.post('/user/logout', app.controllers.user.kill);

    //Generic restful api for all models - if previous routes are not matched, will fall back to these
    //See libs/params.js, which adds param middleware to load & set req.Model based on :model argument
    app.get('/api/todo', ensureAuthenticated, app.controllers.todo.list);
    app.post('/api/todo', ensureAuthenticated, app.controllers.todo.create);
    app.get('/api/todo/:id',ensureAuthenticated,  app.controllers.todo.read);
    app.post('/api/todo/:id', ensureAuthenticated, app.controllers.todo.update);
    app.del('/api/todo/:id', ensureAuthenticated, app.controllers.todo.destroy);

    //default route if we haven't hit anything yet
    app.get('*', app.controllers.home.index);

    /*
    Route Helpers
     */

    //whenever a router parameter :model is matched, this is run
    app.param('model', function(req, res, next, model) {
        var Model = app.models[model];
        if(Model === undefined) {
            //if the request is for a model that does not exist, 404
            return res.send(404);
        }

        req.Model = Model;
        return next();
    });

    //make sure this person is logged in.
    //if they aren't, return a 401.  This let's angular know to go to a login page
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.send(401)
    }
};