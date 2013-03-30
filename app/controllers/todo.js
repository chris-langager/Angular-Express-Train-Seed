var mongoose = require('mongoose');

module.exports = function (app) {
    var controller = {};
    var Todo = app.models.Todo;

    controller.list = [
        function (req, res, next) {
            Todo.find({userId: req.user.id}, function (err, docs) {
                if (err) return next(err);
                return res.json(docs);
            });
        }
    ]
    controller.create = [
        function (req, res, next) {
            console.log(req.body);
            var todo = new Todo(req.body);
            todo.userId = req.user.id;
            todo.save(function (err, doc) {
                if (err) return next(err);
                return res.json(doc);
            })
        }
    ]
    controller.read = [
        function (req, res, next) {
            var id = req.params.id;
            Todo.findById(id, function (err, doc) {
                if (err) return next(err);
                if (doc === null) return res.send(404);
                return res.json(doc);
            });
        }
    ]
    controller.update = [
        function (req, res, next) {
            var id = req.params.id;
            delete req.body._id;
            Todo.findByIdAndUpdate(id, req.body, function (err, doc) {
                if (err) return next(err);
                if (doc === null) return res.send(404);
                return res.json(doc);
            })
        }
    ]
    controller.destroy = [
        function (req, res, next) {
            var id = req.params.id;
            Todo.findByIdAndRemove(id, function (err, doc) {
                if (err) return next(err);
                if (doc === null) return res.send(404);
                return res.send(204);
            })
        }
    ]

    return controller;
}