/*
 * jsCow - JavaScript Component Framework v3.1.0
 * https://github.com/jsCow/jscow
 * 
 * Released under the GNU GENERAL PUBLIC LICENSE
 * https://github.com/jsCow/jscow/blob/master/LICENSE
 */

/**
Core class of the jsCow framework.

@class jsCow
@constructor 
*/

jsCow = (function() {
	
	var jsCowBase = function() {
		/*
		 @description default core setup variables
		 */
		this.config = {
			version: '2.0.0',
			url: {
				base: ''
			},
			zIndex: 1
		};
		
		/**
		Liste aller im Framework registrierten Komponenten.
		
		@property componentsObjectList
		@type Object
		@default "[]"
		**/
		this.componentsObjectList = [];
		
		/**
		Objekt in dem die einzelnen Komponenten-Klassen registriert und abgelegt werden k&ouml;nnen.
		
		@property res
		@type Object
		@default "{
			components: {},
			model: {},
			view: {},
			controller: {}
		}"
		@example
			jsCow.res.components.button = function() { ... }
			jsCow.res.components.button.prototype = { 
				... 
			}
			
			jsCow.res.model.button = function() { ... }
			jsCow.res.model.button.prototype = { 
				... 
			}
			
			jsCow.res.view.button = function() { ... }
			jsCow.res.view.button.prototype = { 
				... 
			}
			
			jsCow.res.controller.button = function() { ... }
			jsCow.res.controller.button.prototype = { 
				... 
			}
		**/
		this.res = {
			core: {
				mvc: {},
				events: {}
			},
			components : {},
			model : {},
			view : {},
			controller : {}
		};
		
		this.events = {};
		this.cache = {};
		
		this.debug = {
			events: false,
			controller: false,
			model: false,
			view: false
		};
		
	};
	
	jsCowBase.prototype = {
		
		/**
		Gibt den n&auml;chst h&ouml;heren z-Index als Zahl zur&uuml;ck.
		
		@method getNextZIndex
		@return {Int} H&ouml;chsten z-Index als Zahl.
		**/
		nextZIndex: function() {
			this.config.zIndex++;
			return this.config.zIndex;
		},
		
		/**
		Speichert einen beliebigen Wert in einer Cache-Liste.
		
		@method setCache
		@param {String} index Index, unter welchem der Wert gespeichert werden soll.
		@param {Object} cache Wert, welcher gespeichert werden soll.
		@return {Object} Referenz auf das das Framework-Object selbst.
		@chainable
		**/
		cache: function(index, value) {
			
			if (index && value) {
			
				if (this.cache[index] === undefined) {
					this.cache[index] = false;
				}

				this.cache[index] = value;
				
			}else{
				if (!index) {
					return this.cache;
				} else if (this.cache[index]) {
					return this.cache[index];
				}
			}
			
			return this;
		},
		
		/**
		L&ouml;scht einen existierenden Wert aus der Cache-Liste.
		
		@method removeCache
		@param {String} index Index, unter welchem der Wert gespeichert wurde.
		@return {Object} Referenz auf das das Framework-Object selbst.
		@chainable
		**/
		removeCache: function(index) {
			delete this.cache[index];
			
			return this;
		},
		
		/**
		...
		
		@method get
		@param {Object} ...
		@return {Object} ...
		@chainable
		**/
		get: function(cmp, preConfig) {
			return this.components.get(cmp, preConfig);
		},
		
		/**
		...
		
		@method find
		@param {Object} ...
		@return {Object} ...
		@chainable
		**/
		find: function(cmp) {
			return this.components.find(cmp);
		}
		
	};
	
	return new jsCowBase();
	
})();

if (typeof module !== 'undefined' && !!module.exports) {
	var exports = module.exports = {
		"jsCow": jsCow
	};
}

( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jsCow requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {



});

(function (root, factory) {

	"use strict";
	
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['b'], function (b) {
            return (root.returnExportsGlobal = factory(b));
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('b'));
    } else {
        // Browser globals
        root.returnExportsGlobal = factory(root.b);
    }
}(this, function (b) {
    //use b in some fashion.

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return {};
}));;/*
 * jsCow.components - jsCow extention - JavaScript Library
 * http://www.gelight-tec.de/
 *
 * Copyright 2011, Mario Linz
 * http://www.gelight-tec.de/gui/license
 *
 * Date: April 04 22:00:00 2011
 */

