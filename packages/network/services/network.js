'use strict';

angular.module('gleepostweb.network').factory('gleepostWebNetwork', [

    function() {
        return {
            name: 'network'
        };
    }
]);

angular.module('gleepostweb.network')
    .factory('network', function($http, $cookieStore) {
        var injector = angular.injector(['gleepostweb.utilities']);
        var dataService = injector.get('data');

        return {
                /*
              required parameters: id=[user-id] token=[token]
              This returns a list of all (non-university) groups this user belongs to.
              Example response: (http 200)
              [{"id":5345, "name":"Stanford Catan Club"}]
          */
            getNetworksforUser: function(params, success, error) {
                dataService.get('/profile/networks', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
              required parameters: id=[user-id] token=[token]
              This revokes your membership of the group network-id, if you are a member. 
              If you attempt this on an official network (a university) you will get an error 403. Otherwise, you will get 204 No Content.
          */
            deleteNetworkforUser: function(networkId, params, success, error) {
                dataService.delete('/profile/networks/' + networkId, params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
              required parameters: id=[user-id] token=[token]
              This resource is a combined feed of posts in groups you are a member of. It functions identically to /posts but with one exception:
              Posts also embed information about the group they were posted in.
          */
            getAllNetworksPostsforUser: function(params, success, error) {
                dataService.get('/profile/networks/posts', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id=[user-id] token=[token]
                A group resource, or 403 if you aren't a member of the group. example responses (http 200):
                {"id":5345, "name":"Super Cool Group", "description":"Pretty cool, no?",
                     "url":"https://s3-eu-west-1.amazonaws.com/gpimg/45661eff6323f17ee42d90fe2fa0ad8dcf29d28a67619f8a95babf4ace48ff96.jpg", 
                     "creator":{"id":2491,"name":"Patrick",
                     "profile_image":"https://s3-eu-west-1.amazonaws.com/gpimg/45661eff6323f17ee42d90fe2fa0ad8dcf29d28a67619f8a95babf4ace48ff96.jpg"}}
            */
            getNetwork: function(networkId, params, success, error) {
                dataService.get('/networks/' + networkId, params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id=[user-id] token=[token]
                url="URL returned from /upload"
                If you created this group, you can change the group's image. If you didn't create the group 
                -- or you didn't choose a valid image URL - it will return 403. Otherwise, returns the updated resource.
                {"id":5345, "name":"Super Cool Group", "description":"Pretty cool, no?", 
                    "url":"https://s3-eu-west-1.amazonaws.com/gpimg/45661eff6323f17ee42d90fe2fa0ad8dcf29d28a67619f8a95babf4ace48ff96.jpg", 
                    "creator":{"id":2491,"name":"Patrick",
                    "profile_image":"https://s3-eu-west-1.amazonaws.com/gpimg/45661eff6323f17ee42d90fe2fa0ad8dcf29d28a67619f8a95babf4ace48ff96.jpg"}}
            */
            addImageToNetwork: function(networkId, params, success, error) {
                dataService.put('/networks/' + networkId, params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id=[user-id] token=[token] name="Name of the group"
                optional: desc="Description of the group" url = uploaded image URL This creates a new group named name and adds you as a member.
                If url is not valid, it will respond with a 403.
                A successful response is 201:
                {"id":5345, "name":"Even Cooler Group", "description":"Pretty cool, no?", 
                    "url":"https://s3-eu-west-1.amazonaws.com/gpimg/45661eff6323f17ee42d90fe2fa0ad8dcf29d28a67619f8a95babf4ace48ff96.jpg", 
                    "creator":{"id":2491,"name":"Patrick",
                    "profile_image":"https://s3-eu-west-1.amazonaws.com/gpimg/45661eff6323f17ee42d90fe2fa0ad8dcf29d28a67619f8a95babf4ace48ff96.jpg"}}
            */
            addNetwork: function(params, success, error) {
                dataService.post('/networks', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id=[user-id] token=[token]
                optional parameters: start=[count] returns a list of 20 posts ordered by time, starting at count
                before=[id] after=[id] returns a list of 20 posts ordered by time, starting before/after [id]
                filter=[tag] Returns only posts belonging to this category tag.
                This returns all the posts in this network, or an error 403 if the user is not allowed to view the posts in this network.
                example responses: (HTTP 200)
            */
            getNetworkPosts: function(networkId, params, success, error) {
                dataService.get('/networks/' + networkId + '/posts', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                Create a post in this network.
                required parameters: id, token, text optional parameters: url, tags
                If set, url must be a url previously returned from /upload. If the image url is invalid, the post will be created without an image.
                If set, tags must be a comma-delimited list of category "tags". Any of those tags which exist will be added to the post 
                    - any which do not exist are silently ignored.
                eg: tags=for-sale,event,salsa
                In addition, any other parameters that are sent when creating the post will be available as an "attribs" object within a post.
                Event posts are strongly encouraged to set "event-time", which represents the time an event begins. 
                This may be either RFC3339 or a unix timestamp. Event posts may also set an "title", to be used as a heading.
                If you are not allowed, will respond with 403. If successful, will respond with HTTP 201
                {"id":345}
            */
            addPostToNetwork: function(networkId, params, success, error) {
                dataService.post('/networks/' + networkId + '/posts', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id=[user-id] token=[token]
                A collection of all the users in this network, or 403 if you aren't a member of the network 
                    (or if it is a university network) Example response:
                    [{"id":9, "name":"Patrick", 
                    "profile_image":"https://gleepost.com/uploads/35da2ca95be101a655961e37cc875b7b.png"},
                        {"id":23, "name":"PeterGatsby", 
                        "profile_image":"https://gleepost.com/uploads/35da2ca95be101a655961e37cc875b7b.png"}]

            */
            getNetworkUsers: function(networkId, params, success, error) {
                dataService.get('/networks/' + networkId + '/users', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id=[user-id] token=[token]
                One or more of: users=[other-user-id],[other-user-id],[other-user-id]
                fbusers=[facebook-id],[facebook-id],[facebook-id]
                email=[other-user-email]
                Adds other users to this network, or records that they have been invited via facebook, or emails them an invite 
                    if they aren't on Gleepost. On success will return 204.

            */
            addUserToNetwork: function(networkId, params, success, error) {
                dataService.post('/networks/' + networkId + '/users', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                Use this to generate a new user in a particular network.
                Required parameters: first, last, email, pass, verified, network-id
                where verified is a boolean and network-id is the network that this user will be created in.
                Success is a 204.

            */
            addNewUserToNetwork: function(params, success, error) {
                dataService.post('/user', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },

        };
    });