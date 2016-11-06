'use strict'

angular
    .module('EditableContentModule.controller')
    .controller('EditableContentController', /*@ngInject*/function(UtilsService, NotificationService, $element, $scope){

        var that = this,
            htmlControlBar,
            userDataNotifId,
            articleDataNotifId;
            
        this.props = {
            editor: undefined,
            data: {}
        };

        this.destroyMediumEditor = function(){
            this.props.editor.destroy();
            this.props.editor = undefined;
        };

        this.buildMediumEditor = function(){
            this.props.editor = new MediumEditor($element, {
                toolbar: {
                    buttons: ['bold', 'italic', 'underline', 'anchor'],
                },
                imageDragging: false,
                placeholder: {
                    text: '',
                    hideOnClick: true
                }
            });
        };

        this.internal = {
            isEditable: function(result){
                var articleData = (result)? result : NotificationService.getLastNotifyValue('ARTICLE_DATA');
                if(UtilsService.keyInObject('creator._id', articleData)){
                    return (articleData.creator._id === UtilsService.getIdFromJWT());
                }else{
                    return false;
                }
            },
            buildEditor: function(result){
                if(that.internal.isEditable(result) && !angular.isDefined(that.props.editor)){
                    that.buildMediumEditor();
                }else if(!that.internal.isEditable(result) && angular.isDefined(that.props.editor)){
                    that.destroyMediumEditor();
                }
            }
        };

        this.init = function(){

            this.props.data = NotificationService.getLastNotifyValue('USER_DATA');

            if(!UtilsService.isEmptyObject(this.props.data) && !angular.isDefined(that.props.editor) && this.internal.isEditable()){
                this.buildMediumEditor();
            }

            userDataNotifId = NotificationService.subscribe('USER_DATA', function(result){
                that.internal.buildEditor();
                that.props.data = result;
            });

            articleDataNotifId = NotificationService.subscribe('ARTICLE_DATA', function(result){
                that.internal.buildEditor(result);
            });

            $element.on('focus', function(event){
                if(event.target.innerHTML === 'Type your text here'){
                    event.target.innerHTML = ''; 
                }
            });

            $element.on('blur', function(event){
                if(event.target.innerHTML.length === 0){
                    event.target.innerHTML = 'Type your text here'; 
                }
            });

            $element.on('dblclick', function(event){
                if(that.internal.isEditable()){
                    NotificationService.notify('HTML_CONTROL_BAR_ACTION', {dom: $element, display:true});
                }
            });

        };

        $scope.$on('$destroy', function(){
            if(angular.isDefined(that.props.editor)){
                that.destroyMediumEditor();
            }
            NotificationService.unsubscribe('USER_DATA', userDataNotifId);
            NotificationService.unsubscribe('ARTICLE_DATA', articleDataNotifId);
        });

        this.init();

    });