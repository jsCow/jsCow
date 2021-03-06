/*
 * jsCow - Views Manager Extension - JavaScript Component Framework
 * https://github.com/jsCow/jscow
 * 
 * Released under the GNU GENERAL PUBLIC LICENSE
 * https://github.com/jsCow/jscow/blob/master/LICENSE
 */

/**
  * Views manager class for the jsCow framework.
  * @class jsCow.res.core.mvc.viewsManager
  * @constructor 
  */

jsCow.res.core.mvc.viewsManager = function() {
	
	/**
	  * List of all registered views of a component instance.
	  * @property viewList
	  * @type Array
	  * @default []
	  */
	this.viewList = [];
	
};
jsCow.res.core.mvc.viewsManager.prototype = {
	
	/**
	  * Init method of all views of the current component instance
	  * @method init
	  * @param {Object} config Object with all default view configurations.
	  */
	init: function(config) {
		
		var cfg = config;
		var self = this;
		var viewList = this.list();
		
		$(viewList).each(function(i, view) {
			
			if (!view.isInit) {
				
				if (view.dom !== 'undefined' && view.dom.main !== 'undefined') {
					
					if (i === 0 && self.cmp().placeholder()) {
						self.cmp().placeholder().replaceWith( view.dom.main );
					}
					
					if (i > 0) {
						viewList[ i - 1 ].dom.main.after( view.dom.main );
					}
					
				}
				
				view.isInit = true;
				
			}
			
		}).promise().done(function() {
			self.cmp().trigger('view.ready');
		});
		
	},
	
	/**
	  * Get a list of all registered views of the current component. 
	  * @method list
	  * @return {Object} Liste aller registrierten Views.
	  */
	list: function() {
		return this.viewList;
	},
	
	/**
	  * Creates a new view instance for the current component.
	  * @method addView
	  * @param {Object} v Reference of the registered view resources.
	  * @return {Object} Returns the view instance of the current component.
	  */
	addView: function(v) {
		
		var self = this;
		var length = this.length();
		
		this.viewList[length] = new v();
		this.viewList[length].__cmp__ = this.cmp();
		this.viewList[length].__cfg__ = {};
		
		//
		// Set events manager
		
		var eventsManager = new jsCow.res.core.events.eventsManager();
		eventsManager.cmp(this.cmp());
		eventsManager.parent(this.viewList[length]);
		this.viewList[length].events = eventsManager;
		
		/**
		  * View class with all default methods.
		  * @class jsCow.view
		  * @constructor
		  */
		$.extend(true, this.viewList[length],  {
			
			/**
			  * Get the reference to the current component instance.
			  * @method cmp
			  * @return {Object} Returns the reference to the current component instance.
			  */
			cmp: function() {
				return this.__cmp__;
			},
			
			/**
			  * Get the main DOM element (jQuery) of a specific component view. 
			  * @method main
			  * @return {Object} Returns the main DOM element (jQuery) of the current component view.
			  */
			main: function() {
				return this.dom.main;
			},
			
			/**
			  * Get the inner DOM element (jQuery) of a specific component view. 
			  * @method content
			  * @return {Object} Returns the inner DOM element (jQuery) of the current component view.
			  */
			content: function() {
				if (this.dom.content) {
					return this.dom.content;
				} else {
					return false;
				}
			},
			
			/**
			  * Append the main DOM element (jQuery) of a specific component view into the target DOM element from the component instance.  
			  * @method appendToTarget
			  * @return {Object} Returns the current component view.
			  * @chainable
			  */
			appendToTarget: function() {
				$(this.dom.main).appendTo(this.cmp().target());
				
				return this;
			},
			
			/**
			  * Append any main DOM element (jQuery) of a specific component view after the main DOM element from the current component view.  
			  * @method appendAfter
			  * @return {Object} Returns the current component view.
			  * @chainable
			  */
			appendAfter: function(target) {
				target.after(this.dom.main);
				
				return this;
			},
			
			/**
			  * Get the configuration of the current component view.
			  * @method cfg
			  * @param {String} index optional Defines the index of the component view.  
			  * @return {Object} Returns the current component view.
			  */
			cfg: function(index) {
				if (index === undefined) {
					
					return this.__cfg__;

				} else {

					if(this.__cfg__[index]) {
						return this.__cfg__[index];
					} else {
						return false;
					}

				}
			},
			
			/**
			  * Get the id of the current component view.   
			  * @method id
			  * @param {String} id 
			  * @return {Object} Returns the current component view.
			  */
			id: function(id) {
				if (id) {
					this.__id__ = id;
					
					return this;
				} else {
					return this.__id__;
				}
			},
			
			/**
			  * Set the CSS class .jsc-focus on the main DOM element of the current component view.   
			  * @method focus
			  * @return {Object} Returns the current component view.
			  */
			focus: function(e) {	
				$(".jsc-focus").removeClass("jsc-focus");
				this.dom.main.addClass('jsc-focus');
			},
			
			/**
			  * Attach an event handler function for an event.
			  * @method on
			  * @param {String} event Defines the name of the attached event 
			  * @param {Function} handler Defines the handler function for the attached event.
			  * @param {Boolean} local Defines the type (local or global) of the event.
			  * @return {Object} Returns the reference to the current view instance.
			  * @chainable
			  */
			on: function(event, handler, local) {
				this.events.on(event, handler, local);
				
				return this;
			},
			
			/**
			  * Triggers an attached event.
			  * @method trigger
			  * @param {String} event Defines the name of the attached event 
			  * @param {Object} data Defines the event data by trigger the attached event.
			  * @param {Boolean} local Defines the type (local or global) of the event.
			  * @return {Object} Returns the reference to the current view instance.  
			  * @chainable
			  */
			trigger: function(event, data, local) {
				this.events.trigger(event, data, local);
				
				return this;
			},
			
			/**
			  * Triggers an event bubbling down into the component hirarchy. 
			  * @method bubbleIn
			  * @param {String} event Defines the name of the attached event 
			  * @param {Object} data Defines the event data by trigger the attached event.
			  * @param {Boolean} local Defines the type (local or global) of the event.
			  * @return {Object} Returns the reference to the current view instance.  
			  * @chainable
			  */
			bubbleIn: function(event, data, local) {
				this.events.bubbleIn(event, data, local);
				
				return this;
			},
			
			/**
			  * Triggers an event bubbling upward in the component hirarchy. 
			  * @method bubbleOut
			  * @param {String} event Defines the name of the attached event 
			  * @param {Object} data Defines the event data by trigger the attached event.
			  * @param {Boolean} local Defines the type (local or global) of the event.
			  * @return {Object} Returns the reference to the current view instance.  
			  * @chainable
			  */
			bubbleOut: function(event, data, local) {
				this.events.bubbleOut(event, data, local);
				
				return this;
			},
			
			/**
			  * Triggers an event bubbling upwards and also down into the component hirarchy. 
			  * @method bubble
			  * @param {String} event Defines the name of the attached event 
			  * @param {Object} data Defines the event data by trigger the attached event.
			  * @param {Boolean} local Defines the type (local or global) of the event.
			  */
			bubble: function(event, data, local) {
				this.events.bubble(event, data, local);
				
				return this;
			}
			
		});
		
		this.viewList[length].id('v' + ((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 18));
		
		//
		// Register default view events event
		
		this.viewList[length].on( "view.init",  this.viewList[length].init);
		this.viewList[length].on( "view.update",  this.viewList[length].update);
		this.viewList[length].on( "view.focus",  this.viewList[length].focus);
		
		// Set focus on component
		this.viewList[length].dom.main.mousedown( function(self, length) {
			return function(e) {
				e.stopPropagation();
				self.viewList[length].trigger('view.focus');
			};
		}(self, length));
		
		
		return this.viewList[length];
		
	},
	
	/**
	  * Add a view to the current component.
	  * @class jsCow.res.core.mvc.viewsManager
	  * @method add
	  * @param {Object} v Reference of the registered view resources.
	  * @return {Object} Returns the view manager of the current component.
	  * @chainable
	  */
	add: function(v) {
		this.addView(v);
		
		return this;
	},
	
	/**
	  * Add a view to the current component.
	  * @method del
	  * @param {Object} view Reference of the view instance of the current component.
	  * @return {Object} Returns the view manager of the current component.
	  * @chainable
	  */
	del: function(view) {
		
		var v = new view();
		var viewList = this.list();
		
		$.each(viewList, function(i, view) {
			if (v.id() === view.id()) {
				if (view.dom.main !== 'undefined') {
					view.dom.main.remove();
				}
				viewList.splice(i,1);
			}
		});
		
		return this;
	},
	
	/**
	  * Add a view to the current component.
	  * @method update
	  * @return {Object} Returns the view manager of the current component.
	  * @chainable
	  */
	update: function() {
		
		var self = this;
		var viewList = this.list();
		
		$.each(viewList, function(i, view) {
			
			self.cmp().trigger("view.update");
			
		});
		
		return this;
	},
	
	/**
	  * Get the length of all registered component views.
	  * @method length
	  * @return {Object} Returns the length of all registered component views.
	  * @chainable
	  */
	length: function() {
		return this.viewList.length;
	},
	
	/**
	  * Get the inner DOM element (jQuery) of a specific component view. 
	  * Without parameter the method will get the content element of the first component view.
	  * @method content
	  * @param {int} idx Defines the index of the registered component view.
	  * @return {Object} Returns the inner DOM element (jQuery) of the current component view. Are there more then one views registered the method will get a list. Is there no content element available the main element of the view will be returned.
	  */
	content: function(idx) {
		
		var index;

		if (idx === undefined) {
			index = 0; 
		} else {
			index = idx;
		}

		var self = this;
		var viewList = this.list();
		var content = false;
		
		$.each(viewList, function(i, view) {
			if (view.dom !== 'undefined' && view.dom.content !== 'undefined' && typeof (view.dom.content) === "object" && (view.dom.content instanceof Array)) {
				if (view.dom.content[index]) {
					content = view.dom.content[index];
				}
			}else if (view.dom !== undefined && view.dom.content !== undefined) {
				content = view.dom.content;
			}else{
				return self.main(index);
			}
		});
		
		return content;
	},
	
	/**
	  * Get the main DOM element (jQuery) of a specific component view. 
	  * Without parameter the method will get the main elementn from the first component view.
	  * @method main
	  * @param {int} idx Defines the index of the registered component view.
	  * @return {Object} Returns the main DOM element (jQuery) of the current component view. Are there more then one views registered the method will get a list. Is there no main element available the method will be return false.
	  */
	main: function(idx) {
		
		var index;

		if (idx === undefined) {
			index = 0; 
		} else {
			index = idx;
		}

		var self = this;
		var viewList = this.list();
		var main = false;
		
		$.each(viewList, function(i, view) {
			if (view.dom !== 'undefined' && view.dom.main !== 'undefined' && typeof (view.dom.main) === "object" && (view.dom.main instanceof Array)) {
				if (view.dom.main[index]) {
					main = view.dom.main[index];
				}
			}else if (view.dom !== 'undefined' && view.dom.main !== 'undefined') {
				main = view.dom.main;
			}else{
				main = false;
			}
		});
		
		return main;
	},
	
	/**
	  * Get the reference to the current component instance.
	  * @method cmp
	  * @return {Object} Returns the reference to the current component instance.
	  */
	cmp: function() {
		return this.__cmp__;
	},
	
	/**
	  * Move the current main DOM element into a other element.
	  * @method appendTo
	  * @param {DOM Element} target jQuery DOM element.
	  * @return {Object} Returns the view manager.
	  * @chainable
	  */
	appendTo: function(target) {
		
		var self = this;
		var viewList = this.list();
		
		$.each(viewList, function(i, view) {
			view.main().appendTo(target);
			self.cmp().target(target);
		});
		
		return this;
	},
	
	/**
	  * Remove all component views.
	  * @method removeAll
	  * @return {Object} Returns the reference to the current component instance.
	  * @chainable
	  */
	removeAll: function() {
		var viewList = this.list();
		$.each(viewList, function(i, view) {
			if (view.dom.main !== 'undefined') {
				view.dom.main.remove();
			}
		});
		
		return this.cmp();
	},
	
	/**
	  * Replace a component view with another one.
	  * @method replace
	  * @param {Object} o Defines a reference to an existing component view.
	  * @param {Object} n Defines a reference to the new component view resource.
	  * @return {Object} Returns the reference to the current component instance.
	  * @chainable
	  */
	replace: function(o, n) {
		
		var oV = new o();
		var _this = this;
		
		var viewList = this.list();
		$.each(viewList, function(i, view) {
			if (view.id() === oV.id()) {
				_this.addView(n).appendAfter(view.main());
				_this.del(o);
			}
		});

		return this;
	},
	
	/**
	  * Set a CSS class or an inline CSS style on the main DOM element in all views.
	  * @method style
	  * @param {Object} o Defines a reference to an existing component view.
	  * @param {Object} n Defines a reference to the new component view resource.
	  * @return {Object} Returns the reference to the current component instance.
	  */
	style: function(css) {
		var style = css;
		var _this = this;
		var viewList = this.list();
		
		$.each(viewList, function(i, view) {
			if (typeof style === "object") {
				view.main().css(style);
			}else if (typeof style === "string") {
				view.main().addClass(style);
			}
		});
		
	}

};
