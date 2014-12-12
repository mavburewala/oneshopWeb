'use strict';

angular.module('gleepostweb.posts').factory('gleepostWebPosts', [

    function() {
        return {
            name: 'posts'
        };
    }
]);

angular.module('gleepostweb.posts')
    .factory('posts', function($http, $cookieStore) {
        var injector = angular.injector(['gleepostweb.utilities']);
        var dataService = injector.get('data');

        return {
            /*
                required parameters: id=[user-id] token=[token]
                optional parameters: start=[count] returns a list of 20 posts ordered by time, starting at count
                before=[id] after=[id] returns a list of 20 posts ordered by time, starting before/after [id]
                filter=[tag] Returns only posts belonging to this category tag.
                This is effectively an alias for /networks/[university-id]/posts which returns the user's university network.
            */
            getPosts: function(params, success, error) {
                dataService.get('/posts', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id, token
                This returns the full representation of this post, or 403 if the user isn't allowed to view it (ie, it is in a network that you aren't).
                example responses: (http 200)
            */
            getPost: function(postId, params, success, error) {
                dataService.get('/posts/' + postId, params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id, token, text optional parameters: url, tags, video
                If set, url must be a url previously returned from /upload. If the image url is invalid, the post will be created without an image.
                If video contains a valid video ID, the post will be created with a video.
                If set, tags must be a comma-delimited list of category "tags". 
                Any of those tags which exist will be added to the post - any which do not exist are silently ignored.
                eg: tags=for-sale,event,salsa
                In addition, any other parameters that are sent when creating the post will be available as an "attribs" object within a post.
                Event posts are strongly encouraged to set "event-time", which represents the time an event begins. This may be either RFC3339
                or a unix timestamp. Event posts may also set an "title", to be used as a heading.
                example responses: (http 200)
                {"id":3}
            */
            addPost: function(postId, params, success, error) {
                dataService.post('/posts', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id=[user-id] token=[token]
                On success, returns 204; if you aren't the creator of the post, will return 403.
            */
            deletePost: function(postId, params, success, error) {
                dataService.delete('/posts/' + postId, params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters:id=[user-id] token=[token]
                optional parameters: start=[count]
                If you are not allowed to view this post, it will return 403. example responses: (http 200)
            */
            getCommentsForPost: function(postId, params, success, error) {
                dataService.get('/posts/' + postId + '/comments', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id, token, text
                example responses: (http 200)
                {"id":234}
                If you provide a zero-length text: (http 400)
                {"error":"Comment too short"}
            */
            addCommentForPost: function(postId, params, success, error) {
                dataService.post('/posts/' + postId + '/comments', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id, token, url
                This adds an image previously uploaded with /upload to this post.
                example responses: (http 201)
                ["https://gleepost.com/uploads/7911970371089d6d59a8a056fe6580a0.jpg", "https://gleepost.com/uploads/3cdcbfbb3646709450d0fb25132ba681.jpg"]
            */
            addImageForPost: function(postId, params, success, error) {
                dataService.post('/posts/' + postId + '/images', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id, token, video
                This adds a video to this post and returns a list of all this post's videos 
                (although this is limited to one) or 403 f you aren't the post's creator..(HTTP 201)
                [
                    {
                        "mp4":"https://s3-us-west-1.amazonaws.com/gpcali/038c00d4c7b335f20f793b899a753ba0767324edfec74685fd189d81d76334ec.mp4",
                        "webm":"https://s3-us-west-1.amazonaws.com/gpcali/bd4ad39805768915de8a50b8e1cfae8ac518f206d031556de7886612f5e8dd3e.webm",
                        "thumbnails":["https://s3-us-west-1.amazonaws.com/gpcali/6e6162b65b83262df79da102bbdbdb824f0cc4149cc51507631eecd53c7635a7.jpg"]
                    }
                ]
            */
            addVideoForPost: function(postId, params, success, error) {
                dataService.post('/posts/' + postId + '/videos', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id, token, liked
                [liked] must be a boolean. If true, adds a like for this post for this user. If false, removes a like for this post for this user.
                If this post is in another network, will respond with 403.
                example responses: (http 200)
                {"post":5, "liked":true}
                {"post":5, "liked":false}
            */
            changeLikeForPost: function(postId, params, success, error) {
                dataService.post('/posts/' + postId + '/likes', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                Returns the popularity, attendee-count and full list of attendees of an event.
            */
            getAttendeesForPost: function(postId, params, success, error) {
                dataService.post('/posts/' + postId + '/attendees', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                Required parameters: attending = (true|false)
                attending=true marks the current user as attending this event. attending=false cancels the attendance.
                It returns the updated popularity, attendee_count and attendees list.
            */
            changeAttendenceForPost: function(postId, params, success, error) {
                dataService.put('/posts/' + postId + '/attendees', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id, token, after
                [after] must be either an RFC3339 formatted time string, or a unix timestamp.
                Live returns the 20 events whose event-time is soonest after "after".
                example responses: (http 200)
            */
            getEventPosts: function(params, success, error) {
                dataService.put('/live', params, true, true)
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
                required parameters: post optional parameters: reason
                Reports the given post ID to moderators, optionally with a reason. On success, will give an HTTP 204.
            */
            reportAPost: function(params, success, error) {
                dataService.post('/reports', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },


        };
    });