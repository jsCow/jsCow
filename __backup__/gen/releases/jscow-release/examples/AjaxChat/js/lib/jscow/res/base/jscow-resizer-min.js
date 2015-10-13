/* jscow - Javascript Component Framework - jscow-resizer-trunk - Mario Linz - http://www.jscow.de */jsCow.res.components.resizer=function(){};jsCow.res.components.resizer.prototype={init:function(){return this},setDefaultMVC:function(){this.setModel(jsCow.res.model.resizer);this.setView(jsCow.res.view.resizer);this.setController(jsCow.res.controller.resizer);return this},setHorizontalOrientation:function(){this.globalEvents.trigger("setDirection",{direction:"horizontal"},this);return this},setVerticalOrientation:function(){this.globalEvents.trigger("setDirection",{direction:"vertical"},this);return this}};jsCow.res.model.resizer=function(){this.type="jsCow.res.model.resizer";this.config={globalDisabled:false,enabled:true,direction:"vertical"}};jsCow.res.model.resizer.prototype={init:function(){this.globalEvents.trigger("viewInit",this.getConfig(),this.getCmp())},initialAppEvent:function(a){if(this.isEnabled()){this.getCmp().getView().call("setDraggableEvent",this.getConfig())}return this},setDirection:function(a){if(this.isEnabled()){this.setConfig({direction:a.data.direction});this.globalEvents.trigger("viewUpdate",this.getConfig(),this.getCmp())}return this},update:function(a){if(this.isEnabled()){this.getCmp().getView().call("setSizes",this.getConfig())}return this}};jsCow.res.view.resizer=function(){this.execInit=false;this.type="jsCow.res.view.resizer";this.dom={};this.dom.main=$("<div/>").width(0).height(0);this.config={};this.isDraggable=false};jsCow.res.view.resizer.prototype={init:function(a){this.setDirectionClass(a)},update:function(a){var a=a.data;if(a){if(!a.enabled||a.globalDisabled){this.dom.main.addClass("jscow-resizer-disabled")}else{this.dom.main.removeClass("jscow-resizer-disabled");this.setDirectionClass(a);this.setSizes(a);if(a.hide){this.dom.main.addClass("jscow-hide")}else{this.dom.main.removeClass("jscow-hide")}}}return this},setDirectionClass:function(a){if(a){this.dom.main.removeAttr("style");switch(a.direction){case"horizontal":this.dom.main.removeClass("clearfix");this.dom.main.addClass("jscow-resizer-horizontal");this.dom.main.removeClass("jscow-resizer-vertical");break;case"vertical":this.dom.main.addClass("clearfix");this.dom.main.addClass("jscow-resizer-vertical");this.dom.main.removeClass("jscow-resizer-horizontal");break}this.setSizes(a)}},setSizes:function(c){var a=c.data;var b=this.getCmp().getParent();if(a&&b){this.dom.main.removeAttr("style");if(a.direction=="horizontal"){this.dom.main.height(b.getInnerHeight())}else{this.dom.main.width(b.getInnerWidth())}window.setTimeout((function(d){return function(){if(a.direction=="horizontal"){var e="x"}else{var e="y"}d.isDraggable=$(d.dom.main).draggable({axis:e,helper:"clone",containment:"parent",stop:function(f,g){var h=$(g.helper).position();d.globalEvents.bubbleUp("resizerDraggableStop",{resizer:d.getCmp(),clone:{posX:h.left,posY:h.top},org:{posX:$(this).position().left,posY:$(this).position().top}})}})}})(this),0)}}};jsCow.res.controller.resizer=function(){this.type="jsCow.res.controller.resizer"};jsCow.res.controller.resizer.prototype={init:function(){},handleSetDirection:function(a){if(this.isMethodExists(this.getModel().setDirection)){this.getModel().setDirection(a)}return this},handleUpdate:function(a){if(this.isMethodExists(this.getModel().update)){this.getModel().update(a)}return false}};