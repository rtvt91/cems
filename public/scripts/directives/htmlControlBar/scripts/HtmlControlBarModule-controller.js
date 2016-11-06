'use strict'

angular
    .module('HtmlControlBarModule.controller')
    .controller('HtmlControlBarController', /*@ngInject*/function(NotificationService, UtilsService, $scope, $element, $compile){

        var that = this,
            htmlControlBarNotifId,
            userDataNotifId;
        
        this.props = {
            toggle: false,
            htmlTag: ''
        };

        this.closeControl = function(){
            this.props.toggle = false;
            this.props.htmlTag = '';
            this.internal.removeControlBar();
        };

        this.toggleControl = function(){
            this.props.toggle = !this.props.toggle;
        };

        this.addHTML = function(){
            this.props.toggle = false;
            if(this.props.htmlTag === 'div' || this.props.htmlTag === 'h3'){
                var $newElt = $('<' + this.props.htmlTag + ' editable-content>Type your text here</' + this.props.htmlTag + '>');
                $compile($newElt.get(0))($scope.$new());
                this.internal.$target.after($newElt);
            }
            this.props.htmlTag = '';
            this.internal.removeControlBar();
        };

        this.removeHTML = function(){
            this.props.toggle = false;
            this.props.htmlTag = '';
            this.internal.$target.remove();
            this.internal.removeControlBar();
        };

        this.internal = {
            $elt: undefined,
            $target: undefined,
            addControlBar: function(){
                if(that.internal.$elt && that.internal.$target && that.internal.$elt.length > 0 && that.internal.$target.length > 0){
                    that.internal.$elt.addClass('show')
                    that.internal.$elt.removeClass('hide');
                    that.internal.$target.after(that.internal.$elt);
                }
            },
            removeControlBar: function(){
                if(that.internal.$elt && that.internal.$elt.length > 0){
                    that.internal.$elt.removeClass('hide')
                    that.internal.$elt.removeClass('show');
                    that.internal.$elt.remove();
                }
            },
            manageControlBar: function(param){
                that.internal.$elt = $($element);
                that.internal.$target = $(param.dom);
                $scope.$apply(function(){
                    that.props.toggle = false;
                });
                if(param.display){
                    that.internal.addControlBar();
                }
            }
        };

        this.init = function(){
            htmlControlBarNotifId = NotificationService.subscribe('HTML_CONTROL_BAR_ACTION', function(param){
                that.internal.manageControlBar(param);
            });

            userDataNotifId = NotificationService.subscribe('USER_DATA', function(result){
                var data = UtilsService.keyInObject('data', result);
                if(UtilsService.isEmptyObject(data)){
                    that.props.toggle = false;
                    that.internal.removeControlBar();
                }
            });
        };

        this.init();

        $scope.$on('$destroy', function(){
            NotificationService.unsubscribe('HTML_CONTROL_BAR_ACTION', htmlControlBarNotifId);
            NotificationService.unsubscribe('USER_DATA', userDataNotifId);
        });

    });