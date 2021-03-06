
jsCow.res.components.toolbar = function() {};
jsCow.res.components.toolbar.prototype = {

	init: function() {
		
		this.addController(jsCow.res.controller.toolbar);
		this.addModel(jsCow.res.model.toolbar);
		this.addView(jsCow.res.view.toolbar);
		
		return this;
	}
	
};

jsCow.res.model.toolbar = function() {
	
};
jsCow.res.model.toolbar.prototype = {
	
	init: function(e) {
		this.trigger("model.ready", this.data);
	}
	
};

jsCow.res.view.toolbar = function() {
	
	this.dom = {};
	this.dom.main = $('<div/>').addClass('jsc-toolbar');
	this.dom.content = $('<div/>').addClass('jsc-toolbar-content').appendTo(this.dom.main);
	
};
jsCow.res.view.toolbar.prototype = {
	
	init: function(e) {	
		
	},
	
	update: function(e) {	
		
	}
	
};

jsCow.res.controller.toolbar = function() {};
jsCow.res.controller.toolbar.prototype = {
	
	init: function() {
		this.on("model.ready", this.isModelReady);
	},
	
	isModelReady: function() {
		this.trigger("view.init");
	}
	
};
