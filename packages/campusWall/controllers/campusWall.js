'use strict';
angular.module('oneShopWeb.campusWall')
    .controller('wallCtrl', ['$scope', '$rootScope', '$http', '$location', 'wall','$interval',
        function($scope, $rootScope, $http, $location, wall,$interval) {

            var injector = angular.injector(['oneShopWeb.utilities']);
            var util = injector.get('util');

            window.globalVar = "Nadeem";
            
            $scope.campusPosts=[];
            $scope.scrollPositionOfPage=$(document).scrollTop();
            $scope.postText = null;
            $scope.postFile = null;
            $scope.category='allposts';
            $scope.$watch('scrollPositionOfPage', function(newValue,oldValue) {
                var limit = document.body.offsetHeight - window.innerHeight;
                if(newValue>limit){
                    if($scope.category=='allposts')
                        getPosts({'start':$scope.campusPosts.length},false);
                    else if($scope.category=='music')
                        getPosts({'start':$scope.campusPosts.length,'filter':'music'},false);
                    else if($scope.category=='theater')
                        getPosts({'start':$scope.campusPosts.length,'filter':'theater'},false);
                    else if($scope.category=='sports')
                        getPosts({'start':$scope.campusPosts.length,'filter':'sports'},false);
                    else if($scope.category=='party')
                        getPosts({'start':$scope.campusPosts.length,'filter':'party'},false);
                    else if($scope.category=='speaker')
                        getPosts({'start':$scope.campusPosts.length,'filter':'speaker'},false);
                    //$scope.getMessagesForConversation($scope.selectedConversation,{'start':$scope.selectedConversation.messages.length},false)
                }
            });

            $scope.showComments = function($index, $event){
                //console.log($scope.campusPosts[$index]);
                var postID = $scope.campusPosts[$index].id;
                if($scope.campusPosts[$index].comments){
                    angular.element($event.currentTarget).parent().parent().parents('.post-container').find('.page').fadeToggle();
                }
                else{
                    $scope.campusPosts[$index].comments = [];
                    wall.getCommentsForPost(postID, null, function(response){
                        //function success
                        console.log(response)
                        for(var i = 0 ; i < response.length; i++){
                            var tmp = {};
                            tmp.profileImage = response[i].by.profile_image;
                            tmp.name = response[i].by.name;
                            tmp.txt = response[i].text;

                            $scope.campusPosts[$index].comments.push(tmp)
                        }
                       // $scope.campusPosts[$index].comments=response;
                       $scope.campusPosts[$index].comments.reverse();
                        $scope.$apply();
                        angular.element($event.currentTarget).parent().parent().parents('.post-container').find('.page').fadeToggle();
                        $scope.$apply();
                    }, function(){
                        //function error
                    });
                }

            };

            $scope.addComment = function($index , $event, txtComment){
               var postID = $scope.campusPosts[$index].id;
               wall.addCommentForPost(postID, {text: txtComment}, function(response){
                    console.log(response)
                    $scope.campusPosts[$index].commentCount++;
                    if($scope.campusPosts[$index].comments){
                      // var commentsContainer = angular.element($event.currentTarget).parent().parent().parents('.post-container').find('.page')
                      // commentsContainer.append('<div  class="show-commnets"> <a href="javascript:void(0)" class="use-comment-image"> <img src="' + window.UserImage+ '"> </a> <p class="user-comment-name ng-binding">'+ window.UserName +'</p> <p class="floatLeft msg ng-binding">' + txtComment+ '</p> </div>')
                       var tmp = {};
                            tmp.profileImage = window.UserImage;
                            tmp.name = window.UserName;
                            tmp.txt = txtComment;

                            $scope.campusPosts[$index].comments.push(tmp)

                    }

               }, function(){

               }); 
            };

            $scope.addPost = function(){
                //alert("Post to be added");
                // util.uploadMedia({

                // }, function(response){

                // }, function(error){

                // });

                wall.addPost({
                   "text": $scope.postText 
                },function(response){
                    console.log(response);
                }, function(error){

                });
            };
            var enableOthers=function(me){
                $('#'+me).attr('disabled','disabled');
                for (var i = categories.length - 1; i >= 0; i--) {
                    if(categories[i]!=me)
                        $('#'+categories[i]).removeAttr('disabled');
                };
            }
            var categories=['party','music','sports','theater','speaker','allposts']
            $scope.PartyClicked=function(){
                $scope.category='party'
                $scope.campusPosts=[];
                getPosts({'filter':'party'},true);
               // console.log($scope.category)
                enableOthers($scope.category)
            }
            $scope.MusicClicked=function(){
                $scope.category='music'
                $scope.campusPosts=[];
                getPosts({'filter':'music'},true);
              //  console.log($scope.category)
                enableOthers($scope.category)
            }
            $scope.SportsClicked=function(){
                $scope.category='sports'
                $scope.campusPosts=[];
                getPosts({'filter':'sports'},true);
              //  console.log($scope.category)
                enableOthers($scope.category)
            }
            $scope.TheaterClicked=function(){
                $scope.category='theater'
                $scope.campusPosts=[];
                getPosts({'filter':'theater'},true);
               // console.log($scope.category)
                enableOthers($scope.category)
            }
            $scope.SpeakerClicked=function(){
                $scope.category='speaker'
                $scope.campusPosts=[];
                getPosts({'filter':'speaker'},true);
               // console.log($scope.category)
                enableOthers($scope.category)
            }
            $scope.AllPostsClicked=function(){
                $scope.category='allposts';
                $scope.campusPosts=[];
                getPosts(null,true);
                //console.log($scope.category)
                enableOthers($scope.category)
            }
            $scope.setFiles = function(file){
                  //   console.log(file);
                  // $scope.$apply(function(scope) {
                  // console.log('files:', element.files);
                  // // Turn the FileList object into an Array
                  // //   scope.files = []
                  // //   for (var i = 0; i < element.files.length; i++) {
                  // //     scope.files.push(element.files[i])
                  // //   }
                  // // scope.progressVisible = false
                  // });
            };

            var getPosts=function(params,isScroll){
                wall.getPosts(params,function(response){
                        console.log(response);
                    for (var i = 0; i < response.length; i++) {
                        var post={};
                        post['id']=response[i].id;
                        post['by']=response[i].by;
                        post['text']=response[i].text;
                        post['time']=moment(response[i].timestamp).fromNow();
                        post['data']=response[i];
                        post['commentCount'] = response[i].comment_count;
                        post['likesCount'] =  response[i].like_count;
                        //console.log(typeof(_.has(response[i], 'videos')))

                        if(_.has(response[i], 'videos') === true){
                        //if (typeof(response[i].videos) !== 'undefined'){
                            //alert("inside If");
                            post["video"] = true;
                            post["mp4"] = response[i].videos[0].mp4;
                            post["webm"] = response[i].videos[0].webm;
                        }
                        else{
                            //alert("inside else")
                            post["video"] = false;
                        }
                        post["video"] = "false";
                        post['image']=(response[i].images!=null) ? response[i].images[0]: ((response[i].videos==null)? null:response[i].videos[0].thumbnails[0]);
                        if(!_.findWhere($scope.campusPosts, {'id': post.id})){
                            $scope.campusPosts.push(post);
                        }
                    };
                    $scope.$apply();
                    if(isScroll){
                        $interval(function() {
                            $scope.scrollPositionOfPage=$(document).scrollTop();
                        }, 50);
                    }
                },function(){
                    console.log("ERROR")
                })
            };

        
            getPosts(null,true);

        }
    ])

    .controller('LiveCtrl', ['$scope', '$rootScope', '$http', '$location', 'wall','$interval',
        function($scope, $rootScope, $http, $location, wall,$interval) {

            var injector = angular.injector(['gleepostweb.utilities']);
            var util = injector.get('util');
            $scope.campusLive = [];

            var getTimeSpan = function(notificationTime){
              var now = moment();
              var notificationDate =moment(notificationTime);
              var diff = now.diff(notificationDate, 'days');
              //console.log(diff);
              return diff;
            };

            var convertToDate = function(date){
                var a =moment(date);
                return a.format("MMM Do YYYY");
            };

            var convertToTime = function(date){
                return moment(date).format('HH:mm');
            };

              var getLive = function(){
                var params ={
                    after :moment().unix()
                };
                wall.getEventPosts(params, function(success){
                    console.log(success);
                    var dummtResults = success;

                    for(var i = 0 ; i < dummtResults.length ; i++){
                        var live={};
                        var dateDiff = getTimeSpan(dummtResults[i].attribs["event-time"]);
                        var evtTime = null
                        if(dateDiff === 0){
                            evtTime = "Today @ " + convertToTime(dummtResults[i].attribs["event-time"]);
                        }
                        else{
                            evtTime = convertToDate(dummtResults[i].attribs["event-time"])
                        }

                        live['id'] = dummtResults[i].id;
                        live['time'] = evtTime;
                        if(dummtResults[i].images !== null)
                          live['image'] = dummtResults[i].images[0];
                        else
                          live['image'] = "";  
                        live['text'] = "Dummy Text";

                        $scope.campusLive.push(live);

                        //delete live;
                        //console.log(dummtResults[i].attribs["event-time"])
                    }

                    $scope.$apply();
                    

                    //console.log($scope.campusLive);     
                }, function(error){

                });
            };

            getLive();
        } 
    ]);