'use strict'

angular
    .module('app')
    .service('UtilsService', /*@ngInject*/function(localStorageService){

        this.validEmail = function(str){
            var reg = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/,
                test = reg.test(str);
            return test;
        };

        this.validPassword = function(str){
            var reg = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
				test = reg.test(str);
            return test;
        };

        this.isValidUrl = function(str){
            return /^[a-zA-Z0-9-_]+$/.test(str);
        };

        this.inArray = function(str, list){
            var total = list.length,
                i = 0,
                test = false;
            for(i; i<total; i+=1){
                if(list[i] === str){
                    test = true;
                }
            }
            return test;
        };

        this.scaleRange = function(value, lowerInitial, upperInitial, lowerNew, upperNew){
            var OldRange = upperInitial - lowerInitial;
            var NewRange = upperNew - lowerNew;
            return (((value - lowerInitial) * NewRange) / OldRange) + lowerNew;
        };

        this.getIdFromJWT = function(){
            var jwt = localStorageService.get('jwt'),
                id;
			if(jwt){
				var payload = jwt.split('.')[1];
                try {
                    var converted = atob(payload);
                    var jsonPayload = angular.fromJson(converted, true);
                    if(this.keyInObject('id', jsonPayload)){
                        id = jsonPayload.id;
                    }
                } catch (error) {
                    id = undefined;
                }
			}
			return id;
		};

        this.isEmptyObject = function(obj){
            for(var prop in obj) {
                if(obj.hasOwnProperty(prop))
                    return false;
            }
            return true;
        };

        this.keyInObject = function(str, obj, bool){
            var s = str.toString(),
                s = s.trim(s),
                list = s.split('.'),
                val;
            if(list.length > 0 && !this.isEmptyObject(obj) && obj[list[0]] !== undefined){
                var i = 0,
                    total = list.length,
                    o = obj;
                for(i; i<total; i+=1){
                    o = o[list[i]];
                    if(o === undefined){
                        val = undefined;
                        return;
                    }
                    if(i === total-1 && o !== undefined){
                        val = o;
                    }
                }
            }
            return val = (bool)? val !== undefined : val;
        };

        this.buildObjectFromString = function(str, finalValue){
            if(str, finalValue){
                var list = str.split('.'),
                    str = '',
                    end = '';
                angular.forEach(list, function(value, id){
                    str += (id === 0)? '{' : '';
                    str += '"'+ value + '"' + ((id === list.length-1)? ':"'+ finalValue +'"' : ':{');
                    end += '}';
                });
                return JSON.parse(str + end);
            }
        };

    });