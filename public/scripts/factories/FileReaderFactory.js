'use strict'

angular
    .module('app')
    .factory('FileReaderFactory', /*@ngInject*/function(NotificationService){

		var fileReader;

		var _onFileReaderError = function(evt){
			NotificationService.notify('FILE_READER', {name:'file_error'});
		};
		
		var _onFileReaderProgress = function(evt){
			if (evt.lengthComputable) {
				var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
				NotificationService.notify('FILE_READER', {name:'file_loadprogress', loaded:percentLoaded});
			}
		};
		
		var _onFileReaderAbort = function(evt){
			fileReader.abort();
			NotificationService.notify('FILE_READER', {name:'file_abort'});
		}
		
		var _onFileReaderLoadStart = function(evt){
			NotificationService.notify('FILE_READER', {name:'file_loadstart'});
		};
		
		var _onFileReaderLoad = function(evt){
			NotificationService.notify('FILE_READER', {name:'file_loadcomplete', src:evt.target.result});
			_destroy();
		};

		var _destroy = function(){
			if(fileReader){
				fileReader.onerror = null;
				fileReader.onprogress = null;
				fileReader.onabort = null;
				fileReader.onloadstart = null;
				fileReader.onload = null;
				fileReader = null;
			}
			return fileReader;
		};

		var _build = function(file){
			var fileReader;
			if (file && file.type.match('image.*')) {
				fileReader = new FileReader();
				fileReader.onerror = _onFileReaderError;
				fileReader.onprogress = _onFileReaderProgress;
				fileReader.onabort = _onFileReaderAbort;
				fileReader.onloadstart = _onFileReaderLoadStart;
				fileReader.onload = _onFileReaderLoad;
				fileReader.readAsDataURL(file);
			}else{
				console.log('Only images are allowed');
			}
			return fileReader;
		};

		return{
			build: _build,
			destroy: _destroy
		};

    });