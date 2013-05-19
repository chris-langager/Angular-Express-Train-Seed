module.exports = function (app, homeController, userController, todoController, apiController) {

    // Home
    app.get('/', homeController.index);

    //User
    app.get('/user', userController.getCurrent);
    app.post('/user/login', userController.authenticate);
    app.post('/user/register', userController.create);
    app.post('/user/logout', userController.kill);

    /*
    Rather than go right to the API routes below, we need to do a few things first, like say what Users Todos
    to return and stamp the Todos they create with their ID.  Once we've dne these things (in the "pre" functions),
    we end up invoking the generic api methods.  Cool, right?
     */
    app.get('/api/Todo', ensureAuthenticated, todoController.preSearch, apiController.search);
    app.post('/api/Todo', ensureAuthenticated, todoController.preCreate, apiController.create);
    app.post('/api/Todo/:id', ensureAuthenticated, todoController.preUpdate, apiController.update);
    app.del('/api/Todo/:id', ensureAuthenticated, todoController.preDestroy, apiController.destroy);

    //Generic restful api for all models - if previous routes are not matched, will fall back to these
    //See libs/params.js, which adds param middleware to load & set req.Model based on :model argument
    app.get('/api/:model', ensureAuthenticated, apiController.search);
    app.post('/api/:model', ensureAuthenticated, apiController.create);
    app.get('/api/:model/:id', ensureAuthenticated, apiController.read);
    app.post('/api/:model/:id', ensureAuthenticated, apiController.update);
    app.del('/api/:model/:id', ensureAuthenticated, apiController.destroy);

    /*
    default route if we haven't hit anything yet
    This will just return the index file and pass the url to our angular app.
    Angular will decide if it should display a 404 page.
     */
    app.get('*', homeController.index);

    /*
     Route Helpers
     */

    //whenever a router parameter :model is matched, this is run
    app.param('model', function (req, res, next, model) {
        console.log(app);
        var Model = app.models[model];
        if (Model === undefined) {
            //if the request is for a model that does not exist, 404
            return res.send(404);
        }
        req.Model = Model;
        return next();
    });

    /*
    Make sure this person is logged in.
    If they aren't, return a 401.  This let's angular know to go to a login page.
     */
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.send(401)
    }
};