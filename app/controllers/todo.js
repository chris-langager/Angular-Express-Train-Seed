module.exports = function (app) {
    var controller = {};
    var Todo = app.models.Todo;

    controller.preSearch = [
        function (req, response, next) {
            req.query = {userId: req.user.id};
            req.Model = app.models.Todo;
            next();
        }
    ]
    controller.preCreate = [
        function (req, response, next) {
            req.body.userId = req.user.id;
            req.Model = app.models.Todo;
            next();
        }
    ]

    return controller;
}
