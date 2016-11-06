'use strict'

angular.module('FirstTimeModule.controller', []);
angular.module('FirstTimeModule.directive', ['FirstTimeModule.controller']);
angular.module('FirstTimeModule', ['FirstTimeModule.directive']);