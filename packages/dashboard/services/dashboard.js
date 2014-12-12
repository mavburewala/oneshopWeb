'use strict';

angular.module('gleepostweb.dashboard').factory('gleepostWebDashboard', [

    function() {
        return {
            name: 'dashboard'
        };
    }
]);

angular.module('gleepostweb.dashboard')
    .factory('Auth', function($http, $cookieStore) {
        var injector = angular.injector(['gleepostweb.utilities']);
        var dataService = injector.get('data');

        return {
            /*
                required parameters: id, token, name
                Returns a list of all the users within your primary (ie university) network, who match a search for name.
                You can supply partial names (with a minimum length of two characters for the first) and the second name is optional.
                If there is a user called "Jonathan Smith", all the searches "Jon" "jonathan" "Jon S" "Jonathan Smi" will match him.
                Example response: (HTTP 200)
                [{"id":9, "name":"Steph", 
                    "profile_image":"https://gleepost.com/uploads/35da2ca95be101a655961e37cc875b7b.png"},
                    {"id":23, "name":"Steve", "profile_image":"https://gleepost.com/uploads/35da2ca95be101a655961e37cc875b7b.png"}]
            */
            searchUserByName: function(name, params, success, error) {
                dataService.get('/search/users/' + name, params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id, token
                user-id is any user ID you want to see the stats for. At the moment there is no limitation on who can see whose stats.
                stat-type is one of "posts", "likes", "comments", "rsvps", "interactions"
                The special stat type "overview" will give you a combined view containing all the above stat types for this interval.
                period is either "hour", "day" or "week" and indicates how the counts are bucketed (the interval within which counts are summed)
                start and finish are RFC3339 formatted strings which indicate the beginning and end of the period you are viewing stats for.
                Example: GET https://dev.gleepost.com/api/v0.34/stats/user/2395/posts/rsvps/week/2013-01-01T00:00:00Z/2015-01-01T00:00:00Z
            */
            // getUserStats: function(userId, statType, period, start, finish, params, success, error) {
            //     dataService.put('/stats/users/' + userId + '/posts/' + statType + '/' + period + '/'
            //           +  start + '/' + finish, params, true, true)
            //         .success(function(response) {
            //             success(response);
            //             return response;
            //         }).error(error);
            // },
            /*
                required parameters: id, token
                stat-type is one of "likes", "comments", "rsvps", "interactions"
                The special stat type "overview" will give you a combined view containing all the above stat types for this interval.
                period is either "hour", "day" or "week" and indicates how the counts are bucketed (the interval within which counts are summed)
                start and finish are RFC3339 formatted strings which indicate the beginning and end of the period you are viewing stats for.
                Example: GET https://dev.gleepost.com/api/v1/stats/posts/2395/rsvps/week/2013-01-01T00:00:00Z/2015-01-01T00:00:00Z
            */
            getPostStats: function(postId, statType, period, start, finish, params, success, error) {
                dataService.put('/stats/posts/' + postId + '/' + statType + '/' + period + '/' +
                        start + '/' + finish, params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },

            getUserStats: function(userId, statType, period, start, finish, params, success, error) {
                dataService.get('/stats/user/' + userId + '/posts/' + statType + '/' + period + '/'
                      +  start + '/' + finish, params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                }).error(error);
            }
        };
    });