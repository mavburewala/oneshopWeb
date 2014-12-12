angular.module('gleepostweb.users')
    .factory('Profile', function($http, $cookieStore) {

      var injector = angular.injector(['gleepostweb.utilities']);
        var dataService = injector.get('data');

        return {
            /*
                required parameters: id=[user-id] token=[token]
                You are only allowed to view a user's profile if they share a network with you. 
                Attempting to access a profile resource of a user you share no networks with will result in a 403 error.
                example responses:
            */
            getUserDetails: function(userId, params, success, error) {
                dataService.get('/user/' + userId, params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
      required parameters: id, token, url
      /profile_image expects the url of an image previously uploaded with /upload.
      For now its response is the same as if you issued a GET /user/[id] but they will diverge in the future.
      example responses: HTTP 200
  */
            updateImageforUser: function(params, success, error) {
                dataService.post('/profile/profile_image', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
      required parameters: id, token, first, last
      /name allows the user to set their name if it is not set already.
      On success, it will return HTTP 204.
  */
            updateImageforUser: function(params, success, error) {
                dataService.post('/profile/name', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
      required parameters: id, token, old, new
      old is the user's old password; new is the password the user is changing to.
      If it fails it will return 400, on success 204.
  */
            updatePasswordforUser: function(params, success, error) {
                dataService.post('/profile/change_pass', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
      required parameters: id, token, status
      status can be true or false
      /profile/busy sets user [id] status to [status]
      example responses: HTTP 200
      { "busy":true }
  */
            updateBusyStatusforUser: function(params, success, error) {
                dataService.post('/profile/busy', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
      required parameters: id, token
      The current busy/free status for this user.
      example responses: HTTP 200
      { "busy":true }
  */
            getBusyStatusforUser: function(params, success, error) {
                dataService.get('/profile/busy', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
      required parameters: email, pass, fbtoken where fbtoken is a facebook session token
      Alternatively, you may provide the normal gleepost authentication and fbtoken.
      This associates the facebook account logged in with fbtoken with the user signed in with email, pass.
      On success, will return 204.
  */
            linkFbforUser: function(params, success, error) {
                dataService.post('/profile/facebook', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
      required parameters: email, pass, fbtoken where fbtoken is a facebook session token
      Alternatively, you may provide the normal gleepost authentication and fbtoken.
      This associates the facebook account logged in with fbtoken with the user signed in with email, pass.
      On success, will return 204.
  */
            RequestRestPasswordforUser: function(params, success, error) {
                dataService.post('/profile/request_reset', params, false, false)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
      required parameters: user-id, reset-token, pass
      user-id and reset-token are in the password reset link sent to the users' email address. pass is the new password.
      A successful response (password changed) will be 204. An unsuccessful response (bad reset token, password too short) will be 400.
  */
            ResetPasswordforUser: function(userId, resetToken, params, success, error) {
                dataService.post('/profile/reset/' + userId + '/' + resetToken, params, false, false)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
      required parameters: id=[user-id] token=[token]
      This will return an array containing the id of every event this user is attending. Example response: (http 200)
      [1,5,764,34,345]
  */
            getAttendingEventsforUser: function(params, success, error) {
                dataService.get('/profile/attending', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
      This will verify the account this verification-token is associated with, or create a verified account for a new facebook user.
      If it fails it will return HTTP 400 and the error.
      Example responses: HTTP 200
      {"verified":true}
  */
            verifyToken: function(token, params, success, error) {
                dataService.post('/verify/' + token, params, false, false)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
      required parameters: email Resend a verification email.
      If successful, will respond with HTTP 204.
  */
            resendVerification: function(params, success, error) {
                dataService.post('/resend_verification', false, false)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
      required parameters: id=[user-id] token=[token]
      Gets all the current user's contacts.
      If you've added someone, they_confirmed will be false until they accept you and vice versa.
      example responses:
      HTTP 200
  */
            getUserContacts: function(params, success, error) {
                dataService.get('/contacts', true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
      required parameters: id, token, user
      Adds the user with id [user] to the current contact list. If this user has already added you, it will accept them.
      example responses:
      HTTP 201
  */
            addContactToUser: function(params, success, error) {
                dataService.post('/contacts', true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
      required parameters: id, token, accepted
      if accepted = true, it will set that contact to "confirmed"
      example responses: HTTP 200
  */
            acceptContactRequestToUser: function(user, params, success, error) {
                dataService.put('/contacts/' + user, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id=[user-id] token=[token]
                optional parameters: start=[count] returns a list of 20 posts ordered by time, starting at count
                before=[id] after=[id] returns a list of 20 posts ordered by time, starting before/after [id]
                filter = "category" returns only posts matching that category example responses:
            */
            getUserPosts: function(userId, params, success, error) {
                dataService.get('/user/' + userId + '/posts', params, true, true)
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