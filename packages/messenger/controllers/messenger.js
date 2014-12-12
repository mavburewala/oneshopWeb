'use strict';
angular.module('gleepostweb.messenger')
    .controller('conversationsCtrl', ['$scope', '$rootScope', '$http', '$location', 'messenger', '$interval', '$cookieStore', '$filter', '$timeout',
        function($scope, $rootScope, $http, $location, messenger, $interval, $cookieStore, $filter, $timeout) {
            
            $scope.$on('newMessageReceived',function(event,messages){
                console.log(event);
                console.log(messages);
                console.log("I am getting it");
                for (var i = 0; i < messages.length; i++) {
                        var message = String(messages[i].location);
                        var conId = message.replace('/conversations/', '');
                        var convers = _.findWhere($scope.listOfConversation, {
                            'id': Number(conId)
                        });
                        console.log(convers);
                        var newMessage = {};
                        newMessage['id'] = messages[i].data.id;
                        newMessage['text'] = messages[i].data.text;
                        newMessage['by'] = messages[i].data.by;
                        newMessage['isSeen'] = false;
                        newMessage['time'] = new Date(messages[i].data.timestamp).toISOString();
                        newMessage['isMine'] = (messages[i].data.by.id == $cookieStore.get('user').id) ? true : false;
                        newMessage['data'] = messages[i].data;
                        newMessage['group'] = getDate(messages[i].data.timestamp).toISOString();
                        if (!_.findWhere(convers['messages'], {
                                'id': newMessage['id']
                            })) {
                            console.log(newMessage);
                            console.log("added");
                            if(convers['messages'])
                                convers['messages'].push(newMessage);
                        }
                        if (_.findWhere(convers['messages'], {
                                'id': newMessage['id']
                            })) {
                            console.log(newMessage);
                            console.log("updated");
                            _.findWhere(convers['messages'], {
                                'id': newMessage['id']
                            })["data"] = messages[i].data;
                        }
                        convers['lastActivity'] = messages[i].data.timestamp;
                        convers['lastMessageText'] = messages[i].data.text;
                        convers['unread'] = convers['unread'] + 1;
                    };
                    //$rootScope.$apply();
                    groupMessages(false);
                    //$scope.$$phase || $scope.$apply();
                    //$scope.$apply();
                    //groupMessages(true);
                    if($scope.selectedConversation){
                        $timeout(function() {
                            $rootScope.$apply(function() {
                                $rootScope['newMessage'] = [];
                            })
                        })
                        $scope.selectedConversation.unread=0;
                    }
            })
            $scope.listOfConversation = [];
            $scope.selectedConversation = null;
            $scope.user = {};
            $scope.newMessage = '';
            $scope.$on('newReadReceived',function(event,reads){
                console.log(reads);
                if (reads.length > 0) {
                    console.log("New reads are: ");
                    console.log(reads);
                    $timeout(function() {
                        $scope.$apply(function() {
                            for (var i = 0; i < reads.length; i++) {
                                if (reads[i].data.user != $cookieStore.get('user').id) {
                                    var message = String(reads[i].location);
                                    var conId = message.replace('/conversations/', '');
                                    var convers = _.findWhere($scope.listOfConversation, {
                                        'id': Number(conId)
                                    });
                                    var seenMessage = _.findWhere(convers['messages'], {
                                        'id': reads[i].data.last_read
                                    });
                                    console.log(reads[i].data.last_read);
                                    console.log(convers['messages']);
                                    console.log(seenMessage);
                                    if (seenMessage) {
                                        seenMessage['isSeen'] = true;
                                        seenMessage['lastSeenBy'] = reads[i].data.user
                                    }
                                }
                            };
                            $rootScope['newRead'] = [];
                        });
                    })
                    $("#messages").animate({
                        scrollTop: $('#messages')[0].scrollHeight
                    }, 1000);
                }
            })
            $scope.lastSeenMessgeID=0;
            $scope.markSeen = function(conversationId, MessageId) {
                if(MessageId!=$scope.lastSeenMessgeID)
                {
                    messenger.markSeenMessagesInConversation(conversationId, {
                        'seen': MessageId
                    }, function(response) {
                        _.findWhere($scope.listOfConversation, {
                            'id': conversationId
                        })['unread'] = 0;
                        $scope.lastSeenMessgeID=MessageId;
                    }, function() {
                        console.log("Error");
                    })
                }
            }
            $scope.scrollPositionOfMessages = $('#messages').scrollTop();
            $scope.scrollPositionOfConversations = $('#conversations').scrollTop();
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
                    messenger.addMessageToConversation(conversationId, {
                        'text': $scope.newMessage
                    }, function(response) {
                        console.log(response);
                        var message = {};
                        message['id'] = response.id;
                        message['text'] = $scope.newMessage;
                        var user = $cookieStore.get('user')
                        message['by'] = {
                            'id': user.id,
                            'name': user.full_name,
                            'profile_image': user.profile_image
                        };
                        message['isSeen'] = false;
                        message['time'] = new Date().toISOString();
                        message['isMine'] = true;
                        message['group'] = getDate(new Date()).toISOString();
                        if (!_.findWhere($scope.selectedConversation["messages"], {
                                'id': message.id
                            })) {
                            //console.log(message);
                            //console.log("added");
                            ($scope.selectedConversation["messages"]).push(message);
                            //addToGroup(message);
                        }
                        //$scope.getMessagesForConversation($scope.selectedConversation, null, true);
                        _.findWhere($scope.listOfConversation, {
                            'id': $scope.selectedConversation.id
                        })['lastActivity'] = new Date().toISOString();
                        _.findWhere($scope.listOfConversation, {
                            'id': $scope.selectedConversation.id
                        })['lastMessageText'] = $scope.newMessage;
                        $scope.newMessage = '';
                        console.log("New message is being sent")
                        groupMessages(true);
                    }, function() {
                        console.log("Error Occured");
                    });
                } else
                    console.log("can't send message")
            };
            $scope.groups = []
            var groupMessages = function(isScroll) {

                $timeout(function() {
                    $scope.$apply(function() {
                        $scope.selectedConversation["groupMessages"]=null;
                        console.log($scope.selectedConversation["messages"]);
                        $scope.selectedConversation["groupMessages"] = _.groupBy($scope.selectedConversation["messages"], 'group')
                        console.log($scope.selectedConversation["groupMessages"]);

                        for (var key in $scope.selectedConversation["groupMessages"]) {
                            //$scope.selectedConversation["groupMessages"][key]=$filter('orderBy')($scope.selectedConversation["groupMessages"][key], "time",false);
                            _.sortBy($scope.selectedConversation["groupMessages"][key], function(o) { return o.time; }).reverse();
                        }
                        console.log("sorting done");
                    })
                    if (isScroll)
                        if($("#messages")&&$('#messages')[0])
                        {
                            $("#messages").animate({
                                    scrollTop: $('#messages')[0].scrollHeight
                                }, 1);
                        }
                })
            }
            var getDate = function(timestamp) {
                timestamp = new Date(timestamp);
                return new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate());
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
                        message['time'] = new Date(response[i].timestamp).toISOString();
                        message['isMine'] = (response[i].by.id == $cookieStore.get('user').id) ? true : false;
                        message["data"] = response[i];
                        message['group'] = getDate(response[i].timestamp).toISOString();
                        if (!$scope.selectedConversation["messages"])
                            ($scope.selectedConversation["messages"]) = [];
                        if (!_.findWhere($scope.selectedConversation["messages"], {
                                'id': message.id
                            })) {
                            ($scope.selectedConversation["messages"]).push(message);
                        }
                    }
                    console.log($scope.selectedConversation["messages"]);
                    groupMessages(isScroll);
                    //groupMessages($scope.selectedConversation["messages"]);
                    if (isScroll) {
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
                selected.unread=0;
                $timeout(function() {
                    $rootScope.$apply(function() {
                        $rootScope['newMessage'] = [];
                    })
                })
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
                        conv['lastActivity'] = response[i].lastActivity;
                        var participants = response[i].participants;
                        conv['participants'] = participants;
                        var participantsNames = '';
                        for (var j = 0; j < participants.length; j++) {
                            if (participants[j].id != $cookieStore.get('user').id)
                                participantsNames += (participants[j].name + ', ');
                        }
                        conv['participantsNames'] = participantsNames.substr(0, participantsNames.length - 2);
                        conv['otherManPic']=participants[0].id == ($cookieStore.get('user').id) ? participants[1].profile_image : participants[0].profile_image;
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