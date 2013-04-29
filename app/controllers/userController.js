module.exports = function (app, User, passportMiddleware) {
    return {
        getCurrent: [
            function (req, res, next) {
                if (!req.user) {
                    res.send(400);
                }
                else {
                    User.findOne({_id: req.user.id}, function (err, results) {
                        if (err) return next(err);
                        if (results) {
                            console.log({username: results.username});
                            res.send({username: results.username});
                        }
                        else {
                            res.send(400);
                        }
                    });
                }
            }],

        authenticate: [
            function (req, res, next) {
                passportMiddleware.authenticate('local', function (err, user, info) {
                    if (err) return next(err);
                    if (!user) {
                        return res.send('Invalid username or password.', 400);
                    }
                    req.logIn(user, function (err) {
                        if (err) return next(err);
                        return res.send('Ok', 200);
                    });
                })(req, res, next);
            }],

        create: [
            function (req, res, next) {
                var user = new User(req.body);
                User.findOne({username: user.username}, function (err, results) {
                    if (err) return next(err);
                    if (results) {
                        res.send('A user with this username already exists.', 400);
                    }
                    else {
                        user.save(function (err, results) {
                            if (err) return next(err);
                            req.logIn(user, function () {
                                res.send('ok', 200)
                            });
                        });
                    }
                })
            }],
        //logout/kill session
        kill: [
            function (req, res) {
                if (req.session) {
                    req.session.destroy(function () {
                        res.send('ok', 200)
                    });
                }
                else {
                    res.send('ok', 200)
                }
            }]
    };
};

