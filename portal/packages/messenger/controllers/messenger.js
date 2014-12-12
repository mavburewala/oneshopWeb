'use strict';
angular.module('gleepostweb.messenger')
    .controller('conversationsCtrl', ['$scope', '$rootScope', '$http', '$location', 'messenger', '$interval', '$cookieStore', '$filter', '$timeout',
        function($scope, $rootScope, $http, $location, messenger, $interval, $cookieStore, $filter, $timeout) {

            $scope.listOfConversation = [];
            $scope.selectedConversation = null;
            $scope.user = {};
            $scope.newMessage = '';
            $rootScope.$watch('newRead', function(newValue, oldValue) {
                if (newValue.length > 0) {
                    console.log("New reads are: ");
                    console.log(newValue);
                    $timeout(function() {
                        $scope.$apply(function() {
                            for (var i = 0; i < newValue.length; i++) {
                                if(newValue[i].data.user!=$cookieStore.get('user').id){
                                    var message = String(newValue[i].location);
                                    var conId = message.replace('/conversations/', '');
                                    var convers = _.findWhere($scope.listOfConversation, {'id': Number(conId)});
                                    var seenMessage = _.findWhere(convers['messages'], {'id': newValue[i].data.last_read});
                                    console.log(newValue[i].data.last_read);
                                    console.log(convers['messages']);
                                    console.log(seenMessage);
                                    if(seenMessage){
                                        seenMessage['isSeen'] = true;
                                        seenMessage['lastSeenBy'] = newValue[i].data.user
                                    }
                                }
                            };
                            $rootScope['newRead'] = [];
                        });
                    })
                    $("#messages").animate({scrollTop: $('#messages')[0].scrollHeight}, 1000);
                }
            }, true);
            $scope.markSeen = function(conversationId, MessageId) {
                messenger.markSeenMessagesInConversation(conversationId, {'seen': MessageId}, function(response) {
                    _.findWhere($scope.listOfConversation, {'id': conversationId})['unread'] = 0;
                }, function() {
                    console.log("Error");
                })
            }
            $scope.scrollPositionOfMessages = $('#messages').scrollTop();
            $scope.scrollPositionOfConversations = $('#conversations').scrollTop();
            $rootScope.$watch('newMessage', function(newValue, oldValue) {
                if (newValue.length > 0) {
                    console.log("New Messages are: ");
                    console.log(newValue);
                    $timeout(function() {
                        $scope.$apply(function() {
                            for (var i = 0; i < newValue.length; i++) {
                                var message = String(newValue[i].location);
                                var conId = message.replace('/conversations/', '');
                                var convers = _.findWhere($scope.listOfConversation, {'id': Number(conId)});
                                var newMessage = {};
                                newMessage['id'] = newValue[i].data.id;
                                newMessage['text'] = newValue[i].data.text;
                                newMessage['by'] = newValue[i].data.by;
                                newMessage['isSeen'] = false;
                                newMessage['time'] = moment(newValue[i].data.timestamp).calendar();
                                newMessage['isMine'] = (newValue[i].data.by.id == $cookieStore.get('user').id) ? true : false;
                                newMessage['data'] = newValue[i].data;
                                if (!_.findWhere(convers['messages'], {'id': newMessage['id']})) {
                                    console.log(newMessage);
                                    console.log("added");
                                    convers['messages'].push(newMessage);
                                }
                                if (_.findWhere(convers['messages'], {'id': newMessage['id']})) {
                                    console.log(newMessage);
                                    console.log("updated");
                                    _.findWhere(convers['messages'], {'id': newMessage['id']})["data"]=newValue[i].data;
                                }
                                convers['lastActivity'] = moment(newValue[i].data.timestamp).fromNow();
                                convers['lastMessageText'] = newValue[i].data.text;
                                convers['unread'] = convers['unread'] + 1;
                            };
                            $rootScope['newMessage'] = [];

                            //$scope.$$phase || $scope.$apply();
                            //$scope.$apply();
                            $("#messages").animate({
                                scrollTop: $('#messages')[0].scrollHeight
                            }, 100);
                        });
                    })

                }
            }, true);
            $scope.$watch('scrollPositionOfMessages', function(newValue, oldValue) {
                if (newValue == 0 && $scope.selectedConversation && $scope.selectedConversation.messages) {
                    $scope.getMessagesForConversation($scope.selectedConversation, {
                        'start': $scope.selectedConversation.messages.length
                    }, false)
                }
                var trueDivHeight = $('#messages')[0].scrollHeight;
                var divHeight = $('#messages').height();
                var scrollLeft = trueDivHeight - divHeight;
                if (newValue == scrollLeft && $scope.selectedConversation && $scope.selectedConversation['messages']) {
                    var temp = $filter('orderBy')($scope.selectedConversation['messages'], 'data.timestamp')[$scope.selectedConversation['messages'].length - 1];
                    $scope.selectedConversation['unread'] = 0;
                    $scope.markSeen($scope.selectedConversation.id, temp.id)
                }
            });
            $scope.$watch('scrollPositionOfConversations', function(newValue, oldValue) {
                var trueDivHeight = $('#conversations')[0].scrollHeight;
                var divHeight = $('#conversations').height();
                var scrollLeft = trueDivHeight - divHeight;
                if (newValue == scrollLeft && $scope.listOfConversation) {
                    $scope.retrieveConversations({
                        'start': $scope.listOfConversation.length
                    }, false, false);
                    //$scope.getMessagesForConversation($scope.selectedConversation,{'start':$scope.selectedConversation.messages.length},false)
                }
            });
            $scope.sendNewMessage = function() {
                if ($scope.newMessage != '' && $scope.selectedConversation) {
                    var conversationId = $scope.selectedConversation.id;
                    messenger.addMessageToConversation(conversationId, {'text': $scope.newMessage}, function(response) {
                        console.log(response);
                        var message={};
                        message['id'] = response.id;
                        message['text'] = $scope.newMessage;
                        var user=$cookieStore.get('user')
                        message['by'] = {'id':user.id,'name':user.full_name,'profile_image':user.profile_image};
                        message['isSeen'] = false;
                        message['time'] = moment(new Date()).calendar();
                        message['isMine'] = true;
                        if (!_.findWhere($scope.selectedConversation["messages"], {'id': message.id})) {
                            //console.log(message);
                            //console.log("added");
                            ($scope.selectedConversation["messages"]).push(message);
                        }
                        //$scope.getMessagesForConversation($scope.selectedConversation, null, true);
                        _.findWhere($scope.listOfConversation, {'id': $scope.selectedConversation.id})['lastActivity'] = moment(new Date()).fromNow();
                        _.findWhere($scope.listOfConversation, {'id': $scope.selectedConversation.id})['lastMessageText'] = $scope.newMessage;
                        $scope.newMessage = '';
                        $scope.$apply();
                        $("#messages").animate({scrollTop: $('#messages')[0].scrollHeight}, 1000);
                        console.log($scope.newMessage)
                    }, function() {
                        console.log("Error Occured");
                    });
                } else
                    console.log("can't send message")
            };
            $scope.getMessagesForConversation = function(selected, params, isScroll) {
                var initInjector = angular.injector(['ngCookies']);
                var $cookieStore = initInjector.get('$cookieStore');
                messenger.getMessagesForConversation(selected.id, params, function(response) {
                    for (var i = 0; i < response.length; i++) {
                        var message = {};
                        message['id'] = response[i].id;
                        message['text'] = response[i].text;
                        message['by'] = response[i].by;
                        message['isSeen'] = false;
                        message['time'] = moment(response[i].timestamp).calendar();
                        message['isMine'] = (response[i].by.id == $cookieStore.get('user').id) ? true : false;
                        message["data"] = response[i];
                        if(!$scope.selectedConversation["messages"])
                            ($scope.selectedConversation["messages"])=[];
                        if (!_.findWhere($scope.selectedConversation["messages"], {'id': message.id})) {
                            ($scope.selectedConversation["messages"]).push(message);
                        }
                    }
                    $scope.$apply();
                    if (isScroll) {
                        $("#messages").animate({scrollTop: $('#messages')[0].scrollHeight}, 1000);
                        $interval(function() {
                            $scope.scrollPositionOfMessages = $('#messages').scrollTop();
                        }, 50);
                    }
                }, function() {
                    console.log("Error Occured");
                });
            };
            $scope.selectConversation = function(selected) {
                selected.isSelected = true;
                $scope.selectedConversation = selected;
                for (var i = 0; i < $scope.listOfConversation.length; i++) {
                    if ($scope.listOfConversation[i] != selected)
                        $scope.listOfConversation[i].isSelected = false;
                }
                $scope.getMessagesForConversation(selected, null, true);
                //$("#messages").animate({ scrollTop: $('#messages')[0].scrollHeight}, 1000);
            };
            var getConversationsFn = function() {
                $scope.retrieveConversations(null, true, true);
            };
            $scope.retrieveConversations = function(params, isScroll, IsSelectFirst) {
                messenger.getConversations(params, function(response) {
                    //console.log(response);
                    for (var i = 0; i < response.length; i++) {
                        var conv = {};
                        conv['id'] = response[i].id;
                        conv['lastMessageText'] = response[i].mostRecentMessage ? S(response[i].mostRecentMessage.text).truncate(36).s : '';
                        conv['lastMessageBy'] = response[i].mostRecentMessage ? response[i].mostRecentMessage.by : null;
                        conv['lastActivity'] = moment(response[i].lastActivity).fromNow();
                        var participants = response[i].participants;
                        conv['participants'] = participants;
                        var participantsNames = '';
                        for (var j = 0; j < participants.length; j++) {
                            if (participants[j].id != $cookieStore.get('user').id)
                                participantsNames += (participants[j].name + ', ');
                        }
                        conv['participantsNames'] = participantsNames.substr(0, participantsNames.length - 2);
                        conv['title'] = (participants.length > 2) ? 'Group Chat' : conv['participantsNames'];
                        conv['data'] = response[i];
                        conv['unread'] = 0;
                        conv['isSelected'] = false;
                        if (!_.findWhere($scope.listOfConversation, {
                            'id': conv.id
                        })) {
                            $scope.listOfConversation.push(conv);
                        }
                    }
                    $scope.$apply()
                    if (isScroll) {
                        // $("#conversations").animate({ scrollTop: $('#conversations')[0].scrollHeight}, 1000);
                        $interval(function() {
                            $scope.scrollPositionOfConversations = $('#conversations').scrollTop();
                            //console.log($scope.scrollPositionOfConversations);
                        }, 50);
                    }
                    if (IsSelectFirst) {
                        $scope.selectConversation($scope.listOfConversation[0]);
                    }
                }, function() {
                    alert("Error Occured");
                });
            };
            // Register the login() function
            getConversationsFn();
        }
    ]);