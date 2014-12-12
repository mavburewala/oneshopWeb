angular.module('gleepostweb.utilities').factory('socketData', [ '$rootScope','settings','$cookieStore', function($rootScope,settings,$cookieStore) {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    var $q=initInjector.get('$q');
    var Service = {};
    var callbacks = {};
    var currentCallbackId = 0;
    console.log(settings.apiUri+'/wss');
    var ws={};
    if($cookieStore.get('user')){
    var uri='wss://dev.gleepost.com:443/api/v1/ws?token='+$cookieStore.get('user').token+'&id='+$cookieStore.get('user').id;
    ws = new WebSocket(uri);
  }
    ws.onopen = function(){  
        console.log("Socket has been opened!");  
    };
    
    ws.onmessage = function(message) {
        listener(JSON.parse(message.data));
    };
    ws.onclose = function(ev) {
    console.log('Connected to server ');
    }
    function sendRequest(request) {
      var defer = $q.defer();
      var callbackId = getCallbackId();
      callbacks[callbackId] = {
        time: new Date(),
        cb:defer
      };
      request.callback_id = callbackId;
      console.log('Sending request', request);
      ws.send(JSON.stringify(request));
      return defer.promise;
    }

    function listener(data) {
      var messageObj = data;
      console.log("Received data from websocket: ", messageObj);
      if(messageObj.type=='message')
          $rootScope['newMessage'].push(messageObj);
      else if(messageObj.type=='read')
          $rootScope['newRead'].push(messageObj);
      else if(messageObj.type=='new-conversation')
          $rootScope['newConversation'].push(messageObj);
      else if(messageObj.type=='ended-conversation')
            $rootScope['endedConversation'].push(messageObj);
      else if(messageObj.type=='changed-conversation')
            $rootScope['changedConversation'].push(messageObj);
      else if(messageObj.type==notification)
            $rootScope['notification'].push(messageObj);
      else if(messageObj.type=='video-ready')
            $rootScope['VideoReady'].push(messageObj);

      console.log($rootScope['newMessage'])
      console.log($rootScope['newRead'])
      console.log($rootScope['newConversation'])
      console.log($rootScope['endedConversation'])
      console.log($rootScope['changedConversation'])
      console.log($rootScope['notification'])
      console.log($rootScope['VideoReady'])
      // If an object exists with callback_id in our callbacks object, resolve it
      if(callbacks.hasOwnProperty(messageObj.callback_id)) {
        console.log(callbacks[messageObj.callback_id]);
        $rootScope.$apply(callbacks[messageObj.callback_id].cb.resolve(messageObj.data));
        delete callbacks[messageObj.callbackID];
      }
    }
    // This creates a new callback ID for a request
    function getCallbackId() {
      currentCallbackId += 1;
      if(currentCallbackId > 10000) {
        currentCallbackId = 0;
      }
      return currentCallbackId;
    }

    // Define a "getter" for getting customer data
    Service.getData = function() {
      var request = {
        type: "get_data"
      }
      // Storing in a variable for clarity on what sendRequest returns
      //var promise = sendRequest(request); 
      return null;
    }

    return Service;
}])