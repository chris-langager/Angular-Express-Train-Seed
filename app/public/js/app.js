'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives'])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

        //The routes that our angular app will handle
        $routeProvider
            .when('/', { templateUrl: '/partials/index.html', controller: IndexCtrl })
            .when('/login', { templateUrl: '/partials/login.html'})
            .when('/mytodos', { templateUrl: '/partials/todos.html', controller: TodosCtrl })
            .otherwise({ templateUrl: '/partials/404.html' });

        //gets rid of the # in urls
        $locationProvider.html5Mode(true);

        /*
         Set up an interceptor to watch for 401 errors.
         The server, rather than redirect to a login page (or whatever), just returns  a 401 error
         if it receives a request that should have a user session going.  Angular catches the error below
         and says what happens - in this case, we just redirect to a login page.  You can get a little more
         complex with this strategy, such as queueing up failed requests and re-trying them once the user logs in.
         Read all about it here: http://www.espeo.pl/2012/02/26/authentication-in-angularjs-application
         */
        var interceptor = ['$q', '$location', '$rootScope', function ($q, $location, $rootScope) {
            function success(response) {
                return response;
            }

            function error(response) {
                var status = response.status;
                if (status == 401) {
                    $rootScope.redirect = $location.url(); // save the current url so we can redirect the user back
                    $rootScope.user = {}
                    $location.path('/login');
                }
                return $q.reject(response);
            }

            return function (promise) {
                return promise.then(success, error);
            }
        }];
        $httpProvider.responseInterceptors.push(interceptor);

    }])
    .run(function ($rootScope, $http, $location) {

        //global object representing the user who is logged in
        $rootScope.user = {};

        //as the app spins up, let's check to see if we have an active session with the server
        $http.get('/user')
            .success(function (data) {
                $rootScope.user.username = data.username;
            })
            .error(function (data) {
            });

        //global function for logging out a user
        $rootScope.logout = function () {
            $rootScope.user = {}
            $http.post('user/logout', {});
            $location.path('/');
        }

    });