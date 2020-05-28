// src = http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame     ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout;
} )();
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback, /* DOMElement */ element){
            return window.setTimeout(callback, 1000 / 60);
        };
})();

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();


function getRandom(min, max) {
	if(min > max) {
		return -1;
	}
	 
	if(min == max) {
		return min;
	}
	 
	var r;
	do {
		r = Math.random();
	}
	while(r == 1.0);
	
	return min + parseInt(r * (max-min+1));
}



function rangeInputCompability(){
	// Check if browser supports <input type=range/>
    var i = document.createElement("input");
    i.setAttribute("type", "range");
    var rangeNotSupported = (i.type === "text");
    delete i;

    // If browser doesn't support <input type=range/>
    // then use jQuery UI to display them
    if(rangeNotSupported) {
        // loop through all <input type=range/>
        // on the page
        $("input[type=range]").each(function(){
            var range = $(this);
            
            // Create <div/> to hold jQuery UI Slider
            var sliderDiv = $("<div/>");
            sliderDiv.width(range.width());
            
            // Insert jQuery UI Slider where the
            // <input type=range/> is located
            range.after(
                sliderDiv.slider({
                    // Set values that are set declaratively
                    // in the <input type=range/> element
                    min: parseFloat(range.attr("min")),
                    max: parseFloat(range.attr("max")),
                    value: parseFloat(range.val()),
                    step: parseFloat(range.attr("step")),
                    // Update the <input type=range/> when
                    // value of slider changes
                    slide: function(evt, ui) {
                        range.val(ui.value);
						
						var self = range[0];
						eval(range.attr("onchange").replace(/this/g, "self"));
                    },
                    change: function(evt, ui) {
                        // set <input type=range/> value
                        range.val(ui.value);
						
						var self = range[0];
						eval(range.attr("onchange").replace(/this/g, "self"));
                    }
                })
            ).
            // Hide <input type=range/> from display
            hide();
        });
    }
}


/*function Timer(callback, delay) {
    var timerId, start, remaining = delay;

    this.pause = function() {
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
    };

    this.resume = function() {
        start = new Date();
        timerId = window.setTimeout(callback, remaining);
    };

    this.resume();
}*/

var runningTimers = new Object();
function Timer(callback, delay) {
    var timerId, start, remaining = delay, running = false, stopped = false;
	
    this.pause = function() {
        if(running == false)
			return;
		
		window.clearTimeout(timerId);
		remaining -= new Date() - start;
		running = false;
    };
	
	this.stop = function(){
		this.pause();
		stopped = true;
		if(typeof runningTimers[timerId] !== 'undefined')
			delete runningTimers[timerId];
	}

    this.start = function() {
        if(running || stopped)
			return;
		
		if(remaining < 0){
			this.stop();
		}
		
		start = new Date();
		running = true;
		timerId = window.setTimeout(callback, remaining);
		
		runningTimers[timerId] = this;
    };
	
	this.stopAll = function(){
		for(var i in runningTimers){
			runningTimers[i].stop();
		}
	}

    this.start();
}
function stopAllTimers(){
	for(var e in runningTimers){
		runningTimers[e].stop();
	}
}


String.prototype.trimRight = function(numChars){
	return this.substr(0, this.length-numChars);
}


function disableFormItems(disable, group){
	var groupClass;
	if(typeof group == 'undefined')
		groupClass = '';
	else
		groupClass = '.disable-group'+group;
	
	if(disable === true){
		var e = $('.config .form-item.disable'+groupClass)
			.addClass('disabled');
		e.find('input, select').filter(':not([disabled])').attr('disabled', 'disabled').addClass('temp-disabled');
		e.find('div.ui-slider').slider( "option", "disabled", true );
	}
	else{
		var e = $('.config .form-item.disable'+groupClass)
			.removeClass('disabled', 300, 'linear');
		e.find('input, select').filter('.temp-disabled').removeAttr('disabled');
		e.find('div.ui-slider').slider( "option", "disabled", false );
	}
}


function checkFeatures(args){
	args = $.extend({
		inlinesvg: false,
		canvas: false
	}, args);
	var errors = Array();
	
	if(args.inlinesvg && !(Modernizr.inlinesvg && Modernizr.svg))
		errors.push('inline svg');
	if(args.canvas && !Modernizr.canvas)
		errors.push('canvas element');
	
	if(errors.length == 0)
		return;
	
	var msg = $('<div class="browser-features-missing"><h1>Warning</h1><p>Your Browser does not support all features needed to run this animation.</p><p>Features Missing: <ul class="features-missing"></ul></p><p>Please use a modern Browser that supports these features.</p></div>');
	for(var i = 0; i < errors.length; i++){
		msg.children('ul.features-missing').prepend('<li>'+errors[i]+'</li>');
	}
	
	$('body').prepend(msg);
}