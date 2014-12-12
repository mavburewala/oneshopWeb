'use strict';

angular.module('gleepostweb.messenger').factory('gleepostWebMessenger', [

    function() {
        return {
            name: 'messenger'
        };
    }
]);

angular.module('gleepostweb.messenger')
    .factory('messenger', function($http, $cookieStore) {
        var injector = angular.injector(['gleepostweb.utilities']);
        var dataService = injector.get('data');

        return {
            /*
                required parameters: id=[user-id] token=[token] 
                Returns up to three live conversations (whose "ended" attribute is false) for the current user.
            */
            getLive3Conversation: function(params, success, error) {
                dataService.get('/conversations/live', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id=[user-id] token=[token]
                Marks all conversations as "seen". On success, will return a 204 (no content).
            */
            markReadAllConversations: function(params, success, error) {
                dataService.post('/conversations/read_all', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id=[user-id] token=[token]
                optional parameters: start=[count]
                returns a list of 20 of your conversations ordered by most recent message, starting at count
            */
            getConversations: function(params, success, error) {
                dataService.get('/conversations', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id=[user-id] token=[token]
                optional parameters: random=[true/false], defaults to true
                If random = true, you should provide: participant_count=[2 <= n <= 4], defaults to 2
                if random = false, you should provide: participants=[user_id],[user_id],[user_id],... 
                    (a comma-delimited list of user_ids to start a conversation with.
                example responses: (HTTP 200)
            */
            addConversation: function(networkId, params, success, error) {
                dataService.post('/conversations', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id=[user-id] token=[token]
                example responses: (HTTP 200)
            */
            getConversation: function(conversationId, params, success, error) {
                dataService.get('/conversations/' + conversationId, params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id=[user-id] token=[token]
                This ends a live conversation. If you try this on a regular conversation, I don't know what will happen!
                If it is successful, it will respond with HTTP 204.
            */
            deleteConversation: function(conversationId, params, success, error) {
                dataService.get('/conversations/' + conversationId, params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id=[user-id] token=[token] expiry=[bool]
                Set expiry = false and a conversation's expiry will be deleted. 
                Will return the updated conversation object. NB: This probably isn't the right place to put this. Will change in a future release.
            */
            putConversation: function(conversationId, params, success, error) {
                dataService.put('/conversations/' + conversationId, params, true, true)
                    .success(function(response) {
                        success();
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id=[user-id], token=[token] optional parameters: start=[start], after=[after], before=[before]
                Returns a list of 20 messages ordered by time from most recent to least recent. 
                Given [start], it returns messages from the [start]th most recent to [start + 20]th most recent. 
                Given [after], it returns at most 20 of the messages received since [after] Given [before], 
                    it returns at most 20 of the messages received immediately before [before]
                example responses:
            */
            getMessagesForConversation: function(conversationId, params, success, error) {
                dataService.get('/conversations/' + conversationId + '/messages', params, true, true)
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
            addMessageToConversation: function(conversationId, params, success, error) {
                dataService.post('/conversations/' + conversationId + '/messages', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            /*
                required parameters: id, token, seen
                Marks all messages in a conversation up to seen seen.
                example responses:
                seen=51 (HTTP 200)

            */
            markSeenMessagesInConversation: function(conversationId, params, success, error) {
                dataService.put('/conversations/' + conversationId + '/messages', params, true, true)
                    .success(function(response) {
                        success(response);
                        return response;
                    }).error(error);
            },
            
        };
    });