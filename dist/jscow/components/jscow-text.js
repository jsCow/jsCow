jsCow.res.components.text=function(){},jsCow.res.components.text.prototype={init:function(){return this.addController(jsCow.res.controller.text),this.addModel(jsCow.res.model.text),this.addView(jsCow.res.view.text),this},text:function(text,wrapper){return"undefined"!=typeof text&&"string"==typeof text&&("undefined"==typeof wrapper&&(wrapper=!1),this.trigger("text",{text:text,wrapper:wrapper})),this}},jsCow.res.model.text=function(){this.data={enabled:!0,visible:!0,text:"",wrapper:!1}},jsCow.res.model.text.prototype={init:function(){this.trigger("model.ready",this.data)}},jsCow.res.view.text=function(){this.dom={},this.dom.main=$("<div/>").addClass("jsc-text clearfix"),this.dom.text=$("<div/>").appendTo(this.dom.main)},jsCow.res.view.text.prototype={init:function(e){this.trigger("view.update",e.data)},update:function(e){e.data.enabled?(this.dom.main.removeClass("jsc-text-disabled").addClass("jsc-text"),e.data.wrapper?this.dom.text.html("<"+e.data.wrapper+">"+e.data.text+"</"+e.data.wrapper+">"):this.dom.text.html(e.data.text),e.data.visible?this.dom.main.show():this.dom.main.hide()):this.dom.main.removeClass("jsc-text").addClass("jsc-text-disabled")}},jsCow.res.controller.text=function(){},jsCow.res.controller.text.prototype={init:function(){this.on("model.ready",this.isModelReady),this.on("text",this.text)},isModelReady:function(){this.trigger("view.init",this.cmp().config())},text:function(e){this.cmp().config({text:e.data.text,wrapper:e.data.wrapper})}};