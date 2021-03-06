
jsCow.res.components.group = function() {};
jsCow.res.components.group.prototype = {

	init: function() {
		
		this.addController(jsCow.res.controller.group);
		this.addModel(jsCow.res.model.group);
		this.addView(jsCow.res.view.group);
		
		return this;
	}
	
};

jsCow.res.model.group = function() {
	
};
jsCow.res.model.group.prototype = {
	
	init: function(e) {
		this.trigger("model.ready", this.data);
	}
	
};

jsCow.res.view.group = function() {
	
	this.dom = {};
	this.dom.main = $('<div/>').addClass('jsc-group');
	this.dom.content = $('<div/>').addClass('jsc-group-content').appendTo(this.dom.main);
	
};
jsCow.res.view.group.prototype = {
	
	init: function(e) {	
		
	},
	
	update: function(e) {	
		
	}
	
};

jsCow.res.controller.group = function() {};
jsCow.res.controller.group.prototype = {
	
	init: function() {
		this.on("model.ready", this.isModelReady);
	},
	
	isModelReady: function() {
		this.trigger("view.init", this.cmp().config());
	}
	
};
