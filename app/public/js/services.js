'use strict';


angular.module('myApp.services', ['ngResource'])
    .factory('Todo', function ($resource) {
        return $resource('api/Todo/:id', {}, {
        });
    });
