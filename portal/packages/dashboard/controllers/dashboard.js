'use strict';
angular.module('gleepostweb.dashboard')
    .controller('dashboardCtrl', ['$scope', '$rootScope', '$http', '$location','Profile', '$cookieStore',
        function($scope, $rootScope, $http, $location, Profile, $cookieStore) {

          $scope.init = function(){
                $scope.ddlFilterType = "Today";
                //alert("This is init");
                $scope.applyFilter();
                $scope.viewTitle = "Posts";
          };
            $scope.cleanDate = function(date){
              date = date.split('+');
              date = date[0];
              return date + 'Z';
            };
           var animateNumber = function(endVal, startVal, selectorID){
              jQuery({someValue: startVal}).animate({someValue: endVal}, {
                duration: 1000,
                easing:'swing', // can be anything
                step: function() { // called on every step
                  // Update the element's text with rounded-up value:
                  jQuery('#' + selectorID).text(Math.ceil(this.someValue));
                }
              });
            };

            var trimGraphDate = function(date){
                date = date.split("T");
                return date[0];
            };

            var nullGraph = function(){
              var data =  {
                            "xScale": "ordinal",
                            "yScale": "linear",
                            "type": "line-dotted",
                            "main": [
                              {
                                "className": ".pizza",
                                "data": null
                              }
                            ]
                          };
              var myChart = new xChart('line-dotted', data, '#dashboardGraph');            
            };

            $scope.showViewsGraph = function(){
              //alert($scope.ddlFilterType);
              $scope.viewTitle = "Views";
              if($scope.ddlFilterType === undefined){
                $scope.ddlFilterType = "Today";
              }

               var statType = "likes";
               var start = null
               var finish = null
               var period = null;

               if($scope.ddlFilterType === 'Today'){
                     finish = $scope.cleanDate(moment().format());
                     start = $scope.cleanDate(moment().subtract(1, 'days').format());
                     period = 'hour';
               }
               else if($scope.ddlFilterType === 'This Week'){
                     finish = $scope.cleanDate(moment().format());
                     start = $scope.cleanDate(moment().subtract('week' ,1 ).format());
                     period = 'day';
               }
               else if($scope.ddlFilterType === 'This Month'){
                     finish = $scope.cleanDate(moment().format());
                     start = $scope.cleanDate(moment().subtract('month',1 ).format());
                     period = 'week';
               }
               else{}

                Profile.getUserStats($cookieStore.get('user').id, "likes", period, start, finish, null, 
                    function(response){
                       // console.log(response.data.posts);
                      if(response.data.likes !== null){
                        var data = '{"xScale":"ordinal","comp":[],"type":"line-dotted","yScale":"linear","main":[{"className":".main.l1","data":['; 
                         for(var i = 0; i < response.data.likes.length; i++){
                         // debugger;
                         //console.log(response.data.posts[i]))
                            data+='{'+   
                              '"y":'+response.data.likes[i].count+','+   
                              '"x":"'+trimGraphDate(response.data.likes[i].start)+'"';
                                if(i<(response.data.likes.length-1)){    
                                    data+='},';  
                                }else{    
                                    data+='}';  
                                }
                          // console.log(totalPosts)
                         }
                        data+=']}]}'; 
                        //console.log(data)
                        data = jQuery.parseJSON( data );
                        var myChart = new xChart('line-dotted', data, '#dashboardGraph');
                      }
                      else{
                        //$("#totalPosts").text(0);
                        nullGraph();
                      }
                        
                    }, function(error){

                }); 
            };

            $scope.showPostsGraph = function(){
              $scope.viewTitle = "Posts";
                var statType = "posts";
               var start = null
               var finish = null
               var period = null;

               if($scope.ddlFilterType === 'Today'){
                     finish = $scope.cleanDate(moment().format());
                     start = $scope.cleanDate(moment().subtract(1, 'days').format());
                     period = 'hour';
               }
               else if($scope.ddlFilterType === 'This Week'){
                     finish = $scope.cleanDate(moment().format());
                     start = $scope.cleanDate(moment().subtract('week' ,1 ).format());
                     period = 'day';
               }
               else if($scope.ddlFilterType === 'This Month'){
                     finish = $scope.cleanDate(moment().format());
                     start = $scope.cleanDate(moment().subtract('month',1 ).format());
                     period = 'week';
               }
               else{}

                Profile.getUserStats($cookieStore.get('user').id, statType, period, start, finish, null, 
                    function(response){
                       // console.log(response.data.posts);
                      if(response.data.posts !== null){
                        var data = '{"xScale":"ordinal","comp":[],"type":"line-dotted","yScale":"linear","main":[{"className":".main.l1","data":['; 
                         for(var i = 0; i < response.data.posts.length; i++){
                         // debugger;
                         //console.log(response.data.posts[i]))
                            data+='{'+   
                              '"y":'+response.data.posts[i].count+','+   
                              '"x":"'+trimGraphDate(response.data.posts[i].start)+'"';
                                if(i<(response.data.posts.length-1)){    
                                    data+='},';  
                                }else{    
                                    data+='}';  
                                }
                          // console.log(totalPosts)
                         }
                        data+=']}]}'; 
                        //console.log(data)
                        data = jQuery.parseJSON( data );
                        var myChart = new xChart('line-dotted', data, '#dashboardGraph');
                      }
                      else{
                        //$("#totalPosts").text(0);
                        nullGraph();
                      }
                        
                    }, function(error){

                }); 
            };

            $scope.showInteractionsGraph = function(){
              $scope.viewTitle = "Interactions";
                 var statType = "interactions";
               var start = null
               var finish = null
               var period = null;

               if($scope.ddlFilterType === 'Today'){
                     finish = $scope.cleanDate(moment().format());
                     start = $scope.cleanDate(moment().subtract(1, 'days').format());
                     period = 'hour';
               }
               else if($scope.ddlFilterType === 'This Week'){
                     finish = $scope.cleanDate(moment().format());
                     start = $scope.cleanDate(moment().subtract('week' ,1 ).format());
                     period = 'day';
               }
               else if($scope.ddlFilterType === 'This Month'){
                     finish = $scope.cleanDate(moment().format());
                     start = $scope.cleanDate(moment().subtract('month',1 ).format());
                     period = 'week';
               }
               else{}

               Profile.getUserStats($cookieStore.get('user').id, statType, period, start, finish, null, 
                    function(response){
                       // console.log(response.data.posts);
                      if(response.data.interactions !== null){
                         var totalPosts = 0;
                        var data = '{"xScale":"ordinal","comp":[],"type":"line-dotted","yScale":"linear","main":[{"className":".main.l1","data":['; 
                         for(var i = 0; i < response.data.interactions.length; i++){
                         // debugger;
                         //console.log(response.data.posts[i]))
                            data+='{'+   
                              '"y":'+response.data.interactions[i].count+','+   
                              '"x":"'+trimGraphDate(response.data.interactions[i].start)+'"';
                                if(i<(response.data.interactions.length-1)){    
                                    data+='},';  
                                }else{    
                                    data+='}';  
                                }   
                           totalPosts =  parseInt(response.data.interactions[i].count) + totalPosts;
                          // console.log(totalPosts)
                         }
                        data+=']}]}'; 
                        //console.log(data)
                        data = jQuery.parseJSON( data );
                        var myChart = new xChart('line-dotted', data, '#dashboardGraph');
                        $("#totalPosts").text(totalPosts);
                      }
                      else{
                        $("#totalPosts").text(0);
                      }
                        
                    }, function(error){

                });   
            };

            $scope.showBuzzGraph = function(){
               $scope.viewTitle = "Buzz";
              //  var statType = "interactions";
               var start = null
               var finish = null
               var period = null;

               if($scope.ddlFilterType === 'Today'){
                     finish = $scope.cleanDate(moment().format());
                     start = $scope.cleanDate(moment().subtract(1, 'days').format());
                     period = 'hour';
               }
               else if($scope.ddlFilterType === 'This Week'){
                     finish = $scope.cleanDate(moment().format());
                     start = $scope.cleanDate(moment().subtract('week' ,1 ).format());
                     period = 'day';
               }
               else if($scope.ddlFilterType === 'This Month'){
                     finish = $scope.cleanDate(moment().format());
                     start = $scope.cleanDate(moment().subtract('month',1 ).format());
                     period = 'week';
               }
               else{}

                    Profile.getUserStats($cookieStore.get('user').id, "rsvps", period, start, finish, null, 
                    function(response){
                       // console.log(response.data.posts);
                      if(response.data.rsvps !== null){
                        var data = '{"xScale":"ordinal","comp":[],"type":"line-dotted","yScale":"linear","main":[{"className":".main.l1","data":['; 
                         for(var i = 0; i < response.data.rsvps.length; i++){
                         // debugger;
                         //console.log(response.data.posts[i]))
                            data+='{'+   
                              '"y":'+response.data.rsvps[i].count+','+   
                              '"x":"'+trimGraphDate(response.data.rsvps[i].start)+'"';
                                if(i<(response.data.rsvps.length-1)){    
                                    data+='},';  
                                }else{    
                                    data+='}';  
                                }
                          // console.log(totalPosts)
                         }
                        data+=']}]}'; 
                        //console.log(data)
                        data = jQuery.parseJSON( data );
                        var myChart = new xChart('line-dotted', data, '#dashboardGraph');
                      }
                      else{
                        //$("#totalPosts").text(0);
                        nullGraph();
                      }
                       
                    }, function(error){

                });
            };
            $scope.applyFilter = function(){
               // alert($scope.ddlFilterType);
               $scope.viewTitle = "Posts";
               var statType = "posts";
               var start = null
               var finish = null
               var period = null;
               if($scope.ddlFilterType === 'Today'){
                     finish = $scope.cleanDate(moment().format());
                     start = $scope.cleanDate(moment().subtract(1, 'days').format());
                     period = 'hour';
               }
               else if($scope.ddlFilterType === 'This Week'){
                     finish = $scope.cleanDate(moment().format());
                     start = $scope.cleanDate(moment().subtract('week' ,1 ).format());
                     period = 'day';
               }
               else if($scope.ddlFilterType === 'This Month'){
                     finish = $scope.cleanDate(moment().format());
                     start = $scope.cleanDate(moment().subtract('month',1 ).format());
                     period = 'week';
               }
               else{}

                Profile.getUserStats($cookieStore.get('user').id, statType, period, start, finish, null, 
                    function(response){
                       // console.log(response.data.posts);
                      if(response.data.posts !== null){
                         var totalPosts = 0;
                        var data = '{"xScale":"ordinal","comp":[],"type":"line-dotted","yScale":"linear","main":[{"className":".main.l1","data":['; 
                         for(var i = 0; i < response.data.posts.length; i++){
                         // debugger;
                         //console.log(response.data.posts[i]))
                            data+='{'+   
                              '"y":'+response.data.posts[i].count+','+   
                              '"x":"'+trimGraphDate(response.data.posts[i].start)+'"';
                                if(i<(response.data.posts.length-1)){    
                                    data+='},';  
                                }else{    
                                    data+='}';  
                                }   
                           totalPosts =  parseInt(response.data.posts[i].count) + totalPosts;
                          // console.log(totalPosts)
                         }
                        data+=']}]}'; 
                        //console.log(data)
                        data = jQuery.parseJSON( data );
                        var myChart = new xChart('line-dotted', data, '#dashboardGraph');
                        $("#totalPosts").text(totalPosts);
                      }
                      else{
                        $("#totalPosts").text(0);
                      }

                      

                    }, function(error){

                }); 

                Profile.getUserStats($cookieStore.get('user').id, "likes", period, start, finish, null, 
                    function(response){
                       // console.log(response.data.posts);
                      if(response.data.likes !== null){
                         var totalPosts = 0;
                         for(var i = 0; i < response.data.likes.length; i++){
                         //console.log(response.data.posts[i]))
                           totalPosts =  parseInt(response.data.likes[i].count) + totalPosts;
                           //console.log(totalPosts)
                         }

                        // animateNumber(totalPosts , 0 , "totalPosts");
                        $("#totalLikes").text(totalPosts);
                         //alert("done");
                      }
                      else{
                        $("#totalLikes").text(0);
                      }

                    }, function(error){

                });

                Profile.getUserStats($cookieStore.get('user').id, "interactions", period, start, finish, null, 
                    function(response){
                       // console.log(response.data.posts);
                      if(response.data.interactions !== null){
                         var totalPosts = 0;
                         for(var i = 0; i < response.data.interactions.length; i++){
                         //console.log(response.data.posts[i]))
                           totalPosts =  parseInt(response.data.interactions[i].count) + totalPosts;
                           //console.log(totalPosts)
                         }

                        // animateNumber(totalPosts , 0 , "totalPosts");
                        $("#totalInteractions").text(totalPosts);
                         //alert("done");
                      }
                      else{
                        $("#totalInteractions").text(0);
                      }

                    }, function(error){

                });

                Profile.getUserStats($cookieStore.get('user').id, "rsvps", period, start, finish, null, 
                    function(response){
                       // console.log(response.data.posts);
                      if(response.data.rsvps !== null){
                         var totalPosts = 0;
                         for(var i = 0; i < response.data.rsvps.length; i++){
                         //console.log(response.data.posts[i]))
                           totalPosts =  parseInt(response.data.rsvps[i].count) + totalPosts;
                           //console.log(totalPosts)
                         }

                        // animateNumber(totalPosts , 0 , "totalPosts");
                        $("#totalRsvps").text(totalPosts);
                         //alert("done");
                      }
                      else{
                        $("#totalRsvps").text(0);
                      }

                    }, function(error){

                });
            };

            $scope.init();
        }
    ])
    