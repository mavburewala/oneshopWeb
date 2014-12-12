'use strict';

angular.module('gleepostweb')
    .factory('notifications', function($http, $cookieStore) {
        var injector = angular.injector(['gleepostweb.utilities']);
        var dataService = injector.get('data');

        return {
            /*
                required parameters: id, token
                optional parameters: include_seen = (true|false)
                Returns all unread notifications for user [id], and includes the read ones if include_seen is true.
                example responses: HTTP 200
            */
            getNotifications: function(params, success, error) {
                dataService.get('/notifications', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id, token, seen
                Marks all notifications for user [id] seen up to and including the notification with id [seen] 
                    Responds with an array containing any unseen notifications.
                example responses: HTTP 200
            */
            markSeenNotifications: function(postId, params, success, error) {
                dataService.put('/notifications', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },

        };
    });