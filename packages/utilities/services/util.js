'use strict';

angular.module('gleepostweb.utilities').factory('util',[function() {
  	var injector = angular.injector(['gleepostweb.utilities']);
    var dataService = injector.get('data');

    return {
        /*
            required parameters: id, token, video
            /video takes a single multipart/form-data encoded video and returns an id and a status ("uploaded").
             You can then check its resource to discover when it is ready to be used. In addition, when the video has uploaded you will get a "video-ready" event if you have a websocket connection.
            HTTP 201
            {"status":"uploaded", "id":2780}
        */
        uploadVideo: function(params, success, error) {
            dataService.post('/videos',params,true,true)
            .success(function(response){
                success(response);
                return response;
            }).error(error);
        },
        /*
            required parameters: id, token
            optional parameters: image or video.
            /upload expects a single multipart/form-data encoded image or video and on success will return a url.
            example responses: HTTP 201
            {"url":"https://s3-eu-west-1.amazonaws.com/gpimg/3acd82c15dd0e698fc59c79e445a464553e57d338a6440601551c7fb28e45bf9.jpg"}
        */
        uploadMedia: function(params, success, error) {
            dataService.post('/upload',params,true,true)
            .success(function(response){
                success(response);
                return response;
            }).error(error);
        },
        /*
            required parameters: id, token, type, device_id
            Type should be "android" or "ios"
            This registers the push notification id "device_id" for the current user
            example responses: HTTP 201
        */
        addDevice: function(params, success, error) {
            dataService.post('/devices',params,true,true)
            .success(function(response){
                success(response);
                return response;
            }).error(error);
        },
        /*
            required parameters: id, token
            This will stop [device-id] receiving push notifications for this user.
            If successfull, the response will be: HTTP 204 (no content)
        */
        deleteDevice: function(deviceId,params, success, error) {
            dataService.delete('/devices/'+deviceId,params,true,true)
            .success(function(response){
                success(response);
                return response;
            }).error(error);
        },
        /*
            required parameters: id, token
            This will stop [device-id] receiving push notifications for this user.
            If successfull, the response will be: HTTP 204 (no content)
        */
        linkToWebSocket: function(params, success, error) {
            dataService.get('/ws',params,true,true)
            .success(function(response){
                success(response);
                return response;
            }).error(error);
        },
    };
}]);