/**
&Uuml;ber das Object "component" kann eine neue Instanz einer registrierten Komponente geholt bzw. erzeugt werden.

@class component
@constructor 
*/
var component = function() {};
component.prototype = {
	
	/**
	Gibt eine neue Instanz einer im Framework registrierten Komponente zur&uuml;ck.
	Das Model, der View, sowie der Controller der entsprechenden Komponente werden mit Standard-Methoden angereichert.
	
	@method get
	@param {Object} c Referenz auf die im Framework registrierte Komponenten-Klasse.
	@return {Object} Referenz auf die Instanz der neuen Komponente
	**/
	get: function(cmpClassReference, preConfig) {
		
		// Get the reference by string		
		if (typeof cmpClassReference === 'string') {

			var search = function search(s, scope) {
				
				if (typeof s === "string") {
					s = s.split('.');
				}

				if (!scope) {
					scope = window;
				}

				if ( s.length < 2 ){

					return scope[s[0]];

				} else {

					if ( scope[s[0]] ) {
						
						var newScope = s.shift();
						return search( s, scope[newScope] );

					} else {

						return false;

					}

				}

			};

			cmpClassReference = search(cmpClassReference);

		}

		var c = new cmpClassReference();
		
		if (typeof c === 'object') {
			
			/**
			...
			
			@property preConfig
			*/
			if (typeof preConfig !== 'undefined') {
				c.__preConfig__ = preConfig;
			} else {
				c.__preConfig__ = {};
			}

			/**
			Objektstuktur einer Komponente mit allen grundlegenden Methoden.
			
			@class cmp
			@constructor 
			*/
			
			c.events = false;
			
			/**
			Registriertes Model der Komponente

			@property __model__
			@type Object
			@default "false"
			**/
			c.__model__ = false;
			
			/**
			Registrierte Views der Komponente

			@property __view__
			@type Object
			@default "false"
			**/
			c.__view__ = false;
			
			/**
			Registrierte Controller der Komponente

			@property __controller__
			@type Object
			@default "false"
			**/
			c.__controller__ = false;
			
			/**
			Konfiguration der Komponente.

			@property config.
			@type Object
			@default "{}"
			**/
			c.__cfg__ = {};
			
			/**
			Referenz auf die &uuml;bergeordnete Komponente.

			@property config.parent
			@type Object
			@default "false"
			**/
			c.__cfg__.parent = false;
			
			/**
			Objekt f&uuml;r alle ben&ouml;tigten HTML-DOM Elemente der Komponente.
			
			@property config.dom
			@type Object
			@default "false"
			**/
			c.__cfg__.dom = false;
			
			c.__cfg__.layerindex = 0;
			c.__cfg__.initialized = [];
			c.__cfg__.__execInit__ = false;
			c.__cfg__.rendered = false;
			c.__cfg__.placeholder = false;
			c.__cfg__.id = false;
			
			/**
			DOM-Target der Komponente.

			@property config.target
			@type Object
			@default "false"
			**/
			c.__cfg__.target = false;
			
			/**
			Liste aller Kind-Komponenten der aktuellen Komponente.

			@property children
			@type Array
			@default "[]"
			**/
			c.__children__ = [];
			
			/**
			Objekt aller Methoden, die die Komponente erweitert.
			
			@property extension
			@type Object
			@default "false"
			**/
			c.extension = false;
			
			// Extend component with all standard methods
			c = $.extend(true, c,  {
				
				/**
				F&uuml;gt eine neue Kind-Komponente der aktuellen Komponente hinzu.
				Die hinzuzuf&uuml;gende Komponente existiert in diesem Fall noch nicht als Instanz.
				
				@method add
				@param {Object} child Referenz auf die im Framework registrierte Komponenten-Klasse.
				@return {Object} child Referenz auf die aktuelle Komponente selbst.
				@chainable
				**/
				add: function(childs) {
					
					var list = [];
					
					if ( childs instanceof Array ) {
						list = childs;
					} else {
						list.push(childs);
					}
					
					$.each(list, (function(self) {
						return function(i, child) {
							
							if (typeof child === 'object' && !child.__cfg__.__execInit__)	{
								
								var content = self.view().content();
								
								if ( content ) {
									content.append( child.placeholder() );
								} else { 
									content = self.placeholder();
								}
								
								child.parent(self);
								child.target(content);
								
								self.__children__.push(child);
								
							}
							
						};
					})(this));
					
					return this;
				},
				
				createPlaceholder: function(index) {

					var ph = $('<div class="jsc-ph-'+index+'"></div>');
					this.placeholder( ph );
					
					return ph;
				},
				
				placeholder: function(placeholder) {
					if ( placeholder ) {
						
						this.__cfg__.placeholder = placeholder;
						this.__cfg__.placeholder.appendTo(this.target());

						return this;

					} else {

						return this.__cfg__.placeholder;

					}
				},
				
				/**
				Setzt das DOM-Target (jQuery) der Komponente.
				
				@method target
				@param {Object} target DOM-Target der Komponente.
				@return {Object} Referenz der aktuellen Komponente.
				@chainable
				**/
				target: function(t) {
					
					var target = t;
					
					if (typeof target === 'undefined') {
						
						if (!this.__cfg__.target) {
							this.__cfg__.target = $('body');
						}
						
						return this.__cfg__.target;
						
					} else {
						
						if (!this.parent() && typeof target === 'undefined') {

							this.__cfg__.target = $('body');
							target = this.__cfg__.target;

						} else {
							
							this.__cfg__.target = target;
							this.placeholder().appendTo(this.__cfg__.target);

						}

						if (this.children.length) {
							$.each(this.children, function(i,child){
								child.target(target);
							});
						}
						
						return this;
						
					}
					
				},
				
				defineVariables: function() {
					
					if(!this.__preConfig__) {this.__preConfig__ = {};}
					
					if(!this.__children__) {this.__children__ = [];}
					if(!this.extension) {this.extension = {};}
					
					if(!this.__cfg__) {this.__cfg__ = {};}
					if(!this.__cfg__.__execInit__) {this.__cfg__.__execInit__ = false;}
					if(!this.__cfg__.apps) {this.__cfg__.apps = [];}
					if(!this.__cfg__.parent) {this.__cfg__.parent = false;}
					if(!this.__cfg__.dom) {this.__cfg__.dom = {};}
					if(!this.__cfg__.rendered) {this.__cfg__.rendered = [];}
					if(!this.__cfg__.placeholder) {this.__cfg__.placeholder = false;}
					if(!this.__cfg__.initialized) {this.__cfg__.initialized = [];}
					if(!this.__cfg__.target) {this.__cfg__.target = false;}
					
					if(!this.events) {this.events = false;}
					
					if(!this.__model__) {this.__model__ = {};}
					if(!this.__view__) {this.__view__ = [];}
					if(!this.__controller__) {this.__controller__ = [];}
					
				},
				
				/**
				F&uuml;gt eine neue Kind-Komponente der aktuellen Komponente hinzu.
				Die hinzuzuf&uuml;gende Komponente muss bereits als Instanz vorliegen.
				
				@method append
				@param {Object} child Referenz auf die Instanz der hinzuzuf&uuml;genden Komponente.
				@return {Object} child Referenz auf die aktuelle Komponente selbst.
				@chainable
				**/
				append: function(child) {
					window.setTimeout((function(self, child) {
						return function() {
							if (!child.config.__execInit__ && typeof child === 'object') {
								self.add(child);
								child.__init();
							}
						};
					}(this, child)), 0);
					
					return this;
				},
				
				/**
				F&uuml;gt der aktuellen Komponente eine neue Kind-Komponente zur Laufzeit hinzu.
				Anwendungsgebiet hier kann beispielsweise die Verwendung von ben&ouml;tigten Komponenten innerhalb eines Viewss sein, 
				welche wiederum von der Komponente selbst gesteuert werden soll.
				
				@method appendInner
				@param {Object} child Referenz auf die im Framework registrierte Komponenten-Klasse.
				@param {Object} target DOM-Target Element (jQuery), in welchem zu erstellende Komponente gerendert werden soll.
				@return {Object} child Referenz auf neu erzeugte Komponente.
				**/
				appendInner: function(child, target) {
					
					window.setTimeout((function(self) {
						return function() {
							
							self.defineVariables();
							
							if (target && !child.config.__execInit__ && typeof child === 'object') {
								
								var placeholder = self.createPlaceholder();
								target.append(placeholder);
								
								child.parent(self);
								child.placeholder(placeholder);
								child.target(target);
								
								self.__children__.push(child);
								
								child.__init();
								
							}
						};
					}(this)), 0);
					
					return child;
				},
				
				/**
				F&uuml;gt der aktuellen Komponente eine neue Kind-Komponente zur Laufzeit hinzu und positioniert die neue Komponente nach einer existierenden Kind-Komponente.
				
				@method appendAfterInner
				@param {Object} child Referenz auf die Komponente, die eingef&uuml;gt werden soll.
				@param {Object} target Referenz auf die Komponente, hinter der die neue Komponente eingef&uuml;gt werden soll.
				@return {Object} child Referenz auf eingef&uuml;gte Komponente.
				**/
				appendAfterInner: function(child, target) {
					
					child.defineVariables();
					
					if (target && !child.config.__execInit__ && typeof child === 'object') {
						
						child.parent(this);
						child.target(this.target());
						child.placeholder(false);
						
						target.view().getDomMain().after(child.view().getDomMain());
						
						this.__children__.push(child);
						
						child.__init();
					
					}
					
					return child;
				},
				
				/**
				Delete a component and remove all related dom elements.
				
				@method del
				@param {Object} [optional] cmp Instance of the component to be deleted
				@return {Object} Reference to the current component instance object
				@chainable
				**/
				del: function(cmp) {	
					
					// Remove the component reference from parent children list
					if (typeof cmp !== 'undefined' && typeof cmp === 'object') {
						
						$(this.children()).each((function(self, cmp) {
							return function(i,c) {

								if (c.id() === cmp.id()) {
									self.__children__.splice(i,1);
								}

							};
						})(this, cmp));

					} else {

						// Call to remove the component reference from parent children list
						if (typeof this.parent() !== 'undefined' && this.parent()) {
							this.parent().del(this);
						}
						
						// Remove the component domelemeents and delete the component instance from global jscow instance list
						$(jsCow.componentsObjectList).each((function(self) {
							return function(i, c) {
								if (c !== 'undefined' && c.id() === self.id()) {
									c.view().removeAll();
									jsCow.componentsObjectList.splice(i,1);
								}
							};
						})(this));

						// Delete children components of the component to be delete
						var list = this.__children__;
						if (list.length > 0) {
							$(list).each(function(i,c) {
								c.del();
							});
						}
						
					}
					
					return this;
				},
				
				run: function() {
					this.__init();
				},
				
				__init: function() {
					
					// init state - completed
					this.readyToShow(this);
					
					// If exists the customized init method will be executed
					if (this.extension.init && typeof this.extension.init === "function") {
						this.extension.init();
					}
					
					// Execute this show or init of childrens
					if (this.__children__.length) {
						$.each(this.__children__, function(i, c) {
							c.__init();
						});
					} else {
						this.__show(true);
					}
					
					this.__cfg__.__execInit__ = true;
					
					// Trigger local event "init"
					this.events.trigger("init");
					
				},
				
				__show: function(showNow) {
					
					// Set show state
					this.showComplete(this);
					
					// Execute show
					if (showNow || (this.__cfg__.rendered.length === this.__children__.length)) {
						
						this.view().init();
						
						// Trigger controller init method
						this.events.trigger("controller.init");
						
						// show state - completed
						if (this.parent()) {
							this.parent().__show();
						}

					}
					
				},
				
				/**
				Erweitert die aktuelle Komponente und reichert sie mit den definierten neuen Methoden an.
				
				@method extend
				@param {Object} method Objekt mit allen hinzuzuf&uuml;genden Methoden.
				@param {Boolean} root Wird root als "true" definiert, werden alle Methoden als Extension angelegt, ohne bestehende Standard-Methoden zu &uuml;berschreiben. 
				Muss eine neue Methode den gleichen Namen einer Standard-Methode haben, kann Dies &uuml;ber eine solche Extension genutzt werden. 
				Innerhalb einer solchen Extension-Methode steht "this" im Scope der Haupt-Klasse der aktuellen Komponente.
				@return {Object} Referenz der aktuellen Komponente.
				@chainable
				**/
				extend: function(method, root) {
					
					var methodList;

					if (root === true) {
						
						$.extend(true, this, method);
						
					} else {
						
						var _this = this;
						
						if (!this.extension) {
							
							var ext = function() {};
							
							methodList = {};
							
							$.each(method, function(i, m) {
								
								methodList[i] = (function( _super, m, i ) {
									m._super = typeof _super[i] === 'function' ? _super[i] : function(){};
									return function() {
										m.apply( _super, arguments);
									};
								})( _this, m, i );
								
							});
							
							$.extend(true, ext.prototype, methodList);
							
							this.extension = new ext();
							
						} else {
							
							methodList = {};
							$.each(method, function(i, m) {
								
								methodList[i] = (function( _super, m, i ) {
									m._super = typeof _super[i] === 'function' ? _super[i] : function(){};
									return function() {
										m.apply( _super, arguments);
									};
								})( _this, m, i );
								
							});
							$.extend(true, this.extension, methodList);
							
						}
					}
					
					return this;
				},
				
				/**
				Verschiebt die aktuelle Komponente in ein neues DOM-Target.
				
				@method move
				@return {Object} Referenz der aktuellen Komponente.
				@chainable
				**/
				move: function(target) {
					
					if (target !== 'undefined' && typeof target === 'object') {
						
						var targetViewContent = target.view().content();
						
						this.view().appendTo(targetViewContent);
						
						if (this.parent()) {
							var parentChildIndex = this.parent().children().indexOf(this);
							this.parent().children().splice(parentChildIndex, 1);
							this.parent(target);
						}
						
						target.__children__.push(this);
					}
					
					return this;
				},
				
				/**
				...
				
				@method id
				@param {String} ...
				@return {String} ID der Komponente.
				**/
				id: function(id) {
					if(id) {
						this.__cfg__.id = id;
						
						this.trigger("update.id", {
							id: id
						});
						
						return this;
					} else {
						return this.__cfg__.id;
					}
				},
				
				/**
				Gibt eine Liste der Kind-Komponenten der Komponente zur&uuml;ck.
				
				@method children
				@return {Array} Liste aller Kind-Komponenten.
				**/
				children: function() {
					return this.__children__;
				},
				
				/**
				Gibt das aktuelle Model der Komponente zur&uuml;ck.
				
				@method model
				@return {Object} Referenz auf das Model der Komponente.
				**/
				model: function() {
					
					if (this.__model__ === 'undefined' || !this.__model__) {
						return false;
					} else {
						return this.__model__;
					}
					
				},
				
				/**
				Gibt eine Referenz auf den View-Manager der Komponente zur&uuml;ck.
				(Das Nutzen von mehr als einem View ist noch in einer fr&uuml;hen Entwicklungsphase und sollte bei Bedarf getestet werden)
				
				@method view
				@return {Object} Referenz auf den View der Komponente.
				**/
				view: function() {
					if (this.__view__ === undefined) {
						return false;
					} else {
						return this.__view__;
					}
				},
				
				/**
				Gibt eine Referenz auf den Controller-Manager der aktuellen Komponente zur&uuml;ck.
				Damit auch Event-Handler Methoden eines Controllers wiederverwendet werden k&ouml;nnen, ist es m&ouml;glich mehr als einen Controller in einer Komponente zu gegistrieren.
				
				@method controller
				@return {Object} Referenz auf den Controller-Manager der Komponente.
				**/
				controller: function() {
					if (this.__controller__ === undefined) {
						return false;
					} else {
						return this.__controller__;
					}
				},
				
				/**
				Setzt eine beliebige Konfiguration im Model der der Komponente.
				
				@method config
				@param {Object} config Objekt mit Konfigurations-Parametern.
				@return {Object} Referenz der aktuellen Komponente.
				@chainable
				**/
				config: function(config, value) {
					
					if (config && value) {
						
						this.model().data[config] = value;
						this.trigger("update", this.config());
						
					} else {
						
						if (config) {
							
							$.extend(true, this.model().data, config);
							this.trigger("update", this.config());
						
						} else {
							
							return this.model().data;
							
						}
						
					}
					
					return this;
				},
				
				/**
				Setzt die Referenz auf die &uuml;bergeordnete Komponente.
				
				@method parent
				@param {Object} parent Referenz auf die &uuml;bergeordnete Komponente.
				@return {Object} Referenz der aktuellen Komponente.
				@chainable
				**/
				parent: function(parent) {
					
					if (parent) {
						this.__cfg__.parent = parent;
						return this;
					} else {
						return this.__cfg__.parent;
					}
					
				},
				
				readyToShow: function(c) {
					
					if(this.__cfg__.initialized) {
						this.__cfg__.initialized = [];
					}

					this.__cfg__.initialized.push(c);
					
					return this;
				},

				showComplete: function(c) {
					
					if (!this.__cfg__.rendered) {
						this.__cfg__.rendered = [];
					}

					this.__cfg__.rendered.push(c);
					
					return this;
				},
				
				eventsManager: function(eventsManager) {
					eventsManager.cmp(this);
					this.events = eventsManager;
				},
				
				/**
				...
				
				@method addModel
				@param {Object} m ...
				@return {Object} ...
				@chainable
				**/
				addModel: function(m) {
					
					this.__model__ = new m();
					this.__model__.__controller__ = this.__controller__;
					if (typeof this.__model__.data === 'undefined') {
						this.__model__.data = {};
					}
					
					//
					// Set events manager
					
					var eventsManager = new jsCow.res.core.events.eventsManager();
					eventsManager.cmp(this);
					eventsManager.parent(this.__model__);
					this.__model__.events = eventsManager;

					$.extend(true, this.__model__,  {
						
						reset: function(index) {
							
							if (index) {
								
								if (this.data[index]) {
									if (typeof this.data[index] === 'object') {
										this.data[index] = {};
									}
									if (typeof this.data[index] === 'string') {
										this.data[index] = "";
									}
									if (this.data[index] instanceof Array) {
										this.data[index] = [];
									}
								}
								
							} else {
								
								if (typeof this.data === 'object') {
									this.data = {};
								}
								if (typeof this.data === 'string') {
									this.data = "";
								}
								if (this.data instanceof Array) {
									this.data = [];
								}

							}
							
							return this;
						},
						
						update: function(e) {
							
							this.data = $.extend(true, this.data, e.data);
							this.trigger("update", this.data);
							
							return this;
							
						},
						
						/**
						...
						
						@method id
						@return {Object} ...
						**/
						id: function(id) {
							if (id) {
								this.__id__ = id;
								
								return this;
							} else {
								return this.__id__;
							}
						},
						
						on: function(event, handler, local) {
							this.events.on(event, handler, local);
							
							return this;
						},
						
						trigger: function(event, data, local) {
							this.events.trigger(event, data, local);
							
							return this;
						},
						
						bubbleIn: function(event, data, local) {
							this.events.bubbleIn(event, data, local);
							
							return this;
						},
						
						bubbleOut: function(event, data, local) {
							this.events.bubbleOut(event, data, local);
							
							return this;
						},
						
						bubble: function(event, data, local) {
							this.events.bubble(event, data, local);
							
							return this;
						}
						
					});
					
					this.__model__.id('m' + ((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 18));
					
					//
					// The init method will be called the model init method by event 
					
					this.__model__.on( "controller.init",  this.__model__.init);
					this.__model__.on( "model.update",  this.__model__.update);
					
					
					return this;
				},
				
				/**
				Registriert den Default-View f&uuml;r die aktuelle Komponente.
				
				@method addView
				@for cmp
				@param {Object} v Referenz auf den im Framework registrierte View-Klasse.
				@return {Object} Referenz der aktuellen Komponente.
				@chainable
				**/
				addView: function(v) {
					this.__view__.add(v);
					
					return this;
				},
				
				/**
				L&ouml;scht einen spezifischen View einer Komponente. 
				
				@method deleteView
				@param {Object} v Referenz auf den registrierten View der Komponente.
				@return {Object} Referenz der aktuellen Komponente.
				@chainable
				**/
				deleteView: function(v) {
					this.__view__.del(v);
					
					return this;
				},
				
				/**
				F&uuml;gt einen weiteren View der Komponente hinzu.
				
				@method deleteController
				@param {Object} c Referenz die zu l&ouml;schende Controller-Instanz.
				@return {Object} Referenz der aktuellen Komponente.
				@chainable
				**/
				deleteController: function(c) {
					this.__controller__.del(c);
					
					return this;
				},
				
				/**
				Tauscht einen bestehenden Controller mit einem Anderen.
				
				@method replaceController
				@param {Object} o Referenz den zu ersetzenden Controller.
				@param {Object} n Referenz auf eine im Framework registrierte Controller-Klasse.
				@return {Object} Referenz der aktuellen Komponente.
				@chainable
				**/
				replaceController: function(o, n) {
					this.__controller__.replace(o, n);
					
					return this;
				},

				/**
				Setzt den Default-Controller f&uuml;r die Komponente.
				
				@method addController
				@param {Object} c Referenz auf die im Framework registrierte Controller-Klasse.
				@return {Object} Referenz der aktuellen Komponente.
				@chainable
				**/
				addController: function(c) {
					this.__controller__.add(c);
					
					return this;
				},
				
				/**
				Ersetzt einen bestehenden View mit einem Anderen.
				
				@method replaceView
				@param {Object} o Referenz den zu ersetzenden View.
				@param {Object} n Referenz auf eine im Framework registrierte View-Klasse.
				@return {Object} Referenz der aktuellen Komponente.
				@chainable
				**/
				replaceView: function(o, n) {
					this.__view__.replace(o, n);
					
					return this;
				},
					
				cfg: function(option, value) {
					
					if (option && value) {
						
						// Set value by option
						if (this.__cfg__[option] === undefined) {
							this.__cfg__[option] = false;
						}

						this.__cfg__[option] = value;
						
						return this;
						
					}else if (option && !value) {
						
						if (typeof option === 'object') {
							$.extend(true, this.__cfg__, option);
						}
						
						return this;
						
					} else {
						return this.__cfg__;
					}
					
				},
				
				on: function(event, handler, local) {
					
					if (typeof this.events.on !== 'undefined') {
						this.events.on(event, handler, local);
					}
					
					return this;
				},
				
				trigger: function(event, data, local) {
					
					if (typeof this.events.trigger !== 'undefined') {
						this.events.trigger(event, data, local);
					}
					
					return this;
				},
				
				bubbleIn: function(event, data, local) {
					
					if (typeof this.events.bubbleIn !== 'undefined') {
						this.events.bubbleIn(event, data, local);
					}

					return this;
				},
				
				bubbleOut: function(event, data, local) {
					
					if (typeof this.events.bubbleOut !== 'undefined') {
						this.events.bubbleOut(event, data, local);
					}

					return this;
				},
				
				bubble: function(event, data, local) {
					
					if (typeof this.events.bubble !== 'undefined') {
						this.events.bubble(event, data, local);
					}

					return this;
				},
				
				// 
				// ===== Methods to trigger component actions manually =====
				
				/**
				...
				
				@method isEnabled
				@return {Boolean} ...
				**/
				isEnabled: function() {

					var c = this.config();
					
					if ( c.enabled === false || typeof c.enabled === 'undefined' ) {
						return false;
					} else {
						return true;
					}

				},

				/**
				...
				
				@method disable
				@return {Object} ...
				@chainable
				**/
				disable: function(bubble) {
					
					if ( typeof bubble !== 'undefined' && bubble ) {
						this.bubbleIn("disable", {
							__forcedEnable__: true
						});
					} else {
						this.trigger("disable", {
							__forcedEnable__: true
						});
					}
					
					return this;
				},
				
				/**
				...
				
				@method enable
				@return {Object} ...
				@chainable
				**/
				enable: function(bubble) {
					
					if ( typeof bubble !== 'undefined' && bubble ) {
						this.bubbleIn("enable", {
							__forcedEnable__: true
						});
					} else {
						this.trigger("enable", {
							__forcedEnable__: true
						});
					}
					
					return this;
				},
				
				/**
				...
				
				@method show
				@return {Object} ...
				@chainable
				**/
				show: function() {
					
					this.config({
						visible: true
					});
					
					return this;
				},
				
				/**
				...
				
				@method hide
				@return {Object} ...
				@chainable
				**/
				hide: function() {
					
					this.config({
						visible: false
					});
					
					return this;
				},
				
				/**
				...
				
				@method update
				@return {Object} ...
				@chainable
				**/
				update: function() {
					
					this.trigger("update");
					
					return this;
				},
				
				/**
				...
				
				@method focus
				@return {Object} ...
				@chainable
				**/
				focus: function() {
					
					this.events.trigger("focus");
					
					return this;
				}
				
			});
				
			//
			// Predefine default variables
			c.defineVariables();
		
			
			// 
			// Current object index
			var cIndex = jsCow.componentsObjectList.length; 
			

			//
			// Set a unique id for the new component
			
			c.id( 'c_' + cIndex + "_" + ((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 18) );
			

			//
			// Set events manager
			
			var eventsManager = new jsCow.res.core.events.eventsManager();
			eventsManager.cmp(c);
			eventsManager.parent(c);
			c.events = eventsManager;
			

			//
			// Set all predefined component configuration parameter
			c.on("model.ready", function(e) {
				
				//
				// Set predefined model data
				if ( !$.isEmptyObject( e.sender.__preConfig__.model ) ) {
					e.sender.config( e.sender.__preConfig__.model );
				}
				
				//
				// Call predefined component methods
				$.each(this.__preConfig__, (function(self) {
					return function(i, args) {
						if ( typeof self[i] !== 'undefined' ) {
							
							if ( i !== 'model' ) {
								
								if (args instanceof Array) {
									self[i].apply(self, args);
								} else {
									self[i].apply(self, [args]);
								}
								
							}
							
						} else if ( i !== 'model' ) {
							
							console.warn("Configuration parameter could not be set. The method '"+ i +"' doesn't exists for component '"+self.id()+"'!");

						}
						
					};
				})(this));
				
			});
			
			
			//
			// Set controller handler
			
			var controllerHandler = new jsCow.res.core.mvc.controllerHandler();
			controllerHandler.events = c.events;
			controllerHandler.__cmp__ = c;
			c.__controller__ = controllerHandler;
			
			
			//
			// Set view handler
			
			var viewsManager = new jsCow.res.core.mvc.viewsManager();
			viewsManager.__cmp__ = c;
			c.__view__ = viewsManager;
			
			
			//
			// Create new placeholder
			c.createPlaceholder(cIndex);
			
			
			//
			// Component initialization
			c.init();
			
			
			jsCow.componentsObjectList[cIndex] = c;
			
			c = null;
			
			return jsCow.componentsObjectList[cIndex];
			
		} else {
			
			console.log("The ressource of a component does not exists!");
			
			return {};
		}
		
	},
	
	/**
	Sucht eine Komponente anhand der angegebenen Komponenten-ID und gibt bei Erfolg die Instanz der gesuchten Komponente zur&uuml;ck.
	
	@method find
	@for component
	@param {String} cid ID der gesuchten Komponente.
	@return {Object} Referenz auf die gesuchte Instanz der Komponente. Wird keine Komponente gefunden, wird false zur&uuml;ckgegeben.
	**/
	find: function(component) {
		
		var cid,
			foundCmp;

		if (typeof component === 'object') {
			cid = component.id();
		}
		
		foundCmp = false;
		$.each(jsCow.componentsObjectList, function(i, c) {
			if (c.id() === component) {
				foundCmp = c;
			}
		});
		
		return foundCmp;
	}
	
};

jsCow.components = new component();
;/*
 jsCow.res.view - jsCow extention - JavaScript Library
 http://www.jscow.de/
 Author: Mario Linz
 */

/**
Objektstuktur des View-Manager mit allen grundlegenden Methoden.

@class viewsManager
@constructor 
*/
jsCow.res.core.mvc.viewsManager = function() {
	
	/**
	Liste aller vorhandenen Views einer Komponente.

	@property viewList
	@type Array
	@default "[]"
	**/
	this.viewList = [];
	
};
jsCow.res.core.mvc.viewsManager.prototype = {
	
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
	Gibt eine Liste aller vorhandenen Views einer Komponente zur&uuml;ck.
	
	@method list
	@return {Object} Liste aller registrierten Views.
	**/
	list: function() {
		return this.viewList;
	},
	
	/**
	Setzt den Default-View einer Komponente.
	
	@method addView
	@param {Object} v Referenz auf die im Framework registrierte View-Klasse.
	@return {Object} Gibt den registrierten View zur&uuml;ck.
	**/
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
		
		$.extend(true, this.viewList[length],  {
			
			cmp: function() {
				return this.__cmp__;
			},
			
			main: function() {
				return this.dom.main;
			},
			
			content: function() {
				if (this.dom.content) {
					return this.dom.content;
				} else {
					return false;
				}
			},
			
			appendToTarget: function() {
				$(this.dom.main).appendTo(this.cmp().target());
				
				return this;
			},
			
			appendAfter: function(target) {
				target.after(this.dom.main);
				
				return this;
			},
			
			cfg: function(param) {
				if (param === undefined) {
					
					return this.__cfg__;

				} else {

					if(this.__cfg__[param]) {
						return this.__cfg__[param];
					} else {
						return false;
					}

				}
			},
			
			id: function(id) {
				if (id) {
					this.__id__ = id;
					
					return this;
				} else {
					return this.__id__;
				}
			},
			
			focus: function(e) {	
				$(".jsc-focus").removeClass("jsc-focus");
				this.dom.main.addClass('jsc-focus');
			},
			
			on: function(event, handler, local) {
				this.events.on(event, handler, local);
				
				return this;
			},
			
			trigger: function(event, data, local) {
				this.events.trigger(event, data, local);
				
				return this;
			},
			
			bubbleIn: function(event, data, local) {
				this.events.bubbleIn(event, data, local);
				
				return this;
			},
			
			bubbleOut: function(event, data, local) {
				this.events.bubbleOut(event, data, local);
				
				return this;
			},
			
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
	F&uuml;gt einen weiteren View einer Komponente hinzu.
	
	@method add
	@param {Object} v Referenz auf die im Framework registrierte View-Klasse.
	@return {Object} Gibt den registrierten View zur&uuml;ck.
	**/
	add: function(v) {
		this.addView(v);
		
		return this;
	},
	
	/**
	L&ouml;scht einen spezifischen View aus einer Komponente.
	
	@method del
	@param {Object} v Referenz auf die Instanz des zu l&ouml;schenden View.
	**/
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
		
	},
	
	/**
	Ruft die Methode .update() f&uuml;r alle vorhandenen Views auf.
	
	@method update
	@param {Object} e Event-Parameter der Handler-Methode.
	**/
	update: function(e) {
		
		var self = this;
		var viewList = this.list();
		
		$.each(viewList, function(i, view) {
			
			self.cmp().trigger("view.update");
			
		});
		
	},
	
	/**
	Gibt die Anzahl der vorhandenen Views einer Komponente zur&uuml;ck.
	
	@method length
	@return {Int} Anzahl der registrierten Views.
	**/
	length: function() {
		return this.viewList.length;
	},
	
	/**
	Gibt den inneren Container (jQuery) der aktuellen Komponente zur&uuml;ck.
	
	@method content
	@param {Object} index Index eines spezifischen DOM-Elements.
	@return {Int} Inneren Container (jQuery) der aktuellen Komponente
	**/
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
	Gibt den &auml;u&szlig;eren Container (jQuery) der aktuellen Komponente zur&uuml;ck.
	
	@method main
	@param {Object} index Index eines spezifischen DOM-Elements.
	@return {Int} &Auml;u&szlig;eren Container (jQuery) der aktuellen Komponente
	**/
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
	Gibt eine Referenz auf die Instanz der aktuellen Komponente zur&uuml;ck.
	
	@method cmp
	@return {Object} Referenz auf die Instanz der aktuellen Komponente.
	**/
	cmp: function() {
		return this.__cmp__;
	},
	
	/**
	F&uuml;gt den &auml;u&szlig;eren Container der Komponente in ein neues DOM-Target Element ein.
	
	@method appendTo
	@param {Object} target jQuery DOM-Element.
	@return {Object} Referenz auf die Instanz der aktuellen Komponente.
	**/
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
	Entfernt alle Views einer Komponente.
	
	@method removeAll
	@return {Object} Referenz auf die Instanz der aktuellen Komponente.
	**/
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
	Tauscht einen existierenden View mit einem Anderen.
	
	@method replace
	@param {Object} o Instanz des View, welcher ersetzt werden soll.
	@param {Object} n Referenz auf die im Framework registrierte View-Klasse.
	**/
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
		
	},
	
	/**
	Setzt einen CSS-Style f&uuml;r den &auml;u&szlig;eren Container der Komponente.
	
	@method style
	@param {String} style CSS Styles
	**/
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
;/*
 jsCow.res.controller - jsCow extention - JavaScript Library
 http://www.gelight-tec.de/
 Copyright 2011, Mario Linz
 http://www.gelight-tec.de/gui/license
 Date: April 04 22:00:00 2011
 */

/**
Objektstuktur des Controller-Manager mit allen grundlegenden Methoden.

@class controllerHandler
@constructor 
*/
jsCow.res.core.mvc.controllerHandler = function() {
	
	/**
	Liste aller vorhandenen Controller einer Komponente.

	@property controllerList
	@type Array
	@default "[]"
	**/
	this.controllerList = [];
	
	this.__cmp__ = false;
	this.events = false;
	
};
jsCow.res.core.mvc.controllerHandler.prototype = {

	/**
	Gibt eine liste aller vorhandenen Controller einer Komponente zur&uuml;ck.
	
	@method controllers
	@return {Object} Liste aller registrierten Controller.
	**/
	controllers: function() {
		return this.controllerList;
	},
	
	/**
	Setzt den Default-Controller einer Komponente.
	
	@method add
	@param {Object} c Referenz auf die im Framework registrierte Controller-Klasse.
	@return {Object} Gibt den registrierten Controller zur&uuml;ck.
	@chainable
	**/
	add: function(c) {
		
		/**
		Objektstuktur eines Controller mit allen grundlegenden Methoden.
		
		@class controller
		@constructor 
		*/
		$.extend(true, c.prototype,  {
			
			/**
			Gibt eine Referenz auf das Model zur&uuml;ck.
			
			@method model
			**/
			model: function() {
				return this.__model__;
			},
			
			/**
			Gibt eine Referenz auf den View-Manager der Komponente zur&uuml;ck.
			
			@method view
			**/
			view: function() {
				return this.__view__;
			},
			
			/**
			...
			
			@method cmp
			@return {Object} ...
			**/
			cmp: function() {
				return this.__cmp__;
			},
			
			/**
			...
			
			@method cmp
			@return {Object} ...
			**/
			__update__: function(e) {
				
				this.trigger("view.update", 
					this.cmp().config()
				);
				
				this.trigger("updated",
					this.cmp().config() 
				);
				
				return this;
			},
			
			/**
			...
			
			@method id
			@return {Object} ...
			**/
			id: function(id) {
				
				if (id) {
					
					this.__id__ = id;
					
					return this;

				}else{

					return this.__id__;

				}
				
			},
			
			/**
			...
			
			@method enabled
			@return {Object} ...
			**/
			enable: function(e) {
				
				var c = this.cmp().config();
				
				if ( (c.enabled === false || typeof c.enabled === 'undefined') && 
					 (!this.cmp().parent() || (this.cmp().parent() && this.cmp().parent().isEnabled())) ) {
					
					this.cmp().config({
						enabled: true
					});

					this.trigger("enabled",
						this.cmp().config(e.data) 
					);
					
					$.each(this.cmp().children(), (function(self) {
						return function(i, c) {
							
							var cfg = c.config();
							
							if ( typeof cfg.__forcedEnable__ === 'undefined' || !cfg.__forcedEnable__ ) {
								e.data.__forcedEnable__ = false;
								c.trigger("enable", e.data);
							}
							
						};
					})(this));
					
				}
				
				return this;
			},
			
			/**
			...
			
			@method disabled
			@return {Object} ...
			**/
			disable: function(e) {
				
				var c = this.cmp().config();
				
				if ( c.enabled === true && typeof c.enabled !== 'undefined' ) {
					
					this.cmp().config({
						enabled: false
					});

					this.trigger("disabled",
						this.cmp().config(e.data) 
					);
					
					$.each(this.cmp().children(), (function(self) {
						return function(i, c) {
							
							e.data.__forcedEnable__ = false;
							c.trigger("disable", e.data);
							
						};
					})(this));
					
				}
				
				return this;
			},
			
			/**
			...
			
			@method show
			@return {Object} ...
			**/
			show: function(e) {
				
				this.cmp().config({
					visible: true
				});

				this.trigger("showed",
					this.cmp().config() 
				);
				
				return this;
			},
			
			/**
			...
			
			@method hide
			@return {Object} ...
			**/
			hide: function(e) {
				
				this.cmp().config({
					visible: false
				});
				
				this.trigger("hidden",
					this.cmp().config() 
				);
				
				return this;
			},
				
			on: function(event, handler, local) {
				this.events.on(event, handler, local);
				
				return this;
			},
			
			trigger: function(event, data, local) {
				this.events.trigger(event, data, local);
				
				return this;
			},
			
			bubbleIn: function(event, data, local) {
				this.events.bubbleIn(event, data, local);
				
				return this;
			},
			
			bubbleOut: function(event, data, local) {
				this.events.bubbleOut(event, data, local);
				
				return this;
			},
			
			bubble: function(event, data, local) {
				this.events.bubble(event, data, local);
				
				return this;
			}
			
		});

		var length = this.length();
		
		this.controllerList[length] = new c();
		this.controllerList[length].__view__ = this.cmp().view();
		this.controllerList[length].__model__ = this.cmp().model();
		this.controllerList[length].__cmp__ = this.cmp();
		this.controllerList[length].id('c' + ((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 18));
		
		//
		// Set events manager
		
		var eventsManager = new jsCow.res.core.events.eventsManager();
		eventsManager.cmp(this.cmp());
		eventsManager.parent(this.controllerList[length]);
		this.controllerList[length].events = eventsManager;
		
		//
		// Register init event
		this.controllerList[length].on( "controller.init",  this.controllerList[length].init, true);
		this.controllerList[length].on( "controller.update",  this.controllerList[length].update, true);
		
		this.controllerList[length].on( "show", this.controllerList[length].show);
		this.controllerList[length].on( "hide", this.controllerList[length].hide);
		
		this.controllerList[length].on( "enable", this.controllerList[length].enable);
		this.controllerList[length].on( "disable", this.controllerList[length].disable);
		
		this.controllerList[length].on( "update", this.controllerList[length].__update__);
		
		return this;
	},
	
	/**
	Gibt die Anzahl der angelegten Controller einer Komponente zur&uuml;ck.
	
	@method length
	@for controllerHandler
	@return {Object} Anzahl der registrierten Controller zur&uuml;ck.
	**/
	length: function() {
		return this.controllerList.length;
	},
	
	/**
	...
	
	@method cmp
	@return {Object} ...
	**/
	cmp: function() {
		return this.__cmp__;
	},
	
	/**
	Entfernt einen spezifischen Controller einer Komponente.
	
	@method del
	@param {Object} c Referenz auf die Instanz des Controller.
	**/
	del: function(controller) {
		
		var c,
			controllerList;

		c = new controller();
		controllerList = this.controllers();
		
		$.each(controllerList, function(i, controller) {
			
			if (c.id() === controller.id()) {
				controllerList.splice(i,1);
			}
			
		});
		
		return this;
	}
	
};
;jsCow.res.core.events.eventsManager = function() {
	
	this.__cfg__ = false;
	this.__cmp__ = false;
	this.parentClass = false;
	
};
jsCow.res.core.events.eventsManager.prototype = {
	
	cmp: function(cmp) {
		if (cmp !== undefined) {
			this.__cmp__ = cmp;
			return this;
		}else{
			return this.__cmp__;
		}
	},

	isNot: function(local) {
		if (local) {
			return false;
		} else {
			return true;
		}
	},
	
	parent: function(parentClass) {
		if (parentClass !== undefined) {
			this.parentClass = parentClass;
			return this;
		}else{
			return this.parentClass;
		}
	},
	
	on: function(event, h, l) {
		
		var handler = h;
		var local = l;

		if (handler === undefined) {
			handler = false;
		}
		var sender = this.cmp();
		var parentClass = this.parentClass;
		if (typeof local === 'undefined' || local === true) {
			local = true; 
		} else { 
			local = false;
		}

		if (event !== undefined && sender) {
			
			if (typeof handler === "function") {
				
				if (jsCow.events[event] === undefined) {
					jsCow.events[event] = Array();
				}

				jsCow.events[event].push({
					event: event,
					handler: handler,
					sender: sender,
					that: parentClass,
					local: local
				});
				
			}else{
				if (jsCow.debug.events) {
					console.warn("There is not defined a handler method for event '" + event + "' in '"+this.cmp().id()+"'. The event trigger will be ignored!");
				}
			}
			
		}else{
			console.error("There have to be defined an event name for the event listener in '"+this.cmp().id()+"'!");
		}
		
		return this;
	},
	
	off: function(event, cmp) {
		if (jsCow.events[event]) {
			$.each(jsCow.events[event], function(i,evt) {
				if (jsCow.events[event][i].getID() === cmp.getID()) {
					jsCow.events[event][i].slice(i,1);
				}
			});
		}
	},
	
	trigger: function (event, d, l) {
		
		var config = this.cmp().config();
		var data = d;
		var local = l;

		if (typeof d === 'undefined' || !d) {
			data = config;
		}else if (typeof d === 'object') {
			data = d;
		}else{
			data = {};
		}
		
		if (data) {
			
			var self = this;
			
			if (typeof local === 'undefined' || !local) {
				local = this.cmp(); 
			} else {
				local = false;
			}

			if (jsCow.events[event] !== undefined) {
				$.each(jsCow.events[event], (function(self, event, data, local) {
					return function (i, e) {
						
						if (typeof local === "object" && local.id() === e.sender.id() && e.local) {
							
							setTimeout(
								function() {
									
									if (jsCow.debug.events) {
										console.log("local :: trigger event ", "'"+e.event+"'", "from", "'"+self.cmp().id()+"' for '"+e.that.id()+"'.");
									}

									e.handler.apply(e.that, [{ 
										data: data,
										sender: self.cmp(),
										date: new Date()
									}]);
								}, 0
							);
							
						} else if (self.isNot(local) === e.local) {
							
							setTimeout(
								function() {
									
									if (jsCow.debug.events) {
										console.log("global :: trigger even", "'"+e.event+"'", "from", "'"+self.cmp().id()+"' for '"+e.that.id()+"'.");
									}

									e.handler.apply(e.that, [{ 
										data: data,
										sender: self.cmp(),
										date: new Date()
									}]);

								}, 0
							);
							
						}
						
					};
				})(self, event, data, local));
			}
			
		}
		
		return this;
	},
	
	bubbleOut: function (event, data, local) {
		
		// trigger event in current component
		var bubble = this.bubbleTrigger(event, data, local);
		
		// Next Event bubbling
		if (bubble) {
			if (this.cmp().parent()) { 
				this.cmp().parent().bubbleOut(event, data, local);
			}
		}
		
	},
	
	bubbleIn: function (event, data, local) {
		
		// trigger event in current component
		var bubble = this.bubbleTrigger(event, data, local);
		
		// Next Event bubbling - down
		if (bubble) {
			if (this.cmp().children().length > 0) {
				var children = this.cmp().children();
				
				$.each(children, (function(self) {
					return function(i,c) {
						c.bubbleIn(event, data, local);
					};
				})(this));

			}
		}
		
	},

	bubble: function (event, data, local) {
		
		// trigger event in current component
		var bubble = this.bubbleTrigger(event, data, local);
		
		if (bubble) {
			
			// Next Event bubbling - up
			this.bubbleOut(event, data, local);
			
			// Next Event bubbling - down
			this.bubbleIn(event, data, local);
			
		}
		
	},
	
	bubbleTrigger: function (event, data, local) {
		var bubble = true;
		
		this.trigger(event, data, local);
		
		return bubble;
	}
	
};