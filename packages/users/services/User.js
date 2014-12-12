'use strict';

angular.module('gleepostweb.users').factory('gleepostWebUsers', [

    function() {
        return {
            name: 'users'
        };
    }
]);

angular.module('gleepostweb.users')
    .factory('Auth', function($http, $cookieStore) {
        var injector = angular.injector(['gleepostweb.utilities']);
        var dataService = injector.get('data');
        console.log(dataService);

        var accessLevels = roleConfig.accessLevels,
            userRoles = roleConfig.userRoles,
            currentUser = $cookieStore.get('user') || {
                email: '',
                role: userRoles.public,
                token: '',
                id: '',
                expiry: ''
            };

        //$cookieStore.remove('user');

        function changeUser(user) {
            _.extend(currentUser, user);
        };

        return {
            authorize: function(accessLevel, role) {
                if (role === undefined)
                    role = currentUser.role;
                //console.log("accessLevel: ", accessLevel);
                //console.log("role: ", role);
                return accessLevel.bitMask & role.bitMask;
            },
            isLoggedIn: function(user) {
                if (user === undefined) {
                    if (!currentUser)
                        currentUser = $cookieStore.get('user');
                    user = currentUser;
                }
                return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
            },
            register: function(user, success, error) {
                // $http.post('/register', user).success(function(res) { 
                //    // changeUser(res);
                //     success(res);
                // }).error(error);
                //debugger;

                $http({
                        method: "POST",
                        url: 'https://dev.gleepost.com/api/v1/register',
                        data: $.param({
                            email: user.email,
                            pass: user.pass,
                            first: user.first,
                            last: user.last
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    })
                    .success(function(user) {
                        //alert("Successfully Registered");
                    }).error(error);
            },
            login: function(user, success, error) {
                var data = {
                    email: user.email,
                    pass: user.pass
                };
                dataService.post('/login', data, false, false)
                    .success(function(response) {
                        var myUser = {
                            email: user.email,
                            role: userRoles.user,
                            token: response.value,
                            id: response.id,
                            expiry: response.expiry
                        };
                        changeUser(myUser);
                        console.log(myUser);
                        $cookieStore.put('user', myUser);
                        //console.log($cookieStore.get('user'))
                        success(myUser);
                    }).error(error);
            },
            logout: function(success) {
                var myUser = {
                    email: '',
                    role: userRoles.public,
                    token: '',
                    id: '',
                    expiry: ''
                };
                changeUser(myUser);
                $cookieStore.remove('user');
                success();
            },

            forgotPassword: function(user, success, error) {
                $http({
                        method: "POST",
                        url: 'https://dev.gleepost.com/api/v1/profile/request_reset',
                        data: $.param({
                            email: user.email
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    })
                    .success(function(user) {
                        //alert("Successfully Registered");
                    }).error(error);
            },
            getToken: function() {
                if (this.isLoggedIn) {
                    console.log(currentUser);
                    return currentUser.token;
                } else
                    return null;
            },
            accessLevels: accessLevels,
            userRoles: userRoles,
            user: currentUser
        };
    });