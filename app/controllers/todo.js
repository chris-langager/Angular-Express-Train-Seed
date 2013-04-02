module.exports = function (app) {
    var controller = {};
    var Todo = app.models.Todo;

    controller.preSearch = [
        function (req, res, next) {
            console.log('this it?');
            req.query = {userId: req.user.id};
            req.Model = app.models.Todo;
            next();
        }
    ]
    controller.preCreate = [
        function (req, res, next) {
            req.body.userId = req.user.id;
            req.Model = app.models.Todo;
            next();
        }
    ]
    controller.preUpdate = [
        function (req, res, next) {
            //try to find a todo that matches the ID in the uri and belongs to the user who is logged i
            app.models.Todo.find({_id: req.params.id, userId: req.user.id}, function (err, results) {
                if (err) return next(err);
                if(!results) return res.send(401); //trying to update a todo that isn't yours?!?!?!
                req.Model = app.models.Todo;
                next();
            });
        }
    ]
    controller.preDestroy = [
        function (req, res, next) {
            //try to find a todo that matches the ID in the uri and belongs to the user who is logged in
            app.models.Todo.find({_id: req.params.id, userId: req.user.id}, function (err, results) {
                if (err) return next(err);
                if(!results) return res.send(401); //trying to update a todo that isn't yours?!?!?!
                req.Model = app.models.Todo;
                next();
            });
        }
    ]

    return controller;
}
